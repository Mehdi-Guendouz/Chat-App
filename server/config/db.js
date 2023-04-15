const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        console.log(`MongoDB Connected`);

    } catch (error) {
        console.log("Error: ", error.message);
        process.exit();
    }
}

module.exports = connectDB;