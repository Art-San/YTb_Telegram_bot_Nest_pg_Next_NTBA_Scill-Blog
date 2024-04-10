import { Injectable } from '@nestjs/common'
import { BotService } from './bot/bot.service'
import { Reputations } from '@prisma/client'

@Injectable()
export class AppService {
	constructor(private readonly botService: BotService) {}
	async getAllUserReputations(): Promise<Reputations[]> {
		const reputations = await this.botService.getAllReputations()
		return reputations.sort((a, b) => b.reputation - a.reputation)
	}
}
