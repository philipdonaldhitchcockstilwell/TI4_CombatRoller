
"use strict";

/**
 * Return a random integer between min and max (inclusive).
 */
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let raceUnits = {};
let raceUpgrades = {};
let currentRace = null;
let counts = {};

const DISPLAY_NAMES = {
    Ground: "Infantry",
    WarSun: "War Sun",
};

async function loadData() {
    const unitsResp = await fetch('race_units.json');
    raceUnits = await unitsResp.json();
    const upResp = await fetch('race_upgrades.json');
    raceUpgrades = await upResp.json();
    const raceNames = Object.keys(raceUnits);
    currentRace = raceNames[0];
    const select = document.getElementById('raceSelect');
    raceNames.forEach(r => {
        const opt = document.createElement('option');
        opt.value = r;
        opt.textContent = r;
        select.appendChild(opt);
    });
    select.value = currentRace;
    select.addEventListener('change', () => {
        currentRace = select.value;
        createUnitControls();
    });
    createUnitControls();
}

/**
 * Roll dice for a given specification.
 * Returns [hits, failures].
 */
function roller(spec) {
    let hits = 0;
    let failures = 0;

    for (let i = 0; i < spec.dice; i++) {
        let result = randomNumber(1, 10) + spec.mod;
        let rerollsLeft = spec.rerolls;

        while (result < spec.hit && rerollsLeft > 0) {
            result = randomNumber(1, 10) + spec.mod;
            rerollsLeft--;
        }

        const ship = document.createElement("div");
        ship.className = "ship";
        ship.textContent = `hits on ${spec.hit}${spec.mod ? (spec.mod > 0 ? `+${spec.mod}` : spec.mod) : ""}`;

        if (result >= spec.hit) {
            hits++;
            ship.classList.add("hit");
        } else {
            failures++;
            ship.classList.add("miss");
        }

        document.getElementById("ships").appendChild(ship);
    }

    return [hits, failures];
}

// Build unit controls on page load
let unitListClickHandler = null;

function unitListClick(e) {
    if (e.target.classList.contains("add")) {
        const unit = e.target.dataset.unit;
        counts[unit]++;
        document.getElementById(`count-${unit}`).textContent = counts[unit];
    } else if (e.target.classList.contains("remove")) {
        const unit = e.target.dataset.unit;
        if (counts[unit] > 0) {
            counts[unit]--;
            document.getElementById(`count-${unit}`).textContent = counts[unit];
        }
    }
}

function createUnitControls() {
    const list = document.getElementById("unitList");
    if (unitListClickHandler) {
        list.removeEventListener("click", unitListClickHandler);
    }
    list.innerHTML = "";
    counts = {};
    const units = raceUnits[currentRace];
    for (const key in units) {
        const unit = units[key];
        const name = DISPLAY_NAMES[key] || unit.name || key;
        const div = document.createElement("div");
        div.className = "unit-control";
        div.innerHTML = `
            <span class="unit-name">${name}</span>
            <div class="counter">
                <button type="button" class="remove" data-unit="${key}">-</button>
                <span id="count-${key}" class="count">0</span>
                <button type="button" class="add" data-unit="${key}">+</button>
            </div>
            <label class="upgrade"><input type="checkbox" id="upgrade-${key}"> ${name} II</label>
        `;
        list.appendChild(div);
        counts[key] = 0;
    }
    unitListClickHandler = unitListClick;
    list.addEventListener("click", unitListClickHandler);
}

loadData();

const buttonClick = document.getElementById("submit");
buttonClick.addEventListener("click", mainCompute, false);

function gatherSpecs() {
    const specs = [];
    const mod = document.getElementById("modPlus1").checked ? 1 : 0;
    const rerolls = document.getElementById("modReroll").checked ? 1 : 0;

    const units = raceUnits[currentRace];
    const upgrades = raceUpgrades[currentRace];
    for (const key in units) {
        const count = counts[key];
        if (count === 0) continue;
        const unit = units[key];
        const upgraded = document.getElementById(`upgrade-${key}`).checked;
        const upgradeStats = upgrades[key] || {};
        const hit = upgraded && upgradeStats.hit !== null ? upgradeStats.hit : unit.hit;
        if (hit === null) continue;
        const dice = (upgraded && upgradeStats.dice ? upgradeStats.dice : unit.dice) * count;
        specs.push({ dice, hit, mod, rerolls });
    }
    return specs;
}

function mainCompute() {
    const specs = gatherSpecs();
    document.getElementById("ships").innerHTML = "";

    let totalHits = 0;
    const failureTotal = {};

    for (const spec of specs) {
        const [hits, fails] = roller(spec);
        totalHits += hits;
        failureTotal[spec.hit] = (failureTotal[spec.hit] || 0) + fails;
    }

    document.getElementById("resultText").textContent = `${totalHits} hit(s)`;
    const failuresDiv = document.getElementById("failures");
    failuresDiv.innerHTML = "";
    for (const property in failureTotal) {
        const p = document.createElement("p");
        p.textContent = `${failureTotal[property]} failures on the ${property} hit count`;
        failuresDiv.appendChild(p);
    }
}
