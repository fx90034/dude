var nano = require('nano')('http://localhost:5984')
var test_db = nano.db.use('albums')

console.log('started')
var data = {
	name: 'pikachu',
	skills: ['thunder bolt', 'iron tail', 'quick attack', 'mega punch'],
	type: 'electric'
}

test_db.insert(data, 'unique_id1', function(err, body){
	if(!err){
		console.log('done')
	}
	else{
		console.log(err)
	}
})
// end
