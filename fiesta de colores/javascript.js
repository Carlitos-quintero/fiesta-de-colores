const initialColors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD", "#D4A5A5", "#9B59B6", "#3498DB"];
    const customColors = [];
    const colorVotes = {};
    let mostPopularColor = "";
    let timer = 10;
    let timerInterval;
    let inactivityTimeout;

    const colorButtonsContainer = document.getElementById("color-buttons");
    const canvas = document.getElementById("canvas");
    const timerDisplay = document.getElementById("timer");
    const title = document.getElementById("title");
    const popularColorDisplay = document.getElementById("popular-color");
    const colorPicker = document.getElementById("color-picker");
    const addColorButton = document.getElementById("add-color");
    const resetButton = document.getElementById("reset");

    let selectedColor = initialColors[0];

    function renderColorButtons() {
    colorButtonsContainer.innerHTML = "";
    [...initialColors, ...customColors].forEach(color => {
        const button = document.createElement("button");
        button.className = "color-button";
        button.style.backgroundColor = color;
        button.addEventListener("click", () => selectColor(color));
        colorButtonsContainer.appendChild(button);
    });
    }

    function selectColor(color) {
    selectedColor = color;
    title.style.color = color;
    updateVotes(color);
    resetInactivityTimer();
    }

    function updateVotes(color) {
    colorVotes[color] = (colorVotes[color] || 0) + 1;
    const sortedVotes = Object.entries(colorVotes).sort((a, b) => b[1] - a[1]);
    mostPopularColor = sortedVotes[0][0];
    renderPopularColor();
    }

    function renderPopularColor() {
    popularColorDisplay.innerHTML = `
        <div>Más Popular: <span style="background: ${mostPopularColor}; width: 16px; height: 16px; display: inline-block; border-radius: 50%;"></span> (${colorVotes[mostPopularColor]} votos)</div>
    `;
    }

    function resetAll() {
    customColors.length = 0;
    Object.keys(colorVotes).forEach(key => delete colorVotes[key]);
    selectedColor = initialColors[0];
    mostPopularColor = "";
    timer = 10;
    title.style.color = selectedColor;
    renderColorButtons();
    renderPopularColor();
    canvas.innerHTML = "";
    }

    function resetInactivityTimer() {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(resetAll, 10000);
    }

    function handleCanvasClick(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dot = document.createElement("div");
    dot.className = "dot";
    dot.style.backgroundColor = selectedColor;
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    canvas.appendChild(dot);
    resetInactivityTimer();
    }

    function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timer--;
        timerDisplay.textContent = `${timer}s`;
        if (timer <= 0) {
        clearInterval(timerInterval);
        resetAll();
        }
    }, 1000);
    }

    addColorButton.addEventListener("click", () => {
    const newColor = colorPicker.value;
    if (!customColors.includes(newColor)) {
        customColors.push(newColor);
        renderColorButtons();
    }
    });

    resetButton.addEventListener("click", resetAll);
    canvas.addEventListener("click", handleCanvasClick);

    renderColorButtons();
    startTimer();