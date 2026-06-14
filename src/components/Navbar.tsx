import { Link } from "react-router-dom";
import { useState } from "react";

const categories = [
  { name: "قصص قصيرة", slug: "short-stories" },
  { name: "مقالات", slug: "articles" },
  { name: "شعر", slug: "poetry" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav
        style={{
          background: "var(--olive)",
          padding: "0 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
        }}
      >
        <Link
          to="/"
          style={{
            fontFamily: "Amiri, serif",
            fontSize: "1.8rem",
            color: "var(--gold-lt)",
            textDecoration: "none",
            letterSpacing: "0.05em",
          }}
        >
          وَرَق
        </Link>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: "2rem" }} className="nav-links">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to={`/category/${c.slug}`}
              style={{
                color: "#ffffffcc",
                textDecoration: "none",
                fontSize: "0.95rem",
                fontWeight: 500,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--gold-lt)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.color = "#ffffffcc")}
            >
              {c.name}
            </Link>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            color: "white",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
          className="nav-burger"
        >
          ☰
        </button>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div
          style={{
            background: "var(--olive-dim)",
            padding: "1rem 2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {categories.map((c) => (
            <Link
              key={c.slug}
              to={`/category/${c.slug}`}
              onClick={() => setOpen(false)}
              style={{
                color: "var(--gold-lt)",
                textDecoration: "none",
                fontSize: "1rem",
              }}
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .nav-links { display: none !important; }
          .nav-burger { display: block !important; }
        }
      `}</style>
    </>
  );
}
