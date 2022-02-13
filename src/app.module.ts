import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UpyunService } from './services';

@Module({
  imports: [CacheModule.register()],
  controllers: [AppController],
  providers: [AppService, UpyunService],
})
export class AppModule {}
