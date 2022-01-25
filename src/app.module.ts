import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UpyunService } from './services/upyun/upyun.service';

@Module({
  imports: [CacheModule.register()],
  controllers: [AppController],
  providers: [AppService, UpyunService],
})
export class AppModule {}
