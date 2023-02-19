const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log(`Connection to database is \x1b[32mSUCCESSFUL!\x1b[0m`);
}).catch((err) => {
    console.log(`Connection to database \x1b[31mFAILED! \n${err}\x1b[0m`);
    process.exit(1);
})