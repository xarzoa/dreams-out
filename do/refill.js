const { bot } = require('../helpers/bot');
const { getBotSettings } = require('../helpers/db');
const { InlineKeyboard } = require('grammy');
const { refill } = require('../helpers/messages');

bot.command('refill', async (ctx) => {
  const botSettings = await getBotSettings();
  let keyBoard = new InlineKeyboard().url(
    'Contact',
    `tg://resolve?domain=${botSettings.refill}`
  );
  ctx.reply(refill(botSettings.charge, botSettings.refill), {
    parse_mode: 'HTML',
    reply_to_message_id: ctx.message.message_id,
    reply_markup: keyBoard,
  });
});
