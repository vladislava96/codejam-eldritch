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
let ancientСhosen;
let levelСhosen;
const ancients = [];

let arrFirstStage = [];
let arrSecondStage = [];
let arrThirdStage = [];

let arrStages = [];
let currentStage = [];

let levelGreenCards = [];
let levelBrownCards = [];
let levelBlueCards = [];

let green;
let brown;
let blue;

let dackAncientGreen = []; // всего зеленых у древнего
let dackAncientBrown = []; // всего коричневых у древнего
let dackAncientBlue = []; // всего голубых у древнего

function createAncientCard(data) {
    const ancientCart = document.createElement('img');

    ancientCart.classList.add('ancient');
    ancientCart.dataset.name = data.id;
    ancientCart.src = data.cardFace;
    ancientCart.alt = data.name;

    return ancientCart;
}

for (const ancientData of ancientsData) {
    const ancient = createAncientCard(ancientData);
    ancientsContainer.appendChild(ancient);
    ancients.push(ancient);
}

ancientsContainer.addEventListener('click', (event) => {
    for (let ancient of ancients) {
        ancient.classList.remove('ancient-active')
    }
    event.target.classList.add('ancient-active')
    ancientСhosen = event.target.dataset.name
    getAncient(ancientСhosen)
    
    cardShown.style.display = 'none';

    arrFirstStage = [];
    arrSecondStage = [];
    arrThirdStage = [];

    if(levelСhosen != undefined && ancientСhosen != undefined) {
        decksGenerationBtn.style.display = 'flex';
    }
})

function getAncient(idСhosen) {
    if(idСhosen != undefined) {
        levelsContainer.style.display = 'flex';
        console.log(idСhosen)
        decks.style.display = 'none';
        counters.innerHTML = '';
        for (let ancientData of ancientsData) {
            if(ancientData.id !== idСhosen) {
                continue
            }
            considerAncient(ancientData)
        }
    }
}

levelsContainer.addEventListener('click', (event) => {
    for (let level of levels) {
        level.classList.remove('level-buton-active')
    }
    event.target.classList.add('level-buton-active')
    levelСhosen = event.target.dataset.name
    getLevel(levelСhosen)

    levelsContainer.style.margin = '0';
    decksGenerationBtn.style.display = 'flex';
})

function getLevel(level) {
    if(level != undefined) {
        decksGenerationBtn.style.display = 'flex';
        decks.style.display = 'none';
    }
}

decksGenerationBtn.addEventListener('click', () => {
    decksGenerationBtn.style.display = 'none'
    decks.style.display = 'flex';

    shuffleDeck(levelСhosen);
})

function considerAncient(ancient) {
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
        if(cardData.difficulty !== level) {
            continue
        }
        levelCards.push(cardData)
    }   
    return (levelCards)   
}

function findMissingCards(level, cardsData, number) {
    let levelCards = [];
    let arrRandomIndex = [];
    let maxIndex = levelCards.length - 1;

    for (let cardData of cardsData) {
        if(cardData.difficulty !== level) {
            continue
        }
        levelCards.push(cardData)
    } 
    for (let i = 0; i < number; i++) {
        let randomIndex = getRandomNumber(0, maxIndex);
        let сard = levelCards.splice(randomIndex, 1);
        arrRandomIndex.push(...сard)
    }
    
    return (arrRandomIndex)   
}

