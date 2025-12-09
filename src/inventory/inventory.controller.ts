import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  Param,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { SupplyInventoryDto } from './dto/supply-inventory.dto';
import { TransferInventoryDto } from './dto/transfer-inventory.dto';
import { WriteOffInventoryDto } from './dto/write-off-inventory.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('supply')
  supply(@Body() dto: SupplyInventoryDto) {
    return this.inventoryService.supply(dto);
  }

  @Post('transfer')
  transfer(@Body() dto: TransferInventoryDto) {
    return this.inventoryService.transfer(dto);
  }

  @Post('write-off')
  writeOff(@Body() dto: WriteOffInventoryDto) {
    return this.inventoryService.writeOff(dto);
  }

  @Get()
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get('warehouse/:id')
  findByWarehouse(@Param('id') id: string) {
    return this.inventoryService.findByWarehouse(+id);
  }

  @Delete()
  remove(
    @Query('productId') productId: string,
    @Query('warehouseId') warehouseId: string,
  ) {
    return this.inventoryService.remove(+productId, +warehouseId);
  }
}
