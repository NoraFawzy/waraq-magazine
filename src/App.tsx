import { BrowserRouter, Routes, Route } from 'react-router-dom'
// @ts-ignore
import Home from './pages/Home'
// @ts-ignore
import Category from './pages/Category'
// @ts-ignore
import Article from './pages/Article'
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:slug" element={<Category />} />
        <Route path="/article/:slug" element={<Article />} />
      </Routes>
    </BrowserRouter>
  )
}