import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert } from '../components/atoms/Alert';
import { ProductForm } from '../components/organisms/ProductForm';
import { useProducts } from '../hooks/useProducts';
import { productRepository } from '../services/productRepository';
import type { Product } from '../types/product';
import { productToFormValues } from '../utils/validation';

/** Sirve para crear (/admin/nuevo) y editar (/admin/editar/:codigo). */
export function ProductFormPage() {
  const { codigo } = useParams<{ codigo: string }>();
  const navigate = useNavigate();
  const { products, createProduct, updateProduct } = useProducts();
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(codigo);
  const editing = codigo ? products.find((p) => p.codigo === codigo) : undefined;

  if (isEditing && !editing) {
    return <Alert variant="danger">Producto no encontrado.</Alert>;
  }

  const handleSubmit = (product: Product) => {
    try {
      if (isEditing) {
        const { codigo: _ignored, ...changes } = product;
        updateProduct(product.codigo, { ...changes, imagen: product.imagen });
        navigate('/admin', { state: { message: `Producto ${product.codigo} actualizado correctamente.` } });
      } else {
        createProduct(product);
        navigate('/admin', { state: { message: `Producto ${product.codigo} creado correctamente.` } });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ocurrió un error inesperado.');
    }
  };

  return (
    <>
      <h1 className="h3 mb-3">{isEditing ? `Editar producto ${codigo}` : 'Nuevo producto'}</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <ProductForm
        initialValues={editing ? productToFormValues(editing) : undefined}
        categories={productRepository.getCategories()}
        existingCodes={products.map((p) => p.codigo)}
        isEditing={isEditing}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin')}
      />
    </>
  );
}
