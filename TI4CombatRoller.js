
function randomNumber(min, max){
    const r = Math.random()*(max-min) + min
    return Math.floor(r)
}

function roller(diceNum, hitVal){
    var hits = 0
    var roll = 0
    var failures = 0

    for (let i = 0; i < diceNum; i++)
        roll = randomNumber(1, 10);
    return roll;
}

printMe = roller(6, 9)

console.log(printMe)