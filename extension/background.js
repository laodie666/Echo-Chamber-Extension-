const backendUrl = 'https://echo-chamber-extension.onrender.com/';

// const backendUrl = 'http://localhost:3000/';


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



chrome.runtime.onStartup.addListener(() => {
    console.log('Extension started GOD BLESSED');
    
});

chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed GOD BLESSED');
});

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     console.log('Tab updated GOD BLESSED');
// });

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
                    body: JSON.stringify(recent_news)});
                
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
        
        

    });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
 do_stuff();
});
chrome.tabs.onActivated.addListener((activeInfo) => {
    do_stuff();
});