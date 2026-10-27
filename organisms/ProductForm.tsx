import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Product, ProductFormValues } from '../../types/product';
import { EMPTY_FORM, toProduct, validateProduct } from '../../utils/validation';
import { Button } from '../atoms/Button';
import { FormField } from '../molecules/FormField';

interface ProductFormProps {
  initialValues?: ProductFormValues;
  categories: string[];
  existingCodes: string[];
  isEditing?: boolean;
  onSubmit: (product: Product) => void;
  onCancel: () => void;
}

export function ProductForm({
  initialValues = EMPTY_FORM, categories, existingCodes, isEditing = false, onSubmit, onCancel,
}: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<keyof ProductFormValues, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  const errors = validateProduct(values, existingCodes, isEditing);
  // Un error solo se muestra si el campo fue tocado o si se intentó enviar el formulario.
  const errorOf = (field: keyof ProductFormValues) =>
    submitted || touched[field] ? errors[field] : undefined;

  const bind = (field: keyof ProductFormValues) => ({
    id: field,
    value: values[field],
    error: errorOf(field),
    onChange: (value: string) => setValues((prev) => ({ ...prev, [field]: value })),
    onBlur: () => setTouched((prev) => ({ ...prev, [field]: true })),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    onSubmit(toProduct(values));
  };

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Formulario de producto" className="lm-panel p-4">
      <div className="row">
        <div className="col-12 col-md-4">
          <FormField {...bind('codigo')} label="Código" placeholder="Ej: MC011" disabled={isEditing} />
        </div>
        <div className="col-12 col-md-4">
          <FormField {...bind('categoria')} label="Categoría" options={categories} placeholder="Selecciona una categoría" />
        </div>
        <div className="col-12 col-md-4">
          <FormField {...bind('subcategoria')} label="Subcategoría" />
        </div>
        <div className="col-12 col-md-8">
          <FormField {...bind('nombre')} label="Nombre del producto" />
        </div>
        <div className="col-12 col-sm-6 col-md-2">
          <FormField {...bind('marca')} label="Marca" />
        </div>
        <div className="col-12 col-sm-6 col-md-2">
          <FormField {...bind('unidad')} label="Unidad" placeholder="Ej: Saco" />
        </div>
        <div className="col-6 col-md-3">
          <FormField {...bind('precioCompra')} label="Precio de compra (CLP)" type="number" />
        </div>
        <div className="col-6 col-md-3">
          <FormField {...bind('precioVenta')} label="Precio de venta (CLP)" type="number" />
        </div>
        <div className="col-6 col-md-3">
          <FormField {...bind('stock')} label="Stock" type="number" />
        </div>
        <div className="col-6 col-md-3">
          <FormField {...bind('stockMinimo')} label="Stock mínimo" type="number" />
        </div>
        <div className="col-12">
          <FormField {...bind('imagen')} label="Foto del producto (opcional)" placeholder="https://... o /productos/MC001.jpg" />
        </div>
      </div>
      <div className="d-flex flex-wrap gap-2">
        <Button type="submit" variant="primary">{isEditing ? 'Guardar cambios' : 'Crear producto'}</Button>
        <Button variant="outline-secondary" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  );
}
