const mongoose = require('mongoose')


const connectDB = () => {
    const uri = "mongodb+srv://db_user:dbuser@cluster0.s1euxib.mongodb.net/?appName=Cluster0";

    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log("MongoDB connected"))
        .catch(err => {
            console.error("MongoDB connection error:", err);
            process.exit(1);
        });
};

module.exports = connectDB;
