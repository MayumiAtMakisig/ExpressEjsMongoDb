const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    username: { 
        type: String, 
        required: true,
        min: 6, 
        max: 20
    },
    password: { 
        type: String,
        required: true,
        min: 6,
        max: 20
    },
    email: { 
        type: String, 
        required: true,
        unique: true,
        lowercase: true,
        trim: true, 
        min: 6, 
        max: 30 
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
});

const usersDB = mongoose.model("users", usersSchema);
module.exports = usersDB;