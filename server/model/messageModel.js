const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema(
    {
     message: {
         text: {
             type: String,
             required: true,
         },
     },
     Users: Array,
     sender: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Users",
         required: true
     },
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("messages", messageSchema)