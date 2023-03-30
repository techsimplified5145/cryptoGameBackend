const express = require("express");
const app = express();
const PORT = process.env.PORT || 7001;
const userRoutes = require("./routes/UserRoutes.js");
const db = require("./database/database.js");

const cors = require("cors");
app.use(cors());

db.then(() => console.log("Connected to MongoDB.")).catch((err) =>
  console.log(err)
);

// Routes

app.use(express.json());

app.use(userRoutes);

const server = app.listen(PORT, () => {
  console.log(`Admin app is running on port ${PORT}`);
});

const io = require("socket.io")(server);

let startTime;
let endPoint;
let players = [];

function addPlayer(name, amount, id) {
  players.push({
    id,
    name,
    amount,
    profit: "betting",
    cashOut: "betting",
  });
  io.emit("newPlayerAdded", { players });
}

// function cashOut(id, amountX, profit) {
//   // test this funtion
//   players.forEach((player) => {
//     if (player.id === id) {
//       player.cashOut = amountX;
//       player.profit = profit;
//     }
//   });
//   io.emit("playerAdded", { players });
// }

function startGame() {
  // set the start time

  console.log("Starting game");
  startTime = Date.now();

  function getRandomNumber() {
    const x = Math.random(); // generate a random number between 0 and 1
    if (x < 0.9) {
      // 90% of the time, generate a random number between 0 and 2
      return Number(Math.random() * 2) + 1;
    } else {
      // 10% of the time, generate a random number between 2 and 10
      return 2 + Math.random() * 8;
    }
  }
  // generate a random endpoint between 1.1 and 1.9
  endPoint = getRandomNumber();

  // log the start time and endpoint
  console.log(
    `Game started at ${startTime}, endpoint is ${endPoint}, players are ${players}`
  );

  // send the start time and endpoint to connected clients
  io.emit("gameStart", { startTime, endPoint, players });
}

// start the game every 5 minutes
setInterval(startGame, 1 * 60 * 1000);

// initialize socket.io
// handle socket connections
io.on("connection", (socket) => {
  // send the current game state to the client when they connect
  socket.emit("gameStart", { startTime, endPoint });
  
  socket.on("player-added", (data) => {
    console.log("player added".data);
    addPlayer(data.name, data.amount, data.id);
  });

  socket.on("gameCrash", () => {
    players.forEach((player) => {
      if (player.cashOut === "betting") {
        player.profit = "crash";
        player.cashOut = "crash";
      }
    });
    io.emit("gameResults", { players });
  });

  socket.on("gameEnded", () => {
    players = [];
  });

  socket.on("playerExit", (data) => {
    console.log("Player exit", data);
    players.forEach((player) => {
      if (player.id === data.id) {
        player.profit = data.profit;
        player.cashOut = data.number;
      }
    });
    console.log("After exiting", players);
    io.emit("playerAdded", { players });
  });

  // handle client disconnections
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
