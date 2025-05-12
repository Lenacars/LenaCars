// /app/api/paytr-token/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import crypto from "crypto";
import qs from "querystring";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      user_id,
      user_name,
      user_email,
      payment_amount, // kuruş cinsinden (örnek: 100.00₺ → 10000)
    } = body;

    // ENV değişkenleri
    const merchant_id = process.env.PAYTR_MERCHANT_ID!;
    const merchant_key = process.env.PAYTR_MERCHANT_KEY!;
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT!;
    const site_url = process.env.NEXT_PUBLIC_SITE_URL!;

    const email = user_email;
    const merchant_oid = `ORDER_${Date.now()}_${user_id}`;
    const success_url = `${site_url}/profil?payment=success`;
    const fail_url = `${site_url}/profil?payment=fail`;
    const user_ip = "127.0.0.1"; // Opsiyonel olarak gerçek IP alınabilir

    const user_basket = JSON.stringify([
      ["Kredi Kartı ile Ödeme", payment_amount / 100, 1],
    ]);

    // hash hazırlığı
    const hash_str =
      merchant_id +
      user_ip +
      merchant_oid +
      email +
      payment_amount +
      user_basket +
      "TL" +
      success_url +
      fail_url;

    const paytr_token = crypto
      .createHmac("sha256", merchant_key)
      .update(hash_str + merchant_salt)
      .digest("base64");

    const params = {
      merchant_id,
      user_ip,
      merchant_oid,
      email,
      payment_amount,
      paytr_token,
      user_basket,
      currency: "TL",
      test_mode: "1", // canlıda 0 yap
      no_installment: "0",
      max_installment: "9",
      user_name,
      success_url,
      fail_url,
      timeout_limit: "30",
      debug_on: "1",
      lang: "tr",
    };

    const response = await fetch("https://www.paytr.com/odeme/api/get-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: qs.stringify(params),
    });

    const result = await response.json();

    if (result.status === "success") {
      return NextResponse.json({ iframe_token: result.token });
    } else {
      return NextResponse.json(
        { status: "failed", reason: result.reason },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("PAYTR token hatası:", error);
    return NextResponse.json(
      { status: "failed", reason: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
