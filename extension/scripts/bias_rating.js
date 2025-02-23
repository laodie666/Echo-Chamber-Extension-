API_URL = chrome.runtime.getManifest().externally_connectable.matches[1];

async function getCurrentSiteBias() {
    try {
        const response = await fetch(API_URL);
        const site = await response.json();

        return site;

    } catch (error) {
        console.error("Current Site couldn't be fetched.", error);
    }
}

async function renderSiteData() {
    const curr = await getCurrentSiteBias();

    document.getElementById("site").innerText = curr.source_name;

}

document.addEventListener("DOMContentLoaded", renderSiteData);
