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

chrome.action.onClicked.addListener((tab) => {
    chrome.action.setPopup({popup: 'hello.html'});
    chrome.action.openPopup();
    console.log(readData());
});