var BaseAdapter = require('./searchAdapter.js');
var MyAdapter = require('./hitchWikiAdapter.js');

var baseAdapter = new BaseAdapter();
var myAdapter = new MyAdapter();

// console.log('hello');
// baseAdapter.searchBox(undefined, function(result) {
// 	// console.log('done');
// });

// lats higher
var box = [59.375129767984, 22.544799804826, 64.208716083434, 35.190063476196];

myAdapter.searchBox(box, function(result) {
	console.log('done');
});