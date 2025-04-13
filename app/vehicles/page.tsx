"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "../../lib/supabase"; // BU KISIM ÖNEMLİ

interface Vehicle {
  id: string;
  isim: string;
  aciklama: string;
  cover_url: string;
  kategori?: string;
}

export default function VehicleListPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      const { data, error } = await supabase.from("Araclar").select("*").order("id", { ascending: false });
      if (error) {
        console.error("Araçlar alınamadı:", error.message);
      } else {
        setVehicles(data || []);
      }
      setLoading(false);
    };

    fetchVehicles();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Araçlar</h1>
      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <Link href={`/vehicles/${vehicle.id}`} key={vehicle.id}>
              <div className="border rounded shadow hover:shadow-md transition overflow-hidden bg-white">
                {vehicle.cover_url && (
                  <Image
                    src={`https://uxnpmedeikzvnevpceiw.supabase.co/storage/v1/object/public/products/${vehicle.cover_url}`}
                    alt={vehicle.isim}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-1">{vehicle.isim}</h2>
                  <p className="text-sm text-gray-600 line-clamp-3">{vehicle.aciklama}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
