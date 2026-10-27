import { Route, Routes } from 'react-router-dom';
import { MainLayout } from './components/templates/MainLayout';
import { SobreNosotros } from './pages/SobreNosotros';
import { AdminPage } from './pages/AdminPage';
import { CatalogPage } from './pages/CatalogPage';
import { Contacto } from './pages/Contacto';
import { DondeEstamos } from './pages/DondeEstamos';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ProductFormPage } from './pages/ProductFormPage';

export function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/producto/:codigo" element={<ProductDetailPage />} />
        <Route path="/nosotros" element={<SobreNosotros />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/ubicacion" element={<DondeEstamos />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/nuevo" element={<ProductFormPage />} />
        <Route path="/admin/editar/:codigo" element={<ProductFormPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}