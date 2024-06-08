const express = require('express');
const app = express();
const cors = require('cors');
const config = require('./config/config');
const port = config.port;
const connectDB = require('./config/db');
const AuthRoute = require('./routes/AuthRoute')
connectDB();
app.use(cors());
app.use(express.json());


// Routes
app.get('/',function (req,res) {
     res.send('Hello From My Api Framework Yuuy')
  })
app.use('/api/auth', AuthRoute);


app.listen(port,function(){
     console.log(`http://localhost:${port}`);
})