// var http = require('http');
var util = require('util');
var express = require('express'); 
var cors = require('cors'); 
var request = require('request'); 
var formidable = require('formidable');

var app = express(); 
app.use(cors());

http.createServer(function (req, res) {
   if (req.url == '/login' && req.method.toLowerCase() == 'post') {
      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {

//      res.end(util.inspect({fileds: fields, files: files}));
        var output = util.inspect({fields});
        console.log(output);

         var str = output.substring(12);
         console.log("str = " + str);
         var keyValues = str.split("'");
         var user = keyValues[1];
         var pass = keyValues[3];

         res.end("User logged in. ");
         console.log("user = " + user);
         console.log("pass = " + pass);

//       var JsonObject = JSON.parse(jsonStr);
//       res.end(JsonObject.result + ":" + JsonObject.count);
      });

      return;
   }

   res.writeHead(200, {'Content-Type': 'text/html'});

   res.write('<form action="login" method="post">');
   res.write('Username:&nbsp;');
   res.write('<input type="text" name="username" size="20"><br>');
   res.write('Password:&nbsp;&nbsp;');
   res.write('<input type="password" name="password" size="20"><p>');
   res.write('<input type="submit">');
   res.write('</form>');

   res.end();

})

app.listen(8080);

//end
