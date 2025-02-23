API_URL = chrome.runtime.getManifest().externally_connectable.matches[0];

async function getUserChartData() {
    
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        leaningData = [0,0,0,0,0,0];
        // leaningData = {"LEFT": 0, "LEAN LEFT": 0, "CENTER":0, "MIXED":0, "LEAN RIGHT": 0, "RIGHT":0};
        
        // loop through to count the number of news sites that belong to a specific leaning
        for (const site of data) {
            if (site.media_bias_rating == "Left") {
                leaningData[0] += 1;
            } else if (site.media_bias_rating == "Lean Left") {
                leaningData[1] += 1;
            } else if (site.media_bias_rating == "Center") {
                leaningData[2] += 1;
            } else if (site.media_bias_rating == "Mixed") {
                leaningData[3] += 1;
            } else if (site.media_bias_rating == "Lean Right") {
                leaningData[4] += 1;
            } else {
                // "Right"
                leaningData[5] += 1;
            }
        }

        return leaningData;

    } catch (error) {
        console.error("User History couldn't be fetched.", error);
    }
}

async function createChart() {
    const ctx = document.getElementById('myChart').getContext('2d');
    const leaningData = await getUserChartData(); 

    if (leaningData === undefined) return; 

    const myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Left', 'Lean Left', 'Center', 'Mixed', 'Lean Right', 'Right'],
            datasets: [{
                label: 'Counts',
                data: leaningData, 
                backgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        padding: 10,
                    }
                }
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", createChart);