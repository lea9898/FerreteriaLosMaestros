import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';
import { formatCLP } from '../../utils/format';
import { getProductImage } from '../../utils/image';
import { ProductImage } from '../atoms/ProductImage';
import { Alert } from '../atoms/Alert';
import { Button } from '../atoms/Button';
import { StockBadge } from '../molecules/StockBadge';

interface ProductTableProps {
  products: Product[];
  onDelete: (codigo: string) => void;
}

export function ProductTable({ products, onDelete }: ProductTableProps) {
  if (products.length === 0) {
    return <Alert variant="info">No se encontraron productos con los filtros aplicados.</Alert>;
  }
  return (
    <div className="lm-table-wrap table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th>Foto</th>
            <th>Código</th>
            <th>Nombre</th>
            <th className="d-none d-md-table-cell">Categoría</th>
            <th className="text-end">Precio venta</th>
            <th className="text-end">Stock</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.codigo}>
              <td style={{ width: 64 }}>
                <ProductImage src={getProductImage(p)} alt={p.nombre} height={48} className="lm-thumb bg-white" />
              </td>
              <td className="fw-semibold">{p.codigo}</td>
              <td>{p.nombre}</td>
              <td className="d-none d-md-table-cell">{p.categoria}</td>
              <td className="text-end">{formatCLP(p.precioVenta)}</td>
              <td className="text-end">{p.stock}</td>
              <td><StockBadge product={p} /></td>
              <td>
                <div className="d-flex gap-1">
                  <Link
                    to={`/admin/editar/${p.codigo}`}
                    className="btn btn-outline-primary btn-sm"
                    aria-label={`Editar ${p.codigo}`}
                  >
                    Editar
                  </Link>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    ariaLabel={`Eliminar ${p.codigo}`}
                    onClick={() => onDelete(p.codigo)}
                  >
                    Eliminar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
