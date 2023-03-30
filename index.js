const { bot } = require('./helpers/bot');
const start = require('./do/start');
const help = require('./do/help');
const refill = require('./do/refill');
const me = require('./do/me')
const secret = require('./do/secret')
const sendPhoto = require('./do/sendPhoto') 

async function startThings() {
  await bot.api.setMyCommands([
    { command: 'start', description: 'Start the bot.' },
    { command: 'me', description: 'Your credits and settings.' },
    { command: 'refill', description: 'Refill your credits.' },
    { command: 'secret', description: 'Your secret token.' },
    { command: 'help', description: 'Help with commands and things.' },
  ]);
}
startThings();

process.once('SIGINT', () => bot.stop());
process.once('SIGTERM', () => bot.stop());

bot.start();
