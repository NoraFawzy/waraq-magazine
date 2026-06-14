import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  reading_time: number;
  categories: { name: string; slug: string };
}

interface Category {
  name: string;
  description: string;
  slug: string;
}

export default function Category() {
  const { slug } = useParams<{ slug: string }>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: cat } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .single();
      setCategory(cat);

      const { data: arts } = await supabase
        .from("articles")
        .select("*, categories(name, slug)")
        .eq("published", true)
        .eq("categories.slug", slug)
        .order("created_at", { ascending: false });
      setArticles(arts || []);
      setLoading(false);
    }
    load();
  }, [slug]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)" }}>
      <Navbar />

      <div
        style={{
          background: "var(--olive)",
          padding: "3rem 1.5rem",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "Amiri, serif",
            fontSize: "2.5rem",
            color: "white",
            marginBottom: "0.5rem",
          }}
        >
          {category?.name || "..."}
        </h1>
        <p style={{ color: "#ffffffaa" }}>{category?.description}</p>
      </div>

      <div
        style={{ maxWidth: "1100px", margin: "0 auto", padding: "3rem 1.5rem" }}
      >
        {loading && (
          <p style={{ textAlign: "center", color: "var(--ink-soft)" }}>
            جارٍ التحميل...
          </p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {articles.map((a) => (
            <Link
              key={a.id}
              to={`/article/${a.slug}`}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  background: "white",
                  borderRadius: "var(--radius)",
                  padding: "1.75rem",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  borderBottom: "3px solid transparent",
                  transition: "all 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderBottomColor =
                    "var(--gold)";
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderBottomColor =
                    "transparent";
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(0)";
                }}
              >
                <p
                  style={{
                    color: "var(--ink-soft)",
                    fontSize: "0.8rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  {a.reading_time} دقائق
                </p>
                <h3
                  style={{
                    fontFamily: "Amiri, serif",
                    fontSize: "1.4rem",
                    color: "var(--ink)",
                    marginBottom: "0.75rem",
                  }}
                >
                  {a.title}
                </h3>
                <p
                  style={{
                    color: "var(--ink-soft)",
                    fontSize: "0.9rem",
                    lineHeight: 1.7,
                  }}
                >
                  {a.excerpt?.slice(0, 100)}...
                </p>
              </div>
            </Link>
          ))}
        </div>

        {!loading && articles.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "4rem",
              color: "var(--ink-soft)",
            }}
          >
            <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>📂</p>
            <p>لا توجد مقالات في هذا القسم بعد</p>
          </div>
        )}
      </div>
    </div>
  );
}