function countCards(cards) {
    for (let ancientData of ancientsData) {
        if(ancientData.id !== ancientСhosen) {
            continue
        }
        return (ancientData.firstStage[cards] + ancientData.secondStage[cards] + ancientData.thirdStage[cards]); 
    }
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createDackAncient(colorCount, finalDeck, arr) {
    for (let i = 0; i < colorCount; i++) {
        let maxIndex = finalDeck.length - 1;
        let randomIndex = getRandomNumber(0, maxIndex);
        let сard = finalDeck.splice(randomIndex, 1);
        arr.push(...сard)
    }
}
function createDackStage(stageCounterColor, dackColor, arrStage) {
    for (let i = 0; i < stageCounterColor; i++) {
        let maxIndex = dackColor - 1;
        let randomIndex = getRandomNumber(0, maxIndex);
        let сard = dackColor.splice(randomIndex, 1);
        arrStage.push(...сard)
    }
}
function createDeck() {
    let ancientСhosenData;

    for (let ancientData of ancientsData) {
        if(ancientData.id !== ancientСhosen) {
            continue
        }
        ancientСhosenData = ancientData
    }

    let firstStageGreen = ancientСhosenData.firstStage.greenCards;
    let firstStagBrown = ancientСhosenData.firstStage.brownCards;
    let firstStageBlue = ancientСhosenData.firstStage.blueCards;

    let secondStageGreen = ancientСhosenData.secondStage.greenCards;
    let secondStagBrown = ancientСhosenData.secondStage.brownCards;
    let secondStageBlue = ancientСhosenData.secondStage.blueCards;

    let thirdStageGreen = ancientСhosenData.thirdStage.greenCards;
    let thirdStageBrown = ancientСhosenData.thirdStage.brownCards;
    let thirdStageBlue = ancientСhosenData.thirdStage.blueCards;
   
    createDackStage(firstStageGreen, dackAncientGreen, arrFirstStage);
    createDackStage(firstStagBrown, dackAncientBrown, arrFirstStage);
    createDackStage(firstStageBlue, dackAncientBlue, arrFirstStage);

    createDackStage(secondStageGreen, dackAncientGreen, arrSecondStage);
    createDackStage(secondStagBrown, dackAncientBrown, arrSecondStage);
    createDackStage(secondStageBlue, dackAncientBlue, arrSecondStage);

    createDackStage(thirdStageGreen, dackAncientGreen, arrThirdStage);
    createDackStage(thirdStageBrown, dackAncientBrown, arrThirdStage);
    createDackStage(thirdStageBlue, dackAncientBlue, arrThirdStage);

    arrStages = [arrFirstStage, arrSecondStage, arrThirdStage];
}

function filterVeryEasyHard(level) {
    levelGreenCards = findCards(level, greenCardsData);
    levelBrownCards = findCards(level, brownCardsData);
    levelBlueCards = findCards(level, blueCardsData);

    green = countCards('greenCards');
    brown = countCards('brownCards');
    blue = countCards('blueCards');

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

    createDackAncient(green, finalGreenDeck, dackAncientGreen);
    createDackAncient(brown, finalBrownDeck, dackAncientBrown);
    createDackAncient(blue, finalBlueDeck, dackAncientBlue);
}

function filterEasyHard(level) {
    let newGreenCardsData = greenCardsData.filter(card => card.difficulty !== level);
    let newBrownCardsData = brownCardsData.filter(card => card.difficulty !== level);
    let newBlueCardsData = blueCardsData.filter(card => card.difficulty !== level);
    
    green = countCards('greenCards');
    brown = countCards('brownCards');
    blue = countCards('blueCards');

    createDackAncient(green, newGreenCardsData, dackAncientGreen);
    createDackAncient(brown, newBrownCardsData, dackAncientBrown);
    createDackAncient(blue, newBlueCardsData, dackAncientBlue);
}

function filterVeryEasyDack() { 
    filterVeryEasyHard('easy')
    createDeck();
}

function filterEasyDack() {
    filterEasyHard('hard')
    createDeck();
}

function filterNormalDark() {
    green = countCards('greenCards');
    brown = countCards('brownCards');
    blue = countCards('blueCards');

    createDackAncient(green, greenCardsData, dackAncientGreen);
    createDackAncient(brown, brownCardsData, dackAncientBrown);
    createDackAncient(blue, blueCardsData, dackAncientBlue);

    createDeck();
}

function filterHardDark() {
    filterEasyHard('easy')
    createDeck();
}

function filterVeryHardDark() {
    
    filterVeryEasyHard('hard')
    createDeck();
}

miniDeck.addEventListener('click', showCard)

function showCard() {
    if (currentStage.length <= 0) {
        currentStage = arrStages.shift()
    }
    if (!currentStage) {
        return
    }
    console.log(arrFirstStage, arrSecondStage, arrThirdStage);

    let maxIndex = currentStage.length - 1;
    let randomIndex = getRandomNumber(0, maxIndex);
    let сard = currentStage.splice(randomIndex, 1);
    
    console.log(сard[0].color);
    
    cardShown.src = сard[0].cardFace;
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

    if (сard[0].color === 'green') {
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
    if (сard[0].color === 'brown') {
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
    if (сard[0].color === 'blue') {
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
    
    switch(level) {
        case 'very-easy': 
            console.log(level);
            filterVeryEasyDack();
            break;
        case 'easy': 
            console.log('easy');
            filterEasyDack();
            break;
        case 'normal': 
            console.log('normal');
            filterNormalDark()
            break;
        case 'hard': 
            console.log('hard');
            filterHardDark()
            break;
        case 'very-hard': 
            console.log('very-hard');
            filterVeryHardDark()
            break;
    } 
}