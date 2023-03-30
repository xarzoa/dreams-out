const { InlineKeyboard } = require('grammy');
const { bot } = require('../helpers/bot');
const { getUser } = require('../helpers/db');
const { aboutMe } = require('../helpers/messages');

let meKeyboard = new InlineKeyboard().text('Refresh', 'refresh');

bot.callbackQuery('refresh', async (ctx) => {
  const user = await getUser(ctx.update.callback_query.from.id);
  let meKeyboard = new InlineKeyboard().text('Refresh', 'refresh');
  bot.api.editMessageText(
    ctx.update.callback_query.message.chat.id,
    ctx.update.callback_query.message.message_id,
    aboutMe(user),
    {
      parse_mode: 'HTML',
      reply_to_message_id: ctx.update.callback_query.message.message_id,
      reply_markup: meKeyboard,
    }
  ).catch(e => console.log(e.message))
});

bot.command('me', async (ctx) => {
  const user = await getUser(ctx.msg.from.id);
  let meKeyboard = new InlineKeyboard().text('Refresh', 'refresh');
  ctx.reply(aboutMe(user), {
    parse_mode: 'HTML',
    reply_to_message_id: ctx.message.message_id,
    reply_markup: meKeyboard,
  });
});