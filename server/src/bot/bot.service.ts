import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
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
			console.log(0, ctx.text)
			const text = ctx.text
			const telegramId = String(ctx.from.id)
			// console.log(0, ctx)
			// console.log(1, text, telegramId)
			// console.log(2, text, telegramId)

			if (ctx?.reply_to_message) {
				if (ctx.text === '👍' || (ctx.sticker && ctx.sticker.emoji === '👍')) {
					this.handleThanksWordReaction(ctx, bot)
				}
			}
		})
	}

	async handleThanksWordReaction(ctx: TelegramBot.Message, bot: TelegramBot) {
		// const telegramId = String(ctx?.reply_to_message?.from.id)
		// const userAvatar = await this.getUserAvatarUrl(
		// 	ctx.reply_to_message.from.id,
		// 	bot
		// )
		// console.log(0, telegramId)
		// console.log(1, ctx)
		console.log(1, ctx?.reply_to_message?.from.id)
		// await this.increaseReputation(
		// 	telegramId,
		// 	ctx.reply_to_message.from?.username
		// 		? ctx.reply_to_message.from.username
		// 		: '',
		// 	`${ctx.reply_to_message.from?.first_name} ${ctx.reply_to_message.from?.last_name}`,
		// 	userAvatar
		// )
		// await this.sendReputationMessage(
		// 	ctx.chat.id,
		// 	`${ctx.reply_to_message.from.first_name} ${
		// 		ctx.reply_to_message.from?.username
		// 			? `(@${ctx.reply_to_message.from?.username})`
		// 			: ''
		// 	}`,
		// 	ctx.from.first_name,
		// 	bot,
		// 	telegramId
		// )
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
