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
    // Generate a new keypair for the recipient
    const recipientKeypair = Keypair.generate();

    // Extract the public key from the keypair
    const recipientPublicKey = recipientKeypair.publicKey.toBase58();

    // console.log('Recipient Public Key:', recipientPublicKey);
    const accountField = req.body?.account;
    if (!accountField) {
        throw new Error('missing account')
    };
    const sender = new PublicKey(accountField);


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

    // create the transaction
    const serializedTransaction = transaction.serialize({
        verifySignatures: false,
        requireAllSignatures: false
    });

    const base64Transaction = Buffer.from(serializedTransaction).toString('base64');
    const message = 'Thank you for your purchase of ExiledApe #518';

    res.status(200).send({ transaction: base64Transaction, message });
});


module.exports = router;
