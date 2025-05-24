"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
// useEffect veya useState'e gerek kalmadı, tüm state'ler MainHeader'dan geliyor.

// MainHeader'dan gelen menuItems yapısına uygun arayüzler
// Bu tipler MainHeader'da da tanımlı olabilir veya buradan export edilebilir.
export interface SubNavigationMenuItem {
  title: string;
  slug: string;
  isExternal?: boolean;
}

export interface NavigationMenuItem {
  title: string;
  slug: string;
  isExternal?: boolean;
  subItems?: SubNavigationMenuItem[];
}

interface Props {
  menuItems: NavigationMenuItem[];
  isMobileFromParent: boolean;
  setIsMobileMenuOpenFromParent: (isOpen: boolean) => void;
  activeDropdownFromParent: string | null;
  toggleDropdownFromParent: (title: string) => void;
}

export default function NavigationMenu({
  menuItems = [],
  isMobileFromParent,
  setIsMobileMenuOpenFromParent,
  activeDropdownFromParent,
  toggleDropdownFromParent,
}: Props) {
  const pathname = usePathname();

  const handleLinkClick = (isSubItemClick: boolean = false) => {
    // Mobilde bir linke tıklandığında ana menüyü kapat
    if (isMobileFromParent) {
      setIsMobileMenuOpenFromParent(false);
      // Eğer bir alt menü linkine tıklandıysa ve ana menü kapanıyorsa,
      // aktif alt menüyü de kapat (MainHeader'daki toggle fonksiyonunu kullanarak)
      // Bu, bir sonraki menü açılışında alt menünün kapalı başlamasını sağlar.
      if (activeDropdownFromParent) {
        toggleDropdownFromParent(activeDropdownFromParent); // Aktif olanı tekrar toggle ederek kapatır
      }
    }
  };

  const handleMobileSubMenuToggle = (title: string) => {
    toggleDropdownFromParent(title); // MainHeader'daki state'i günceller
  };
  
  // Bu bileşen mobilde ana menü (MainHeader'daki hamburger) açıkken render edilir.
  // Dolayısıyla, isMobileFromParent true ise, mobil menü içeriği doğrudan gösterilmelidir.
  return (
    <nav 
      className={`bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm 
                 ${isMobileFromParent 
                   ? 'absolute top-full left-0 w-full z-30 border-t'  // Mobil: Ana header'ın altında açılır
                   : 'sticky z-40'                                   // Masaüstü: Normal akışta sticky
                 }`}
      style={isMobileFromParent 
        // Mobilde, NavigationMenu'nün top değeri, üstteki iki barın toplam yüksekliği olmalı.
        // Bu CSS değişkenleri MainHeader.tsx içinde ayarlanır.
        ? { top: 'var(--main-header-total-height, 116px)' } 
        // Masaüstünde, NavigationMenu, ikinci barın (logo barı) altından sticky olur.
        // Veya kendi yüksekliği varsa (örneğin 57px), sticky top değeri buna göre ayarlanır.
        // Şu anki sticky top değeri, üstteki iki barın toplam yüksekliği.
        // Eğer NavigationMenu'nün kendi bir yüksekliği varsa ve o yükseklik içinde sticky olacaksa,
        // top: 'var(--top-bar-height)' gibi bir ayar düşünülebilir veya sticky konumu kaldırılabilir.
        // Şimdilik iki barın altında sticky kalacak şekilde ayarlı.
        // Eğer NavigationMenu'nün kendi yüksekliği varsa ve sticky olması isteniyorsa,
        // Örneğin, ikinci bar 76px, NavigationMenu 57px ise, top: calc(var(--top-bar-height) + var(--main-header-height)) olur.
        // Eğer direkt main header'ın altına yapışacaksa bu `md:sticky md:top-[calc(var(--top-bar-height)+var(--main-header-height))]`
        // veya Tailwind'de `md:sticky md:top-[var(--main-header-total-height)]` gibi.
        // Şimdilik `top-[calc(var(--top-bar-height,40px)+var(--main-header-height,76px))]` doğru görünüyor.
        : { top: 'calc(var(--top-bar-height, 40px) + var(--main-header-height, 76px))' } 
      }
    >
      {/* Mobile Menu Content - isMobileFromParent true ise render edilir */}
      {isMobileFromParent && (
        <div className="w-full bg-white"> 
          <div className="px-3 py-3 space-y-1 max-h-[calc(100vh-var(--main-header-total-height,116px)-var(--mobile-search-height,56px)-20px)] overflow-y-auto">
            {menuItems.map((item) => (
              <li key={item.slug || item.title} className="list-none">
                {!item.subItems || item.subItems.length === 0 ? (
                  <Link
                    href={item.isExternal ? item.slug : `/${item.slug.startsWith('/') ? item.slug.substring(1) : item.slug}`}
                    target={item.isExternal ? "_blank" : "_self"}
                    rel={item.isExternal ? "noopener noreferrer" : undefined}
                    className={`block py-2.5 px-3.5 text-base text-gray-700 font-medium hover:bg-purple-50 hover:text-[#6A3C96] rounded-lg transition-colors duration-150 ${
                      pathname === `/${item.slug.startsWith('/') ? item.slug.substring(1) : item.slug}` ? "bg-purple-100 text-[#6A3C96]" : ""
                    }`}
                    onClick={() => handleLinkClick(false)}
                  >
                    {item.title}
                    {item.isExternal && <span className="ml-1 text-sm">↗</span>}
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => handleMobileSubMenuToggle(item.title)}
                      className="w-full flex justify-between items-center py-2.5 px-3.5 text-base text-gray-700 font-medium hover:bg-purple-50 hover:text-[#6A3C96] rounded-lg transition-colors duration-150"
                    >
                      <span>{item.title}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-200 ${activeDropdownFromParent === item.title ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {activeDropdownFromParent === item.title && (
                      <ul className="pl-4 mt-1.5 mb-1 space-y-1 border-l-2 border-purple-200 ml-1.5">
                        {item.subItems.map((subPage) => (
                          <li key={subPage.slug}>
                            <Link
                              href={subPage.isExternal ? subPage.slug : `/${subPage.slug.startsWith('/') ? subPage.slug.substring(1) : subPage.slug}`}
                              target={subPage.isExternal ? "_blank" : "_self"}
                              rel={subPage.isExternal ? "noopener noreferrer" : undefined}
                              className={`block py-2 px-3 text-sm text-gray-600 hover:text-[#6A3C96] hover:bg-purple-50 rounded-md transition-colors duration-150 ${
                                pathname === `/${subPage.slug.startsWith('/') ? subPage.slug.substring(1) : subPage.slug}` ? "text-[#6A3C96] bg-purple-100 font-semibold" : ""
                              }`}
                              onClick={() => handleLinkClick(true)}
                            >
                              {subPage.title}
                              {subPage.isExternal && <span className="ml-1 text-xs">↗</span>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </li>
            ))}
          </div>
        </div>
      )}

      {/* Desktop Menu */}
      {!isMobileFromParent && (
        <div className="max-w-screen-xl mx-auto flex justify-center items-center px-4 h-[57px]"> {/* Desktop menü için sabit bir yükseklik */}
          {menuItems.map((item) => (
            <div key={item.slug || item.title} className="relative group h-full flex items-center">
              {!item.subItems || item.subItems.length === 0 ? (
                <Link
                  href={item.isExternal ? item.slug : `/${item.slug.startsWith('/') ? item.slug.substring(1) : item.slug}`}
                  target={item.isExternal ? "_blank" : "_self"}
                  rel={item.isExternal ? "noopener noreferrer" : undefined}
                  className={`h-full flex items-center px-3 text-sm text-gray-600 hover:text-[#6A3C96] font-medium transition-colors duration-200 whitespace-nowrap relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[3px] after:bg-[#6A3C96] after:transition-all after:duration-300 ${
                    pathname === `/${item.slug.startsWith('/') ? item.slug.substring(1) : item.slug}` ? "text-[#6A3C96] after:w-full" : "after:w-0 group-hover:after:w-3/4"
                  }`}
                >
                  {item.title}
                  {item.isExternal && <span className="ml-1 text-sm">↗</span>}
                </Link>
              ) : (
                <>
                  <span className="h-full flex items-center px-3 text-sm cursor-default text-gray-600 group-hover:text-[#6A3C96] font-medium transition-colors duration-200 whitespace-nowrap relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[3px] after:bg-[#6A3C96] after:transition-all after:duration-300 after:w-0 group-hover:after:w-3/4">
                    {item.title}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5 text-gray-400 group-hover:text-[#6A3C96] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                  <div className="absolute left-1/2 -translate-x-1/2 mt-0 top-full w-auto min-w-[200px] bg-white shadow-xl border border-gray-100 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out z-50">
                    <ul className="py-2">
                      {item.subItems.map((subPage) => (
                        <li key={subPage.slug}>
                          <Link
                            href={subPage.isExternal ? subPage.slug : `/${subPage.slug.startsWith('/') ? subPage.slug.substring(1) : subPage.slug}`}
                            target={subPage.isExternal ? "_blank" : "_self"}
                            rel={subPage.isExternal ? "noopener noreferrer" : undefined}
                            className={`block w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-[#6A3C96] transition-colors duration-150 whitespace-nowrap ${
                              pathname === `/${subPage.slug.startsWith('/') ? subPage.slug.substring(1) : subPage.slug}` ? "bg-purple-100 text-[#6A3C96] font-semibold" : ""
                            }`}
                          >
                            {subPage.title}
                            {subPage.isExternal && <span className="ml-1 text-xs">↗</span>}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}
