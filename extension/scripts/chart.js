API_URL = chrome.runtime.getManifest().externally_connectable.matches[0];

async function getUserChartData() {
    
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        let leaningData = {
            "Left": 0,
            "Lean Left": 0,
            "Center": 0,
            "Mixed": 0,
            "Lean Right": 0,
            "Right": 0
        };
        
        // loop through to count the number of news sites that belong to a specific leaning
        for (const site of data) {
            if (leaningData.hasOwnProperty(site.media_bias_rating)) {
                leaningData[site.media_bias_rating] += 1;
                console.log(site.source_name);
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
            labels: Object.keys(leaningData),
            datasets: [{
                label: 'Counts',
                data: Object.values(leaningData), 
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

    // display most frequent bias of sources viewed
    let max = 0;
    let maxKey = "";
    let totalSites = 0;

    for (const key of Object.keys(leaningData)) {
        if (leaningData[key] > max) {
            maxKey = key;
            max = leaningData[key];
            totalSites += leaningData[key];
        }
    }

    document.getElementById("main alignment").innerText = maxKey.toUpperCase();
    document.getElementById("percent").innerText = `${((max/totalSites) * 100).toFixed(0)}% of your sites come from ${maxKey.toLowerCase()} sources.`;
    
}

document.addEventListener("DOMContentLoaded", createChart);