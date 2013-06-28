/**
 * Implementations of algorithm for text search.
 * 
 * NOTE: These implementations may not be unicode aware!
 */
(function( adsftw, undefined ) {
    //Private Property
//    var isHot = true;

    //Public Property
//    adsftw.ingredient = "Bacon Strips";

    /**
     * The algorithm introduced by knuth, morris and pratt for text search.
     * 
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
        
    	var occurences = [], j = 0;
    	
    	var next = initNext( pattern );
    	
    	for(var i = 0; i < text.length; i++) {
    		
    		while(j >= 0 && pattern.charAt(j) !== text.charAt(i))
    			j = next[j];
    		
    		if(pattern.charAt(j) === text.charAt(i))
    			j++;
    		
    		if(j === pattern.length - 1) {
    			occurences.push(i - j + 1);
    			j = next[j];
    		}
    	}
    	
        return occurences;
    };

    
    /**
     * The algorithm introduced by boyer and moore for text search.
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
        //TODO bugged...
    	var occurences = [];
    	var last = initLast( pattern );
    	var suffix = initSuffix( pattern );
    	
    	var i = -1;
    	while(i <= text.length - pattern.length) {
    		
    		var j = pattern.length - 1;
    		
    		while(j >= 0 && pattern[j] === text[i + j])
    			j--;
    		
    		if(j === -1) {
    			occurences.push(i);
    			i += suffix[0];
    		}
    		else {
    			i += Math.max(suffix[j], j - last.getLastPositionOf(text[i + j]));
    		}
    	}
    	
        return occurences;
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
    
    
}( window.adsftw = window.adsftw || {} ));