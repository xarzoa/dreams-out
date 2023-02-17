const axios = require('axios');
const ba64 = require('ba64');
const randomString = require('randomstring')


async function generate(prompt, endPoints) {
  const randomEndPoint = Math.floor(Math.random()*endPoints.length)
  console.log(`Generating image using ${randomEndPoint} end-point. URL: ${endPoints[randomEndPoint]} `)
  const { data } = await axios.post(
    endPoints[randomEndPoint],
    { data: [prompt] }
  );
  let random = randomString.generate(4+6) // It's my thing. Don't care bout it!
  ba64.writeImageSync(`images/${random}`, data.data[0]);
  return random
}

module.exports = { generate };
