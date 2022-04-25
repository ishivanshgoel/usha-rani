const fetch = require("node-fetch");
let deviceId = "12345";
let base = "https://ishivanshgoelwot.herokuapp.com"

setInterval(async function () {
  const rawResponse = await fetch(`${base}/temperature`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ deviceId: deviceId, temp: Math.floor(Math.random()*(100-70+1)+70) }),
  });

  console.log("Temperature value sent successfully to Server!");

  const rawResponse2 = await fetch(`${base}/mositure`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ deviceId: deviceId, mois: Math.floor(Math.random()*(300-200+1)+200) }),
  });

  console.log("Moisture value sent successfully to Server!");
}, 2000); // run this for every 10 seconds
