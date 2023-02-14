require('dotenv').config();

function checkEnv(name) {
  let env = process.env;
  if (env[name]) {
    return env[name];
  }
  console.error(`Error! ${name} not found. Exiting now.`);
  process.exit(9);
}

const config = {
  botToken: checkEnv('BOT_TOKEN'),
  detaKey: checkEnv('DETA_KEY'),
};

module.exports = { config };
