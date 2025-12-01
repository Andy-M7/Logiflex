export interface Product {
  id: string;
  name: string;
  batch: string; // Lote
  imageUrl?: string;
  isActive: boolean;
}