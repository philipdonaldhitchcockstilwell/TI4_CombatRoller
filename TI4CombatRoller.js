
function randomNumber(min, max) {
    const r = Math.random()*(max-min) + min
    return Math.floor(r)
}

function roller(diceNum, hitVal) {
    var hits = 0;
    var roll = 0;
    var failures = 0;

    for (let i = 0; i < diceNum; i++) {
        roll = randomNumber(1, 10);
        if (hitVal <= roll) {
            hits = hits + 1;
        } else if (hitVal > roll) {
            failures = failures + 1;
        } else {
            continue;
        }
    } 
    return [hits, failures];
}

const buttonClick = document.getElementById("submit");
buttonClick.addEventListener("click", mainCompute, false);

function mainCompute() {
    totalHits = 0
    bestFailure = 10
    failureTotal = {}
    var userInput = document.getElementById('diceInput').value;
    userInput = userInput.split(' ')
    for (i = 0; i < userInput.length; i++) {
        userInput[i] = userInput[i].split('h');
    }
    for (i = 0; i < userInput.length; i++) {
        for (k = 0; k < userInput[i].length; k++) {
            userInput[i][k] = parseInt(userInput[i][k]);
        }
    }
    for (i = 0; i < userInput.length; i++){
        var hitsAndFailures = roller(userInput[i][0], userInput[i][1])
        if (hitsAndFailures[0] >= 1) {
            totalHits = totalHits + hitsAndFailures[0];
        }
        if (hitsAndFailures[1] > 0) {
            if (bestFailure > userInput[i][1]) {
                bestFailure = userInput[i][1];
            }
        }
        failureTotal[userInput[i][1]] = hitsAndFailures[1];
        continue
    }
    document.getElementById("resultText").innerHTML = `${totalHits} hit(s)`
    for (i = 0; i < failureTotal.length; i++) {
        var newLine = document.createElement("p");
        newLine.appendChild(document.createTextNode(`${failureTotal[i][1]} failures on the ${failureTotal[i][0]} hit count`));
        document.getElementById("failures").appendChild(newLine);
    }

}
