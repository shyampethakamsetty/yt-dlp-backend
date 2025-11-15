import express from "express";
import { exec } from "child_process";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("yt-dlp backend running on Render 🚀");
});

app.get("/health", (req, res) => {
  res.send("OK");
});

app.get("/download", (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).send("Missing ?url=");

  const cmd = `yt-dlp -f "bestvideo[ext=mp4]+bestaudio/best" --merge-output-format mp4 -o - "${videoUrl}"`;

  console.log("Downloading:", videoUrl);

  const process = exec(cmd);

  res.setHeader("Content-Type", "video/mp4");

  process.stdout.pipe(res);
  process.stderr.on("data", data => console.log("yt-dlp:", data));
  process.on("exit", () => console.log("yt-dlp process finished"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server running on port", port));
