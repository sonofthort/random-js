// Eric Thortsen - https://github.com/sonofthort/random-js

// algo - object which has a .random() function which returns a number >= 0 and < 1
// - JavaScript "Math" works
// - "MersenneTwister" from banksean/mersenne-twister.js works very well (https://gist.github.com/banksean/300494)
Random = function(algo) {
	this.algo = algo || Math
}

Random.prototype = {
	// nullary: returns value >= 0 and < 1
	// unary: returns value >= 0 and < a
	// binary: returns value >= min(a, b) and < max(a, b)
	next: function(a, b) {
		var v = this.algo.random()
		return a != null ? (b != null ? (a < b ? a + v * (b - a) : b + v * (a - b)) : v * a) : v
	},
	nextInt: function(a, b) {
		return Math.floor(this.next(a, b))
	},
	nextBool: function(odds) {
		return this.algo.random() < (odds != null ? odds : 0.5)
	},
	nextSign: function(odds) {
		return this.nextBool(odds) ? 1 : -1
	},
	nextIndex: function(arr) {
		return Math.floor(this.algo.random() * arr.length)
	},
	nextElement: function(arr) {
		return arr[this.nextIndex(arr)]
	},
	nextKey: function(obj) {
		return this.nextElement(Object.getOwnPropertyNames(obj))
	},
	nextValue: function(obj, keys) {
		return obj[keys ? this.nextElement(keys) : this.nextKey(obj)]
	},
	// in-place shuffle
	// https://github.com/coolaj86/knuth-shuffle
	shuffle: function(arr) {
		var algo = this.algo
		
		for (var i = arr.length; i !== 0;) {
			var j = Math.floor(algo.random() * (i--))
				t = arr[i]
			
			arr[i] = arr[j]
			arr[j] = t
		}

		return arr
	}
}

Random.randomSeed = function() {
	return Math.ceil(Math.random() * 4294967295)
}

// a simple hash function
// http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
Random.seedFromString = function(str) {
	var hash = 0,
		len = str.length
	
	if (len === 0) {
		return hash
	}
	
	for (var i = 0; i < len; ++i) {
		hash = ((hash << 5) - hash) + str.charCodeAt(i)
		hash |= 0 // Convert to 32bit integer
	}
	
	return hash
}

// simple seeded algo (linear congruent generator) - not as random as other algos
// http://indiegamr.com/generate-repeatable-random-numbers-in-js/
Random.SimpleAlgo = function(seed) {
	this.seed = seed || Random.randomSeed()
}

Random.SimpleAlgo.prototype.random = function() {
	this.seed = (this.seed * 9301 + 49297) % 233280
	return this.seed / 233280
}
