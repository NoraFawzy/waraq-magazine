import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  reading_time: number;
  created_at: string;
  categories: { name: string; slug: string };
}

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("articles")
        .select("*, categories(name, slug)")
        .eq("slug", slug)
        .single();
      setArticle(data);
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading)
    return (
      <div style={{ minHeight: "100vh", background: "var(--paper)" }}>
        <Navbar />
        <div
          style={{
            textAlign: "center",
            padding: "6rem",
            color: "var(--ink-soft)",
          }}
        >
          جارٍ التحميل...
        </div>
      </div>
    );

  if (!article)
    return (
      <div style={{ minHeight: "100vh", background: "var(--paper)" }}>
        <Navbar />
        <div style={{ textAlign: "center", padding: "6rem" }}>
          <p style={{ fontSize: "3rem" }}>📄</p>
          <p style={{ color: "var(--ink-soft)" }}>المقال غير موجود</p>
          <Link
            to="/"
            style={{
              color: "var(--olive)",
              marginTop: "1rem",
              display: "inline-block",
            }}
          >
            ← العودة للرئيسية
          </Link>
        </div>
      </div>
    );

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)" }}>
      <Navbar />

      {/* Article Header */}
      <div
        style={{
          background:
            "linear-gradient(to bottom, var(--olive) 0%, var(--paper) 100%)",
          padding: "4rem 1.5rem 3rem",
          textAlign: "center",
        }}
      >
        <Link
          to={`/category/${article.categories?.slug}`}
          style={{
            display: "inline-block",
            background: "var(--gold)",
            color: "white",
            padding: "0.3rem 1rem",
            borderRadius: "20px",
            fontSize: "0.8rem",
            textDecoration: "none",
            marginBottom: "1.5rem",
          }}
        >
          {article.categories?.name}
        </Link>

        <h1
          style={{
            fontFamily: "Amiri, serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            color: "white",
            maxWidth: "700px",
            margin: "0 auto 1.5rem",
            lineHeight: 1.3,
          }}
        >
          {article.title}
        </h1>

        <p style={{ color: "#ffffffaa", fontSize: "0.85rem" }}>
          {article.reading_time} دقائق قراءة ·{" "}
          {new Date(article.created_at).toLocaleDateString("ar-EG", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Article Body */}
      <div
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          padding: "3rem 1.5rem 5rem",
        }}
      >
        {/* Excerpt */}
        <p
          style={{
            fontSize: "1.2rem",
            color: "var(--ink-soft)",
            lineHeight: 1.9,
            borderRight: "4px solid var(--gold)",
            paddingRight: "1.5rem",
            marginBottom: "2.5rem",
            fontStyle: "italic",
            fontFamily: "Amiri, serif",
          }}
        >
          {article.excerpt}
        </p>

        {/* Divider */}
        <div
          style={{
            textAlign: "center",
            color: "var(--gold)",
            fontSize: "1.2rem",
            marginBottom: "2.5rem",
            letterSpacing: "0.5em",
          }}
        >
          ✦ ✦ ✦
        </div>

        {/* Content */}
        <div
          style={{
            fontSize: "1.1rem",
            lineHeight: 2,
            color: "var(--ink)",
            fontFamily: "Amiri, serif",
          }}
        >
          {article.content.split("\n").map(
            (para, i) =>
              para.trim() && (
                <p key={i} style={{ marginBottom: "1.5rem" }}>
                  {para}
                </p>
              ),
          )}
        </div>

        {/* Back link */}
        <div
          style={{
            marginTop: "4rem",
            paddingTop: "2rem",
            borderTop: "1px solid var(--paper-alt)",
          }}
        >
          <Link
            to="/"
            style={{
              color: "var(--olive)",
              textDecoration: "none",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            → العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
