function start(user){

  const message = `Welcome, <b>${user}</b>!

Me, the bot can turn your <b>Idea</b> to a <b>Picture.</b>.`

  return message
}

function aboutMe(name, credits){
  const message = `
Hey, <b>${name}</b>!

You got <b>${credits}</b> DT(s).
`

  return message
}

function refill(charge){
  const message = `
<b>Refill guide</b>

You can buy credits or earn them or wait until next month.
Your choice.

30DTs/month - free
90DTs - 0.99$ - 1.89$
210DTs - 1.99$ - 4.39$
660DTs - 6.99$ - 13.99$

<code>${charge}DTs = Image</code>

If you can't afford, Just ask.

Pay with <b>TON</b> or <b>Paypal</b>.
- <b>30 Days refund gurantee</b>.

Contact @MyDreamerBot
`

  return message
}

function help(){
  const message = `
<b>About commands</b>

<code>/start</code> - Start the bot.
<code>/help</code> - Help with commands and some notes.
<code>/refill</code> - Refill your DTs
<code>/me</code> - About you. (Your available DT(s) and ect.)
<code>/secret</code> - Your secret. (Keep it or write down somewhere safe. You gonna need it when moving account or restoring account.)

<b>Notes</b>

- DT means Dreamer Tokens. (Prices gonna change when we change the model.)
- Don't use Emojies. (Cost credits.)
- Don't spam. (Result will be permenent ban.)
`

  return message
}

function secret(secret){
  const message = `
Your secret is <code>${secret}</code>.

Keep it or write down somewhere safe. You gonna need it when moving account or restoring account.
`
  return message
}

module.exports = {
  start, aboutMe, refill, help, secret
}