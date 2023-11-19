// index.js
const express = require('express')
const app = express()
const PORT = 4000
const cors = require("cors")

app.use(
  cors({
  origin: "*",
  methods: ["GET", "POST"],
  })
)

app.get('/', (req, res) => {
  res.status(200).json({message: `This is a .env ${process.env.SOLANA_RPC}`});
})


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Export the Express API
module.exports = app