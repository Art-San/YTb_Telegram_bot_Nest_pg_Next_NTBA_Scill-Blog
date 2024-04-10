import { Controller, Get } from '@nestjs/common'
import { Reputations } from '@prisma/client'
import { AppService } from './app.service'

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get('/reputations')
	async getReputations(): Promise<Reputations[]> {
		return this.appService.getAllUserReputations()
	}
}
