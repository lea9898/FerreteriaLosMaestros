import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Alert } from '../components/atoms/Alert';
import { ConfirmBox } from '../components/molecules/ConfirmBox';
import { SearchFilters } from '../components/molecules/SearchFilters';
import { ProductTable } from '../components/organisms/ProductTable';
import { useProducts } from '../hooks/useProducts';
import { productRepository } from '../services/productRepository';
import type { ProductFilters } from '../types/product';
import { EMPTY_FILTERS, filterProducts } from '../utils/filters';

export function AdminPage() {
  const location = useLocation();
  const { products, deleteProduct } = useProducts();
  const [filters, setFilters] = useState<ProductFilters>(EMPTY_FILTERS);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(
    (location.state as { message?: string } | null)?.message ?? null,
  );

  const handleConfirm = () => {
    if (!pendingDelete) return;
    deleteProduct(pendingDelete);
    setMessage(`Producto ${pendingDelete} eliminado correctamente.`);
    setPendingDelete(null);
  };

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <span className="lm-eyebrow mb-1" style={{ background: "#fdeee0", color: "#c1600f" }}>Panel</span>
          <h1 className="h3 mb-0">Administración de productos</h1>
        </div>
        <Link to="/admin/nuevo" className="btn btn-primary">+ Nuevo producto</Link>
      </div>

      {message && <Alert variant="success">{message}</Alert>}
      {pendingDelete && (
        <ConfirmBox
          message={`¿Seguro que quieres eliminar el producto ${pendingDelete}?`}
          onConfirm={handleConfirm}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      <SearchFilters
        filters={filters}
        categories={productRepository.getCategories()}
        onChange={setFilters}
        onClear={() => setFilters(EMPTY_FILTERS)}
      />
      <ProductTable products={filterProducts(products, filters)} onDelete={setPendingDelete} />
    </>
  );
}
