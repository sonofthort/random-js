// Eric Thortsen - https://github.com/sonofthort/random-js

// algo - object which has a .random() function
// - JavaScript Math is a valid algo
// - "MersenneTwister" from banksean/mersenne-twister.js also works (https://gist.github.com/banksean/300494)
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
	shuffle: function(arr) {
		var length = arr.length,
			n = length * 2
		
		for (var i = 0; i < n; ++i) {
			var i1 = this.nextIntBelow(length),
				i2 = this.nextIntBelow(length),
				t = a[i1]
			
			arr[i1] = arr[i2]
			arr[i2] = t
		}
		
		return arr
	}
}

Random.randomSeed = function() {
	return Math.ceil(Math.random() * 4294967295)
}

// just a simple hash function
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

// some simple seeded rng algo I found (linear congruent generator), I usually prefer MersenneTwister though
// https://programmers.stackexchange.com/questions/260969/original-source-of-seed-9301-49297-233280-random-algorithm
Random.SimpleAlgo = function(seed) {
	this.seed = seed || Random.randomSeed()
}

Random.SimpleAlgo.prototype.random = function() {
	this.seed = (this.seed * 9301 + 49297) % 233280
	return this.seed / 233280
}
