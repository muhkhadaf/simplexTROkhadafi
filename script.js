// script.js
document.getElementById('simplexForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const objective = document.getElementById('objective').value;
    const constraints = document.getElementById('constraints').value;
    const resultTableBody = document.querySelector('#resultTable tbody');
    const finalResultDiv = document.getElementById('finalResult');
    resultTableBody.innerHTML = ''; // Kosongkan tabel sebelum menampilkan hasil
    finalResultDiv.innerHTML = ''; // Kosongkan hasil akhir

    // Proses input dan hitung iterasi Simplex
    const results = simplexMethod(objective, constraints);
    
    // Menampilkan hasil iterasi
    results.iterations.forEach((iteration, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${index + 1}</td><td>${iteration.variable}</td><td>${iteration.value}</td>`;
        resultTableBody.appendChild(row);
    });

    // Tampilkan hasil akhir
    finalResultDiv.innerHTML = `<h2>Nilai Fungsi Tujuan: ${results.finalValue}</h2>`;

    // Menampilkan grafik
    const labels = results.iterations.map((_, index) => `Iterasi ${index + 1}`);
    const dataValues = results.iterations.map(iter => iter.value);

    // Ubah tipe grafik menjadi 'scatter'
    const chart = new Chart(ctx, {
        type: 'scatter', // Tipe grafik diubah menjadi scatter
        data: {
            labels: labels,
            datasets: [{
                label: 'Nilai Variabel',
                data: results.iterations.map((iter, index) => ({ x: index + 1, y: iter.value })), // Format data untuk scatter
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1,
                showLine: false // Nonaktifkan garis untuk scatter plot
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Iterasi'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Nilai'
                    }
                }
            }
        }
    });
});

// Fungsi Simplex
function simplexMethod(objective, constraints) {
    // Parsing fungsi tujuan
    const objectiveCoefficients = parseObjective(objective);
    const constraintEquations = parseConstraints(constraints);
    
    // Inisialisasi variabel
    let iterations = [];
    let finalValue = 0;

    // Simulasi langkah iterasi
    // Contoh nilai untuk setiap iterasi
    const exampleIterations = [
        { variable: 'x1', value: 10 },
        { variable: 'x2', value: 5 },
        { variable: 'x1', value: 8 },
        { variable: 'x2', value: 6 },
        { variable: 'x1', value: 6 },
        { variable: 'x2', value: 7 }
    ];

    // Menghitung iterasi
    for (let i = 0; i < exampleIterations.length; i += 2) {
        iterations.push({
            variable: `x1`,
            value: exampleIterations[i].value
        });
        iterations.push({
            variable: `x2`,
            value: exampleIterations[i + 1].value
        });
    }

    // Menghitung nilai fungsi tujuan
    finalValue = objectiveCoefficients[0] * iterations[iterations.length - 2].value + 
                 objectiveCoefficients[1] * iterations[iterations.length - 1].value;

    return {
        iterations: iterations,
        finalValue: finalValue
    };
}

// Fungsi untuk parsing fungsi tujuan
function parseObjective(objective) {
    const regex = /([+-]?\d*\.?\d*)x(\d)/g;
    let match;
    const coefficients = [];
    while ((match = regex.exec(objective)) !== null) {
        coefficients[match[2] - 1] = parseFloat(match[1]) || 1; // Default ke 1 jika tidak ada angka
    }
    return coefficients;
}

// Fungsi untuk parsing kendala
function parseConstraints(constraints) {
    return constraints.split(';').map(constraint => constraint.trim());
}