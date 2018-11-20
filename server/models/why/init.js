// models/why/init.js

const env = process.env.NODE_ENV || 'dev'
const config = require('../../config.' + env);
const nano = require('nano')('http://localhost:config.db.port');
console.log("Start to initialize database 'why'...")
try {
  nano.db.destroy('why', function() {
    nano.db.create('why', function() {
      var why = nano.use('why');
      why.insert({
         "views": {
            "by_concern": {
               "map": function (doc) {
                  emit([doc.concern, doc.ip, doc.user], doc._id);
               }
            },
            "by_ip": {
               "map": function (doc) {
                  emit([doc.ip, doc.user], doc._id);
               }
            }
         },
         "updates": {
           "update" : function(doc, req) {
               var request_body = JSON.parse(req.body);
               var field = request_body.field;
               var value = request_body.value;
               var message = 'set ' + field + ' to ' + value;
               doc[field] = value;
               return [doc, message];
           }
         }
      }, '_design/answer', function (error, response) {
        console.log("View 'by_concern' is created.");
        console.log("View 'by_ip' is created.");
        console.log("Update 'last_update_date' is created.");
        console.log("Design document 'answer' is created in database 'why'.");
        console.log("Database 'why' is initialized.");
      });
    });
  });
} catch(err) {
  console.error(err);
}
