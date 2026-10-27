import type { Product } from '../../types/product';
import { isLowStock } from '../../utils/filters';
import { Badge } from '../atoms/Badge';

interface StockBadgeProps {
  product: Pick<Product, 'stock' | 'stockMinimo'>;
}

export function StockBadge({ product }: StockBadgeProps) {
  if (product.stock === 0) return <Badge variant="danger">Sin stock</Badge>;
  if (isLowStock(product)) return <Badge variant="warning">Stock bajo</Badge>;
  return <Badge variant="success">Disponible</Badge>;
}
