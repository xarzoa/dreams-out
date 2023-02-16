const { Bot, InputFile, InlineKeyboard } = require('grammy');
const { config } = require('./helpers/config');
const {
  start,
  aboutMe,
  refill,
  help,
  secret,
  newSecret,
} = require('./helpers/messages');
const {
  createUser,
  getUser,
  addPrompt,
  getPrompts,
  addImage,
  updateUser,
  updateBotSettings,
  getBotSettings,
  resetSecret,
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
  const botSettings = await getBotSettings();
  let keyBoard = new InlineKeyboard()
    .url('Bug reports', `tg://resolve?domain=${botSettings.admin}`)
    .url('Help', `tg://resolve?domain=${botSettings.support}`);

  if (!user) {
    await createUser(ctx.msg.from.first_name, ctx.msg.from.id, 30);
  }
  ctx.reply(
    start(ctx.msg.from.first_name, botSettings.admin, botSettings.version),
    { parse_mode: 'HTML', reply_markup: keyBoard }
  );
});

let meKeyboard = new InlineKeyboard().text('Refresh', 'refresh');

bot.command('me', async (ctx) => {
  const user = await getUser(ctx.msg.from.id);
  let meKeyboard = new InlineKeyboard().text('Refresh', 'refresh');
  ctx.reply(aboutMe(user), {
    parse_mode: 'HTML',
    reply_to_message_id: ctx.message.message_id,
    reply_markup: meKeyboard,
  });
});

bot.callbackQuery('refresh', async (ctx) => {
  const user = await getUser(ctx.update.callback_query.from.id);
  let meKeyboard = new InlineKeyboard().text('Refresh', 'refresh');
  try {
    bot.api.editMessageText(
      ctx.update.callback_query.message.chat.id,
      ctx.update.callback_query.message.message_id,
      aboutMe(user),
      {
        parse_mode: 'HTML',
        reply_to_message_id: ctx.update.callback_query.message.message_id,
        reply_markup: meKeyboard,
      }
    );
  } catch (e) {
    console.error(e.message);
  }
});

bot.command('refill', async (ctx) => {
  const botSettings = await getBotSettings();
  let keyBoard = new InlineKeyboard().url(
    'Contact',
    `tg://resolve?domain=${botSettings.admin}`
  );
  ctx.reply(refill(botSettings.charge, botSettings.admin), {
    parse_mode: 'HTML',
    reply_to_message_id: ctx.message.message_id,
    reply_markup: keyBoard,
  });
});

bot.command('secret', async (ctx) => {
  const user = await getUser(ctx.message.from.id);
  let keyBoard = new InlineKeyboard().text('Reset', 'resetSecret');
  const msg = ctx.reply(secret(user.secret), {
    parse_mode: 'HTML',
    reply_to_message_id: ctx.message.message_id,
    reply_markup: keyBoard,
  });
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
  );
});

bot.command('help', async (ctx) => {
  const botSettings = await getBotSettings();
  let keyBoard = new InlineKeyboard().url(
    'Contact',
    `tg://resolve?domain=${botSettings.support}`
  );
  ctx.reply(help(botSettings.support), {
    parse_mode: 'HTML',
    reply_to_message_id: ctx.message.message_id,
    reply_markup: keyBoard,
  });
});

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
      await generate(ctx.msg.text, botSettings.endPoints);
      bot.api.sendChatAction(ctx.msg.chat.id, 'upload_photo');
      bot.api.editMessageText(status.chat.id, status.message_id, 'Generated.');
      await ctx.replyWithPhoto(new InputFile(`./images/${ctx.msg.text}.jpeg`), {
        reply_to_message_id: ctx.msg.message_id,
      });
      bot.api.deleteMessage(status.chat.id, status.message_id);
      await updateUser(ctx.msg.from.id, botSettings.charge);
      const file = await addImage(
        `./${ctx.msg.from.id}/${ctx.msg.text}.jpeg`,
        `./images/${ctx.msg.text}.jpeg`
      );
      await addPrompt(ctx.msg.text, file, botSettings.charge, ctx.msg.from.id);
      deleteFile(`./images/${ctx.msg.text}.jpeg`);
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

process.once('SIGINT', () => bot.stop());
process.once('SIGTERM', () => bot.stop());

bot.start();
