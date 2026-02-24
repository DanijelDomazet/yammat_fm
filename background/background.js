"use strict";

// Offscreen documents can't reliably access UI APIs like chrome.action,
// so they ask the service worker to update the toolbar icon.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message && message.action === "set_icon") {
        const playing = message.state === "playing";

        // chrome.action.setIcon expects resource paths relative to the extension root.
        // Use absolute-extension paths to avoid "Failed to fetch" in some contexts.
        const path = playing ? {
            16: chrome.runtime.getURL("img/icons/ym16x16_play.png"),
            32: chrome.runtime.getURL("img/icons/ym32x32_play.png"),
            58: chrome.runtime.getURL("img/icons/ym58x58_play.png"),
            120: chrome.runtime.getURL("img/icons/ym120x120_play.png"),
        } : {
            16: chrome.runtime.getURL("img/icons/ym16x16.png"),
            32: chrome.runtime.getURL("img/icons/ym32x32.png"),
            58: chrome.runtime.getURL("img/icons/ym58x58.png"),
            120: chrome.runtime.getURL("img/icons/ym120x120.png"),
        };

        // Don't block; this is purely cosmetic.
        chrome.action.setIcon({ path }).catch((err) => {
            console.warn("setIcon failed:", err);
        });
    }
});

 (async function initialize() {
     try {
         await createOffscreen();
     } catch (error) {
         console.error("Error creating offscreen document:", error);
     }
 })();

 async function playSound() {
     try {
         await createOffscreen();
         await chrome.runtime.sendMessage({ play: { source } });
     } catch (error) {
         console.error("Error playing sound:", error);
     }
 }

 async function createOffscreen() {
     try {
         const hasDocument = await chrome.offscreen.hasDocument();
         if (!hasDocument) {
             await chrome.offscreen.createDocument({
                 url: '../offscreen/offscreen.html',
                 reasons: ['AUDIO_PLAYBACK'],
                 justification: 'Background audio playback'
             });
         }
     } catch (error) {
         console.error("Error in createOffscreen:", error);
     }
 }
