import { Module } from '@nestjs/common';
import { GatewayGateway } from './gateway.gateway';
import { GatewayService } from './gateway.service';

@Module({
  providers: [GatewayGateway, GatewayService],
  exports: [GatewayGateway]
})
export class GatewayModule { }
