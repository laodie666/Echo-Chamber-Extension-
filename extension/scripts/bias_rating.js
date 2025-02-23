API_URL = chrome.runtime.getManifest().externally_connectable.matches[1];


async function getUniqueId(){
    return new Promise((resolve, reject) => {
        chrome.storage.local.get("userId", (data) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                console.log("User ID retrieved on startup:", data.userId);
                resolve(data.userId);
            }
        });
    });

    
}
async function getCurrentSiteBias() {
    try {
        console.log(await getUniqueId());
        const response = await fetch(API_URL + "/" + await getUniqueId());
        
        const site = await response.json();
        console.log(site);
        return site;

    } catch (error) {
        console.error("Current Site couldn't be fetched.", error, API_URL + "/" + await getUniqueId());
    }
}

async function renderSiteData() {
    console.log("rendering site data")
    const curr = await getCurrentSiteBias();

    const leaningColour = {
        "Left": 'rgba(255, 99, 132, 1)',
        "Lean Left": 'rgba(255, 166, 185, 1)',
        "Center": 'rgba(153, 102, 255, 1)',
        "Mixed": 'rgba(255, 206, 86, 1)',
        "Lean Right": 'rgba(142, 203, 245, 1)',
        "Right": 'rgba(54, 162, 235, 1)'
    };

    document.getElementById("site").innerText = curr.source_name;
    document.getElementById("bias").innerText = (curr.media_bias_rating).toUpperCase();
    document.getElementById("bias").style.color = leaningColour[curr.media_bias_rating];
    document.getElementById("freq").innerText = `You've visited this site ${curr.visitCount} time(s) in the last 30 days.`;

}
renderSiteData();