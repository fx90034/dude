// ./routes/why/util.js

const util = require('../util');
const debug = require('debug')('why_util');
const file = './conf/why.json';
const db = require('../../models/why');
const fs = require('fs');
const report = './reports/';

var why = null;
var questions = [[[]]];
var answers = [[[[]]]];

exports.getData = function(i, j, k, callback) {
debug("i=" + i)
debug("j=" + j)
debug("k=" + k)
  var data = { question: questions[i][j][k], answers: answers[i][j][k] };
debug("data = " + JSON.stringify(data))
  return callback(null, data);
}
exports.load = function(callback) {
debug("Loading ...")
  util.readJSON(file, function(err, data) {
    if(err) {
      console.error(err);
      throw err;
    }
    try {
// debug("level0a.question = " + data.question)
      var level0 = data;
      var level1 = level0.answer;
      var answer1 = Object.keys(level1);
      var level2;
// debug("level1 = " + JSON.stringify(level1))
 debug("answer1 = " + answer1)
      questions[0][0].push(level0.question);
 debug("level0.question = " + questions[0][0][0])
      for(var i=0; i<answer1.length; i++) {
        answers[0][0][0].push(answer1[i]);
 debug("answers[0][0][0] = " + answers[0][0][0])
}
      for(var j=1; j<=answer1.length; j++) {
        var levelj = level1[answer1[j-1]];
debug('j = ' + j)
 debug("levelj = " + JSON.stringify(levelj))
        questions[0][j] = [];
        questions[0][j].push(levelj.question);
 debug("questions[0][j] = " + questions[0][j])
        level2 = levelj.answer;
        var answer2 = Object.keys(level2);
debug("answer2 = " + answer2)
        answers[0][j] = [];
        answers[0][j][0] = [];
        for(var k=0; k<answer2.length; k++) {
          answers[0][j][0].push(answer2[k]);
        }
 debug("answers[0][j][0] = " + answers[0][j][0])
        for(var k=1; k<answer2.length; k++) {
          var levelk = level2[answer2[k]];
debug('k = ' + k)
 debug("level2 = " + JSON.stringify(levelk))
//          questions[0][j][k] = [];
//          questions[0][j][k].push(levelk.question);
            questions[0][j][k] = levelk.question;
            answers[0][j][k] = [];
debug("levelk.answer = " + JSON.stringify(levelk.answer))
//           for(var answer in levelk.answer) {
//             answers[0][j][k].push(answer);
// debug("answers[0][j][k][0] = " + answers[0][j][k][0])
//           }
            var answer = Object.keys(levelk.answer);
debug("answer.length = " + answer.length)
            for(var l=0; l<answer.length; l++) {
              var value = answer[l] + ": " + levelk.answer[answer[l]];
              answers[0][j][k].push(value);
debug('value = ' + value)
debug("answers[0][j][k][0] = " + JSON.stringify(answers[0][j][k][0]))
            }
        }
      }
    } catch(ex) {
      console.error(ex);
    }
    return callback(null, null);
  });
}
exports.report = function(callback) {
  var answers1 = [];
  var answers2 = [];
  var answers3 = [];
  var line = [];
  var time = new Date();
  var file = report + time.toISOString().slice(0, 10) + '.txt';
  this.getData(0, 0, 0, function(err, data) {
    if(err) {
      console.error(err);
      return callback(err);
    }
    else {
      answers1 = data.answers;
debug("answers1 = " + answers1)
      for(var i=0; i<answers1.length; i++) {
        db.report.reportByLevel1(answers1[i], function(err, count) {
          line.push("Level1 - " + answers1[i] + ": " + JSON.stringify(count));
        });
        this.getData(0, i+1, 0, function(err, data) {
          if(err) {
            console.error(err);
            return callback(err);
          }
          else {
            answers2 = data.answers;
  debug("answers2 = " + answers2)
            for(var j=0; j<answers2.length; i++) {
              db.report.reportByLevel2(answers1[i], answers2[j], function(err, count) {
                line.push("Level2 - " + answers2[j] + ": " + JSON.stringify(count));
              });
              this.getData(0, i+1, j+1, function(err, data) {
                if(err) {
                  console.error(err);
                  return callback(err);
                }
                else {
                  answers3 = data.answers;
  debug("answers3 = " + answers3)
                  for(var k=0; j<answers3.length; i++) {
                    db.report.reportByLevel3(answers1[i], answers2[j], answers3[k], function(err, count) {
                      line.push("Level2 - " + answers2[j] + ": " + JSON.stringify(count));
                    });
                  } // for(k)
                }
              });
            } // for(j)
          }
        });
      } // for(i)
      fs.appendFile(file, JSON.stringify(line), (err) => {
        if(err) return callback(err);
      });
    }
  });
}
