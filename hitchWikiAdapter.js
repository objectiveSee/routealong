var Adapter = require('./searchAdapter.js');
var util = require("util");
var request = require('request');

/**
 * Module exports.
 */

module.exports = MyAdapter;


function MyAdapter() {
    Adapter.call(this);
}

util.inherits(MyAdapter, Adapter);

MyAdapter.prototype.searchBox = function(box, fn){
	console.log('My Search!');
	// fn(undefined);

	//return [lat_minus, lon_minus, lat_plus, lon_plus];	
	var ur = "http://hitchwiki.org/maps/api/?bounds=";
	ur += box[0] + ',';
	ur += box[2] + ',';
	ur += box[1] + ',';
	ur += box[3];

	console.log('url is '+ur);

	request(ur, function (error, response, body) {
  		if (!error && response.statusCode == 200) {
    		console.log(body) // Print the google web page.
		} else {
			if ( error ) {
				console.log('error='+error);
			} else {
				console.log('status code = '+response.statusCode);
			}
		}
		fn(undefined);
	});

};