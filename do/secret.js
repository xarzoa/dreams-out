const { bot } = require('../helpers/bot');
const { getUser, resetSecret } = require('../helpers/db');
const { InlineKeyboard } = require('grammy');
const { secret } = require('../helpers/messages');

bot.command('secret', async (ctx) => {
  const user = await getUser(ctx.message.from.id);
  let keyBoard = new InlineKeyboard().text('Reset', 'resetSecret');
  const msg = ctx.reply(secret(user.secret), {
    parse_mode: 'HTML',
    reply_to_message_id: ctx.message.message_id,
    reply_markup: keyBoard,
  }).catch(e => console.log(e.message))
});

bot.callbackQuery('resetSecret', async (ctx) => {
  const secret = await resetSecret(ctx.update.callback_query.from.id);
  bot.api.editMessageText(
    ctx.update.callback_query.message.chat.id,
    ctx.update.callback_query.message.message_id,
    newSecret(secret),
    {
      parse_mode: 'HTML',
      reply_to_message_id: ctx.update.callback_query.message.message_id,
    }
  ).catch(e => console.log(e.message))
});