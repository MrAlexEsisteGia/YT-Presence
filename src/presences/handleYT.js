const constants = require("../util/constants.js");
const { yt_client_id } = require("../config.json");
const Entities = require("html-entities").AllHtmlEntities;
const entities = new Entities();

const Config = require("electron-config");
const userSettings = new Config({
  name: 'userSettings'
})

let startTime = new Date(),
  lastTitle

async function updatePresence(data) {
  if(lastTitle != data.currentSongTitle) {
    startTime = new Date()
  }
  if(data.url.includes("/watch?v")) {
    lastTitle = data.currentSongTitle;
    if (
      (data.currentSongAuthor && data.currentSongTitle) != undefined &&
      data.currentSongAuthor != "" &&
      data.currentSongTitle != ""
    ) {
      if(userSettings.get('titleMenubar')) {
        constants.menuBar.tray.setTitle(entities.decode(data.currentSongTitle));
      } else constants.menuBar.tray.setTitle("")
      constants.ytrpc.setActivity({
        details: entities.decode(data.currentSongTitle),
        state: entities.decode(data.currentSongAuthor),
        smallImageKey: "play",
        smallImageText: "Playing back.",
        startTimestamp: startTime,
        largeImageKey: "yt_lg",
        instance: true
      });
    }
  } else {
    constants.menuBar.tray.setTitle(entities.decode(data.currentSongTitle));
      constants.ytrpc.setActivity({
        details: "Searching",
        state: "for a video...",
        largeImageKey: "yt_lg",
        instance: true
      });
  }
}

constants.ytrpc.on("ready", () => {
  constants.presenceReady = true;
});

exports.updatePresence = updatePresence;

constants.ytrpc.login({clientId: yt_client_id}).catch(console.error);
