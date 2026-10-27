export interface Product {
  codigo: string;
  categoria: string;
  subcategoria: string;
  nombre: string;
  marca: string;
  unidad: string;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  stockMinimo: number;
  /** URL o ruta de la foto. Si falta, se usa /productos/<codigo>.jpg */
  imagen?: string;
}

/** Valores del formulario: los inputs siempre entregan texto. */
export interface ProductFormValues {
  codigo: string;
  categoria: string;
  subcategoria: string;
  nombre: string;
  marca: string;
  unidad: string;
  precioCompra: string;
  precioVenta: string;
  stock: string;
  stockMinimo: string;
  imagen: string;
}

export type ProductFormErrors = Partial<Record<keyof ProductFormValues, string>>;

export interface ProductFilters {
  texto: string;
  categoria: string;
  soloStockBajo: boolean;
}
