import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { SupplyInventoryDto } from './dto/supply-inventory.dto';
import { TransferInventoryDto } from './dto/transfer-inventory.dto';
import { WriteOffInventoryDto } from './dto/write-off-inventory.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';

interface RequestWithUser {
  user: { username: string; userId: number; role: string };
}

@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('supply')
  @Roles('ADMIN', 'MANAGER')
  supply(@Body() dto: SupplyInventoryDto, @Request() req: RequestWithUser) {
    return this.inventoryService.supply(dto, req.user.username);
  }

  @Post('transfer')
  @Roles('ADMIN', 'MANAGER')
  transfer(@Body() dto: TransferInventoryDto, @Request() req: RequestWithUser) {
    return this.inventoryService.transfer(dto, req.user.username);
  }

  @Post('write-off')
  @Roles('ADMIN', 'MANAGER')
  writeOff(@Body() dto: WriteOffInventoryDto, @Request() req: RequestWithUser) {
    return this.inventoryService.writeOff(dto, req.user.username);
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
  @Roles('ADMIN')
  remove(
    @Query('productId') productId: string,
    @Query('warehouseId') warehouseId: string,
  ) {
    return this.inventoryService.remove(+productId, +warehouseId);
  }
}
