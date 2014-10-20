var RouteBoxes = require('./route2boxes.js');
var _ = require('underscore');
var Q = require('q');

// flattens results from multiple api responses into a single, unique array of responses
var compressResults = function compressResults(results) {	
	// var objects = [];
	// _.each(results, function(result) {
	// 	console.log('result has '+result.businesses.length+' sub-results');
	// 	console.log('names are: ', _.pluck(result.businesses, 'name'));
	// 	objects = _.union(result.businesses, objects);
	// });
	// // console.log('BUSINESSES =', JSON.stringify(objects));
	// return objects;
	return results;	// todo
};


var makeRequestPromises = function (adapter, boxes) {

	var RateLimiter = require('limiter').RateLimiter;
	// Allow 150 requests per hour (the Twitter search limit). Also understands
	// 'second', 'minute', 'day', or a number of milliseconds
	var limiter = new RateLimiter(100, 'second');

	console.log('making promises...');

	var promises = _.map(boxes, function(box) {

		var deferred = Q.defer();

		console.log('box is '+box.length);

		// Throttle requests
		limiter.removeTokens(1, function(err, remainingRequests) {

			// err will only be set if we request more than the maximum number of requests we set in the constructor
		 	if ( err ) {
				console.log('RateLimiter error. u fucked up');
				deferred.reject(new Error('idk'));
				return;
			}

			console.log('Making API request');

		 	// remainingRequests tells us how many additional requests could be sent right this moment
			adapter.searchBox(box, function(response) {
				console.log('API request done!');
				if ( response ) {
					deferred.resolve(response);
				} else {
					deferred.reject(new Error('omg'));
				}
		 	});

		});

		return deferred.promise;

	});

	return promises;
};

// Define the factory
function newRouteSearch(adapter) {

	return {
		searchRoute: function searchRoute(route_points, callback) {

			var boxes = RouteBoxes.convertRouteToBoxes(route_points, 500);
			var firstBox = boxes[0];
			console.log('there are '+boxes.length+' boxes, sir.'+firstBox);

			var promises = makeRequestPromises(adapter, boxes);
			console.log('there are '+promises.length+' promises.');

			return Q.all(promises)
			.then(function(result) {
				console.log('searches finished!');
				var uniq_results = compressResults(result);
				return uniq_results;
			}).then(function(results) {
				console.log('done with it all!  Results='+JSON.stringify(results));
				callback(results);
				return results;
			});
		}
	};
}

// Export this file as a module
module.exports = newRouteSearch;
