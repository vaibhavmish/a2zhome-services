// server.js
const path=require('path');

const express = require('express');
const app = express();

var port = process.env.PORT || 8080;
// Run the app by serving the static files
// in the dist directory

app.use(express.static(__dirname + '/dist'));

// For all GET requests, send back index.html
// so that PathLocationStrategy can be used

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

// Start the app by listening on the default port

app.listen(port, function () {
  console.log('App is running on http://localhost:' + port);
});
