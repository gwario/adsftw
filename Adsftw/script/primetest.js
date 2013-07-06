/**
 * Implementation of the Miller-Rabin prime number test.
 */
(function( adsftw, undefined ) {
	
	/**
	 * Implementation of the Miller-Rabin prime number test.
	 * Failure probability <= 1/(2^s)
	 * @param number the number to be tested.
	 * @param s the number of iterations. the higher the number the higher the certainty.
	 */
	adsftw.mr = function(number, s) {
		
		if(typeof number === 'number' && typeof s === 'number')
			return _mr(number, s);
		else
			throw new TypeError("need numbers!");
			
	};
	
	function _mr(number, s) {
		
		for(var i = 1, a = 0; i <= s; i++) {
			a = 1 + Math.floor(Math.random() * number);// [1,number-1]
			if(witness(a, number))
				return false;
		}
		
		return true;
	};
	
	/**
	 * If witness returns true, number is certainly no prime number, otherwise we don't know it exactly.
	 * 
	 * @param a a number between 1 and n - 1.
	 * @param n the number to be tested.
	 */
	function witness(a, n) {
		
		var b = (n - 1).toString(2);// binary form of n - 1
		var d = 1;
		
		for(var k = 0; k < b.length; k++) {
			d = (d * d) % n;
			if(b[k] === '1') // since toString returns an array of strings...
				d = (d * a) % n;
		}
		
		if(d !== 1)
			return true;//n is not primal
		else
			return false;
	};
	
}( window.adsftw = window.adsftw || {} ));