var http = require('http');
var util = require('util');
var formidable = require('formidable');

http.createServer(function (req, res) {
   if (req.url == '/login' && req.method.toLowerCase() == 'post') {
      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {

//      res.end(util.inspect({fileds: fields, files: files}));
        var output = util.inspect({fields});
        console.log(output);

         var begin1 = output.indexOf("username: '");
         var end1 = output.indexOf("', password");
         var end2 = output.indexOf("' }");
         var user = output.substring(begin1+11, end1);
         var pass = output.substring(end1+14, end2);

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

}).listen(8080);
