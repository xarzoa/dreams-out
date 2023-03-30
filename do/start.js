const { bot } = require('../helpers/bot');
const { createUser, getUser, getBotSettings } = require('../helpers/db');
const { InlineKeyboard } = require('grammy');
const { start } = require('../helpers/messages');

bot.command('start', async (ctx) => {
  const user = await getUser(ctx.msg.from.id);
  const botSettings = await getBotSettings();
  let keyBoard = new InlineKeyboard()
    .url('Bug reports', `tg://resolve?domain=${botSettings.support}`)
    .url('Help', `${botSettings.channel}`);

  if (!user) {
    await createUser(ctx.msg.from.first_name, ctx.msg.from.id, 30);
  }
  ctx.reply(
    start(ctx.msg.from.first_name, botSettings.admin, botSettings.version),
    { parse_mode: 'HTML', reply_markup: keyBoard }
  );
});