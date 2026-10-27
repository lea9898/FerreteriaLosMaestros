import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';
import { formatCLP } from '../../utils/format';
import { getProductImage } from '../../utils/image';
import { ProductImage } from '../atoms/ProductImage';
import { StockBadge } from './StockBadge';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="lm-card h-100 d-flex flex-column">
      <div className="lm-card-img">
        <ProductImage src={getProductImage(product)} alt={product.nombre} height={180} />
      </div>
      <div className="p-3 d-flex flex-column flex-grow-1">
        <span className="lm-tag align-self-start">{product.categoria}</span>
        <small className="text-muted mt-2">{product.subcategoria} · {product.marca}</small>
        <h2 className="h6 mt-1 mb-2">{product.nombre}</h2>
        <p className="lm-price mb-2">{formatCLP(product.precioVenta)}</p>
        <div className="mb-3"><StockBadge product={product} /></div>
        <Link to={`/producto/${product.codigo}`} className="btn btn-outline-primary btn-sm mt-auto">
          Ver detalle
        </Link>
      </div>
    </div>
  );
}
