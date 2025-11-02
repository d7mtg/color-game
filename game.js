// Game state
const gameState = {
    right: 0,
    wrong: 0,
    rgbMode: true,
    correctIndex: null,
    totalQuestions: 0
};

// DOM elements - will be initialized after DOM loads
let elements = {};

// Easy starting colors for beginners
const easyColors = [
    '#FF0000', // Pure red
    '#00FF00', // Pure green
    '#0000FF', // Pure blue
    '#FFFF00', // Yellow
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
    '#FFFFFF', // White
    '#000000', // Black
    '#808080', // Gray
    '#FF8000', // Orange
    '#8000FF', // Purple
];

// Utility functions
const generateRandomColor = () => {
    return '#' + ('00000' + ((Math.random() * (1 << 24)) | 0).toString(16)).slice(-6).toUpperCase();
};

const getColorForQuestion = (questionNumber) => {
    // First 11 questions use easy colors
    if (questionNumber < easyColors.length) {
        return easyColors[questionNumber];
    }
    // After that, use random colors
    return generateRandomColor();
};

const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
};

const formatColorCode = (color, rgbMode) => {
    if (!rgbMode) {
        return color;
    }

    // Extract RGB components and show them with intensity-based shading
    const redHex = color.substring(1, 3);
    const greenHex = color.substring(3, 5);
    const blueHex = color.substring(5, 7);

    // Convert hex to decimal for intensity (0-255)
    const redValue = parseInt(redHex, 16);
    const greenValue = parseInt(greenHex, 16);
    const blueValue = parseInt(blueHex, 16);

    // Create RGB colors with proper intensity
    // Add minimum brightness so dark values are still visible
    const minBright = 100;
    const redColor = `rgb(${Math.max(redValue, minBright)}, 0, 0)`;
    const greenColor = `rgb(0, ${Math.max(greenValue, minBright)}, 0)`;
    const blueColor = `rgb(0, 0, ${Math.max(blueValue, minBright)})`;

    return `<span style='color:white'>${color.substring(0, 1)}</span>` +
           `<span style='color:${redColor}; font-weight: ${redValue > 128 ? 'bold' : 'normal'}'>${redHex}</span>` +
           `<span style='color:${greenColor}; font-weight: ${greenValue > 128 ? 'bold' : 'normal'}'>${greenHex}</span>` +
           `<span style='color:${blueColor}; font-weight: ${blueValue > 128 ? 'bold' : 'normal'}'>${blueHex}</span>`;
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

    elements.totalcount.innerText = `${total} total`;
    elements.rightcount.innerText = `${right} right`;
    elements.wrongcount.innerText = `${wrong} wrong`;
    elements.score.innerText = `${scorePercentage}%`;

    elements.score.classList.remove('success', 'error', 'neutral');

    if (right > wrong) {
        elements.score.classList.add('success');
    } else if (wrong > right) {
        elements.score.classList.add('error');
    } else {
        elements.score.classList.add('neutral');
    }
};

const generateColor = () => {
    // Shuffle positions
    const positions = shuffleArray([0, 1, 2]);
    const correctColor = getColorForQuestion(gameState.totalQuestions);
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

    // Increment total questions for difficulty progression
    gameState.totalQuestions++;

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
