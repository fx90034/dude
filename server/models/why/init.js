// models/why/init.js

const env = process.env.NODE_ENV || 'dev'
const config = require('../../conf/config.' + env);
const nano = require('nano')('http://' + config.cloud.credential + 'localhost:' + config.db.port);
console.log("Start to initialize database 'why'...")
try {
  nano.db.destroy('why', function() {
    nano.db.create('why', function() {
      var why = nano.use('why');
      why.insert({
         "views": {
            "by_level1": {
               "map": function(doc) {
                  emit(doc.level1, doc._id);
               }
            },
            "by_level2": {
               "map": function(doc) {
                  emit(doc.level2, doc._id);
               }
            },
            "by_level3": {
               "map": function(doc) {
                  emit(doc.level3, doc._id);
               }
            },
            "by_ip": {
               "map": function(doc) {
                  emit([doc.ip, doc.user], doc._id);
               }
            },
            "count_level1": {
              "map": function(doc) {
                  emit([doc.level1, doc.ip, doc.user], 1);
              },
              "reduce": function(key, values) {
                return sum(values);
              }
            },
            "count_level2": {
              "map": function(doc) {
                emit(doc.leve2, 1);
              },
              "reduce": function(key, values) {
                return sum(values)
              }
            },
            "count_level3": {
              "map": function(doc) {
                emit(doc.level3, 1);
              },
              "reduce": function(key, values) {
                return sum(values)
              }
            }
/*         },
         "updates": {
           "update" : function(doc, req) {
               var request_body = JSON.parse(req.body);
               var field = request_body.field;
               var value = request_body.value;
               var message = 'set ' + field + ' to ' + value;
               doc[field] = value;
               return [doc, message];
           } */
         }
      }, '_design/answers', function (error, response) {
        console.log("View 'by_level1' is created.");
        console.log("View 'by_level2' is created.");
        console.log("View 'by_level3' is created.");
        console.log("View 'by_ip' is created.");
        console.log("View 'count_level1' is created.");
        console.log("View 'count_level2' is created.");
        console.log("View 'count_level3' is created.");
//        console.log("Update 'last_update_date' is created.");
        console.log("Design document 'answers' is created in database 'why'.");
        console.log("Database 'why' is initialized.");
      });
    });
  });
} catch(err) {
  console.error(err);
}
