/**
 * Implementations of algorithm for text search.
 * https://en.wikipedia.org/wiki/Rolling_hash
 * NOTE: These implementations may not be unicode aware!
 */
(function( adsftw, undefined ) {
    //Private Property
//    var isHot = true;

    //Public Property
//    adsftw.ingredient = "Bacon Strips";
	
	/**
	 * Logs the execution time of the given function with the give text and pattern.
	 */
	adsftw.executionDuration = function(func, text, pattern) {
		
		var start = +new Date();  // log start timestamp
		var result = func( text, pattern );
		var end =  +new Date();  // log end timestamp
		var diff = end - start;
		
		console.log("execution took "+diff+"ms");
		
		return result;
	};
	
	
    /**
     * The algorithm introduced by Knuth, Morris and Pratt for text search.
     * TODO still bugged...
     * @param string text a string containing the text.
     * @param string pattern the pattern to be looked for in text.
     */
    adsftw.kmp = function(text, pattern) {
    	
    	if(typeof text !== 'string' || typeof pattern !== 'string')
			throw new TypeError("need strings!");
    	else
    		return _kmp( text, pattern );
    };
    
    function _kmp(text, pattern) {
        
    	var occurrences = [], j = 0;
    	
    	var next = initNext( pattern );
    	
    	for(var i = 0; i < text.length; i++) {
    		
    		while(j > 0 && pattern.charAt(j) !== text.charAt(i))
    			j = next[j+1];
    		
    		if(pattern.charAt(j) === text.charAt(i))
    			j++;
    		
    		if(j === pattern.length - 1) {
    			occurrences.push(i - j + 1);
    			j = next[j];
    		}
    	}
    	
        return occurrences;
    };

    
    /**
     * The algorithm introduced by Boyer and Moore for text search.
     * 
     * @param string text a string containing the text.
     * @param string pattern the pattern to be looked for in text.
     */
    adsftw.bm = function(text, pattern) {
    	
    	if(typeof text !== 'string' || typeof pattern !== 'string')
			throw new TypeError("need strings!");
    	else
    		return _bm( text, pattern );
    };
    
    function _bm(text, pattern) {
        
    	var occurrences = [];
    	var last = initLast( pattern );
    	var suffix = initSuffix( pattern );
    	
    	var i = -1;
    	while(i <= text.length - pattern.length) {
    		
    		var j = pattern.length - 1;
    		
    		while(j >= 0 && pattern[j] === text[i + j])
    			j--;
    		
    		if(j === -1) {
    			occurrences.push(i);
    			i += suffix[0];
    		}
    		else {
    			i += Math.max(suffix[j], j - last.getLastPositionOf(text[i + j]));
    		}
    	}
    	
        return occurrences;
    };
    
    
    /**
     * Returns the suffix array.
     */
    function initSuffix( pattern ) {
    	
    	var suffix = [];
    	var next = initNext( pattern );
    	var nextR = initNext( pattern.split('').reverse().join('') );
    	
    	for(var i = 0; i < pattern. length; i++)
    		suffix.push(pattern.length - 1 - next[pattern.length - 1]);
    	
    	for(var i = 0; i < pattern.length; i++) {
    		
    		var j = pattern.length - 1 - nextR[i];
			suffix[j] = Math.min(suffix[j], i - nextR[i]);
    	}
    	
    	return suffix;
    };
    
    
    /**
     * Returns the last array object.
     */
    function initLast( pattern ) {
        
    	var last = {};
    	last.getLastPositionOf = function( character ) {
    		
    		if(character in last)
    			return last[character];
    		else return 0;
    	};
    	
    	for(var i = 0; i < pattern.length; i++) {
    		
    		last[pattern.charAt(i)] = i; 
    	}
    	
    	return last;
    };
    
    /**
     * Returns the next array.
     */
    function initNext( pattern ) {
        
    	var next = [], l = 0;
    	next.push(0);
    	
    	for(var i = 1; i < pattern.length; i++) {
    		
    		while(l > 0 && pattern.charAt(l) !== pattern.charAt(i))
        		l = next[l];
    		
    		if(pattern.charAt(l) === pattern.charAt(i))
    			l++;
    		
    		next[i] = l;
    	}
    	
    	return next;
    };
    
    
	
	/**
	 * The signature based algorithm introduced by karp and rabin for text search.
	 * 
	 * @param string text a string containing the text.
     * @param string pattern the pattern to be looked for in text.
     */
	adsftw.kr = function(text, pattern) {
		
		if(typeof text !== 'string' || typeof pattern !== 'string')
			throw new TypeError("need strings!");
    	else
    		return _kr( text, pattern );
	};
	
	function _kr(text, pattern) {
		
		var occurrences = [];
		
		var hPattern = new CPHasher( pattern ).getHash();
		
		for(var i = 0, hasher = new CPHasher( text.substring(0, pattern.length) ); i < text.length - pattern.length + 1; hasher.addChar(text.charAt(pattern.length + i++))) {
			
			var hTextWindow = hasher.getHash();
			
			if(hTextWindow === hPattern) {
				
				var k = 0;
				while(k < pattern.length && pattern.charAt(k) === text.charAt(i+k))
					k++;
			
				if(k === pattern.length)
					occurrences.push(i);
			}
			
		}
		
		return occurrences;
	};
	
	/**
	 * Shifts a in binary representation b (< 32) bits to the left,
	 * shifting in the shifted out bits.
	 */
	function circularShiftRight(a, b) {
		
		if(b < 0)
			throw new RangeError("b must be positive or zero!");
		while(b-- > 0) {
			
			var x = a & 0x1;
			//a:   aaaaaaaabbbbbbbbbbbbbbbbbbbbbbbb
			//  &  00000000000000000000000000000001
			//x:   0000000000000000000000000000000b
			
			x <<= 31;
			//x:   b0000000000000000000000000000000
			
			a >>>= 1;
			//a:   0aaaaaaaabbbbbbbbbbbbbbbbbbbbbbb
			
			a |= x;
			//a:   0aaaaaaaabbbbbbbbbbbbbbbbbbbbbbb
			//   | b0000000000000000000000000000000
			//a:   baaaaaaaabbbbbbbbbbbbbbbbbbbbbbb
		}
		
		return a;
	}
	
	/**
	 * Holds the hash value of a text.
	 * 
	 * Allows incremental hashing with cyclic polynomial (buzhash).
	 */
	function CPHasher(initialText) {
		
		var hash = 0x0;
		var text = initialText;
		
		for(var k = text.length, i = 0; 0 < k; k--) {
			
			hash ^= circularShiftRight(text.charCodeAt(i++), k - 1);
		}
		
		/**
		 * Adds a new character to the hash value.
		 */
		this.addChar = function(char) {
			hash = circularShiftRight(hash, 1);
			hash ^= circularShiftRight(text.charCodeAt(0), text.length);
			hash ^= char.charCodeAt(0);
			text = text.substring(1) + char;//update text
		};
		
		/**
		 * Returns the current hash value.
		 */
		this.getHash = function() {
			
			return hash;
		};
		
		/**
		 * Returns the current text.
		 */
		this.getText = function() {
			
			return text;
		};
	}
	
	
	/**
	 * Holds the hash value of a text.
	 * TODO Bugged for a > 1....
	 * 
	 * Allows incremental hashing as introduced by Karp and Rabin.
	 */
	function KRHasher(initialText) {
		
		var a = 1;//damn higher factors do not work cause integer overflow....
		var n = 1664525;
		
		var hash = 0;
		var text = initialText;
		
		//initil calculation
		var i = 0;
		while(i < initialText.length) {
			hash *= a;
			hash %= n;
			hash += text.charCodeAt(i++);
			hash %= n;
		}
		
		/**
		 * Adds a new character to the hash value.
		 */
		this.addChar = function(char) {
			//remove previous first term
			hash -= text.charCodeAt(0) * Math.pow(a, text.length - 1);
			
			//update text - remove the first char and add the new one
			text = text.substring(1) + char;
			
			//update hash
			hash *= a;
			hash %= n;
			hash += char.charCodeAt(0);
			hash %= n;
		};
		
		/**
		 * Returns the current hash value.
		 */
		this.getHash = function() {
			
			return hash;
		};
		
		/**
		 * Returns the current text.
		 */
		this.getText = function() {
			
			return text;
		};
	};
    
}( window.adsftw = window.adsftw || {} ));