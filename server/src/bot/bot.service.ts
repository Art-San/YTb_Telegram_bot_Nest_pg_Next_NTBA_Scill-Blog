import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common'
import { Prisma, PrismaClient, Reputations } from '@prisma/client'
import { DbService } from 'src/db/db.service'
import TelegramBot = require('node-telegram-bot-api')

@Injectable()
export class BotService implements OnModuleInit {
	constructor(private readonly db: DbService) {}
	async onModuleInit() {
		await this.botMessage()
	}

	async botMessage() {
		const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
			//
			polling: true,
		})

		bot.on('new_chat_members', (ctx) => {
			// console.log(0, ctx)
			bot.sendMessage(
				ctx.chat.id,
				`Привет, ${ctx.new_chat_members[0].first_name}! Добро пожаловать в чат Skill Blog! Я Skill Blog: Bot! Если тебе нужна помощь, то задай свой вопрос и участники группы постараются тебе помочь! Помощник чата yaluvv (@yalvv). Админ чата ꧁Seeh Ball꧂ (@dvejer)`
			)
		})

		bot.on('message', (ctx) => {
			console.log(0, 'ctx.text', ctx.text)
			const text = ctx.text
			const telegramId = String(ctx.from.id)
			// console.log(0, ctx)
			// console.log(1, text, telegramId)
			// console.log(1, 'ctx.sticker', ctx.sticker)
			// console.log(2, 'ctx.sticker.emoji', ctx.sticker.emoji)

			if (ctx.text === '👍') {
				this.handleThanksWordReaction(ctx, bot)
				return
			}

			if (ctx?.sticker) {
				if (ctx.sticker.emoji === '👍' || '👌') {
					this.handleThanksWordReaction(ctx, bot)
				}
				// return
			}
		})
	}

	async sendReputationMessage(
		chatId: number,
		replyUsername: string,
		fromUsername: string,
		bot: TelegramBot,
		telegramId: string
	) {
		const reputationData = await this.getReputation(telegramId)

		bot.sendMessage(
			chatId,
			`Поздравляю, ${replyUsername}! Участник ${fromUsername} повысил твою репутацию, так держать! Твоя репутация ${reputationData.reputation}`,
			{
				reply_markup: {
					inline_keyboard: [
						[
							{
								text: 'Статистика чата',
								url: 'https://skill-bot-client.vercel.app',
							},
						],
					],
				},
			}
		)
	}

	async getReputation(telegramId: string): Promise<Reputations> {
		return await this.db.reputations.findFirst({
			where: { telegramId },
		})
	}

	async updateReputation(reputation: number, id: number): Promise<void> {
		await this.db.reputations.update({
			where: { id },
			data: { reputation },
		})
	}

	async addNewReputation(data: Prisma.ReputationsCreateInput): Promise<void> {
		await this.db.reputations.create({ data })
	}

	async increaseReputation(
		telegramId: string,
		username: string,
		fullName: string,
		userAvatar: string
	) {
		const reputationData = await this.getReputation(telegramId)

		if (reputationData) {
			await this.updateReputation(
				reputationData.reputation + 1,
				reputationData.id
			)
			return
		}

		await this.addNewReputation({
			telegramId,
			username,
			userAvatar,
			fullName,
			reputation: 1,
		})
	}

	async handleThanksWordReaction(ctx: TelegramBot.Message, bot: TelegramBot) {
		const telegramId = String(ctx?.reply_to_message?.from.id)
		const userAvatar = await this.getUserAvatarUrl(
			ctx.reply_to_message.from.id,
			bot
		)
		// console.log(1, userAvatar)

		await this.increaseReputation(
			telegramId,
			ctx.reply_to_message.from?.username
				? ctx.reply_to_message.from.username
				: '',
			`${ctx.reply_to_message.from?.first_name} ${ctx.reply_to_message.from?.last_name}`,
			userAvatar
		)

		await this.sendReputationMessage(
			ctx.chat.id,
			`${ctx.reply_to_message.from.first_name} ${
				ctx.reply_to_message.from?.username
					? `(@${ctx.reply_to_message.from?.username})`
					: ''
			}`,
			ctx.from.first_name,
			bot,
			telegramId
		)
	}

	async getUserAvatarUrl(userId: number, bot: TelegramBot) {
		const userProfile = await bot.getUserProfilePhotos(userId)

		if (!userProfile.photos.length) {
			return ''
		}

		const fileId = userProfile.photos[0][0].file_id
		const file = await bot.getFile(fileId)
		const filePath = file.file_path

		return `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${filePath}`
	}
}
