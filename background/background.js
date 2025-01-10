"use strict";

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
