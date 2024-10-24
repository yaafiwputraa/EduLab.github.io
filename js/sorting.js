const sortingCanvas = document.getElementById('sortingCanvas');
const sortCtx = sortingCanvas.getContext('2d');
const sortBtn = document.getElementById('sortBtn');
const speedSlider = document.getElementById('speed');
const algorithmSelect = document.getElementById('algorithm');
const arraySizeSlider = document.getElementById('arraySize');
const randomizeArrayBtn = document.getElementById('randomizeArrayBtn');
const resetBtn = document.getElementById('resetBtn');

let array = [];
let sortingSpeed = 50;
let arraySize = arraySizeSlider.value;
let sortedIndices = new Set(); // Using Set to track sorted indices
let isSorting = false;

// Set canvas resolution for crisp rendering
function setupCanvas() {
    const displayWidth = sortingCanvas.clientWidth;
    const displayHeight = sortingCanvas.clientHeight;
    const scale = window.devicePixelRatio;
    sortingCanvas.width = Math.floor(displayWidth * scale);
    sortingCanvas.height = Math.floor(displayHeight * scale);
    sortCtx.scale(scale, scale);
    sortingCanvas.style.width = displayWidth + 'px';
    sortingCanvas.style.height = displayHeight + 'px';
}

// Generate random array
function generateArray(size = 10) {
    array = [];
    sortedIndices.clear();
    isSorting = false;
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 50) + 1);
    }
    drawArray();
}

// Draw array with updated styling
function drawArray(highlightIndices = []) {
    setupCanvas();
    sortCtx.clearRect(0, 0, sortingCanvas.clientWidth, sortingCanvas.clientHeight);
    
    const margin = 50;
    const availableWidth = sortingCanvas.clientWidth - (2 * margin);
    const availableHeight = sortingCanvas.clientHeight - (2 * margin);
    const barWidth = Math.min((availableWidth / array.length) * 0.8, 60);
    const spacing = (availableWidth - (barWidth * array.length)) / (array.length + 1);

    array.forEach((value, index) => {
        const barHeight = (value / Math.max(...array)) * availableHeight * 0.8;
        const barX = margin + spacing + index * (barWidth + spacing);
        const barY = sortingCanvas.clientHeight - margin - barHeight;

        // Determine bar color
        if (highlightIndices.includes(index)) {
            sortCtx.fillStyle = '#22c55e'; // Green for comparing
        } else if (sortedIndices.has(index)) {
            sortCtx.fillStyle = '#f97316'; // Orange for sorted elements
        } else {
            sortCtx.fillStyle = '#93c5fd'; // Light blue for unsorted
        }

        const gradient = sortCtx.createLinearGradient(barX, barY, barX, barY + barHeight);
        gradient.addColorStop(0, sortCtx.fillStyle);
        gradient.addColorStop(1, adjustColor(sortCtx.fillStyle, -20));
        sortCtx.fillStyle = gradient;

        sortCtx.beginPath();
        sortCtx.roundRect(barX, barY, barWidth, barHeight, 4);
        sortCtx.fill();

        sortCtx.fillStyle = '#1e293b';
        sortCtx.font = 'bold 14px Inter, -apple-system, BlinkMacSystemFont, sans-serif';
        sortCtx.textAlign = 'center';
        sortCtx.textBaseline = 'top';
        sortCtx.fillText(value, barX + barWidth/2, barY + barHeight + 5);

        sortCtx.fillStyle = '#64748b';
        sortCtx.font = '12px Inter, -apple-system, BlinkMacSystemFont, sans-serif';
        sortCtx.fillText(index, barX + barWidth/2, sortingCanvas.clientHeight - margin + 20);
    });
}

