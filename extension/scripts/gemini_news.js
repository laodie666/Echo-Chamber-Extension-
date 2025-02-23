API_URL_SEARCH = chrome.runtime.getManifest().externally_connectable.matches[2];
API_URL_CURRENT = chrome.runtime.getManifest().externally_connectable.matches[1];
console.log("1");


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
        const response = await fetch(API_URL_CURRENT + "/" + await getUniqueId());
        
        const site = await response.json();
        console.log(site);
        return site;

    } catch (error) {
        console.error("Current Site couldn't be fetched.", error, API_URL + "/" + await getUniqueId());
    }
}

async function getOppposingArticle() {

    try {

        const currentSiteBias = await getCurrentSiteBias();
        const uniqueId = await getUniqueId();

        console.log("current site bias", currentSiteBias);
        let target_bias;
        if(currentSiteBias.bias_numeric < -0.75){
            target_bias = 'right';
        }else if(currentSiteBias.bias_numeric > 0.75){
            target_bias = 'left';
        }else{
            target_bias = 'center';
        }
        

        console.log("current source url and target bias are", currentSiteBias.source_url, target_bias);
        console.log("total url for gemini search ", API_URL_SEARCH + "/" + uniqueId + 
        "user?"+"url="+currentSiteBias.source_url+"&targetBias="+target_bias);
        
        
        const response = await fetch(API_URL_SEARCH + "/" + uniqueId + 
        "user?"+"url="+currentSiteBias.source_url+"&targetBias="+target_bias);    

        const data = await response.json();

        console.log("Alternative articles:", data.articles);
        console.log("returned from gemini", data);
        return data;

    } catch (error) {
        console.error("Gemini News Articles couldn't be fetched.", error);
    }
}
getOppposingArticle();
// function updateResults(articles) {
//     const resultsDiv = document.getElementById('results');
//     resultsDiv.innerHTML = '';  // Clear previous results

//     articles.forEach(url => {
//         const articleLink = document.createElement('a');
//         articleLink.href = url;
//         articleLink.target = '_blank';
//         articleLink.textContent = url;
//         resultsDiv.appendChild(articleLink);
//         resultsDiv.appendChild(document.createElement('br'));
//     });
// }