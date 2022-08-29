const ancientsContainer = document.querySelector('.ancients-container');

const levelsContainer = document.querySelector('.levels-container');
const levels = document.querySelectorAll('.level');

const decksGenerationBtn = document.querySelector('.decks-generation');
const decks = document.querySelector('.decks');
const miniDeck = document.querySelector('.mini-deck');
const cardShown = document.querySelector('.card');

const counters = document.querySelector('.counters');

import ancientsData from './data/ancients.js';
import cardBackground from './assets/mythicCardBackground.png';
import blueCardsData from './data/mythicCards/blue/index.js';
import brownCardsData from './data/mythicCards/brown/index.js';
import greenCardsData from './data/mythicCards/green/index.js';


miniDeck.src = cardBackground;

let ancientChosen;
let levelChosen;
const ancients = [];

let arrStages = [];
let currentStage = [];

function createAncientCard(data) {
    const ancientCart = document.createElement('img');

    ancientCart.classList.add('ancient');
    ancientCart.dataset.name = data.id;
    ancientCart.src = data.cardFace;
    ancientCart.alt = data.name;

    ancientCart.addEventListener('click', onAncientClick);

    return ancientCart;
}

for (const ancientData of ancientsData) {
    const ancient = createAncientCard(ancientData);
    ancientsContainer.appendChild(ancient);
    ancients.push(ancient);
}

function onAncientClick(event) {
    for (let ancient of ancients) {
        ancient.classList.remove('ancient-active')
    }
    event.target.classList.add('ancient-active')
    ancientChosen = event.target.dataset.name
    getAncient(ancientChosen)

    cardShown.style.display = 'none';

    if (levelChosen != undefined && ancientChosen != undefined) {
        decksGenerationBtn.style.display = 'flex';
    }
}

function getAncient(idChosen) {
    if (idChosen != undefined) {
        levelsContainer.style.display = 'flex';
        console.log(idChosen)
        decks.style.display = 'none';
    }
}

levelsContainer.addEventListener('click', (event) => {
    const target = event.target;

    if ('BUTTON' != target.tagName) {
        return;
    }

    for (let level of levels) {
        level.classList.remove('level-button-active')
    }

    target.classList.add('level-button-active')
    levelChosen = target.dataset.name
    getLevel(levelChosen)

    levelsContainer.style.margin = '0';
    decksGenerationBtn.style.display = 'flex';
})

function getLevel(level) {
    if (level != undefined) {
        decksGenerationBtn.style.display = 'flex';
        decks.style.display = 'none';
    }
}

decksGenerationBtn.addEventListener('click', () => {
    decksGenerationBtn.style.display = 'none'
    decks.style.display = 'flex';
    currentStage = [];

    let ancientData = getAncientDataById(ancientChosen);
    considerAncient(ancientData)

    shuffleDeck(levelChosen);
})

function considerAncient(ancient) {
    counters.innerHTML = '';
    createStage('I', ancient.firstStage);
    createStage('II', ancient.secondStage);
    createStage('III', ancient.thirdStage);
}

function createStage(stageNumber, stageData) {
    const stage = document.createElement('div');
    stage.className = 'stage';

    const header = document.createElement('p');
    header.textContent = stageNumber;

    const counterContainer = document.createElement('div');
    counterContainer.className = 'counter-container';

    stage.appendChild(header);
    stage.appendChild(counterContainer);

    createCounter(stageData.greenCards, 'green', counterContainer, stageNumber);
    createCounter(stageData.brownCards, 'brown', counterContainer, stageNumber);
    createCounter(stageData.blueCards, 'blue', counterContainer, stageNumber);

    counters.appendChild(stage);
}

function createCounter(amount, color, container, number) {
    const counter = document.createElement('div');
    counter.className = `counter ${color}`;
    counter.textContent = amount;
    counter.dataset.id = `${number}-${color}`;
    container.appendChild(counter);
}

function findCards(level, cardsData) {
    let levelCards = [];
    for (let cardData of cardsData) {
        if (cardData.difficulty !== level) {
            continue
        }
        levelCards.push(cardData)
    }
    return levelCards;
}

