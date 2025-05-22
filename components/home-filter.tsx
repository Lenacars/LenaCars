"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react"; // İkon için

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

  // Mevcut useEffect'leriniz (işlevsellik) olduğu gibi kalıyor
  useEffect(() => {
    async function fetchBrands() {
      try {
        const res = await fetch("https://adminpanel-green-two.vercel.app/api/araclar");
        const json = await res.json();
        if (json.data) {
          const markaListesi = [...new Set(json.data.map((v: any) => v.brand?.trim()).filter(Boolean))].sort();
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
  }, [filters, onFilterChange]); // onFilterChange'i dependency array'e eklemek iyi bir pratiktir

  // Her bir select için ortak stil sınıfları
  const selectBaseClasses = "w-full bg-white border border-gray-300 text-gray-700 py-2.5 px-4 pr-8 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-150 ease-in-out appearance-none";
  const selectPlaceholderClasses = "text-gray-400"; // Seçili değilken placeholder rengi

  return (
    <div className="bg-gray-50 p-4 sm:p-6 rounded-xl shadow-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Yakıt Filtresi */}
        <div className="relative">
          <select
            className={`${selectBaseClasses} ${filters.yakit === "" ? selectPlaceholderClasses : "text-gray-800 font-medium"}`}
            value={filters.yakit}
            onChange={(e) => setFilters({ ...filters, yakit: e.target.value })}
          >
            <option value="" className="text-gray-500">Yakıt Tipi</option>
            <option value="Benzin">Benzin</option>
            <option value="Dizel">Dizel</option>
            <option value="Elektrik">Elektrik</option>
            <option value="Hibrit">Hibrit</option>
            <option value="Benzin + LPG">Benzin + LPG</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>

        {/* Vites Filtresi */}
        <div className="relative">
          <select
            className={`${selectBaseClasses} ${filters.vites === "" ? selectPlaceholderClasses : "text-gray-800 font-medium"}`}
            value={filters.vites}
            onChange={(e) => setFilters({ ...filters, vites: e.target.value })}
          >
            <option value="" className="text-gray-500">Vites Türü</option>
            <option value="Manuel">Manuel</option>
            <option value="Otomatik">Otomatik</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>

        {/* Marka Filtresi */}
        <div className="relative">
          <select
            className={`${selectBaseClasses} ${filters.brand === "" ? selectPlaceholderClasses : "text-gray-800 font-medium"}`}
            value={filters.brand}
            onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
          >
            <option value="" className="text-gray-500">Marka Seçin</option>
            {brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>

        {/* Segment Filtresi */}
        <div className="relative">
          <select
            className={`${selectBaseClasses} ${filters.segment === "" ? selectPlaceholderClasses : "text-gray-800 font-medium"}`}
            value={filters.segment}
            onChange={(e) => setFilters({ ...filters, segment: e.target.value })}
          >
            <option value="" className="text-gray-500">Segment</option>
            <option value="Ekonomik">Ekonomik</option>
            <option value="Orta">Orta</option>
            <option value="Orta + Üst">Orta + Üst</option>
            <option value="Lux">Lüks</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>

        {/* Kasa Tipi Filtresi */}
        <div className="relative">
          <select
            className={`${selectBaseClasses} ${filters.bodyType === "" ? selectPlaceholderClasses : "text-gray-800 font-medium"}`}
            value={filters.bodyType}
            onChange={(e) => setFilters({ ...filters, bodyType: e.target.value })}
          >
            <option value="" className="text-gray-500">Kasa Tipi</option>
            <option value="SUV">SUV</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Sedan">Sedan</option>
            <option value="Crossover">Crossover</option>
            {/* Diğer kasa tipleri eklenebilir */}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>

        {/* Durum Filtresi */}
        <div className="relative">
          <select
            className={`${selectBaseClasses} ${filters.durum === "" ? selectPlaceholderClasses : "text-gray-800 font-medium"}`}
            value={filters.durum}
            onChange={(e) => setFilters({ ...filters, durum: e.target.value })}
          >
            <option value="" className="text-gray-500">Araç Durumu</option>
            <option value="Sıfır">Sıfır</option>
            <option value="İkinci El">İkinci El</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
