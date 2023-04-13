const { bot } = require('../helpers/bot');
const { getBotSettings } = require('../helpers/db');
const { InlineKeyboard } = require('grammy');
const { help } = require('../helpers/messages');

bot.command('help', async (ctx) => {
  const botSettings = await getBotSettings();
  let keyBoard = new InlineKeyboard()
    .url('Bug reports', `${botSettings.support}`)
    .url('Help', `${botSettings.channel}`);
  ctx.reply(help(botSettings.support), {
    parse_mode: 'HTML',
    reply_to_message_id: ctx.message.message_id,
    reply_markup: keyBoard,
  }).catch(e => console.log(e.message))
});
