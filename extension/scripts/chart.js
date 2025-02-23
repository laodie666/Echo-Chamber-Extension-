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

    const leaningColour = {
        "Left": 'rgba(255, 99, 132, 1)',
        "Lean Left": 'rgba(255, 166, 185, 1)',
        "Center": 'rgba(153, 102, 255, 1)',
        "Mixed": 'rgba(255, 206, 86, 1)',
        "Lean Right": 'rgba(142, 203, 245, 1)',
        "Right": 'rgba(54, 162, 235, 1)'
    };

    if (leaningData === undefined) return; 

    const myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Left', 'Lean Left', 'Center', 'Mixed', 'Lean Right', 'Right'],
            datasets: [{
                label: 'Counts',
                data: [leaningData["Left"], leaningData["Lean Left"], leaningData["Center"], leaningData["Mixed"], leaningData["Lean Right"], leaningData["Right"]], 
                backgroundColor: [
                    leaningColour["Left"],
                    leaningColour["Lean Left"],
                    leaningColour["Center"],
                    leaningColour["Mixed"],
                    leaningColour["Lean Right"],
                    leaningColour["Right"],
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
    document.getElementById("main alignment").style.color = leaningColour[maxKey];
    document.getElementById("percent").innerText = `${((max/totalSites) * 100).toFixed(0)}% of your news sources class as ${maxKey.toLowerCase()}-biased.`;
    
}

document.addEventListener("DOMContentLoaded", createChart);