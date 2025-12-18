import { Module } from '@nestjs/common';
import { TouristsController } from './tourists.controller';
import { TouristsService } from './tourists.service';

@Module({
  controllers: [TouristsController],
  providers: [TouristsService]
})
export class TouristsModule {}
