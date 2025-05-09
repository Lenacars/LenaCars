"use client";

import { useState, useEffect } from "react";

interface FilterProps {
  onFilterChange: (filters: Filters) => void;
}

export interface Filters {
  yakit: string;
  vites: string;
  brand: string;
  segment: string;
  bodyType: string;
  durum: string;
}

export default function HomeFilter({ onFilterChange }: FilterProps) {
  const [filters, setFilters] = useState<Filters>({
    yakit: "",
    vites: "",
    brand: "",
    segment: "",
    bodyType: "",
    durum: "",
  });

  const [brands, setBrands] = useState<string[]>([]);

  useEffect(() => {
    async function fetchBrands() {
      try {
        const res = await fetch("https://adminpanel-green-two.vercel.app/api/araclar");
        const json = await res.json();
        if (json.data) {
          const markaListesi = [...new Set(json.data.map((v: any) => v.brand))].filter(Boolean);
          setBrands(markaListesi);
        }
      } catch (err) {
        console.error("Markalar çekilemedi", err);
      }
    }
    fetchBrands();
  }, []);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <select
        className="border p-2 rounded text-sm"
        value={filters.yakit}
        onChange={(e) => setFilters({ ...filters, yakit: e.target.value })}
      >
        <option value="">Yakıt</option>
        <option>Benzin</option>
        <option>Dizel</option>
        <option>Elektrik</option>
        <option>Hibrit</option>
        <option>Benzin + LPG</option>
      </select>

      <select
        className="border p-2 rounded text-sm"
        value={filters.vites}
        onChange={(e) => setFilters({ ...filters, vites: e.target.value })}
      >
        <option value="">Vites</option>
        <option>Manuel</option>
        <option>Otomatik</option>
      </select>

      <select
        className="border p-2 rounded text-sm"
        value={filters.brand}
        onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
      >
        <option value="">Marka</option>
        {brands.map((b) => (
          <option key={b}>{b}</option>
        ))}
      </select>

      <select
        className="border p-2 rounded text-sm"
        value={filters.segment}
        onChange={(e) => setFilters({ ...filters, segment: e.target.value })}
      >
        <option value="">Segment</option>
        <option>Ekonomik</option>
        <option>Orta</option>
        <option>Orta + Üst</option>
        <option>Lux</option>
      </select>

      <select
        className="border p-2 rounded text-sm"
        value={filters.bodyType}
        onChange={(e) => setFilters({ ...filters, bodyType: e.target.value })}
      >
        <option value="">Kasa Tipi</option>
        <option>SUV</option>
        <option>Hatchback</option>
        <option>Sedan</option>
        <option>Crossover</option>
      </select>

      <select
        className="border p-2 rounded text-sm"
        value={filters.durum}
        onChange={(e) => setFilters({ ...filters, durum: e.target.value })}
      >
        <option value="">Durum</option>
        <option>Sıfır</option>
        <option>İkinci El</option>
      </select>
    </div>
  );
}
