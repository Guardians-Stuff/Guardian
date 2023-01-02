/**
 * @template T
 * @param {Array<T>} original
 * @param {Number} values
 * @returns {Array<T>}
 */
function pickUnique(original, values){
    const array = [...original];
    const picked = [];

    for(let i = 0; i < values; i++){
        const pick = Math.floor(Math.random() * array.length);
        picked.push(...array.splice(pick, 1));
    }

    return picked;
}

module.exports = { pickUnique };