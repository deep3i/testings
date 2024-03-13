const express = require("express");
const router = express.Router();
const {
    clusterApiUrl,
    Connection,
    Keypair,
    PublicKey,
    VersionedTransaction,
    SystemProgram,
    Transaction
} = require('@solana/web3.js');


router.get("/hello", (req, res) => {
    res.status(200).json({
        label: "Solana Pay",
        icon: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    })
});

router.post("/hello", async (req, res) => {
    const accountField = req.body?.account;
    if (!accountField) {
        throw new Error('missing account')
    };
    const sender = new PublicKey(accountField);
const merchant = Keypair.fromSecretKey(
      new Uint8Array(JSON.parse("[226,230,33,166,183,94,221,240,76,0,177,119,22,166,134,93,69,185,83,121,221,13,229,219,18,55,91,84,86,112,53,87,139,130,97,105,159,216,5,167,211,57,175,154,105,195,156,4,68,100,253,224,35,32,204,44,126,175,226,176,146,254,206,226]")),
    );

    // Build Transaction
    const ix = SystemProgram.transfer({
        fromPubkey: sender,
        toPubkey: new PublicKey('77zyWX6Ue6xwmSABJyseCqN6EYDvqvARuCy99TyF7F7D'),
        lamports: 133700000
    });

    const transaction = new Transaction();
    transaction.add(ix);
    
    const connection = new Connection("https://api.devnet.solana.com");
    const bh = await connection.getLatestBlockhash();
    transaction.recentBlockhash = bh.blockhash
    transaction.feePayer = sender
      transaction.sign(merchant);
    
    // airdrop 1 SOL just for fun
     connection.requestAirdrop(sender, 1000000000)
    
    // create the transaction
    const serializedTransaction = transaction.serialize({
        verifySignatures: false,
        requireAllSignatures: false
    });

    const base64Transaction = Buffer.from(serializedTransaction).toString('base64');
    const message = 'Thank you testnet';

    res.status(200).send({ transaction: base64Transaction, message })

});


module.exports = router;
