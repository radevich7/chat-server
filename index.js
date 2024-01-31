const express = require("express");
const parser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const EventEmitter = require("events");

const Stream = new EventEmitter();

app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const onStreamPush = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  Stream.on("push", onStreamPush);

  // Handle client disconnect
  req.on("close", () => {
    Stream.removeListener("push", onStreamPush);
  });
});

app.post("/", cors(), async (req, res) => {
  const { request } = req.body;

  try {
    main(request);

    res.status(200).json({ status: "success", data: { promptSent: true } });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.listen(7000, () => {
  console.log("server is running on port 7000");
});

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: "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",
});
async function main(request) {
  const response = {
    id: new Date().getTime().toString(),
    answer: "Analyzing Data...",
    status: "processing",
    creationDate: new Date(),
    sessionID: request.sessionID,
    role: "system",
  };
  Stream.emit("push", "message", response);

  let isResponseDelayed = false;

  const timeout2sec = setTimeout(() => {
    isResponseDelayed = true;
    response.answer = "Generating Response...";
    response.status = "processing";
    Stream.emit("push", "message", response);
  }, 2000);

  const timeout6sec = setTimeout(() => {
    isResponseDelayed = true;
    response.answer = "Delivering Response...";
    response.status = "processing";
    Stream.emit("push", "message", response);
  }, 6000);

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: request.query }],
      model: "gpt-3.5-turbo",
    });

    clearTimeout(timeout2sec);
    clearTimeout(timeout6sec);

    response.id = completion.id;
    response.status = "completed";
    response.answer = completion.choices[0].message.content;
    response.creationDate = completion.created;
    Stream.emit("push", "message", response);
  } catch (error) {
    clearTimeout(timeoutId);
    Stream.emit("push", "error", { data: "An error occurred" });
  }
}
