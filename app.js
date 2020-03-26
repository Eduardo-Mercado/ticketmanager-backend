var cors = require('cors');
var express = require('express');
var bodyParser = require('body-parser');

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

var port = process.env.port || 3300

 app.listen(port, () => {
    
    console.log("Hi This port is running");
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var router = require('./routes')();
 
app.use('/api', router);
