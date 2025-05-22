"use client";

import Image from "next/image";
import { useEffect, useState, Fragment } from "react"; // Fragment eklendi
import { Card, CardContent } from "@/components/ui/card";
import VehicleCard from "@/components/vehicle-card";
import HowItWorks from "@/components/how-it-works";
import HeroSlider from "@/components/hero-slider";
import { useSearch } from "@/context/SearchContext";
import { Listbox, Transition } from '@headlessui/react'; // Headless UI importları

// Filtrelerin state tipi
interface HomeFiltersState {
  brand: string;
  segment: string;
  bodyType: string;
  yakit_turu: string;
  vites: string;
  durum: string;
}

// Basit bir ChevronDown ikonu (SVG)
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

// Seçili olduğunu gösteren Check ikonu (isteğe bağlı)
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

  // Dinamik Marka listesi için state
  const [brandOptions, setBrandOptions] = useState<string[]>([]);

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

      // Marka seçeneklerini oluştur
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
  }, [filters, sortType, vehicles, searchTerm]);

  // Statik filtre seçenekleri
  const yakitSecenekleri = ["Benzin", "Dizel", "Elektrik", "Hibrit", "Benzin + LPG"];
  const vitesSecenekleri = ["Manuel", "Otomatik"];
  const segmentSecenekleri = ["Ekonomik", "Orta", "Orta + Üst", "Lüks"]; // "Lux" -> "Lüks" olarak güncellendi
  const kasaTipiSecenekleri = ["SUV", "Hatchback", "Sedan", "Crossover"];
  const durumSecenekleri = ["Sıfır", "İkinci El"];
  const sortOptions = [
    { value: "price-asc", label: "Fiyat: Düşükten Yükseğe" },
    { value: "price-desc", label: "Fiyat: Yüksekten Düşüğe" },
    { value: "rating", label: "Puan: En Yüksek" },
  ];


  // Genel Listbox oluşturma fonksiyonu (isteğe bağlı, tekrarı azaltmak için)
  // Bu fonksiyonu kullanmak yerine her bir Listbox'ı ayrı ayrı da yazabilirsiniz.
  // Şimdilik daha anlaşılır olması için her birini ayrı yazacağım.

  return (
    <>
      <HeroSlider />
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-12 shadow-xl bg-gray-50 rounded-xl">
          <CardContent className="p-5 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              
              {/* MARKA FİLTRESİ (Dinamik) */}
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

            </div>
          </CardContent>
        </Card>

        <div id="vehicle-list" className="mb-12">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-y-4">
            <h2 className="text-3xl font-extrabold text-gray-800">Araç Filomuz</h2>
            <div className="flex items-center gap-x-3">
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{filtered.length} sonuç bulundu</span>
              {/* Sıralama select'i için de aynı Listbox yapısı uygulanabilir */}
              <div className="relative min-w-[200px]"> {/* Genişlik için min-w eklendi */}
                 <Listbox value={sortType} onChange={setSortType}>
                  <div className="relative">
                    <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2.5 pl-4 pr-10 text-left shadow-sm focus:outline-none focus-visible:border-purple-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-300 text-sm border border-gray-300 h-[42px] flex items-center">
                      <span className="block truncate text-gray-800 font-medium">
                        {sortOptions.find(opt => opt.value === sortType)?.label || "Sırala"}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                      <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
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

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-xl text-gray-500">Aradığınız kriterlere uygun araç bulunamadı.</p>
            </div>
          )}
        </div>

        <HowItWorks />
      </div>
    </>
  );
}
