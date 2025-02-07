import express from "express";
import http from "http";
import path from "path";
import { spawn } from "child_process";
import { Server as SocketIO } from "socket.io";
import { error, log } from "console";

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server);

const options = [
  "-i",
  "-",
  "-c:v",
  "libx264",
  "-preset",
  "ultrafast",
  "-tune",
  "zerolatency",
  "-r",
  `${25}`,
  "-g",
  `${25 * 2}`,
  "-keyint_min",
  25,
  "-crf",
  "25",
  "-pix_fmt",
  "yuv420p",
  "-sc_threshold",
  "0",
  "-profile:v",
  "main",
  "-level",
  "3.1",
  "-c:a",
  "aac",
  "-b:a",
  "128k",
  "-ar",
  128000 / 4,
  "-f",
  "flv",
  `rtmp://a.rtmp.youtube.com/live2/dcfx-m7v2-j248-3185-9207`,
];

const ffmpegProcess = spawn("ffmpeg", options);

app.use(express.static(path.resolve("./public")));

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);
  socket.on("binarystream", (data) => {
    // console.log("Received binary data:", data);
    ffmpegProcess.stdin.write(data, (er) => {
      console.log(er);
    });
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
