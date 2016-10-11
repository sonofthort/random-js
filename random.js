// Eric Thortsen - https://github.com/sonofthort/random-js

// algo - object which has a .random() function
// - JavaScript "Math" works
// - "MersenneTwister" from banksean/mersenne-twister.js works very well (https://gist.github.com/banksean/300494)
Random = function(algo) {
	this.algo = algo || Math
}

Random.prototype = {
	next: function() {
		return this.algo.random()
	},
	nextWithin: function(max, min) {
		return min + this.algo.random() * (max - min)
	},
	nextBelow: function(max) {
		return this.algo.random() * max
	},
	nextIntWithin: function(max, min) {
		return Math.floor(min + this.algo.random() * (max - min))
	},
	nextIntBelow: function(max) {
		return Math.floor(this.algo.random() * max)
	},
	nextBoolOdds: function(odds) {
		return this.algo.random() < odds
	},
	nextBool: function() {
		return this.nextBoolOdds(0.5)
	},
	nextSignOdds: function(odds) {
		return this.algo.random() < odds ? -1 : 1
	},
	nextSign: function() {
		return this.nextSignOdds(0.5)
	},
	nextIndex: function(arr) {
		return this.nextIntBelow(arr.length)
	},
	nextElement: function(arr) {
		return arr[this.nextIndex(arr)]
	},
	nextKey: function(obj) {
		return this.nextElement(Object.getOwnPropertyNames(obj))
	},
	nextValue: function(obj) {
		return obj[this.nextKey(obj)]
	},
	// in-place shuffle
	// https://github.com/coolaj86/knuth-shuffle
	shuffle: function(arr) {
		for (var i = arr.length; i !== 0;) {
			var j = this.nextIntBelow(i)
			i -= 1
			var t = arr[i]; arr[i] = arr[j]; arr[j] = t
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
	var hash = 0
	
	if (str.length === 0) {
		return hash
	}
	
	for (var i = 0, len = str.length; i < len; ++i) {
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
