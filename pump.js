const fetch = require("node-fetch");
let deviceId = "12345";
let scheduleTime = null;
let base = "https://ishivanshgoelwot.herokuapp.com"

async function fetchSchedule() {
  const rawResponse = await fetch(
    `${base}/schedule/?deviceId=${deviceId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  let response = await rawResponse.json();
  if (response.found) {
    scheduleTime = response.time;
  }
}

fetchSchedule()

// keep checking if current time is same as scheduled time
setInterval(async function () {
  let currentTime = new Date().toGMTString();
  console.log("Current Time "+currentTime)
  console.log("Schedule Time "+scheduleTime)
  if (currentTime == scheduleTime) {
    console.log("WATER PUMP ON!!");
  }
}, 1000); // run this every second
