// Chart canvas reference
let canvas = null;
let ctx = null;
let chartData = [];

// Color palette
const colors = [
    '#667eea',
    '#764ba2',
    '#ed64a6',
    '#ff9a9e',
    '#fad0c4',
    '#9aecdb',
    '#6ac4dc',
    '#7b68ee',
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    canvas = document.getElementById('myChart');
    ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 400;
    canvas.height = 400;
    
    const inputs = document.querySelectorAll('#labelInput, #valueInput');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addData();
            }
        });
    });
    
    // Initialize with sample data
    addSampleData();
});

// Draw pie chart
function drawPieChart() {
    const chartType = document.getElementById('chartType').value;
    
    if (chartData.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '16px Segoe UI';
        ctx.fillStyle = '#999';
        ctx.textAlign = 'center';
        ctx.fillText('Agrega datos para ver la gráfica', canvas.width / 2, canvas.height / 2);
        return;
    }
    
    if (chartType === 'pie' || chartType === 'doughnut') {
        drawCircularChart(chartType === 'doughnut');
    } else {
        drawBarChart();
    }
}

// Draw circular chart (pie or doughnut)
function drawCircularChart(isDoughnut) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const values = chartData.map(item => item.value);
    const total = values.reduce((sum, val) => sum + val, 0);
    const percentages = values.map(val => (val / total) * 100);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 60;
    
    let currentAngle = -Math.PI / 2; // Start from top
    
    // Draw slices
    chartData.forEach((item, index) => {
        const sliceAngle = (values[index] / total) * 2 * Math.PI;
        
        // Draw slice
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw percentage text
        const midAngle = currentAngle + sliceAngle / 2;
        const textX = centerX + (radius * 0.6) * Math.cos(midAngle);
        const textY = centerY + (radius * 0.6) * Math.sin(midAngle);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px Segoe UI';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(percentages[index].toFixed(1) + '%', textX, textY);
        
        currentAngle += sliceAngle;
    });
    
    // Draw doughnut hole
    if (isDoughnut) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
    }
    
    // Draw legend
    drawLegend();
}

// Draw bar chart
function drawBarChart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const values = chartData.map(item => item.value);
    const total = values.reduce((sum, val) => sum + val, 0);
    const percentages = values.map(val => (val / total) * 100);
    
    const barWidth = canvas.width / (chartData.length * 2);
    const maxHeight = canvas.height - 100;
    const barSpacing = barWidth;
    
    chartData.forEach((item, index) => {
        const barHeight = (percentages[index] / 100) * maxHeight;
        const x = (index * 2 * barWidth) + barWidth / 2 + 20;
        const y = canvas.height - barHeight - 30;
        
        // Draw bar
        ctx.fillStyle = colors[index % colors.length];
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Draw percentage text
        ctx.fillStyle = '#333';
        ctx.font = 'bold 12px Segoe UI';
        ctx.textAlign = 'center';
        ctx.fillText(percentages[index].toFixed(1) + '%', x + barWidth / 2, y - 5);
        
        // Draw label
        ctx.save();
        ctx.translate(x + barWidth / 2, canvas.height - 10);
        ctx.rotate(-Math.PI / 4);
        ctx.font = '10px Segoe UI';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'right';
        ctx.fillText(item.label, 0, 0);
        ctx.restore();
    });
}

// Draw legend
function drawLegend() {
    const legendY = canvas.height - 40;
    const itemWidth = canvas.width / chartData.length;
    
    chartData.forEach((item, index) => {
        const x = index * itemWidth + 10;
        
        // Draw color box
        ctx.fillStyle = colors[index % colors.length];
        ctx.fillRect(x, legendY, 15, 15);
        
        // Draw label
        ctx.fillStyle = '#333';
        ctx.font = '10px Segoe UI';
        ctx.textAlign = 'left';
        ctx.fillText(item.label.substring(0, 10), x + 20, legendY + 12);
    });
}

// Calculate percentages
function calculatePercentages(values) {
    const total = values.reduce((sum, val) => sum + val, 0);
    return values.map(val => ((val / total) * 100).toFixed(1));
}

// Add data
function addData() {
    const labelInput = document.getElementById('labelInput');
    const valueInput = document.getElementById('valueInput');
    
    const label = labelInput.value.trim();
    const value = parseFloat(valueInput.value);
    
    if (!label || isNaN(value) || value <= 0) {
        alert('Por favor, ingresa una etiqueta válida y un valor mayor a 0');
        return;
    }
    
    chartData.push({ label, value });
    
    // Clear inputs
    labelInput.value = '';
    valueInput.value = '';
    labelInput.focus();
    
    updateDataList();
    drawPieChart();
}

// Update data list
function updateDataList() {
    const dataItems = document.getElementById('dataItems');
    const values = chartData.map(item => item.value);
    const percentages = calculatePercentages(values);
    
    dataItems.innerHTML = '';
    
    chartData.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="label">${item.label}</span>
            <span class="value">${item.value}</span>
            <span class="percentage">${percentages[index]}%</span>
            <button class="delete-btn" onclick="deleteData(${index})">×</button>
        `;
        dataItems.appendChild(li);
    });
}

// Delete data
function deleteData(index) {
    chartData.splice(index, 1);
    updateDataList();
    drawPieChart();
}

// Clear all data
function clearData() {
    if (chartData.length === 0) return;
    
    if (confirm('¿Estás seguro de que quieres eliminar todos los datos?')) {
        chartData = [];
        updateDataList();
        drawPieChart();
    }
}

// Update chart type
function updateChartType() {
    drawPieChart();
}

// Add sample data on load
function addSampleData() {
    chartData = [
        { label: 'Ventas', value: 35 },
        { label: 'Marketing', value: 25 },
        { label: 'Operaciones', value: 20 },
        { label: 'Desarrollo', value: 20 }
    ];
    updateDataList();
    drawPieChart();
}
