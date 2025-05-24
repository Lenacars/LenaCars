"use client";

import Image from "next/image";
import { useEffect, useState, Fragment } from "react";
import { Card, CardContent } from "@/components/ui/card";
import VehicleCard from "@/components/vehicle-card";
import HowItWorks from "@/components/how-it-works";
import HeroSlider from "@/components/hero-slider";
import { useSearch } from "@/context/SearchContext";
import { Listbox, Transition } from '@headlessui/react';

// Filtrelerin state tipi
interface HomeFiltersState {
  brand: string;
  segment: string;
  bodyType: string;
  yakit_turu: string;
  vites: string;
  durum: string;
}

// İkonlar
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg
    className={className || "h-5 w-5 text-gray-400"}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    strokeWidth="2"
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    className={className || "h-5 w-5"}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const FilterIcon = ({ className }: { className?: string }) => (
  <svg
    className={className || "h-5 w-5 text-gray-400"}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M7 12h10M10 18h4" />
  </svg>
);

export default function Home() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [filters, setFilters] = useState<HomeFiltersState>({
    brand: "",
    segment: "",
    bodyType: "",
    yakit_turu: "",
    vites: "",
    durum: "",
  });
  const [sortType, setSortType] = useState("price-asc");
  const { searchTerm } = useSearch();
  const [brandOptions, setBrandOptions] = useState<string[]>([]);

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const pageSizeOptions = [
    { value: 20, label: "20 Araç Göster" },
    { value: 40, label: "40 Araç Göster" },
    { value: 60, label: "60 Araç Göster" },
    { value: 80, label: "80 Araç Göster" },
    { value: Infinity, label: "Tümünü Göster"},
  ];
  const [currentPageSize, setCurrentPageSize] = useState(pageSizeOptions[0].value);
  const [visibleVehicleCount, setVisibleVehicleCount] = useState(pageSizeOptions[0].value);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); 
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchVehicles = async () => {
      const res = await fetch("https://adminpanel-green-two.vercel.app/api/araclar", {
        cache: "no-store",
      });
      if (!res.ok) {
        console.error("API'den araç verisi çekilemedi. Status:", res.status);
        setVehicles([]);
        setFiltered([]);
        return;
      }
      const json = await res.json();
      const rawVehicles = json.data || [];
      const transformed = rawVehicles.map((vehicle: any) => {
        const aktifVaryasyonlar = vehicle.variations?.filter((v: any) => v.status === "Aktif") || [];
        const enDusukFiyat =
          aktifVaryasyonlar.length > 0
            ? Math.min(...aktifVaryasyonlar.map((v: any) => v.fiyat))
            : vehicle.fiyat ?? 0;
        return {
          ...vehicle,
          id: vehicle.id,
          name: vehicle.isim || "Araç İsmi Yok",
          image: vehicle.cover_image?.startsWith("http")
            ? vehicle.cover_image
            : vehicle.cover_image
              ? `https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${vehicle.cover_image.replace(/^\/+/, "")}`
              : "/placeholder.svg",
          price: enDusukFiyat,
          rating: vehicle.rating || 4.5,
          features: vehicle.features || [],
          variations: aktifVaryasyonlar,
        };
      });
      setVehicles(transformed);

      if (transformed.length > 0) {
        const uniqueBrands = Array.from(new Set(transformed.map((v) => v.brand).filter(Boolean))).sort();
        setBrandOptions(uniqueBrands);
      }
    };
    fetchVehicles();
  }, []);

  useEffect(() => {
    let results = [...vehicles];
    if (searchTerm && searchTerm.trim()) {
      results = results.filter((vehicle) =>
        vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    results = results.filter((v) =>
      (!filters.brand || v.brand === filters.brand) &&
      (!filters.segment || v.segment === filters.segment) &&
      (!filters.bodyType || v.bodyType === filters.bodyType) &&
      (!filters.yakit_turu || v.yakit_turu === filters.yakit_turu) &&
      (!filters.vites || v.vites === filters.vites) &&
      (!filters.durum || v.durum === filters.durum)
    );
    if (sortType === "price-asc") {
      results.sort((a, b) => a.price - b.price);
    } else if (sortType === "price-desc") {
      results.sort((a, b) => b.price - a.price);
    } else if (sortType === "rating") {
      results.sort((a, b) => b.rating - a.rating);
    }
    setFiltered(results);
    setVisibleVehicleCount(currentPageSize === Infinity ? results.length : currentPageSize);
  }, [filters, sortType, vehicles, searchTerm, currentPageSize]);

  const handleLoadMore = () => {
    setVisibleVehicleCount(prevCount => 
        Math.min(prevCount + (currentPageSize === Infinity ? 20 : currentPageSize) , filtered.length) // Tümünü göster seçiliyken 20 ekle
    );
  };

  const yakitSecenekleri = ["Benzin", "Dizel", "Elektrik", "Hibrit", "Benzin + LPG"];
  const vitesSecenekleri = ["Manuel", "Otomatik"];
  const segmentSecenekleri = ["Ekonomik", "Orta", "Orta + Üst", "Lüks"];
  const kasaTipiSecenekleri = ["SUV", "Hatchback", "Sedan", "Crossover"];
  const durumSecenekleri = ["Sıfır", "İkinci El"];
  const sortOptions = [
    { value: "price-asc", label: "Fiyat: Düşükten Yükseğe" },
    { value: "price-desc", label: "Fiyat: Yüksekten Düşüğe" },
    { value: "rating", label: "Puan: En Yüksek" },
  ];

  const renderAllFilters = () => (
    <>
      {/* MARKA FİLTRESİ */}
      <div className="relative">
        <Listbox value={filters.brand} onChange={(value) => setFilters({ ...filters, brand: value })}>
           <div className="relative">
            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2.5 pl-4 pr-10 text-left shadow-sm focus:outline-none focus-visible:border-purple-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-300 text-sm border border-gray-300 h-[42px] flex items-center">
              <span className={`block truncate ${filters.brand ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                {filters.brand || "Marka Seçin"}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>
            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
              <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                <Listbox.Option key="brand-placeholder" className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-[#6A3C96] text-white' : 'text-gray-900'}`} value="">
                  {({ selected }) => (<span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>Marka Seçin</span>)}
                </Listbox.Option>
                {brandOptions.map((brand) => (
                  <Listbox.Option key={brand} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-[#6A3C96] text-white' : 'text-gray-900'}`} value={brand}>
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{brand}</span>
                        {selected ? (<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#6A3C96]"><CheckIcon /></span>) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
      {/* SEGMENT FİLTRESİ */}
       <div className="relative">
        <Listbox value={filters.segment} onChange={(value) => setFilters({ ...filters, segment: value })}>
          <div className="relative">
            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2.5 pl-4 pr-10 text-left shadow-sm focus:outline-none focus-visible:border-purple-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-300 text-sm border border-gray-300 h-[42px] flex items-center">
              <span className={`block truncate ${filters.segment ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                {filters.segment || "Segment Seçin"}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>
            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
              <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                <Listbox.Option key="segment-placeholder" className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-[#6A3C96] text-white' : 'text-gray-900'}`} value="">
                  {({ selected }) => (<span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>Segment Seçin</span>)}
                </Listbox.Option>
                {segmentSecenekleri.map((segment) => (
                  <Listbox.Option key={segment} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-[#6A3C96] text-white' : 'text-gray-900'}`} value={segment}>
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{segment}</span>
                        {selected ? (<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#6A3C96]"><CheckIcon /></span>) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
      {/* KASA TİPİ FİLTRESİ */}
      <div className="relative">
        <Listbox value={filters.bodyType} onChange={(value) => setFilters({ ...filters, bodyType: value })}>
          <div className="relative">
            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2.5 pl-4 pr-10 text-left shadow-sm focus:outline-none focus-visible:border-purple-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-300 text-sm border border-gray-300 h-[42px] flex items-center">
              <span className={`block truncate ${filters.bodyType ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                {filters.bodyType || "Kasa Tipi Seçin"}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>
            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
              <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                <Listbox.Option key="bodytype-placeholder" className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-[#6A3C96] text-white' : 'text-gray-900'}`} value="">
                  {({ selected }) => (<span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>Kasa Tipi Seçin</span>)}
                </Listbox.Option>
                {kasaTipiSecenekleri.map((kasa) => (
                  <Listbox.Option key={kasa} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-[#6A3C96] text-white' : 'text-gray-900'}`} value={kasa}>
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{kasa}</span>
                        {selected ? (<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#6A3C96]"><CheckIcon /></span>) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
      {/* YAKIT TÜRÜ FİLTRESİ */}
      <div className="relative">
        <Listbox value={filters.yakit_turu} onChange={(value) => setFilters({ ...filters, yakit_turu: value })}>
          <div className="relative">
            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2.5 pl-4 pr-10 text-left shadow-sm focus:outline-none focus-visible:border-purple-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-300 text-sm border border-gray-300 h-[42px] flex items-center">
              <span className={`block truncate ${filters.yakit_turu ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                {filters.yakit_turu || "Yakıt Türü Seçin"}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>
            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
              <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                <Listbox.Option key="yakit-placeholder" className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-[#6A3C96] text-white' : 'text-gray-900'}`} value="">
                  {({ selected }) => (<span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>Yakıt Türü Seçin</span>)}
                </Listbox.Option>
                {yakitSecenekleri.map((yakit) => (
                  <Listbox.Option key={yakit} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-[#6A3C96] text-white' : 'text-gray-900'}`} value={yakit}>
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{yakit}</span>
                        {selected ? (<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#6A3C96]"><CheckIcon /></span>) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
      {/* VİTES TÜRÜ FİLTRESİ */}
      <div className="relative">
        <Listbox value={filters.vites} onChange={(value) => setFilters({ ...filters, vites: value })}>
          <div className="relative">
            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2.5 pl-4 pr-10 text-left shadow-sm focus:outline-none focus-visible:border-purple-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-300 text-sm border border-gray-300 h-[42px] flex items-center">
              <span className={`block truncate ${filters.vites ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                {filters.vites || "Vites Tipi Seçin"}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>
            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
              <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                <Listbox.Option key="vites-placeholder" className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-[#6A3C96] text-white' : 'text-gray-900'}`} value="">
                  {({ selected }) => (<span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>Vites Tipi Seçin</span>)}
                </Listbox.Option>
                {vitesSecenekleri.map((vites) => (
                  <Listbox.Option key={vites} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-[#6A3C96] text-white' : 'text-gray-900'}`} value={vites}>
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{vites}</span>
                        {selected ? (<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#6A3C96]"><CheckIcon /></span>) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
      {/* DURUM FİLTRESİ */}
      <div className="relative">
        <Listbox value={filters.durum} onChange={(value) => setFilters({ ...filters, durum: value })}>
          <div className="relative">
            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2.5 pl-4 pr-10 text-left shadow-sm focus:outline-none focus-visible:border-purple-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-300 text-sm border border-gray-300 h-[42px] flex items-center">
              <span className={`block truncate ${filters.durum ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                {filters.durum || "Durum Seçin"}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>
            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
              <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                <Listbox.Option key="durum-placeholder" className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-[#6A3C96] text-white' : 'text-gray-900'}`} value="">
                  {({ selected }) => (<span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>Durum Seçin</span>)}
                </Listbox.Option>
                {durumSecenekleri.map((durum) => (
                  <Listbox.Option key={durum} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-[#6A3C96] text-white' : 'text-gray-900'}`} value={durum}>
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{durum}</span>
                        {selected ? (<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#6A3C96]"><CheckIcon /></span>) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
    </>
  );

  return (
    <>
      <HeroSlider />
      <div className="container mx-auto px-4 py-8">
        <div id="vehicle-list" className="mb-12">
          {/* === BAŞLIK VE KONTROLLER BÖLÜMÜ (MOBİL İÇİN YENİ DÜZEN) === */}
          <div className="mb-6">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-4 text-center sm:text-left">Araç Filomuz</h2>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4"> {/* Mobil için gap-3, sm+ için gap-4 */}
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-full text-center sm:text-left order-1 sm:order-none"> {/* Mobil için py-2 */}
                {filtered.length} sonuç bulundu
              </span>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto order-2 sm:order-none"> {/* Kontroller için sarmalayıcı */}
                {/* Sayfa Başına Gösterilecek Araç Sayısı Seçimi */}
                <div className="relative w-full sm:min-w-[180px]">
                  <Listbox value={currentPageSize} onChange={(value) => {
                      setCurrentPageSize(value);
                      setVisibleVehicleCount(value === Infinity ? filtered.length : value);
                  }}>
                    <div className="relative">
                      <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2.5 pl-3 pr-10 text-left shadow-sm focus:outline-none text-sm border border-gray-300 h-[42px] flex items-center">
                        <span className="block truncate text-gray-800 font-medium">
                          {pageSizeOptions.find(opt => opt.value === currentPageSize)?.label || `${currentPageSize} Araç`}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </span>
                      </Listbox.Button>
                      <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <Listbox.Options className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                          {pageSizeOptions.map((option) => (
                            <Listbox.Option key={option.value} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-[#6A3C96] text-white' : 'text-gray-900'}`} value={option.value}>
                              {({ selected }) => (
                                <>
                                  <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{option.label}</span>
                                  {selected ? (<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#6A3C96]"><CheckIcon /></span>) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                </div>
                {/* Sıralama Seçimi */}
                <div className="relative w-full sm:min-w-[200px]">
                  <Listbox value={sortType} onChange={setSortType}>
                    <div className="relative">
                      <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2.5 pl-3 pr-10 text-left shadow-sm focus:outline-none text-sm border border-gray-300 h-[42px] flex items-center">
                        <span className="block truncate text-gray-800 font-medium">
                          {sortOptions.find(opt => opt.value === sortType)?.label || "Sırala"}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </span>
                      </Listbox.Button>
                      <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <Listbox.Options className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                          {sortOptions.map((option) => (
                            <Listbox.Option key={option.value} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-[#6A3C96] text-white' : 'text-gray-900'}`} value={option.value}>
                              {({ selected }) => (
                                <>
                                  <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{option.label}</span>
                                  {selected ? (<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#6A3C96]"><CheckIcon /></span>) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                </div>
              </div>
            </div>
          </div>
          {/* === BAŞLIK VE KONTROLLER BÖLÜMÜ SONU === */}
          
          <Card className="mb-8 shadow-xl bg-gray-50 rounded-xl">
            <CardContent className="p-5 sm:p-6">
              <div className="md:hidden mb-4">
                <button
                  onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-base font-semibold text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6A3C96]"
                >
                  <span className="flex items-center">
                    <FilterIcon className="h-5 w-5 mr-3 text-[#6A3C96]" />
                    Filtreler
                  </span>
                  <ChevronDownIcon className={`h-6 w-6 text-gray-500 transition-transform duration-300 ease-in-out ${isMobileFiltersOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {isMobile ? (
                <Transition
                  show={isMobileFiltersOpen}
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 -translate-y-2"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 -translate-y-2"
                >
                  <div className="grid grid-cols-1 gap-4 mt-4 border-t border-gray-200 pt-4 md:hidden">
                    {renderAllFilters()}
                  </div>
                </Transition>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {renderAllFilters()}
                </div>
              )}
            </CardContent>
          </Card>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.slice(0, visibleVehicleCount).map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-xl text-gray-500">Aradığınız kriterlere uygun araç bulunamadı.</p>
            </div>
          )}

          {filtered.length > 0 && visibleVehicleCount < filtered.length && currentPageSize !== Infinity && (
            <div className="mt-10 text-center">
              <button
                onClick={handleLoadMore}
                className="px-8 py-3 bg-[#6A3C96] text-white font-semibold rounded-lg hover:bg-[#5a3080] transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6A3C96]"
              >
                Daha Fazla Göster 
                ({Math.min(currentPageSize === Infinity ? 0 : currentPageSize, filtered.length - visibleVehicleCount)} araç daha)
              </button>
            </div>
          )}
        </div>

        <HowItWorks />
      </div>
    </>
  );
}
