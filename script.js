const words = [{
        word: 'cat',
        translate: 'кот',
        example: 'The cat likes milk.'
    },

    {
        word: 'dog',
        translate: 'собака',
        example: 'The dog guards the house.'
    },

    {
        word: 'parrot',
        translate: 'попугай',
        example: 'The parrot can repeat words.'
    },

    {
        word: 'hamster',
        translate: 'хомяк',
        example: 'The hamster likes to eat grains.'
    },

    {
        word: 'monkey',
        translate: 'обезьянка',
        example: 'The monkey likes to eat bananas.'
    }
];

const flipCard = document.querySelector('.flip-card');
const btnNext = document.querySelector('#next');
const btnBack = document.querySelector('#exam');
const examCards = document.querySelector('#exam-cards');
const shuffleWords = document.querySelector('#shuffle-words');
const time = document.querySelector('#time');

let index = 0;

const currentWords = [...words];

function makeCard({ word, translate, example }) {
    flipCard.querySelector('card-front h2').textContent = word;
    flipCard.querySelector('card-back h2').textContent = translate;
    flipCard.querySelector('card-back p span').textContent = example;
};

function renderCard(arr) {
    arr.forEach((item) => {
        makeCard(item);
    });
};

renderCard(currentWords);

document.querySelector('#total-word').textContent = currentWords.length;

function getrandomCard(arr) {
    return arr[Math.floor(Mathrandom() * arr.length)];
}

shuffleWords.addEventListener('click', () => {
    makeCard(getRandomcard(currentWords));
});

function showProgress() {
    document.querySelector('#words-progress').value = index * (100 / (currentWords.length - 1));
    document.querySelector('#current-word').textContent = index + 1;
    makeCard(currentWords[index]);
}

flipCard.onclick = function() {
    flipCard.classList.toggle('active');
};

btnNext.onclick = function() {
    index = ++index;
    btnBack.disabled = false;
    if (index === currentWords.length - 1) {
        btnNext.disabled = true;
    }
    showProgress();
};

btnBack.onclick = function() {
    index = --index;
    if (index === 0) {
        btnBack.disabled = true;
    }
    if (index < currentWords.length - 1) {
        btnNext.disabled = false;
    }
    showProgress();
};

function shuffleCard(array) {
    const currentIndex = array.length,
        randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[currentIndex], array[randomIndex]];
    }
    return array;
};

function makeExamCard(elem) {
    const item = document.createElement('div');
    item.classList.add('card');
    item.textContent = elem;
    return item;
};

function mixCards(arr) {
    const newArr = [];
    arr.forEach((item) => {
        newArr.push(makeExamCard(item.word));
        newArr.push(makeExamCard(item.translate));
    })
    return shuffleCard(newArr);
};

function renderExamCard(arr) {
    arr.forEach((item) => {
        examCards.append(item);
    })
};

let timer;
let sec = 0;
let min = 0;
let firstCard = 0;
let secondCard = 0;
let firstCardIndex = 0;
let secondCardIndex = 0;
const segment = Object.keys(words).length;
let endIndex = 0;
let click = false;

function showExamProgress(value) {
    const result = (100 * (value + 1)) / segment;
    return Math.round(result);
};

btnExam.addEventListener('click', () => {
    document.querySelector('.study-cards').classList.add('hidden');
    document.querySelector('#study-mode').classList.add('hidden');
    document.querySelector('#exam-mode').classList.remove('hidden');
    renderExamCard(mixCards(currentWords));

    timer = setInterval(() => {
        sec++;
        if (sec === 60) {
            sec = 0;
            min++
        }
        if (sec < 10) {
            time.textContent = `${min}:0${sec}`;
        } else {
            time.textContent = `${min}:${sec}`;
        }
    }, 1000);
});

examCards.addEventListener('click', (event) => {
    const card = event.target.closest('.card');
    if (click === false) {
        card.classList.add('correct');
        firstCard = card;
        firstCardIndex = currentWords.findIndex((item) => item.word === card.textContent || item.translate === card.textContent);
        click = true;
        firstCard.style.pointerEvents = 'none';
    } else {
        secondCard = card;
        secondCardIndex = currentWords.findIndex((item) => item.word === card.textContent || item.translate === card.textContent);
        firstCard.style.pointerEvents = 'all';

        if (firstCardIndex === secondCardIndex) {
            document.querySelector('#correct-percent').textContent = showExamProgress(endIndex) + '%';
            document.querySelector('#exam-progress').value = showExamProgress(endIndex);
            endIndex++;
            firstCard.classList.add('fade-out');
            secondCard.classList.add('correct');
            secondCard.classList.add('fade-out');
            firstCard.style.pointerEvents = 'none';
            secondCard.style.pointerEvents = 'none';

            if (endIndex === segment) {
                clearInterval(timer);
                document.querySelector('.motivation').textContent = 'Поздравляю! Тестирование пройдено успешно!';
            }
            click = false;

        } else if (firstCardIndex !== secondCardIndex) {
            click = false;
            secondCardIndex.classList.add('wrong');
            setTimeout(() => {
                firstCard.classList.remove('correct');
                secondCard.classList.remove('wrong');
            }, 600);
        }
    }
});