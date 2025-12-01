import { ProductRepositoryImpl } from '../../../data/repositories/ProductRepositoryImpl';
import { Product } from '../../entities/products';

const repo = new ProductRepositoryImpl();

export const GetProductsUseCase = () => repo.getAll();

export const CreateProductUseCase = (product: Omit<Product, 'id'>) => {
  return repo.create(product);
};

export const UpdateProductUseCase = (id: string, product: Partial<Product>) => {
  return repo.update(id, product);
};

export const DeleteProductUseCase = (id: string) => {
  return repo.delete(id);
};