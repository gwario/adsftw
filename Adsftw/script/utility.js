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