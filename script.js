const express = require('express');
const http = require("http");
const EventEmitter = require('events');
const { Server } = require("socket.io");

const app = express();
app.use(express.json());

const myEmitter = new EventEmitter();

// keep the water pump schedule with the device id
let schedule = {}

// temperature sensor data
let temperature = {}

// mositure sensor data
let moisture = {}

// socket id to deviceId mapper
let socketMapper = {}

const server = http.createServer(app);

const PORT = 5000

// to save the scheduled timing for water pump
app.post("/schedule", (req, res, next)=>{

    try{

        let { time } = req.body
        let { deviceId } = req.body
        schedule[deviceId] = time
        console.log("Updated Schedule ", schedule);
        res.json({
            status: true
        })

    } catch(err){
        next(err)
    }
    
})


// to get the schedule of water pump
app.get("/schedule", (req, res, next)=>{

    try{

        let deviceId  = req.query.deviceId;
        console.log("Schedule ", schedule);
        let time = schedule[deviceId];
        if(time == null){
            res.json({
                time: null,
                found: false
            })
        }
        else {
            res.json({
                time: time,
                found: true
            })
        }

    } catch(err){
        next(err)
    }
    
})


// save temperature
app.post("/temperature", (req, res, next)=>{

    try{

        let { temp } = req.body
        let { deviceId } = req.body
        temperature[deviceId] = temp
        console.log("Updated Temperature ", temp);
        myEmitter.emit("updateTemperature", { deviceId: deviceId, temperature: temp });
        res.json({
            status: true
        })

    } catch(err){
        next(err)
    }
    
})


// moisture
app.post("/mositure", (req, res, next)=>{

    try{

        let { mois } = req.body
        let { deviceId } = req.body
        moisture[deviceId] = mois
        console.log("Updated Moisture ", mois);
        myEmitter.emit("updateMositure", { deviceId: deviceId, mositure: mois });

        res.json({
            status: true
        })

    } catch(err){
        next(err)
    }
    
})

const io = new Server(server, {
    cors: {
      origin: "*",
    },
});

io.on("connection", (socket) => {

    // register userId in active connections
    socket.on("register", (data) => {
        socketMapper[data.deviceId] = socket.id;
    });

    // emit socket event to update temperature value
    myEmitter.on("updateTemperature", (data)=>{
        console.log("Event emitter temperature ", data)
        socket.emit("updatedTemperature", data)

    })

    // emit socket event to update mositure value
    myEmitter.on("updateMositure", (data)=>{
        console.log("Event emitter Mositure ", data)
        socket.emit("updateMositure", data)
    })

    // remove user from active connections list on disconnect 
    socket.on("disconnect", () => {
      console.log('SOCKET ID ' + socket.id + ' is now offline');
    });

});

server.listen(PORT, () => {
    console.log(`Listening at PORT: ${PORT}`);
});
