var cors = require('cors');
var express = require('express');
var bodyParser = require('body-parser');
//var expressJWT = require('express-jwt'); 


var allowedOrigins = ['http://localhost:4200',
                      'http://yourapp.com'];

var app = express();

var corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions));
//app.use(cors());
app.options('*', cors());

var port = process.env.port || 3300

 app.listen(port, () => {
    
    console.log("Hi This port is running");
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var server = require('http').createServer(app);
var io = require('socket.io')(server);


var router = require('./routes')();
 
app.use('/api', router);
