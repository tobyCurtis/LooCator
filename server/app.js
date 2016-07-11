var express = require('express');
var path = require('path');

var app = express();

var port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname+'/../app')));

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/../app/index.html'));
});

app.listen(port, function() {
    console.log('Our app is running on port ' + port);
});