import { useState } from 'react';
import { ProductGrid } from '../components/organisms/ProductGrid';
import { SearchFilters } from '../components/molecules/SearchFilters';
import { useProducts } from '../hooks/useProducts';
import { productRepository } from '../services/productRepository';
import type { ProductFilters } from '../types/product';
import { EMPTY_FILTERS, filterProducts } from '../utils/filters';

export function CatalogPage() {
  const { products } = useProducts();
  const [filters, setFilters] = useState<ProductFilters>(EMPTY_FILTERS);
  const visible = filterProducts(products, filters);
  const categories = productRepository.getCategories();

  return (
    <>
      <section className="lm-hero mb-4">
        <span className="lm-eyebrow">Ferretería Los Maestros</span>
        <h1>Catálogo de productos</h1>
        <p>Materiales de construcción, pinturas y herramientas para contratistas y particulares. Busca, filtra y revisa el detalle de cada producto.</p>
        <ul className="lm-hero-stats">
          <li><strong>{products.length}</strong><span>productos</span></li>
          <li><strong>{categories.length}</strong><span>categorías</span></li>
          <li><strong>22</strong><span>años de experiencia</span></li>
        </ul>
      </section>
      <SearchFilters
        filters={filters}
        categories={categories}
        onChange={setFilters}
        onClear={() => setFilters(EMPTY_FILTERS)}
      />
      <p className="text-muted small">Mostrando {visible.length} de {products.length} productos</p>
      <ProductGrid products={visible} />
    </>
  );
}
