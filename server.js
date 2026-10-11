const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("C:\\Users\\WIN10\\Desktop\\VS CODE\\html-css"));

const {API_KEY} = require("./AIKi.js");

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.contents[0].parts[0].text;
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions",
     {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-3-super-120b-a12b:free",
        messages: [{ role: "user", content: userMessage }]
      })
    });
    
    const data = await response.json();
    console.log("Response:", JSON.stringify(data));
    
    res.json({
      candidates: [{
        content: {
          parts: [{
            text: data.choices[0].message.content
          }]
        }
      }]
    });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});