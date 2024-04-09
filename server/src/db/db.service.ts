import { PrismaClient } from '@prisma/client'
import { Injectable, OnModuleInit } from '@nestjs/common'

@Injectable()
export class DbService extends PrismaClient implements OnModuleInit {
	async onModuleInit() {
		// хук onModuleInit для подключения к БД
		await this.$connect()
	}
}

// import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';

// @Injectable()
// export class PrismaService extends PrismaClient implements OnModuleInit {
//   async onModuleInit() {
//     await this.$connect();
//   }

//   async enableShutdownHooks(app: INestApplication) {
//     this.$on('beforeExit', async () => {
//       await app.close();
//     });
//   }
// }
