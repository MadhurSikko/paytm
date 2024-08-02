const mongoose = require("mongoose");
const { Schema } = require("zod");

mongoose.connect("mongodb+srv://madhurdagars:53Dd73vcRzJQGNAv@cluster0.kllljsj.mongodb.net/sample");

// User model and schema
const userSchema = new mongoose.Schema ({
    firstName: String,
    lastName: String,
    password: String,
    username: String,
});

const User = mongoose.model('User', userSchema);

// Account model and schema
const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

const Account = mongoose.model('Account', accountSchema);

// Exporting the models
module.exports = {
    User,
    Account,
}