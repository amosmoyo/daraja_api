const mongoose = require("mongoose");

const lipaNaMpesaSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true
    },
    trnx_id: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('Mpesa', lipaNaMpesaSchema)