const express = require('express')
const app = express();
const db =require('./db');

const bodyParser =require('body-parser');
app.use(bodyParser.json());

app.get('/',function(req,res){
        res.send('Welcome to my hotel')
})

//Import the router files.......
const personRoutes = require('./routes/personRoutes');
app.use('/person',personRoutes);

const menuRoutes = require('./routes/menuItemRoutes');
app.use('/menu',menuRoutes);

app.listen(3000,()=>{
        console.log('listening on port 3000');
})


