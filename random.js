// Eric Thortsen - https://github.com/sonofthort/random-js

// algo - object which has a .random() function which returns a number >= 0 and < 1
// - JavaScript "Math" works
// - "MersenneTwister" from banksean/mersenne-twister.js works very well (https://gist.github.com/banksean/300494)
Random = function(algo) {
	this.algo = algo || Math
}

Random.prototype = {
	next: function(a, b) {
		if (a == null) {
			a = 0
		}
		if (b == null) {
			b = 1
		}
		if (a > b) {
			var t = a
			a = b
			b = t
		}
		return this.algo.random() * (b - a) + a
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
	nextElement: function(arr, filter) {
		if (filter == null) {
			return arr[this.nextIndex(arr)]
		}
		
		var best = null,
			bestWeight = -1,
			len = arr.length
		
		for (var i = 0; i < len; ++i) {
			var value = arr[i],
				filterResult = filter(value, i)
			if (filterResult) { // accept filterResult if its not false, not zero, and not null/undefined
				var weight = this.algo.random()
				if (typeof filterResult === 'number') {
					weight *= filterResult
				}
				if (weight > bestWeight) {
					best = value
					bestWeight = weight
				}
			}
		}
		
		return best
	},
	// TODO: make an interface for storing Object.keys(obj) so that it is not recreated each time
	nextKey: function(obj, filter) {
		return this.nextElement(Object.keys(obj), filter)
	},
	nextValue: function(obj, keys, filter) {
		var key = keys ? this.nextElement(keys, filter) : this.nextKey(obj, filter)
		return key ? obj[key] : null
	},
	// obj is in the form {key1: weight1, key2: weight2}, and nextKeyFromWeightedObject selects a key based on each key's weight 
	nextKeyFromWeightedObject: function(obj) {
		return this.nextKey(obj, function(key) {
			return obj[key]
		})
	},
	nextSeed: function() {
		return this.nextInt(4294967295)
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
	},
	selectBestIndex: function(arr, getWeight) {
		var len = arr.length,
			bestIndex = null,
			bestWeight = null,
			bestTieBreaker = null,
			algo = this.algo
		
		for (var i = 0; i < len; ++i) {
			var value = arr[i],
				weight = getWeight != null ? getWeight(value) : value
			
			if (weight != null) {
				if (bestIndex == null || bestWeight < weight) {
					bestIndex = i
					bestWeight = weight
					bestTieBreaker = algo.random()
				} else if (bestWeight === weight) {
					var tieBreaker = algo.random()
					if (tieBreaker > bestTieBreaker) {
						bestIndex = i
						bestWeight = weight
						bestTieBreaker = tieBreaker
					}
				}
			}
		}
		
		return bestIndex
	},
	selectBestElement: function(arr, getWeight) {
		var index = this.selectBestIndex(arr, getWeight)
		return index != null ? arr[index] : null
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
