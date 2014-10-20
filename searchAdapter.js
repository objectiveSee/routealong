/**
 * Module exports.
 */
module.exports = Adapter;

/**
 * adapter constructor.
 *
 * @api public
 */

function Adapter(){
}

/**
 * search api.
 *
 * @api public
 * @param box - a geospatial box to search within.
 * @param fn - callback function when finished query.
 */
Adapter.prototype.searchBox = function(box, fn){
	console.log('Base search!');
	fn(undefined);
};