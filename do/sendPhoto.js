const { InputFile } = require('grammy');
const {
  createUser,
  getUser,
  addPrompt,
  addImage,
  getBotSettings,
} = require('../helpers/db');
const { deleteFile, countSize } = require('../helpers/fileSystem');
const { generate } = require('../helpers/generate');
const { bot } = require('../helpers/bot');

bot.on('message:text', (ctx) => {
  sendFile(ctx);
});

async function sendFile(ctx) {
  const status = await ctx.reply('Generating...', {
    reply_to_message_id: ctx.message.message_id,
  });
  const botSettings = await getBotSettings();
  const user = await getUser(ctx.msg.from.id);
  if (!user) {
    await createUser(ctx.msg.from.first_name, ctx.msg.from.id, 30);
  } else if (user.credits >= botSettings.charge) {
    try {
      const fileName = await generate(ctx.msg.text, botSettings.endPoints);
      bot.api.sendChatAction(ctx.msg.chat.id, 'upload_photo');
      bot.api.editMessageText(status.chat.id, status.message_id, 'Generated.');
      await ctx.replyWithPhoto(new InputFile(`./images/${fileName}.jpeg`), {
        reply_to_message_id: ctx.msg.message_id,
      });
      bot.api.deleteMessage(status.chat.id, status.message_id);
      await updateUser(ctx.msg.from.id, botSettings.charge);
      const file = await addImage(
        `./${ctx.msg.from.id}/${fileName}.jpeg`,
        `./images/${fileName}.jpeg`
      );
      await addPrompt(ctx.msg.text, file, botSettings.charge, ctx.msg.from.id);
      deleteFile(`./images/${fileName}.jpeg`);
    } catch (e) {
      bot.api.editMessageText(
        status.chat.id,
        status.message_id,
        `${e.message}. <b>Try again</b>.`,
        {
          parse_mode: 'HTML',
        }
      );
    }
    return;
  }
  bot.api.editMessageText(
    status.chat.id,
    status.message_id,
    "<b>Not enough credits.</b> /refill em. It's free.",
    {
      parse_mode: 'HTML',
    }
  );
}
