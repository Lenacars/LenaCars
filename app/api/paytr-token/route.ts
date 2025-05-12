import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    user_id,
    user_name,
    user_email,
    payment_amount
  } = body;

  const merchant_id = process.env.PAYTR_MERCHANT_ID!;
  const merchant_key = process.env.PAYTR_MERCHANT_KEY!;
  const merchant_salt = process.env.PAYTR_MERCHANT_SALT!;
  const merchant_oid = `ORD-${Date.now()}-${user_id}`;
  const user_ip = "127.0.0.1";

  const email = user_email;
  const name = user_name;

  const basket = JSON.stringify([
    ["LenaCars Ödeme", payment_amount / 100, 1]
  ]);

  const no_installment = "0";
  const max_installment = "12";
  const currency = "TL";
  const test_mode = "0";

  const hash_str = `${merchant_id}${user_ip}${merchant_oid}${email}${payment_amount}${basket}${no_installment}${max_installment}${currency}${test_mode}`;
  const paytr_token = crypto
    .createHmac("sha256", merchant_key)
    .update(hash_str + merchant_salt)
    .digest("base64");

  const post_data = new URLSearchParams({
    merchant_id,
    user_ip,
    merchant_oid,
    email,
    payment_amount: payment_amount.toString(),
    paytr_token,
    user_name: name,
    user_address: "Adres girilmedi",
    user_phone: "0000000000",
    merchant_ok_url: process.env.NEXT_PUBLIC_SITE_URL + "/profil",
    merchant_fail_url: process.env.NEXT_PUBLIC_SITE_URL + "/profil",
    debug_on: "1",
    no_installment,
    max_installment,
    user_basket: basket,
    currency,
    test_mode
  });

  const response = await fetch("https://www.paytr.com/odeme/api/get-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: post_data.toString()
  });

  const text = await response.text();
  let result;

  try {
    result = JSON.parse(text);
  } catch (e) {
    return NextResponse.json({ status: "failed", reason: text }, { status: 400 });
  }

  if (result.status === "success") {
    return NextResponse.json({ iframe_token: result.token });
  } else {
    return NextResponse.json({ status: "failed", reason: result.reason }, { status: 400 });
  }
}
