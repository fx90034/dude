// models/devices/init.js

const env = process.env.NODE_ENV || 'dev'
const config = require('../../conf/config.' + env);
const nano = require('nano')('http://localhost:' + config.db.port);
console.log("Start to initialize database 'devices'...")
try {
  nano.db.destroy('devices', function() {
    nano.db.create('devices', function() {
      var devices = nano.use('devices');
      devices.insert({
          "views": {
            "by_last_update_date": {
               "map": function(doc) {
                  emit(doc.last_update_date, doc._id);
               }
            },
            "by_name": {
               "map": function(doc) {
                  emit( [doc.name, doc.group, doc.subgroup], doc._rev);
               }
            },
            "by_group": {
               "map": function(doc) {
                  emit(doc.group, doc._id);
               }
            },
            "count_group": {
              "map": function(doc) {
                  emit(doc.group, 1);
              },
              "reduce": function(key, values) {
                return sum(values);
              }
            },
            "by_subgroup": {
               "map": function(doc) {
                  emit([doc.subgroup, doc.group], doc._id);
               }
            },
            "count_subgroup": {
              "map": function(doc) {
                emit(doc.subgroup, 1);
              },
              "reduce": function(key, values) {
                return sum(values);
              }
            }
         }
      }, '_design/device', function (error, response) {
        console.log("View 'by_last_update_date' is created.");
        console.log("View 'by_name' is created.");
        console.log("View 'by_group' is created.");
        console.log("View 'count_group' is created.");
        console.log("View 'by_subgroup' is created.");
        console.log("View 'count_subgroup' is created.");
        console.log("Design document 'device' is created in database 'devices'.");
      });
    });
  });
  console.log("Database 'devices' is initialized.");
} catch(err) {
  console.error(err);
}
