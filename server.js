const util = require('util');
const express = require('express');
// import express from 'express';
const cors = require('cors');
const fs = require('fs');
const http = require('http');
// const request = require('request');
const formidable = require('formidable');

const port = 8080;

var app = express();
app.use(cors());

// Load index.html under /public folder
app.use(express.static('public'))

// Return 'Hello World ' when the root is called
// app.get('/hello', (rea, res) => res.send('Hello World!'));
 app.get('/hello', (rea, res) => {
	 debugger
	 res.send('Hello World!')
 })

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
debugger
  console.log(`server is listening on ${port}`)
})

//////////////////////////////////////////////

const requestHandler = (request, response) => {
  console.log(request.url)
  response.end('Hello Node.js Server!')
}

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
/*.listen(port, (err) => {
	if(err)
		console.log(err)
}
)

console.log(`Server is started and listening on port: ${port}`);
*/
//end
