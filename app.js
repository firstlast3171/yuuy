const express = require('express');
const app = express();
const cors = require('cors');
const port = config.port;
const connectDB = require('./config/db');
connectDB();
app.use(cors());
app.use(express.json());


// Routes
app.get('/',function (req,res) {
     res.send('Hello From My Api Framework Yuuy')
  })



app.listen(port,function(){
     console.log(`http://localhost:${port}`);
})
