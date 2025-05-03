// lib/api.ts

import { supabase } from "./supabase-browser";

export async function getAllVehicles() {
  try {
    const { data, error } = await supabase
      .from("Araclar")
      .select("*")
      .order("id", { ascending: false });

    if (error) throw new Error("Araç listesi alınamadı: " + error.message);
    return data;
  } catch (error) {
    console.error("getAllVehicles hata:", error);
    return [];
  }
}

export async function getVehicleById(id: string) {
  try {
    const { data, error } = await supabase
      .from("Araclar")
      .select("*, variations:variations(*)")
      .eq("id", id)
      .single();

    if (error) throw new Error("Araç bilgisi alınamadı: " + error.message);
    return data;
  } catch (error) {
    console.error("getVehicleById hata:", error);
    return null;
  }
}
