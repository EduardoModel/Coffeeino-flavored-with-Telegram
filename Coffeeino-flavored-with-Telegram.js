//Inicialização da API responsável pela comunicação com o arduino
const five = require('johnny-five')
const arduino = new five.Board()

//Inicialização da API responsável pela comunicação com o bot
const Telegraf = require('telegraf')
const Markup = require('telegraf/markup')
//Substitui o token no espaço BOT_TOKEN
const BOT_TOKEN = 'seu_token_aqui'
const bot = new Telegraf(BOT_TOKEN)

//Status do Arduino
let estaLigado = false


//Escopo para o arduino pronto para receber comandos
arduino.on('ready', () => {
	bot.start((ctx) => {
		ctx.reply('Comandos', Markup.keyboard([
					['/Status'],
					['/Liga', '/Desliga']
				])
				.oneTime()
				.resize()
				.extra()
			)
	})
	bot.command('Status', (ctx) => {
		let s = "A cafeteira está "
		if(estaLigado)
			s += "Ligada"
		else
			s += "Desligada"
		ctx.reply(s)
	})
	bot.command('Liga', (ctx) => {
		estaLigado = true
		ctx.reply('A cafeteira foi ligada')
	})
	bot.command('Desliga', (ctx) => {
		estaLigado = false
		ctx.reply('A cafeteira foi desligada')
	})


	bot.startPolling();
});
