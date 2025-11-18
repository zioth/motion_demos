/**
 * Create a random number in the given range.
 * 
 * @param {[number, number]} vals 
 * @returns {number}
 */
export const randInRange = (vals) => vals[0] + Math.random() * (vals[1] - vals[0]);

/**
 * Returns a random element from a list.
 * 
 * @param {Array<any>} list 
 * @returns {any}
 */
export const randFromList = (list) => list[Math.floor(Math.random() * list.length)];

/**
 * Flip a coin.
 * 
 * @returns {boolean}
 */
export const coinflip = () => Math.random() < 0.5;