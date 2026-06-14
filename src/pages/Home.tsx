import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
// @ts-ignore
import Navbar from '../components/Navbar'

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  reading_time: number
  created_at: string
  categories: { name: string; slug: string }
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([])
  const [featured, setFeatured] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('articles')
        .select('*, categories(name, slug)')
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (data && data.length > 0) {
        setFeatured(data[0])
        setArticles(data.slice(1))
      }
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>
      <Navbar />

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, var(--olive-dim) 0%, var(--olive) 100%)',
        padding: '5rem 2rem 4rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'repeating-linear-gradient(45deg, var(--gold) 0, var(--gold) 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px',
        }} />
        <p style={{ color: 'var(--gold-lt)', fontSize: '0.85rem', letterSpacing: '0.2em', marginBottom: '1rem' }}>
          ✦ مجلة أدبية وثقافية ✦
        </p>
        <h1 style={{
          fontFamily: 'Amiri, serif',
          fontSize: 'clamp(3rem, 8vw, 6rem)',
          color: 'white',
          marginBottom: '1rem',
        }}>وَرَق</h1>
        <p style={{ color: '#ffffffaa', fontSize: '1.1rem', maxWidth: '400px', margin: '0 auto' }}>
          قصص تسكن القلب، ومقالات تشغل العقل، وشعر يلمس الروح
        </p>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>

        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--ink-soft)' }}>
            جارٍ التحميل...
          </div>
        )}

        {/* Featured Article */}
        {featured && (
          <div style={{ marginBottom: '3rem' }}>
            <p style={{
              fontSize: '0.75rem', letterSpacing: '0.15em',
              color: 'var(--gold)', fontWeight: 600, marginBottom: '1rem',
              textTransform: 'uppercase',
            }}>✦ مقال مميز</p>
            <Link to={`/article/${featured.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'white',
                borderRadius: 'var(--radius)',
                padding: '2.5rem',
                borderRight: '5px solid var(--olive)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
                transition: 'transform 0.25s, box-shadow 0.25s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.07)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{
                    background: 'var(--olive)', color: 'white',
                    padding: '0.2rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem',
                  }}>{featured.categories?.name}</span>
                  <span style={{ color: 'var(--ink-soft)', fontSize: '0.8rem' }}>
                    {featured.reading_time} دقائق قراءة
                  </span>
                </div>
                <h2 style={{
                  fontFamily: 'Amiri, serif', fontSize: '2rem',
                  color: 'var(--ink)', marginBottom: '1rem',
                }}>{featured.title}</h2>
                <p style={{ color: 'var(--ink-soft)', fontSize: '1rem', lineHeight: 1.8 }}>
                  {featured.excerpt}
                </p>
                <p style={{ color: 'var(--olive)', marginTop: '1.5rem', fontWeight: 600 }}>
                  اقرأ المزيد ←
                </p>
              </div>
            </Link>
          </div>
        )}

        {/* Articles Grid */}
        {articles.length > 0 && (
          <>
            <p style={{
              fontSize: '0.75rem', letterSpacing: '0.15em',
              color: 'var(--gold)', fontWeight: 600, marginBottom: '1.5rem',
            }}>✦ آخر المنشورات</p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}>
              {articles.map(a => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </>
        )}

        {!loading && articles.length === 0 && !featured && (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--ink-soft)' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📖</p>
            <p>لا توجد مقالات بعد</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link to={`/article/${article.slug}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'white',
        borderRadius: 'var(--radius)',
        padding: '1.75rem',
        height: '100%',
        borderBottom: '3px solid transparent',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderBottomColor = 'var(--gold)'
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
        ;(e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderBottomColor = 'transparent'
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
        ;(e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{
            background: 'var(--paper-alt)', color: 'var(--olive)',
            padding: '0.2rem 0.65rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
          }}>{article.categories?.name}</span>
          <span style={{ color: 'var(--ink-soft)', fontSize: '0.75rem' }}>
            {article.reading_time} د
          </span>
        </div>
        <h3 style={{
          fontFamily: 'Amiri, serif', fontSize: '1.35rem',
          color: 'var(--ink)', marginBottom: '0.6rem', lineHeight: 1.4,
        }}>{article.title}</h3>
        <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', lineHeight: 1.7 }}>
          {article.excerpt?.slice(0, 100)}...
        </p>
      </div>
    </Link>
  )
}

function Footer() {
  return (
    <footer style={{
      background: 'var(--olive-dim)',
      color: '#ffffffaa',
      textAlign: 'center',
      padding: '2.5rem',
      marginTop: '4rem',
      fontSize: '0.9rem',
    }}>
      <p style={{ fontFamily: 'Amiri, serif', fontSize: '1.5rem', color: 'var(--gold-lt)', marginBottom: '0.5rem' }}>وَرَق</p>
      <p>© 2026 Nora Fawzy — All Rights Reserved</p>
    </footer>
  )
}