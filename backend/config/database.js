const mongoose = require('mongoose');
const mongouri = "mongodb://localhost:27017/shopit"

const connectDatabase = () => {
    mongoose.connect(process.env.DB_LOCAL_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        
    }).then(con => {
        console.log(`MongoDB Database connected with HOST: ${con.connection.host}`)
    })
}


module.exports = connectDatabase