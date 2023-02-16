function start(user, admin, version) {
  const message = `Welcome, <b>${user}</b>!

Me, the bot can turn your <b>Idea</b> to a <b>Picture</b>.

Just send me your prompt/dream as text.

Use /help for more.

<b>Dreams Out</b> <code>v${version}</code>`;

  return message;
}

function aboutMe(user) {
  const date = new Date();
  const lastChecked = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  const message = `
You got <b>${user.credits}</b> credits.

You're ${user.banned ? '' : 'not'} banned.

Last checked at ${lastChecked}
`;

  return message;
}

function refill(charge, admin) {
  const message = `
<b>Refill guide</b>,

You can't buy credits rn. Also we don't want to sell them rn. We added them to prevent abusing <b>free service</b>.

You can contact @${admin} for credit refill.

<code>${charge} credit(s) = Image</code>
`;

  return message;
}

function help(support) {
  const message = `
<b>About commands</b>

<code>/start</code> - Start the bot.
<code>/help</code> - Help with commands and some notes.
<code>/refill</code> - Refill your credits
<code>/me</code> - About you. (Your available credits and ect.)
<code>/secret</code> - Your secret. (Keep it or write down somewhere safe. You gonna need it when moving account or restoring account.)

<b>Notes</b>

- There's no option to buy credits.
- We added credits to prevent abusing <b>free service</b>.
- Don't spam. (Result will be permenent ban.)
- Best way to support us is reporting bugs and asking for new features.
`;
  return message;
}

function secret(secret) {
  const message = `
Your secret is <code>${secret}</code>.

Keep it or write it down somewhere safe. You gonna need it when moving account or restoring account.
`;
  return message;
}

function newSecret(secret) {
  const message = `
We reset your secret!

New secret is <code>${secret}</code>.

Keep it or write it down somewhere safe.
`;
  return message;
}

module.exports = {
  start,
  aboutMe,
  refill,
  help,
  secret,
  newSecret,
};
