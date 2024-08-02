const { Router } = require("express");
const { Account } = require("../db");
const authMiddleware = require("../middleware");
const mongoose = require("mongoose");
const zod = require("zod");

const router = Router();

router.get("/balance", authMiddleware, async (req, res) => {
    const response = await Account.findOne({userId: req.userId});
    return res.status(200).json({
        balance: response.balance,
    });
});

// const numberSchema = zod.number();
// const stringSchema = zod.string();

router.post("/transfer",authMiddleware , async (req, res) => {
    
    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount, to } = req.body;

    // Fetch the accounts within th transaction
    const account = await Account.findOne({ userId: req.userId }).session(session);
    
    if (account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    // Perform the transfer
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);

    // Commit the transaction
    await session.commitTransaction();

    res.json({
        message: "Transfer successful"
    });
});

module.exports = router;