// Helper function to adjust color brightness
function adjustColor(color, amount) {
    const hex = color.replace('#', '');
    const num = parseInt(hex, 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Improved swap animation with smooth transition
async function animateSwap(index1, index2) {
    const frames = 30;
    const margin = 50;
    const availableWidth = sortingCanvas.clientWidth - (2 * margin);
    const barWidth = Math.min((availableWidth / array.length) * 0.8, 60);
    const spacing = (availableWidth - (barWidth * array.length)) / (array.length + 1);
    
    const x1 = margin + spacing + index1 * (barWidth + spacing);
    const x2 = margin + spacing + index2 * (barWidth + spacing);
    
    const value1 = array[index1];
    const value2 = array[index2];

    for (let frame = 0; frame <= frames; frame++) {
        const progress = frame / frames;
        
        setupCanvas();
        sortCtx.clearRect(0, 0, sortingCanvas.clientWidth, sortingCanvas.clientHeight);
        
        // Draw all bars except the swapping ones
        for (let i = 0; i < array.length; i++) {
            if (i !== index1 && i !== index2) {
                const value = array[i];
                const barHeight = (value / Math.max(...array)) * (sortingCanvas.clientHeight - 2 * margin) * 0.8;
                const barX = margin + spacing + i * (barWidth + spacing);
                const barY = sortingCanvas.clientHeight - margin - barHeight;
                
                if (sortedIndices.has(i)) {
                    sortCtx.fillStyle = '#f97316'; // Orange for sorted
                } else {
                    sortCtx.fillStyle = '#93c5fd'; // Light blue for unsorted
                }
                
                sortCtx.beginPath();
                sortCtx.roundRect(barX, barY, barWidth, barHeight, 4);
                sortCtx.fill();
                
                // Draw values and indices
                sortCtx.fillStyle = '#1e293b';
                sortCtx.font = 'bold 14px Inter, -apple-system, BlinkMacSystemFont, sans-serif';
                sortCtx.textAlign = 'center';
                sortCtx.fillText(value, barX + barWidth/2, barY + barHeight + 5);
                
                sortCtx.fillStyle = '#64748b';
                sortCtx.font = '12px Inter, -apple-system, BlinkMacSystemFont, sans-serif';
                sortCtx.fillText(i, barX + barWidth/2, sortingCanvas.clientHeight - margin + 20);
            }
        }
        
        // Draw the swapping bars with interpolated positions
        const drawMovingBar = (value, startX, endX, index) => {
            const currentX = startX + (endX - startX) * progress;
            const barHeight = (value / Math.max(...array)) * (sortingCanvas.clientHeight - 2 * margin) * 0.8;
            const barY = sortingCanvas.clientHeight - margin - barHeight;
            
            sortCtx.fillStyle = '#22c55e'; // Green for comparing
            sortCtx.beginPath();
            sortCtx.roundRect(currentX, barY, barWidth, barHeight, 4);
            sortCtx.fill();
            
            // Draw values and indices
            sortCtx.fillStyle = '#1e293b';
            sortCtx.font = 'bold 14px Inter, -apple-system, BlinkMacSystemFont, sans-serif';
            sortCtx.textAlign = 'center';
            sortCtx.fillText(value, currentX + barWidth/2, barY + barHeight + 5);
            
            sortCtx.fillStyle = '#64748b';
            sortCtx.font = '12px Inter, -apple-system, BlinkMacSystemFont, sans-serif';
            sortCtx.fillText(index, currentX + barWidth/2, sortingCanvas.clientHeight - margin + 20);
        };
        
        drawMovingBar(value1, x1, x2, index1);
        drawMovingBar(value2, x2, x1, index2);
        
        await new Promise(resolve => setTimeout(resolve, 1000 / 60));
    }
    
    [array[index1], array[index2]] = [array[index2], array[index1]];
}

// Bubble Sort implementation
async function bubbleSort() {
    isSorting = true;
    sortedIndices.clear();
    const len = array.length;

    for (let i = 0; i < len - 1; i++) {
        let swapped = false;
        for (let j = 0; j < len - i - 1; j++) {
            drawArray([j, j + 1]);
            await new Promise(resolve => setTimeout(resolve, 100));

            if (array[j] > array[j + 1]) {
                await animateSwap(j, j + 1);
                swapped = true;
            }
        }
        sortedIndices.add(len - 1 - i);  // Menambahkan indeks terakhir yang diurutkan
        if (!swapped) break;
    }

    // Menandai semua elemen sebagai terurut setelah algoritma selesai
    for (let i = 0; i < len; i++) {
        sortedIndices.add(i);
    }

    drawArray([]);  // Menggambar ulang dengan semua batang berwarna oranye
    isSorting = false;
}


// Event listeners
window.addEventListener('resize', () => {
    setupCanvas();
    drawArray();
});

sortBtn.addEventListener('click', () => {
    if (!isSorting) {
        sortingSpeed = speedSlider.value;
        if (algorithmSelect.value === 'bubble') {
            bubbleSort();
        }
    }
});

randomizeArrayBtn.addEventListener('click', () => {
    generateArray(arraySize);
});

resetBtn.addEventListener('click', () => {
    generateArray(arraySize);
});

arraySizeSlider.addEventListener('input', () => {
    arraySize = arraySizeSlider.value;
    generateArray(arraySize);
});

// Initial setup
setupCanvas();
generateArray(arraySize);