import express from "express";
import cors from "cors";
import youtubedl from "youtube-dl-exec";

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("yt backend running 🚀");
});

app.get("/health", (req, res) => {
  console.log("Health check");
  res.send("OK");
});

app.get("/download", async (req, res) => {
  const url = req.query.url;

  console.log("Incoming:", url);

  if (!url) return res.status(400).send("Missing ?url");

  try {
    res.setHeader("Content-Type", "video/mp4");

    const stream = youtubedl.execStream(url, {
      format: "mp4",
      output: "-",
      quiet: true
    });

    stream.on("error", err => {
      console.error("youtube-dl error:", err);
      res.status(500).send("Error downloading");
    });

    stream.pipe(res);

    stream.on("end", () => {
      console.log("Stream finished");
    });

  } catch (e) {
    console.error(e);
    res.status(500).send("Server error");
  }
});

const port = process.env.PORT || 10000;
app.listen(port, () => console.log("Server running on port", port));
