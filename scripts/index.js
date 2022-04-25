console.log("index.js attached")

let deviceId = document.getElementById("deviceId").value;
let sch = document.getElementById("scheduleTime").value;
console.log(deviceId, sch)

let base = ""

socket = io(base);

function schedule() {

    fetch(base + "/schedule", {
        method: "POST",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ deviceId: deviceId, time: sch }),
  });
}

socket.on("connect", () => {
    console.log(socket.id); // "G5p5..."
});

socket.emit("register", { deviceId: deviceId });

socket.on("updateMositure", (data) => {
    console.log("Updated Mois ", data);
    document.getElementById("mois").innerHTML = "Moisture: " + data.mositure
})

socket.on("updatedTemperature", (data) => {
    console.log("Updated Temp ", data);
    document.getElementById("temp").innerHTML = "Temperature: " + data.temperature
})

// attempt to reconnect
socket.on("disconnect", () => {
    socket.connect();
});