// models/apps/init.js

const env = process.env.NODE_ENV || 'dev'
const config = require('../../conf/config.' + env);
const nano = require('nano')('http://localhost:' + config.db.port);
console.log("Start to initialize database 'apps'...")
try {
  nano.db.destroy('apps', function() {
    nano.db.create('apps', function() {
      var apps = nano.use('apps');
      apps.insert({
         "views": {
            "by_group": {
               "map": function(doc) {
                  emit([doc.group, doc.ip, doc.user], doc._id);
               }
            },
            "count_group": {
              "map": function(doc) {
                  emit([doc.group, doc.ip, doc.user], 1);
              },
              "reduce": function(key, values) {
                return sum(values);
              }
            },
            "by_subgroup": {
               "map": function(doc) {
                  emit([doc.subgroup, doc.user], doc._id);
               }
            },
            "count_subgroup": {
              "map": function(doc) {
                emit([doc.subgroup, doc.user], 1);
              },
              "reduce": function(key, values) {
                return sum(values)
              }
            }
         }
      }, '_design/group', function (error, response) {
        console.log("View 'by_group' is created.");
        console.log("View 'count_group' is created.");
        console.log("View 'by_subgroup' is created.");
        console.log("View 'count_subgroup' is created.");
        console.log("Design document 'group' is created in database 'apps'.");
      });
      apps.insert({
         "views": {
            "by_device_id": {
              "map": function(doc) {
                 emit([doc.id, doc.user], doc._id);
              }
            },
            "count_active": {
              "map": function(doc) {
                emit([doc.active, doc.user], 1);
              },
              "reduce": function(key, values) {
                return sum(values)
              }
            }
         }
      }, '_design/active', function (error, response) {
        console.log("View 'by_device_id' is created.");
        console.log("View 'count_active' is created.");
        console.log("Design document 'active' is created in database 'apps'.");
      });
    });
  });
  console.log("Database 'apps' is initialized.");
} catch(err) {
  console.error(err);
}
