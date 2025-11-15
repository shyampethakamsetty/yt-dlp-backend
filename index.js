import express from "express";
import cors from "cors";
import ytdlp from "yt-dlp-exec";

const app = express();
app.use(cors());

// Root endpoint
app.get("/", (req, res) => {
  res.send("yt-dlp backend running on Render 🚀");
});

// Health check
app.get("/health", (req, res) => {
  console.log("Health check hit");
  res.send("OK");
});

// Download endpoint
app.get("/download", async (req, res) => {
  const videoUrl = req.query.url;

  console.log("Incoming request → /download:", videoUrl);

  if (!videoUrl) return res.status(400).send("Missing ?url");

  try {
    // Tell browser we are sending video
    res.setHeader("Content-Type", "video/mp4");

    console.log("Starting yt-dlp stream...");

    const stream = ytdlp.execStream(videoUrl, {
      f: "mp4",
      o: "-",          // Output to stdout
      quiet: true,
    });

    // Handle errors
    stream.on("error", (err) => {
      console.error("yt-dlp error:", err);
      res.status(500).send("Error downloading video");
    });

    // Pipe video stream to client
    stream.pipe(res);

    stream.on("end", () => {
      console.log("yt-dlp stream finished");
    });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

// Port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server running on port", port));