function findMissingCards(level, cardsData, number) {
    let levelCards = [];
    let arrRandomIndex = [];
    let maxIndex = levelCards.length - 1;

    for (let cardData of cardsData) {
        if (cardData.difficulty !== level) {
            continue
        }
        levelCards.push(cardData)
    }
    for (let i = 0; i < number; i++) {
        let randomIndex = getRandomNumber(0, maxIndex);
        let card = levelCards.splice(randomIndex, 1);
        arrRandomIndex.push(...card)
    }

    return arrRandomIndex;
}

function countCards(cards) {
    const ancientData = getAncientDataById(ancientChosen);

    return ancientData.firstStage[cards] +
        ancientData.secondStage[cards] +
        ancientData.thirdStage[cards];
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createDeckAncient(colorCount, finalDeck) {
    let newDeck = [];

    for (let i = 0; i < colorCount; i++) {
        let maxIndex = finalDeck.length - 1;
        let randomIndex = getRandomNumber(0, maxIndex);
        let card = finalDeck.splice(randomIndex, 1);
        newDeck.push(...card)
    }

    return newDeck;
}

function getAncientDataById(id) {
    for (let ancientData of ancientsData) {
        if (ancientData.id === id) {
            return ancientData;
        }
    }

    return null;
}

function createDeck(colorDecks) {
    const ancientChosenData = getAncientDataById(ancientChosen);

    const arrFirstStage = createDeckStage(
        ancientChosenData.firstStage,
        colorDecks
    );

    const arrSecondStage = createDeckStage(
        ancientChosenData.secondStage,
        colorDecks
    );

    const arrThirdStage = createDeckStage(
        ancientChosenData.thirdStage,
        colorDecks
    );

    return [arrFirstStage, arrSecondStage, arrThirdStage];
}

function createDeckStage(stageData, colorDecks)
{
    let arrStage = [];

    fillDeckWithColor(stageData.greenCards, colorDecks.green, arrStage);
    fillDeckWithColor(stageData.brownCards, colorDecks.brown, arrStage);
    fillDeckWithColor(stageData.blueCards, colorDecks.blue, arrStage);

    return arrStage;
}

function fillDeckWithColor(stageCounterColor, deckColor, arrStage) {
    for (let i = 0; i < stageCounterColor; i++) {
        let maxIndex = deckColor - 1;
        let randomIndex = getRandomNumber(0, maxIndex);
        let card = deckColor.splice(randomIndex, 1);
        arrStage.push(...card)
    }
}

function filterVeryEasyHard(level) {
    let levelGreenCards = findCards(level, greenCardsData);
    let levelBrownCards = findCards(level, brownCardsData);
    let levelBlueCards = findCards(level, blueCardsData);

    let green = countCards('greenCards');
    let brown = countCards('brownCards');
    let blue = countCards('blueCards');

    let levelGreenCardsNormal;
    let levelBrownCardsNormal;
    let levelBlueCardsNormal;

    if (levelGreenCards.length < green) {
        let numberMissingCards = green - levelGreenCards.length;
        console.log(numberMissingCards)
        levelGreenCardsNormal = findMissingCards('normal', greenCardsData, numberMissingCards);
    }
    if (levelBrownCards.length < brown) {
        let numberMissingCards = brown - levelBrownCards.length;
        console.log(numberMissingCards)
        levelBrownCardsNormal = findMissingCards('normal', brownCardsData, numberMissingCards);
    }
    if (levelBlueCards.length < blue) {
        let numberMissingCards = blue - levelBlueCards.length;
        console.log(numberMissingCards)
        levelBlueCardsNormal = findMissingCards('normal', blueCardsData, numberMissingCards);
    }

    let finalGreenDeck = !levelGreenCardsNormal ? levelGreenCards : [...levelGreenCards, ...levelGreenCardsNormal];
    let finalBrownDeck = !levelBrownCardsNormal ? levelBrownCards : [...levelBrownCards, ...levelBrownCardsNormal];
    let finalBlueDeck = !levelBlueCardsNormal ? levelBlueCards : [...levelBlueCards, ...levelBlueCardsNormal];

    return {
        green: createDeckAncient(green, finalGreenDeck),
        brown: createDeckAncient(brown, finalBrownDeck),
        blue: createDeckAncient(blue, finalBlueDeck),
    };
}

function filterEasyHard(level) {
    let newGreenCardsData = greenCardsData.filter(card => card.difficulty !== level);
    let newBrownCardsData = brownCardsData.filter(card => card.difficulty !== level);
    let newBlueCardsData = blueCardsData.filter(card => card.difficulty !== level);

    let green = countCards('greenCards');
    let brown = countCards('brownCards');
    let blue = countCards('blueCards');

    return {
        green: createDeckAncient(green, newGreenCardsData),
        brown: createDeckAncient(brown, newBrownCardsData),
        blue: createDeckAncient(blue, newBlueCardsData),
    }
}

function filterVeryEasyDeck() {
    return filterVeryEasyHard('easy');
}

function filterEasyDeck() {
    return filterEasyHard('hard')
}

function filterNormalDark() {
    let green = countCards('greenCards');
    let brown = countCards('brownCards');
    let blue = countCards('blueCards');

    return {
        green: createDeckAncient(green, greenCardsData),
        brown: createDeckAncient(brown, brownCardsData),
        blue: createDeckAncient(blue, blueCardsData),
    }
}

function filterHardDark() {
    return filterEasyHard('easy')
}

function filterVeryHardDark() {
    return filterVeryEasyHard('hard')
}

miniDeck.addEventListener('click', showCard)

function showCard() {
    if (!currentStage) {
        return
    }
    if (currentStage.length <= 0) {
        currentStage = arrStages.shift()
    }
    if (!currentStage) {
        cardShown.style.display = 'none'
        return
    }
    
    let maxIndex = currentStage.length - 1;
    let randomIndex = getRandomNumber(0, maxIndex);
    let card = currentStage.splice(randomIndex, 1);

    console.log(card[0].color);

    cardShown.src = card[0].cardFace;
    cardShown.style.display = 'inline-block';

    let counterIgreen = document.querySelector('[data-id="I-green"]');
    let counterIbrown = document.querySelector('[data-id="I-brown"]');
    let counterIblue = document.querySelector('[data-id="I-blue"]');

    let counterIIgreen = document.querySelector('[data-id="II-green"]');
    let counterIIbrown = document.querySelector('[data-id="II-brown"]');
    let counterIIblue = document.querySelector('[data-id="II-blue"]');

    let counterIIIgreen = document.querySelector('[data-id="III-green"]');
    let counterIIIbrown = document.querySelector('[data-id="III-brown"]');
    let counterIIIblue = document.querySelector('[data-id="III-blue"]');

    if (card[0].color === 'green') {
        if (counterIgreen.textContent !== '0') {
            let num = Number(counterIgreen.textContent) - 1;
            counterIgreen.textContent = num;
        } else if (counterIIgreen.textContent !== '0') {
            let num = Number(counterIIgreen.textContent) - 1;
            counterIIgreen.textContent = num;
        } else if (counterIIIgreen.textContent !== '0') {
            let num = Number(counterIIIgreen.textContent) - 1;
            counterIIIgreen.textContent = num;
        }
    }
    if (card[0].color === 'brown') {
        if (counterIbrown.textContent !== '0') {
            let num = Number(counterIbrown.textContent) - 1;
            counterIbrown.textContent = num;
        } else if (counterIIbrown.textContent !== '0') {
            let num = Number(counterIIbrown.textContent) - 1;
            counterIIbrown.textContent = num;
        } else if (counterIIIbrown.textContent !== '0') {
            let num = Number(counterIIIbrown.textContent) - 1;
            counterIIIbrown.textContent = num;
        }
    }
    if (card[0].color === 'blue') {
        if (counterIblue.textContent !== '0') {
            let num = Number(counterIblue.textContent) - 1;
            counterIblue.textContent = num;
        } else if (counterIIblue.textContent !== '0') {
            let num = Number(counterIIblue.textContent) - 1;
            counterIIblue.textContent = num;
        } else if (counterIIIblue.textContent !== '0') {
            let num = Number(counterIIIblue.textContent) - 1;
            counterIIIblue.textContent = num;
        }
    }
}

function shuffleDeck(level) {
    console.log(level);

    let colorDecks = {
        green: [],
        brown: [],
        blue: [],
    };

    switch (level) {
        case 'very-easy':
            colorDecks = filterVeryEasyDeck();
            break;
        case 'easy':
            colorDecks = filterEasyDeck();
            break;
        case 'normal':
            colorDecks = filterNormalDark()
            break;
        case 'hard':
            colorDecks = filterHardDark()
            break;
        case 'very-hard':
            colorDecks = filterVeryHardDark()
            break;
    }

    arrStages = createDeck(colorDecks);

    console.log(arrStages);
}
