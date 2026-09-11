console.log("Group routes carregadas ✅");
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const groupRoutes = require("./routes/groupRoutes");
const timerRoutes = require("./routes/timerRoutes");
const rankingRoutes = require("./routes/rankingRoutes");
const summaryRoutes = require("./routes/summaryRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const callRoutes = require("./routes/callRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

console.log("App carregado ✅"); 

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

app.use("/auth", authRoutes);
app.use("/group", groupRoutes);
app.use("/timer", timerRoutes);
app.use("/ranking", rankingRoutes);
app.use("/summary", summaryRoutes);
app.use("/reminder", reminderRoutes);
app.use("/call", callRoutes);
app.use("/message", messageRoutes);

module.exports = app;