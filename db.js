const mongooes = require('mongoose');

//Define the mongoDB connection URL
const mongoURL ="mongodb://localhost:27017/hotels"

//Set up MongoDB connection.......
mongooes.connect(mongoURL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
const db = mongooes.connection;

db.on('connected',()=>{
    console.log('connected to mongoDB server');
});

db.on('error',(err)=>{
    console.log('mongoDB connection error:'+err);
});

db.on('disconnected',()=>{
    console.log('mongoDB disconnected');
});

//Export the database connection
module.exports=db;