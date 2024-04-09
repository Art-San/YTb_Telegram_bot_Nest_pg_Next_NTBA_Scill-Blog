import { Module } from '@nestjs/common'
import { DbService } from './db.service'

@Module({
	providers: [DbService],
	exports: [DbService] // Будем использовать по всему приложение по этому пишем "exports"
})
export class DbModule {}
