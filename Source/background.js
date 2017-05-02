chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
	if (changeInfo.status == 'complete') {
		chrome.tabs.executeScript(null, {file: "run.js"});
	}
});

chrome.browserAction.onClicked.addListener( function () {
	chrome.tabs.executeScript(null, {file: "run.js"});
});