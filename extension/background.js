// recent_history = [];
// import {readFile} from "fs";

async function readData() {
    try {
        const data = await fetch('https://echo-chamber-extension.onrender.com/').then((response) => response.json());
        return data;
    } catch (err) {
        console.error(err);
        return null;
    }
}


chrome.runtime.onStartup.addListener(() =>{
    console.log('Extension started GOD BLESSED');


});

chrome.runtime.onInstalled.addListener(() =>{
    console.log('Extension installed GOD BLESSED');


});

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     console.log('Tab updated GOD BLESSED');
// });

// chrome.action.onClicked.addListener((tab) => {
//     const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
//     chrome.history.search({text: '', startTime: oneMonthAgo}, (data) => {
//         recent_history = data;
//         console.log(recent_history);
//         console.log(readData());
        
//     });

// });

chrome.action.onClicked.addListener((tab) => {
    chrome.action.setPopup({popup: 'hello.html'});
    chrome.action.openPopup();
    console.log(readData());
});