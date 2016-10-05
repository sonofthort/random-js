# random-js
Provides a high level interface for random number generation, and is algorithm agnostic.

Wraps any object which has a .random() function which returns a floating point value >= 0 and < 1.

Can wrap JavaScript "Math" to use the builtin rng.

Can also wrap "MersenneTwister" from banksean/mersenne-twister.js (https://gist.github.com/banksean/300494)
