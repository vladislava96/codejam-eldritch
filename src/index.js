const ancientsContainer = document.querySelector('.ancients-container');
const ancients = document.querySelectorAll('.ancient');

const levelsContainer = document.querySelector('.levels-container');
const levels = document.querySelectorAll('.level');

const decksGenerationBtn = document.querySelector('.decks-generation');
const decks = document.querySelector('.decks');

const counters = document.querySelector('.counters');

import ancientsData from './data/ancients.js';
import cardsData from './data/mythicCards/blue/index.js';

console.log(cardsData)
let ancientСhosen;
let levelСhosen;

ancientsContainer.addEventListener('click', (event) => {
    for (let ancient of ancients) {
        ancient.classList.remove('ancient-active')
    }
    event.target.classList.add('ancient-active')
    ancientСhosen = event.target.dataset.name
    getAncient(ancientСhosen)
    if (ancientСhosen !== undefined && levelСhosen !== undefined) {
        decksGenerationBtn.style.display = 'flex'
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
})

function getLevel(level) {
    if(level != undefined) {
        decksGenerationBtn.style.display = 'flex';
        console.log(level)
        decks.style.display = 'none';
    }

}

decksGenerationBtn.addEventListener('click', () => {
    decksGenerationBtn.style.display = 'none'
    decks.style.display = 'flex';
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

    createCounter(stageData.greenCards, 'green', counterContainer);
    createCounter(stageData.brownCards, 'brown', counterContainer);
    createCounter(stageData.blueCards, 'blue', counterContainer);

    counters.appendChild(stage);
}
function createCounter(amount, color, container) {
    const counter = document.createElement('div');
    counter.className = `counter ${color}`;
    counter.textContent = amount;
    container.appendChild(counter)
}

let arrEasyCards = [];

function findEasyCards(level) {
   for (let cardData of cardsData) {
        if(cardData.difficulty !== level) {
            continue
        }
        arrEasyCards.push(cardData)
   }
}