// Chrome background script
console.log("Chrome New Tab Extension background script running")

// Listen for extension installation or update
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed or updated")
})
