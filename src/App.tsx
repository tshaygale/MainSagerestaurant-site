import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { supabase, type MenuItem } from '@/lib/supabase';
import { AuthProvider } from '@/hooks/useAuth';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import MenuPage from '@/pages/MenuPage';
import VisitPage from '@/pages/VisitPage';
import ReservePage from '@/pages/ReservePage';
import AdminSignIn from '@/components/AdminSignIn';
import AdminDashboard from '@/components/AdminDashboard';
import ScrollToTop from '@/components/ScrollToTop';
import NotFoundPage from '@/pages/NotFoundPage';

export default function App() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('category', { ascending: true })
        .order('sort_order', { ascending: true });

      if (error) {
        setError("We couldn't load the menu. Please try again shortly.");
      } else {
        setItems(data as MenuItem[]);
      }
      setLoading(false);
    };
    fetchMenu();
  }, []);

  const featured = items.filter((i) => i.is_featured);

  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route
            path="/"
            element={<HomePage featured={featured} menuItems={items} />}
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/visit" element={<VisitPage />} />
          <Route path="/reserve" element={<ReservePage />} />
          <Route path="/admin/signin" element={<AdminSignIn />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
