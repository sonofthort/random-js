# random-js
Provides a high level interface for random number generation, and is algorithm agnostic, allowing seeded algorithms.

Wraps any object which has a .random() function which returns a floating point value >= 0 and < 1.

Can wrap the JavaScript "Math" object to use the builtin rng.

Can also wrap "MersenneTwister" from banksean/mersenne-twister.js (https://gist.github.com/banksean/300494)
