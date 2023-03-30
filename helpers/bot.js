const { Bot, InputFile, InlineKeyboard } = require('grammy');
const { config } = require('./config');

const bot = new Bot(config.botToken);

module.exports = {
  bot
}