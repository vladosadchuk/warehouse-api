export class WriteOffInventoryDto {
  productId: number;
  warehouseId: number;
  amount: number;
  reason?: string; // Optional reasoning (e.g., "Damaged", "Lost")
}
