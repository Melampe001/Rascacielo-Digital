// Chart instance
let myChart = null;
let chartData = [];

// Color palette
const colors = [
    'rgba(102, 126, 234, 0.8)',
    'rgba(118, 75, 162, 0.8)',
    'rgba(237, 100, 166, 0.8)',
    'rgba(255, 154, 158, 0.8)',
    'rgba(250, 208, 196, 0.8)',
    'rgba(154, 236, 219, 0.8)',
    'rgba(106, 196, 220, 0.8)',
    'rgba(123, 104, 238, 0.8)',
];

// Initialize chart
function initChart() {
    const ctx = document.getElementById('myChart').getContext('2d');
    const chartType = document.getElementById('chartType').value;
    
    if (chartData.length === 0) {
        // Show empty state
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = '20px Segoe UI';
        ctx.fillStyle = '#999';
        ctx.textAlign = 'center';
        ctx.fillText('Agrega datos para ver la gráfica', ctx.canvas.width / 2, ctx.canvas.height / 2);
        return;
    }
    
    const labels = chartData.map(item => item.label);
    const values = chartData.map(item => item.value);
    const percentages = calculatePercentages(values);
    
    if (myChart) {
        myChart.destroy();
    }
    
    myChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors.slice(0, chartData.length),
                borderColor: 'white',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || context.parsed.y || 0;
                            const percentage = percentages[context.dataIndex];
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
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
    initChart();
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
    initChart();
}

// Clear all data
function clearData() {
    if (chartData.length === 0) return;
    
    if (confirm('¿Estás seguro de que quieres eliminar todos los datos?')) {
        chartData = [];
        updateDataList();
        initChart();
    }
}

// Update chart type
function updateChartType() {
    initChart();
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
    initChart();
}

// Handle Enter key
document.addEventListener('DOMContentLoaded', function() {
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
