import { useState } from 'react';
import { productRepository } from '../services/productRepository';
import type { Product } from '../types/product';

/** Conecta el estado de React (useState) con el Repository. */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>(() => productRepository.getAll());

  const refresh = () => setProducts(productRepository.getAll());

  const createProduct = (product: Product) => {
    productRepository.create(product);
    refresh();
  };

  const updateProduct = (codigo: string, changes: Partial<Omit<Product, 'codigo'>>) => {
    productRepository.update(codigo, changes);
    refresh();
  };

  const deleteProduct = (codigo: string) => {
    productRepository.remove(codigo);
    refresh();
  };

  return { products, createProduct, updateProduct, deleteProduct };
}
