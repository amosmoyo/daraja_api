const mongoose = require("mongoose");


const connectDB  = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.mongo_url}`, {
            useUnifiedTopology: true,
            // useCreateIndex:true,
            useNewUrlParser: true
        })

        console.log(`mongoDb successfull connected to ${conn.connection.host}`.underline.bold.green)
    } catch (error) {
        console.log(`${error.message}`.error)
        process.exit(1)
    }
}

module.exports = connectDB;