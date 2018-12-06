// ./routes/why/util.js

const util = require('../util');
const debug = require('debug')('why_util');
const file = './conf/why.json';

var why = null;
var questions = [[[]]];
var answers = [[[[]]]];

exports.getData = function(i, j, k, callback) {
  if(questions[0][0][0] == null) {
debug("Loading ...")
    load(function(err, data) {
      if(err) {
        console.error(err);
        return callback(err, null);
      }
debug("@@@@@@@@@@Loaded.")
debug("questions[0][0][0] = " + questions[0][0][0])
      var data = { question: questions[i][j][k], answers: answers[i][j][k] };
debug("data = " + JSON.stringify(data))
      return callback(null, data);
    });
  }
  else {
debug("i=" + i)
debug("j=" + j)
debug("k=" + k)
    var data = { question: questions[i][j][k], answers: answers[i][j][k] };
debug("data = " + JSON.stringify(data))
    return callback(null, data);
  }
}
exports.getAnswer = function( i, j, k, callback) {
  try {
    if(questions == null)
      load();
    var level1 = why.answer;
    var level2 = level1.answer;
    var level3 = level2.answer;
    var key = level3.answer;
    var value = why.level1.level2.level3.key;
    return callback (null, { key, value });
  } catch(e) {
    return callback(e, null);
  }
}
function load(callback) {
  util.readJSON(file, function(err, data) {
    if(err) {
      console.error(err);
      throw err;
    }
    try {
// debug("level0a.question = " + data.question)
      var level0 = data;
      var level1;
      var level2;
//      answers[0][0][0] = [];
      questions[0][0].push(level0.question);
 debug("level0.question = " + questions[0][0][0])
      var level1 = level0.answer;
      var answer1 = Object.keys(level1);
// debug("level1 = " + JSON.stringify(level1))
 debug("answer1 = " + answer1)
      for(var i=0; i<answer1.length; i++) {
        answers[0][0][0].push(answer1[i]);
 debug("answers[0][0][0] = " + answers[0][0][0])
}
// debug("answers[0][0][0] = " + answers[0][0][0])
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
