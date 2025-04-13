import { supabase } from "@/lib/supabase";
import Image from "next/image";

export default async function VehicleDetailPage({ params }: { params: { id: string } }) {
  const { data, error } = await supabase
    .from("Araclar")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !data) {
    return <div className="p-6 text-red-500">Araç bulunamadı.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{data.isim}</h1>
      {data.cover_url && (
        <Image
          src={`https://uxnpmedeikzvnevpceiw.supabase.co/storage/v1/object/public/products/${data.cover_url}`}
          alt={data.isim}
          width={800}
          height={600}
          className="rounded mb-4"
        />
      )}
      <p className="text-gray-700">{data.aciklama}</p>
    </div>
  );
}
