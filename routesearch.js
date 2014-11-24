var RouteBoxes = require('./route2boxes.js');
var _ = require('underscore');
var Q = require('q');

// flattens results from multiple api responses into a single, unique array of responses
var compressResults = function compressResults(results) {	

	var objects = [];
	_.each(results, function(result) {
		if (result.state === "fulfilled") {
            var value = result.value;
            objects = _.union(objects, result.value);
        } else {
        	console.log('Unfulfilled promise :(');
        	// todo: idk
        }
	});
	return objects;
};


var makeRequestPromises = function (adapter, boxes) {

	var RateLimiter = require('limiter').RateLimiter;
	// Allow 150 requests per hour (the Twitter search limit). Also understands
	// 'second', 'minute', 'day', or a number of milliseconds
	var limiter = new RateLimiter(100, 'second');

	// console.log('making promises...');

	var promises = _.map(boxes, function(box) {

		var deferred = Q.defer();

		// console.log('box is '+box.length);

		// Throttle requests
		limiter.removeTokens(1, function(err, remainingRequests) {

			// err will only be set if we request more than the maximum number of requests we set in the constructor
		 	if ( err ) {
				console.log('RateLimiter error. u fucked up');
				deferred.reject(new Error('idk'));
				return;
			}

			// console.log('Making API request');
		 	// remainingRequests tells us how many additional requests could be sent right this moment
			adapter.searchBox(box, function(response) {
				// console.log('API request done!');
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

function newRouteSearch(adapter) {

	// The actual API of this module:
	return {
		searchRoute: function searchRoute(route_points, callback) {

			var boxes = RouteBoxes.convertRouteToBoxes(route_points, 500);
			var firstBox = boxes[0];
			// console.log('there are '+boxes.length+' boxes, sir.'+firstBox);

			var promises = makeRequestPromises(adapter, boxes);
			console.log('Making '+promises.length+' API requests...');

			return Q.allSettled(promises)	// search each box asynchronously

			.then(function(promiseResults) {

				var results = compressResults(promiseResults);
				var count = results.length;

				console.log('Results='+JSON.stringify(results));
				console.log('Done. '+count+' Results');
				callback(results);
				return results;
			});
		}
	};
}

// Export this file as a module
module.exports = newRouteSearch;
