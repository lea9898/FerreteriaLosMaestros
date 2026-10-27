import type { Product } from '../../types/product';
import { Alert } from '../atoms/Alert';
import { ProductCard } from '../molecules/ProductCard';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return <Alert variant="info">No se encontraron productos con los filtros aplicados.</Alert>;
  }
  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 row-cols-xl-4 g-4">
      {products.map((p) => (
        <div className="col" key={p.codigo}>
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}
