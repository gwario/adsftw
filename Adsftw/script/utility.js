/**
 * Some supporting functions..
 */
(function( adsftw, undefined ) {
	
	/**
	 * Logs the execution time of the given function with the give text and pattern.
	 * 
	 * @returns { result, duration }
	 */
	adsftw.executionDuration = function(func, text, pattern) {
		
		var start = +new Date();  // log start timestamp
		var result = func( text, pattern );
		var end =  +new Date();  // log end timestamp
		var diff = end - start;
		
		return {	'result': result,
					'duration': diff
				};
	};
    
}( window.adsftw = window.adsftw || {} ));

/**
 * Repeats the string num times.
 * @param num
 * @returns
 */
String.prototype.repeat = function(num) {
	return new Array(num+1).join(this);
};

/**
 * Returns true if the number is an integer and false if its Number.NaN or a floating point number
 */
Number.prototype.isInt = function() {
	return parseFloat(this) == parseInt(this, 10) && !isNaN(this);
};