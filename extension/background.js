const backendUrl = 'https://echo-chamber-extension.onrender.com/';

// const backendUrl = 'http://localhost:3000/';
let uniqueid;


async function readData() {
    try {
        const data = await fetch(backendUrl).then((response) => response.json());
        console.log('Data fetched GOD BLESSED');
        console.log('Fetched data:', data); // Log the entire data object
        return data;
    } catch (err) {
        console.error(err);
        return null;
    }
}

async function getCurrentTab() {
    return (await chrome.tabs.query({
        active: true,
        currentWindow: true,
    }))[0];
}

chrome.runtime.onStartup.addListener(() => {
    console.log('Extension started GOD BLESSED');
    chrome.storage.local.get("userId", (data) => {

        if (data.userId === undefined) {
            const uniqueId = crypto.randomUUID(); // Generates a unique identifier
            uniqueid = uniqueId;
            chrome.storage.local.set({ userId: uniqueId });
            console.log("Generated new user ID:", uniqueId);
        } else {
            uniqueid = data.userId; // Ensure uniqueid is set correctly
            console.log("User ID exists:", data.userId);
        }
    });
});

chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed GOD BLESSED');
    chrome.storage.local.get("userId", (data) => {

        if (data.userId === undefined) {
            const uniqueId = crypto.randomUUID(); // Generates a unique identifier
            uniqueid = uniqueId;
            chrome.storage.local.set({ userId: uniqueId });
            console.log("Generated new user ID:", uniqueId);
        } else {
            uniqueid = data.userId; // Ensure uniqueid is set correctly
            console.log("User ID exists:", data.userId);
        }
    });
});

function do_stuff(){
    
    console.log('Do stuff triggered GOD BLESSED');
    const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    chrome.history.search({ text: '', startTime: oneMonthAgo }, async (data) => {
        // SLEEP DEPRIVATION IS BAD FOR WRITING CODE NEED TO REFRACTOR if we got time lmao
        // just do smt like async function getHistory(){return await chrome.history.search({ text: '', startTime: oneMonthAgo });}
        
        const all_history = data;
        console.log(all_history);

        const recent_history = [];
        const historyMap = new Map();
        for (const history of all_history) {
            const temp_historyHostname = new URL(history.url).hostname;
            if (!historyMap.has(temp_historyHostname)) {

                history.title = temp_historyHostname;
                history.url = "https://" + temp_historyHostname;
                historyMap.set(temp_historyHostname, history);
                
            }else{
                historyMap.get(temp_historyHostname).lastVisitTime = Math.max(history.lastVisitTime, historyMap.get(temp_historyHostname).lastVisitTime);
                historyMap.get(temp_historyHostname).visitCount += history.visitCount;
            }
        }
        for (const key of historyMap.keys()) {
            recent_history.push(historyMap.get(key));
        }
        
        console.log(recent_history);

        const allside_promise = await readData();
        const allside_data = allside_promise['allsides_media_bias_ratings'];

        const recent_news = [];
        for (const history of recent_history) {
            for (let news of allside_data) {
                news = news.publication; 
                const historyHostname = new URL(history.url).hostname;
                if (news.source_url == "") {
                    continue;
                }
                const newsHostname = new URL(news.source_url).hostname;
                if (newsHostname == historyHostname) {
                    
                    const aug_news = news;
                    aug_news.visitCount = history.visitCount;
                    aug_news.bias_numeric = 0;

                    if (news.media_bias_rating == "Left") {
                        aug_news.bias_numeric = -2;
                    }else if (news.media_bias_rating == "Lean Left") {
                        aug_news.bias_numeric = -1;
                    }
                    else if (news.media_bias_rating == "Center") {
                        aug_news.bias_numeric = 0;
                    }
                    else if(news.media_bias_rating == "Mixed") {
                        aug_news.bias_numeric = 0;
                    }
                    else if (news.media_bias_rating == "Lean Right") {
                        aug_news.bias_numeric = 1;
                    }
                    else if(news.media_bias_rating == "Right") {
                        aug_news.bias_numeric = 2;
                    }

                    recent_news.push(aug_news);
                }
            }
        }
        console.log(recent_news);



        const updateBackEnd = async (data) => {
            try {
                const response = await fetch(backendUrl + "update", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)});
                
                if (!response.ok) {
                    const responseText = await response.text();
                    console.error(`Error updating data: ${response.status} ${response.statusText}`);
                    console.error("Response text:", responseText);
                    return;
                }
        
                const result = await response.json();
                console.log("Response from backend:", result);
            } catch (error) {
                console.error("Error updating data:", error);
            }
        }
        updateBackEnd(recent_news);
        
        
        const currentTab = await getCurrentTab();
        const currentTabUrl = new URL(currentTab.url);
        console.log(currentTabUrl);

        let bestMatch = null;
        let bestMatchScore = -1;
        let bestMatchLength = Infinity;

        for (const news of recent_news) {
            const newsUrl = new URL(news.source_url);
            if (currentTabUrl.hostname === newsUrl.hostname) {
                const score = getMatchScore(currentTabUrl.pathname, newsUrl.pathname);
                if (score > bestMatchScore || (score === bestMatchScore && newsUrl.pathname.length < bestMatchLength)) {
                    bestMatch = news;
                    bestMatchScore = score;
                    bestMatchLength = newsUrl.pathname.length;
                }
            }
        }

        if (bestMatch) {
            const updateCurrent = async (data) => {
                try {
                    console.log("id being updated: " + uniqueid);
                    console.log(backendUrl + "update_curr/" + uniqueid);
                    const response = await fetch(backendUrl + "update_curr/" + uniqueid, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data)});
                        
                        if (!response.ok) {
                            const responseText = await response.text();
                            console.error(`Error updating data: ${response.status} ${response.statusText}`);
                            console.error("Response text:", responseText);
                            return;
                        }
                
                        const result = await response.json();
                        console.log("Response from backend:", result);
                    } catch (error) {
                        console.error("Error updating data:", error);
                    }
                }
                console.log("Updating current with best match:", bestMatch.source_url);
                updateCurrent(bestMatch);
            }
        console.log("comparison done");
        

    });
}

function getMatchScore(path1, path2) {
    const segments1 = path1.split('/');
    const segments2 = path2.split('/');
    let score = 0;
    for (let i = 0; i < Math.min(segments1.length, segments2.length); i++) {
        if (segments1[i] === segments2[i]) {
            score += 1;
        } else {
            break;
        }
    }
    score = score - Math.abs(segments1.length - segments2.length);
    return score;
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
 do_stuff();
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    do_stuff();
});

chrome.tabs.onHighlighted.addListener((activeInfo) => {
    do_stuff();
});
  
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("10");
    if (message.action === "getCurrentUrl") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentUrl = tabs[0].url;
        sendResponse({ url: currentUrl });
        });
        return true;  // Keeps the message channel open for async response
    }
});