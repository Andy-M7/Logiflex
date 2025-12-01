import { Product } from "../../domain/entities/products";
import { ProductRepository } from "../../domain/repositories/product.repository";
import { backendApi } from "../source/remote/api/backendApi";

export class ProductRepositoryImpl implements ProductRepository {
  
  async getAll(): Promise<Product[]> {
    const { data } = await backendApi.get<Product[]>('/products');
    return data;
  }

  async create(product: Omit<Product, 'id'>): Promise<Product> {
    const { data } = await backendApi.post<Product>('/products', product);
    return data;
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
    const { data } = await backendApi.patch<Product>(`/products/${id}`, product);
    return data;
  }

  async delete(id: string): Promise<void> {
    await backendApi.delete(`/products/${id}`);
  }
}