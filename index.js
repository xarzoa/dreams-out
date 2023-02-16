const { Bot, InputFile } = require('grammy');
const { config } = require('./helpers/config');
const { start, aboutMe, refill, help, secret } = require('./helpers/messages');
const {
  createUser,
  getUser,
  addPrompt,
  getPrompts,
  addImage,
  updateUser,
  updateBotSettings,
  getBotSettings,
} = require('./helpers/deta');
const { deleteFile, countSize } = require('./helpers/fileSystem');
const { generate } = require('./helpers/generate');

const bot = new Bot(config.botToken);

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

bot.command('start', async (ctx) => {
  const user = await getUser(ctx.msg.from.id);
  if (!user) {
    await createUser(ctx.msg.from.first_name, ctx.msg.from.id, 30);
  }
  ctx.reply(start(ctx.msg.from.first_name), { parse_mode: 'HTML' });
});

bot.command('me', async (ctx) => {
  const user = await getUser(ctx.msg.from.id);
  ctx.reply(aboutMe(ctx.msg.from.first_name, user.credits), {
    parse_mode: 'HTML',
    reply_to_message_id: ctx.message.message_id,
  });
});

bot.command('refill', async (ctx) => {
  const botSettings = await getBotSettings();
  ctx.reply(refill(botSettings.charge), {
    parse_mode: 'HTML',
    reply_to_message_id: ctx.message.message_id,
  });
});

bot.command('secret', async (ctx) => {
  const user = await getUser(ctx.msg.from.id);
  ctx.reply(secret(user.secret), {
    parse_mode: 'HTML',
    reply_to_message_id: ctx.message.message_id,
  });
});

bot.command('help', async (ctx) => {
  ctx.reply(help(), {
    parse_mode: 'HTML',
    reply_to_message_id: ctx.message.message_id,
  });
});

bot.on('message:text', async (ctx) => {
  const status = await ctx.reply('Generating...', {
    reply_to_message_id: ctx.message.message_id,
  });
  const botSettings = await getBotSettings();
  const user = await getUser(ctx.msg.from.id);
  if (user.credits > 0) {
    try {
      await generate(ctx.msg.text, botSettings.endPoints);
      bot.api.sendChatAction(ctx.msg.chat.id, 'upload_photo')
      bot.api.editMessageText(status.chat.id, status.message_id, 'Generated.');
      await ctx.replyWithPhoto(new InputFile(`./images/${ctx.msg.text}.jpeg`), {
        reply_to_message_id: ctx.message.message_id,
      });
      bot.api.deleteMessage(status.chat.id, status.message_id);
      await updateUser(ctx.msg.from.id, botSettings.charge);
      await addImage(
        `./images/${ctx.msg.text}.jpeg`,
        `./images/${ctx.msg.text}.jpeg`
      );
      deleteFile(`./images/${ctx.msg.text}.jpeg`);
    } catch (e) {
      bot.api.editMessageText(
        status.chat.id,
        status.message_id,
        `${e.message}. Try again.`,
      );
    }
    return;
  }
  bot.api.editMessageText(
    status.chat.id,
    status.message_id,
    '<b>Not enough credits.</b> To get credits use /refill',
    {
      parse_mode: 'HTML',
    }
  );
});

process.once("SIGINT", () => bot.stop());
process.once("SIGTERM", () => bot.stop());

bot.start();
