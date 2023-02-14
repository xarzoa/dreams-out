const axios = require('axios');
var ba64 = require('ba64');

async function generate(prompt, endPoints) {

  const { data } = await axios.post(endPoints[Math.floor(Math.random(endPoints.length))], { data: [prompt] });

  ba64.writeImageSync(`images/${prompt}`, data.data[0]);
}

module.exports = { generate };