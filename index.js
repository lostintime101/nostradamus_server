// index.js
const express = require('express')
const app = express()
const PORT = 4000
const cors = require("cors")
const {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} = require("@solana/web3.js");


const solanaRPC = "22e66a6ccfc4c51bd2a01484ff2071019c67a0bc"
const SECRET= "153,80,118,72,44,231,22,196,70,63,118,163,128,4,64,139,41,174,240,216,169,28,133,49,183,231,249,102,231,214,46,22,3,91,174,177,220,202,4,95,153,234,63,43,91,135,111,225,182,27,253,242,230,30,9,107,239,137,246,30,199,25,178,95"

// const solanaRPC = process.env.SOLANA_RPC;
// const SECRET = process.env.SOLANA_PRIVATE_KEY

const secret = SECRET.split(",")
const fromKeypair = Keypair.fromSecretKey(new Uint8Array(secret));

const QUICKNODE_RPC = `https://orbital-few-diamond.solana-devnet.quiknode.pro/${solanaRPC}/`;
const SOLANA_CONNECTION = new Connection(QUICKNODE_RPC);

// CORS middleware
app.use(
  cors({
  origin: "*",
  methods: ["GET", "POST"],
  })
)
app.use(express.json());


app.post('/', async (req, res) => {

  const { memo } = req.body;
  console.log("memo", memo)
  if (!memo || !memo.length > 0){
    res.status(400).json({message: "No memo found"})
  }

    let tx = new Transaction();
  
    tx.add(
    new TransactionInstruction({
      keys: [{ pubkey: fromKeypair.publicKey, isSigner: true, isWritable: true }],
      data: Buffer.from(memo, "utf-8"),
      programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
      // Program ID of the Memo Program, NOT the sender
    })
    )
  
    const result = await sendAndConfirmTransaction(SOLANA_CONNECTION, tx, [fromKeypair]);
  
    console.log("complete: ", `https://explorer.solana.com/tx/${result}?cluster=devnet`);

  res.status(200).json({
    message: `This is a .env ${solanaRPC}`,
    tx: `https://explorer.solana.com/tx/${result}?cluster=devnet`,
  });

})


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Export the Express API
module.exports = app