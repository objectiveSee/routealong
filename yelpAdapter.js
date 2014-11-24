var Adapter = require('./searchAdapter.js');
var util = require("util");
var request = require('request');
var _ = require('underscore');


var yelp_config = {
	"consumer_key": "42sXp5DqoHqmPOzU18_rBg",
	"consumer_secret": "wHuvD7XEkm2JNHe-Xrd6lWu5sr4",
	"token": "I9BSaHOk7TOg87dszzlCOjPnO5ugE_Et",
	"token_secret": "h-5_0xwOCV35jDj42f5WbqAA6CU"
};
var yelp = require("yelp").createClient(yelp_config);

/**
 * Module exports.
 */

module.exports = MyAdapter;


function MyAdapter() {
    Adapter.call(this);
}

util.inherits(MyAdapter, Adapter);

function convertResults(results) {

	results = results.businesses;
	// console.log('results:'+JSON.stringify(results));

	var r = _.map(results, function(res) {
		if ( res.location && res.location.coordinate ) {
			res.lat = res.location.coordinate.latitude;
			res.lng = res.location.coordinate.longitude;
			return {lat: res.lat, lng: res.lng, lon: res.lng, id: res.name, rating:1};
		}
		console.log('skipping result. no coordinates');
	});
	// console.log('r='+JSON.stringify(r)+'\n\n*********\n\n');
	return r;
}

MyAdapter.prototype.searchBox = function(box, fn){

	// box is: latmin, lonmin, latmax, lonmax
	var params = {term: 'food'};		

	// TODO: need better representation of box that handles coordinate signs!

	var bounds = "";
	bounds += box[0] + ',';
	bounds += box[1] + '|';
	bounds += box[2] + ',';
	bounds += box[3];
	// bounds = "37.900000,-122.500000|37.788022,-122.399797"	// sample from Yelp.com

	params.bounds = bounds;
	params.limit = 20;

	// console.log('Params='+JSON.stringify(params));

	yelp.search(params, function(error, data) {
		if ( error ) {
			console.log('error='+JSON.stringify(error));
			fn(undefined);	// todo
		} else {
			fn(convertResults(data));
		}
	});

};