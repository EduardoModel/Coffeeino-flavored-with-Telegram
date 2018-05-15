//Inicialização da API responsável pela comunicação com o arduino
const five = require('johnny-five')
const arduino = new five.Board()

//Inicialização da API responsável pela comunicação com o bot
const Telegraf = require('telegraf')
const Markup = require('telegraf/markup')
//Substitui o token no espaço BOT_TOKEN
//const BOT_TOKEN = 'seu_token_aqui'

const bot = new Telegraf(BOT_TOKEN)

//Status da cafeteira
let estaLigado = false


//Escopo para o arduino pronto para receber comandos
arduino.on('ready', () => {
	//Declaração dos componentes que serão utilizados
	let rele = new five.Relay(10)
	let botao = new five.Button(2)
	let led = new five.Led(13)
	arduino.repl.inject({
		led: led
	})

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
		Liga(rele, led)
		ctx.reply('A cafeteira foi ligada')
	})
	bot.command('Desliga', (ctx) => {
		estaLigado = false
		Desliga(rele, led)
		ctx.reply('A cafeteira foi desligada')
	})

	//Para ligar a cafeteira quando não tiver acesso a internet, usa um simples botão
	botao.on('press', () =>{
		estaLigado = !estaLigado
		if(estaLigado){
			Liga(rele, led)
		}
		else{
			Desliga(rele, led)
		}
	})

	bot.startPolling();
});

function Liga(rele, led){
	rele.on()
	led.on()
	console.log("Relé ligado")
}
function Desliga(rele, led){
	rele.off()
	led.off()
	console.log('Relé desligado')
}