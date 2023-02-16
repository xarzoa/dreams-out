const { Deta } = require('deta');
const { v4: uuid } = require('uuid')
const { config } = require('./config');

const deta = Deta(config.detaKey);

const users = deta.Base('users');
const prompts = deta.Base('prompts');
const botSettings = deta.Base('botSettings');

const images = deta.Drive('images');

async function createUser(name, id, credits) {
  await users.put(
    { name: name, banned: false, credits: credits, paid: false, secret: uuid() },
    `${id}`
  );
}

async function updateUser(id, charge) {
  await users.update({ credits: users.util.increment(-charge) }, `${id}`);
}

async function getUser(id) {
  const data = await users.get(`${id}`);
  return data;
}

async function addPrompt(prompt, imgPath, charged,id) {
  await prompts.put({ prompt: prompt, img: imgPath, charged: charged }, `${id}`);
}

async function getPrompts(id) {
  const { items } = prompts.fetch({ key: id });
  return items;
}

async function addImage(image,path) {
  const data = await images.put(image, { path: path });
  return data
}

async function updateBotSettings(endPoint, charge) {
  if (!charge) {
    await botSettings.update(
      { endPoints: base.util.apped(endPoint), charge: charge },
      'settings'
    );
  } else if (!endPoint) {
    await botSettings.update(
      { endPoints: base.util.apped(endPoint), charge: charge },
      'settings'
    );
  } else {
    await botSettings.update(
      { endPoints: base.util.apped(endPoint), charge: charge },
      'settings'
    );
  }
}

async function getBotSettings() {
  const data = await botSettings.get('settings');
  return data;
}

module.exports = {
  createUser,
  getUser,
  updateUser,
  addPrompt,
  getPrompts,
  addImage,
  updateBotSettings,
  getBotSettings,
};
