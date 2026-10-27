import { Link, useParams } from 'react-router-dom';
import { Alert } from '../components/atoms/Alert';
import { ProductImage } from '../components/atoms/ProductImage';
import { getProductImage } from '../utils/image';
import { StockBadge } from '../components/molecules/StockBadge';
import { useProducts } from '../hooks/useProducts';
import { formatCLP } from '../utils/format';

export function ProductDetailPage() {
  const { codigo } = useParams<{ codigo: string }>();
  const { products } = useProducts();
  const product = products.find((p) => p.codigo === codigo);

  if (!product) {
    return (
      <>
        <Alert variant="danger">Producto no encontrado.</Alert>
        <Link to="/" className="btn btn-outline-primary">Volver al catálogo</Link>
      </>
    );
  }

  return (
    <>
      <Link to="/" className="btn btn-link px-0 mb-2">← Volver al catálogo</Link>
      <div className="row g-4">
        <div className="col-12 col-md-6">
          <div className="lm-detail-img">
            <ProductImage src={getProductImage(product)} alt={product.nombre} height={340} />
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="lm-panel p-4 h-100">
            <span className="lm-tag">{product.categoria}</span>
            <small className="text-muted d-block mt-2">{product.codigo} · {product.subcategoria}</small>
            <h1 className="h3 mt-1">{product.nombre}</h1>
            <p className="text-muted">Marca: {product.marca} · Unidad: {product.unidad}</p>
            <p className="lm-detail-price mb-3">{formatCLP(product.precioVenta)}</p>
            <p className="mb-2">Stock disponible: <strong>{product.stock}</strong> (mínimo de reposición: {product.stockMinimo})</p>
            <StockBadge product={product} />
          </div>
        </div>
      </div>
    </>
  );
}
