import type { Product, ProductFormErrors, ProductFormValues } from '../types/product';

export const EMPTY_FORM: ProductFormValues = {
  codigo: '',
  categoria: '',
  subcategoria: '',
  nombre: '',
  marca: '',
  unidad: '',
  precioCompra: '',
  precioVenta: '',
  stock: '',
  stockMinimo: '',
  imagen: '',
};

const CODE_FORMAT = /^[A-Z]{2}\d{3,4}$/;

const IMAGE_FORMAT = /^(https?:\/\/|\/)\S+$/;

const isBlank = (v: string) => v.trim() === '';

function validatePrice(value: string): string | undefined {
  if (isBlank(value)) return 'Este campo es obligatorio.';
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return 'Debe ser un número mayor a 0.';
  return undefined;
}

function validateCount(value: string): string | undefined {
  if (isBlank(value)) return 'Este campo es obligatorio.';
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0) return 'Debe ser un número entero igual o mayor a 0.';
  return undefined;
}

export function validateProduct(
  values: ProductFormValues,
  existingCodes: string[] = [],
  isEditing = false,
): ProductFormErrors {
  const errors: ProductFormErrors = {};

  if (isBlank(values.codigo)) {
    errors.codigo = 'El código es obligatorio.';
  } else if (!CODE_FORMAT.test(values.codigo.trim())) {
    errors.codigo = 'Formato inválido: usa 2 letras mayúsculas y 3 o 4 números (ej: MC001).';
  } else if (!isEditing && existingCodes.includes(values.codigo.trim())) {
    errors.codigo = 'Ya existe un producto con este código.';
  }

  if (isBlank(values.categoria)) errors.categoria = 'Selecciona una categoría.';
  if (isBlank(values.subcategoria)) errors.subcategoria = 'La subcategoría es obligatoria.';

  if (isBlank(values.nombre)) {
    errors.nombre = 'El nombre es obligatorio.';
  } else if (values.nombre.trim().length < 3) {
    errors.nombre = 'El nombre debe tener al menos 3 caracteres.';
  }

  if (isBlank(values.marca)) errors.marca = 'La marca es obligatoria.';
  if (isBlank(values.unidad)) errors.unidad = 'La unidad es obligatoria.';

  const compra = validatePrice(values.precioCompra);
  if (compra) errors.precioCompra = compra;

  const venta = validatePrice(values.precioVenta);
  if (venta) {
    errors.precioVenta = venta;
  } else if (!compra && Number(values.precioVenta) < Number(values.precioCompra)) {
    errors.precioVenta = 'El precio de venta no puede ser menor al precio de compra.';
  }

  const stock = validateCount(values.stock);
  if (stock) errors.stock = stock;

  const minimo = validateCount(values.stockMinimo);
  if (minimo) errors.stockMinimo = minimo;

  if (!isBlank(values.imagen) && !IMAGE_FORMAT.test(values.imagen.trim())) {
    errors.imagen = 'Ingresa una URL válida (http/https) o una ruta que empiece con / (ej: /productos/MC001.jpg).';
  }

  return errors;
}

export const toProduct = (v: ProductFormValues): Product => ({
  ...(v.imagen.trim() !== '' ? { imagen: v.imagen.trim() } : {}),
  codigo: v.codigo.trim(),
  categoria: v.categoria.trim(),
  subcategoria: v.subcategoria.trim(),
  nombre: v.nombre.trim(),
  marca: v.marca.trim(),
  unidad: v.unidad.trim(),
  precioCompra: Number(v.precioCompra),
  precioVenta: Number(v.precioVenta),
  stock: Number(v.stock),
  stockMinimo: Number(v.stockMinimo),
});

export const productToFormValues = (p: Product): ProductFormValues => ({
  codigo: p.codigo,
  categoria: p.categoria,
  subcategoria: p.subcategoria,
  nombre: p.nombre,
  marca: p.marca,
  unidad: p.unidad,
  precioCompra: String(p.precioCompra),
  precioVenta: String(p.precioVenta),
  stock: String(p.stock),
  stockMinimo: String(p.stockMinimo),
  imagen: p.imagen ?? '',
});
