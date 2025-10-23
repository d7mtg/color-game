// Game state
const gameState = {
    right: 0,
    wrong: 0,
    rgbMode: true,
    correctIndex: null
};

// DOM elements - will be initialized after DOM loads
let elements = {};

// Utility functions
const generateRandomColor = () => {
    return '#' + ('00000' + ((Math.random() * (1 << 24)) | 0).toString(16)).slice(-6);
};

const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
};

const formatColorCode = (color, rgbMode) => {
    if (!rgbMode) {
        return color;
    }

    return `<span style='color:white'>${color.substring(0, 1)}</span>` +
           `<span style='color:#ff6b6b'>${color.substring(1, 3)}</span>` +
           `<span style='color:#51cf66'>${color.substring(3, 5)}</span>` +
           `<span style='color:#339af0'>${color.substring(5, 7)}</span>`;
};

const showFeedback = (isCorrect) => {
    elements.current.style.backgroundColor = isCorrect ? '#10b981' : '#ef4444';
    elements.current.innerText = isCorrect ? 'Correct!' : 'Wrong!';
    elements.current.classList.add('show');

    setTimeout(() => {
        elements.current.classList.remove('show');
    }, 500);
};

const updateStats = () => {
    const { right, wrong } = gameState;
    const total = right + wrong;
    const scorePercentage = total > 0 ? Math.trunc((right / total) * 100) : 0;

    elements.rightcount.innerText = `Correct: ${right}`;
    elements.wrongcount.innerText = `Wrong: ${wrong}`;
    elements.totalcount.innerText = `Total: ${total}`;
    elements.score.innerText = `Score: ${scorePercentage}%`;

    // Update stat card styles
    const statCards = document.querySelectorAll('.stat-card');

    statCards.forEach(card => {
        card.classList.remove('success', 'error', 'neutral');
    });

    if (right > wrong) {
        statCards.forEach(card => card.classList.add('success'));
    } else if (wrong > right) {
        statCards.forEach(card => card.classList.add('error'));
    } else {
        statCards.forEach(card => card.classList.add('neutral'));
    }
};

const generateColor = () => {
    // Shuffle positions
    const positions = shuffleArray([0, 1, 2]);
    const correctColor = generateRandomColor();
    gameState.correctIndex = positions[2];

    // Reset current feedback
    elements.current.style.backgroundColor = 'transparent';
    elements.current.classList.remove('show');

    // Set colors
    elements.colorboxes[positions[0]].style.backgroundColor = generateRandomColor();
    elements.colorboxes[positions[1]].style.backgroundColor = generateRandomColor();
    elements.colorboxes[positions[2]].style.backgroundColor = correctColor;

    // Mark correct box
    for (let i = 0; i < elements.colorboxes.length; i++) {
        elements.colorboxes[i].removeAttribute('id');
    }
    elements.colorboxes[positions[2]].id = 'correct';

    // Display color code
    elements.colorCode.innerHTML = formatColorCode(correctColor, gameState.rgbMode);
};

const handleColorClick = function() {
    const isCorrect = this.id === 'correct';

    if (isCorrect) {
        gameState.right++;
        this.classList.add('pulse');
    } else {
        gameState.wrong++;
    }

    showFeedback(isCorrect);
    updateStats();

    setTimeout(() => {
        this.classList.remove('pulse');
        generateColor();
    }, 300);
};

const handleKeyPress = (event) => {
    const keyMap = {
        '1': 0,
        '2': 1,
        '3': 2
    };

    const index = keyMap[event.key];
    if (index !== undefined) {
        event.preventDefault();
        elements.colorboxes[index].click();
    }
};

const toggleRgbMode = () => {
    gameState.rgbMode = !gameState.rgbMode;
    generateColor();
};

// Initialize game
const init = () => {
    // Initialize DOM elements after page loads
    elements = {
        colorCode: document.getElementById('colorCode'),
        colorboxes: document.getElementsByClassName('colorbox'),
        current: document.getElementById('current'),
        score: document.getElementById('score'),
        rightcount: document.getElementById('rightcount'),
        wrongcount: document.getElementById('wrongcount'),
        totalcount: document.getElementById('totalcount'),
        scoreDiv: document.getElementById('scorediv')
    };

    // Add click listeners to color boxes
    Array.from(elements.colorboxes).forEach(box => {
        box.addEventListener('click', handleColorClick);
    });

    // Add keyboard listeners
    document.body.addEventListener('keyup', handleKeyPress);

    // Generate initial colors
    generateColor();
};

// Start game when page loads
window.addEventListener('load', init);
