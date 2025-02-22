import express from 'express'; // Importing express
const app = express();
const PORT = 3000;

async function readData() {
    try {
        const data = await fetch('https://echo-chamber-extension.onrender.com/').then((response) => response.json());
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

chrome.action.onClicked.addListener(async (tab) => {
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
            for (const news of allside_data) {
                const historyHostname = new URL(history.url).hostname;
                if (news.publication.source_url == "") {
                    continue;
                }
                const newsHostname = new URL(news.publication.source_url).hostname;

                if (newsHostname == historyHostname) {
                    const aug_news = news;
                    // REMINDER EVERYTHING SITS IN .publicatoin OTHER THAN visitCount
                    aug_news.visitCount = history.visitCount;
                    recent_news.push(aug_news);
                }
            }
        }
        console.log(recent_news);

        // This is the worst coding practice I have done omg its joever. I am so sorry for this

        app.get('/', async (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(recent_news));
        });

        chrome.action.setPopup({popup: 'hello.html'});
        chrome.action.openPopup();
     

    });
});

// chrome.action.onClicked.addListener((tab) => {
//     chrome.action.setPopup({popup: 'hello.html'});
//     chrome.action.openPopup();

// });
