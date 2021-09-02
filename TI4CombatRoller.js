
"use strict";

function randomNumber(min, max) {
    const r = Math.random()*(max-min) + min
    return Math.floor(r)
}

function roller(diceNum, hitVal) {
    let hits = 0;
    let roll = 0;
    let failures = 0;

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
    let totalHits = 0;
    let bestFailure = 0;
    let failureTotal = {}
    let userInput = document.getElementById('diceInput').value;
    userInput = userInput.split(' ')
    for (let i = 0; i < userInput.length; i++) {
        userInput[i] = userInput[i].split('h');
    }
    for (let i = 0; i < userInput.length; i++) {
        for (let k = 0; k < userInput[i].length; k++) {
            userInput[i][k] = parseInt(userInput[i][k]);
        }
    }
    for (let i = 0; i < userInput.length; i++){
        let hitsAndFailures = roller(userInput[i][0], userInput[i][1])
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
    document.getElementById("failures").innerHTML = "";
    for (let property in failureTotal) {
        let newParagraph = document.createElement("p");
        newParagraph.appendChild(document.createTextNode(`${property} failures on the ${failureTotal[property]} hit count`));
        document.getElementById("failures").appendChild(newParagraph);
    }

}
