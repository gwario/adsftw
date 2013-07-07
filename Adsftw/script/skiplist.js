/**
 * Implementation of a skip list and related functions.
 */
(function( adsftw, undefined ) {
	
	adsftw.Skiplist = function() {
		
		var min_key = 0;
		var max_key = Math.pow(2, 50);
		
		this.MIN_KEY = function() {
			return min_key;
		};
		this.MAX_KEY = function() {
			return max_key;
		};
		
		var head = new Container(null); // init head
		var tail = new Container(Number.POSITIVE_INFINITY); // init tail
		head.next.push(tail);
		
		this.show = function(){
			var p = head;
			var largest = 0;
			while(typeof p !== 'undefined' && p.key < Number.POSITIVE_INFINITY) {
				if(p.key > largest)
					largest = p.key;
				p = p.next[0];
			}
			p = head;
			while(typeof p !== 'undefined') {
				console.log(p.toSkiplistString(head.next.length, largest.toString().length));
				p = p.next[0];
			}
		};

		/**
		 * Adds new_key to the skip list.
		 */
		this.add = function(new_key) {
			
			if(!(min_key <= new_key && new_key <= max_key))
				throw new RangeError('invalid key range, ensure '+min_key+' <= new_key <= '+max_key);
			
			var p = head;
			var update = [];
			
			for(var i = head.height() - 1; 0 <= i; i--) {
				
				while(p.next[i].key < new_key)
					p = p.next[i];
				
				update[i] = p;
			}
			
			p = p.next[0];
			if(p.key === new_key)
				;//key already exists...
			else {
				var newHeight = randomHeight();
				
				if(newHeight > head.height()) {
					for(var i = head.height(); i < newHeight; i++)
						update[i] = head;
				}
				p = new Container(new_key);
				for(var i  = 0; i < newHeight; i++) {
					
					if(typeof update[i].next[i] === 'undefined')
						p.next[i] = tail;//next = tail
					else
						p.next[i] = update[i].next[i];//next = nextOfFormerPrevious
					update[i].next[i] = p;//nextOfFormerPrevious is p
				}
			}
			
			/**
			 * Returns a random number between 1 and head.height() + 1.
			 */
			function randomHeight() {
				var height = 1;
				for(var flip = (Math.random()*2); flip < 1 && height <= head.height(); flip = (Math.random()*2))// [0,2) < 1
					height++;
				
				return height;
			};
		};
		
		/**
		 * Removes del_key from the skip list.
		 */
		this.remove = function(del_key) {
			
			if(!(min_key <= del_key && del_key <= max_key))
				throw new RangeError('invalid key range, ensure '+min_key+' <= del_key <= '+max_key);
			
			var p = head;
			var update = [];
			
			for(var i = head.height() - 1; 0 <= i; i--) {
				
				while(p.next[i].key < del_key)
					p = p.next[i];
				
				update[i] = p;
			}
			p = p.next[0];
			if(p.key === del_key) {
				
				for(var i = 0; i < p.height(); i++)
					update[i].next[i] = p.next[i];
				
				while(head.height() >= 1 && head.next[head.height() - 1].key == Number.POSITIVE_INFINITY)//reduce height until next is not tail anymore
					head.next.pop();
			}
		};
		
		this.find = function(key) {
			
			if(!(min_key <= key && key <= max_key))
				throw new RangeError('invalid key range, ensure '+min_key+' <= key <= '+max_key);
			
			var p = head;
			
			for(var i = head.height() - 1; 0 <= i; i--)
				while(p.next[i].key < key)
					p = p.next[i];
			
			p = p.next[0];
			
			if(p.key === key)
				return p;
			else
				return null;
		};
		
		this.height = function() {
			return this.head.length;
		};
		
		return this;
	};
	
	function Container(_key) {
		
		var header_key = 'h';
		var tail_key = 't';
		
		this.next = [];
		this.key = _key;
		
		this.height = function() {
			return this.next.length;
		};
		
		/**
		 * To display the whole container.
		 */
		this.toSkiplistString = function(max_height, max_item_length) {
			var keyDsp = this.key;
			var spaces = ' ';
			
			if(this.key === null) {
				keyDsp = header_key;
				spaces = spaces.repeat(max_item_length - header_key.length);
			}
			else if(this.key === Number.POSITIVE_INFINITY) {
				keyDsp = tail_key;
				spaces = spaces.repeat(max_item_length - tail_key.length);
			}
			else {
				keyDsp = this.key;
				spaces = spaces.repeat(max_item_length - this.key.toString().length);
			}
			
			var normalized_next = [];
			
			if(keyDsp == 't') {
				var temp = new Array(max_height+1).join(" ,").split(",");
				temp.pop();
				normalized_next = normalize_item_length_of_to(temp, max_item_length);
			}
			else
				normalized_next = normalize_item_length_of_to(this.next, max_item_length);
				
			return keyDsp+spaces+',['+normalized_next+']';
			
			function normalize_item_length_of_to(array, length) {
				var spaces = ' ';
				var normalized_array = [];
				for(var i = 0; i < array.length; i++) {
					var item = '';
					if(typeof array[i].key !== 'undefined')
						item = (array[i].key == Number.POSITIVE_INFINITY ? 't' : array[i].key.toString());
					
					normalized_array.push(item+spaces.repeat(length - item.length));
				}
				return normalized_array;
			};
		};
		
		/**
		 * Default toString shows only the key. To get the right display of next array.
		 */
		this.toString = function() {
			if(this.key === null)
				return header_key;
			else if(this.key === Number.POSITIVE_INFINITY)
				return tail_key;
			else
				return this.key;
		};
	};
	
}( window.adsftw = window.adsftw || {} ));