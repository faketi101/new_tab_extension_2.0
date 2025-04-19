// This script bridges localStorage with Chrome's chrome.storage API
// Include this in your index.html for Chrome version

// Override localStorage methods to sync with chrome.storage
const originalSetItem = localStorage.setItem
localStorage.setItem = function (key, value) {
  // Call the original method
  originalSetItem.call(this, key, value)

  // Sync to chrome.storage
  const item = {}
  item[key] = value
  try {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.set(item)
    } else {
      console.warn("chrome.storage is not available.  Data will not be synced to Chrome storage.")
    }
  } catch (err) {
    console.error("Error syncing to chrome.storage:", err)
  }
}

const originalRemoveItem = localStorage.removeItem
localStorage.removeItem = function (key) {
  // Call the original method
  originalRemoveItem.call(this, key)

  // Remove from chrome.storage
  try {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.remove(key)
    } else {
      console.warn("chrome.storage is not available.  Data will not be removed from Chrome storage.")
    }
  } catch (err) {
    console.error("Error removing from chrome.storage:", err)
  }
}

// Initialize localStorage from chrome.storage on page load
document.addEventListener("DOMContentLoaded", () => {
  try {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get(null, (items) => {
        for (const [key, value] of Object.entries(items)) {
          // Don't trigger our overridden setItem to avoid an infinite loop
          originalSetItem.call(localStorage, key, value)
        }
        console.log("Initialized localStorage from chrome.storage")
      })
    } else {
      console.warn("chrome.storage is not available.  localStorage will not be initialized from Chrome storage.")
    }
  } catch (err) {
    console.error("Error accessing chrome.storage:", err)
  }
})
