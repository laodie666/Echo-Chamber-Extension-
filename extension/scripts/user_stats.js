API_URL = chrome.runtime.getManifest().externally_connectable.matches[0];

async function getUserStats() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        return data;

    } catch (error) {
        console.error("Current Site couldn't be fetched.", error);
    }
}

async function calculateStats() {
    const data = await getUserStats();

    // calculate the average numeric score of all the sites visited by the user
    // weighted with the number of times the user has visited the outlet 
    totalVisits = 0;
    totalWeightedScores = 0;

    // find unweighted mean for later
    totalSites = 0;
    totalScores = 0;

    for (const site of data) {
        totalVisits += site.visitCount;
        totalWeightedScores += (site.visitCount) * (site.bias_numeric);

        totalSites += 1;
        totalScores += site.bias_numeric;
    }

    const weighted_mean_bias_rating = (totalWeightedScores / totalVisits).toFixed(2);

    // calculate the standard deviation in bias ratings of websites visited
    const mean_bias_rating = (totalScores / totalSites).toFixed(2);

    variations = 0;
    for (const site of data) {
        variations += (site.bias_numeric - mean_bias_rating) ** 2;
    }

    const std_dev = ((variations / totalSites) ** 0.5).toFixed(2);


    document.getElementById("mean").innerText = `Weighted Mean Bias Rating: ${weighted_mean_bias_rating}`;
    document.getElementById("std dev").innerText = `Standard Deviation: ${std_dev}`;

}

document.addEventListener("DOMContentLoaded", calculateStats);
