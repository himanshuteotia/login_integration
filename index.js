// curl -k https://localhost:8000/
var express = require('express');
var http = require('http');
var https = require('https');
var fs = require('fs');
var querystring = require('querystring');

const options = {
  key: fs.readFileSync('./key.pem','utf8'),
  cert: fs.readFileSync('./server.crt','utf8')
};


function PostCode() {
  // Build the post string from an object
  console.log("Post call ....")
  var post_data = querystring.stringify({
     	"uid" : "20843287",
  		"pwd" : "abcd1234"
  });

  // An object of options to indicate where to post to
  var post_options = {
      host: '202.165.10.133',
      port: '443',
      path: '/m2/postLogin',
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(post_data)
      }
  };

  // Set up the request
  var post_req = https.request(post_options, function(res) {
  	  console.log("calling...",res)
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          console.log('Response: ' + chunk);
      });
  });

  // post the data
  post_req.write(post_data);
  post_req.end();

}


var PORT = 443;
var HOST = 'localhost';
app = express();

server = https.createServer(options, app).listen(PORT, HOST);
console.log('HTTPS Server listening on %s:%s', HOST, PORT);


// routes
app.get('/login', function(req, res) {
    return PostCode();
    // res.send('HEY!');
});
app.post('/ho', function(req, res) {
    res.send('HO!');
});