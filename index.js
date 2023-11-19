// index.js
const express = require('express')
const app = express()
const PORT = 4000
const {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} = require("@solana/web3.js");

// CORS middleware
const cors = require("cors")
app.use(
  cors({
  origin: "*",
  methods: ["GET", "POST"],
  })
)
app.use(express.json());

const solanaRPC = process.env.SOLANA_RPC;
const SECRET = process.env.SOLANA_PRIVATE_KEY

const secret = SECRET.split(",")
const fromKeypair = Keypair.fromSecretKey(new Uint8Array(secret));

const QUICKNODE_RPC = `https://orbital-few-diamond.solana-devnet.quiknode.pro/${solanaRPC}/`;
const SOLANA_CONNECTION = new Connection(QUICKNODE_RPC);

app.post('/', async (req, res) => {

  const { memo } = req.body;
  console.log("memo", memo)
  if (!memo || !memo.length > 0){
    res.status(400).json({message: "No memo found!"})
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
    message: memo,
    transactionHash: `${result}`,
    trxLink: `https://explorer.solana.com/tx/${result}?cluster=devnet`,
  });

})


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Export the Express API
module.exports = app