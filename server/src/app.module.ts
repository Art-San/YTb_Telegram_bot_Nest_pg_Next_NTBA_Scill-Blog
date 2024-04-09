import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DbModule } from './db/db.module'
import { BotService } from './bot/bot.service'
import { DbService } from './db/db.service'

@Module({
	imports: [DbModule],
	controllers: [AppController],
	providers: [AppService, BotService],
})
export class AppModule {}
