import { supabase } from "@/lib/supabase-browser"; // Supabase import yolunuzun doğru olduğundan emin olun
import Link from "next/link";
import Image from "next/image";

// Eğer CSS modülü kullanıyorsanız:
// import styles from './BlogPage.module.css'; 
// Ve aşağıdaki className'leri styles.className şeklinde güncelleyin.
// Örneğin: className={styles.blogPageContainer}

export default async function BlogPage() {
  const { data: blogs, error } = await supabase
    .from("bloglar")
    .select("id, title, slug, seo_description, thumbnail_image, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Blog yazıları yüklenirken hata oluştu:", error);
    return <div className="p-6 text-red-500 text-center">Blog yazıları yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.</div>;
  }

  if (!blogs || blogs.length === 0) {
    return <div className="p-6 text-gray-700 text-center">Henüz yayınlanmış bir blog yazısı bulunmamaktadır.</div>;
  }

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('tr-TR', options);
    } catch (e) {
      console.error("Tarih formatlama hatası:", e);
      return ""; 
    }
  };

  return (
    <div className="blog-page-container"> {/* Ana konteyner için özel sınıf */}
      
      {/* Banner bölümü isteğiniz üzerine kaldırıldı */}
      
      <h1 className="blog-page-title">Blog</h1> {/* Başlık için özel sınıf */}
      
      <div className="blog-grid"> {/* Grid için özel sınıf */}
        {blogs.map((blog) => (
          <Link key={blog.id} href={`/blog/${blog.slug}`} passHref legacyBehavior>
            <a className="blog-card-link"> 
              <div className="blog-card"> 
                {blog.thumbnail_image && (
                  <div className="blog-card-image-wrapper"> 
                    <Image
                      src={blog.thumbnail_image}
                      alt={blog.title || "Blog görseli"}
                      layout="fill" 
                      objectFit="cover"
                    />
                  </div>
                )}
                <div className="blog-card-content">
                  <h2 className="blog-card-title">{blog.title}</h2>
                  <p className="blog-card-description">{blog.seo_description || "Açıklama bulunamadı."}</p>
                  <p className="blog-card-date">{formatDate(blog.created_at)}</p> 
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
