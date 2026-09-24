// Ye main entry point hai — sab kuch yahi se shuru hota hai

require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const jobsRouter = require("./routes/jobs");
const sourcesRouter = require("./routes/sources");
const { startScheduler } = require("./scheduler");

const app = express();
const server = http.createServer(app);

// Socket.io setup - ye live/real-time updates ke liye hai
const io = new Server(server, {
  cors: { origin: "*" }, // production me isko apni actual frontend domain tak limit kar dena
});

app.set("io", io); // taaki routes me bhi io use kar sakein

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // frontend (public/index.html) yahi se serve hoga

// API routes
app.use("/api/jobs", jobsRouter);
app.use("/api/sources", sourcesRouter);

// Jab bhi koi naya browser connect ho
io.on("connection", (socket) => {
  console.log("Ek user live connect hua:", socket.id);
});

// MongoDB se connect karo
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server chal raha hai: http://localhost:${PORT}`);
      startScheduler(io); // scraper scheduler ko background me start karo
    });
  })
  .catch((err) => {
    console.error("MongoDB connect nahi ho paya:", err.message);
  });
