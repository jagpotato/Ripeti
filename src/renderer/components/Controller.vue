<template>
  <div id="footer" @mouseenter="toggleControllerOpacity" @mouseleave="toggleControllerOpacity" :style="{opacity: controllerOpacity}">
    <div id="controller">
      <div id="time">
        <span>{{currentTimeText}}</span>
        <input id="seek-bar" type="range" v-model="currentVideoTime" min="0" :max="videoDuration" :disabled="isSeekbarDisabled" :style="{backgroundImage: seekBarBackground}">
        <span>{{durationText}}</span>
      </div>
      <div id="control-item">
        <div id="control-item-left">
          <transition name="play-button" mode="out-in">
            <button key="pause" id="pause-button" @click="pauseVideo" v-if="isPlaying"><i class="mdi mdi-pause mdi-light mdi-24px"></i></button>
            <button key="play" id="play-button" @click="playVideo" v-else :disabled="isPlayButtonDisabled"><i class="mdi mdi-play mdi-light mdi-24px"></i></button>
          </transition>
          <div id="volume">
            <button id="mute-button" @click="toggleMute">
              <i class="mdi mdi-volume-off mdi-light mdi-24px" v-if="isMute"></i>
              <i class="mdi mdi-volume-high mdi-light mdi-24px" v-else></i>
            </button>
            <input id="volume-bar" type="range" v-model="currentVolume" min="0" max="100" :style="{backgroundImage: volumeBarBackground}">
          </div>
        </div>
        <div id="control-item-right">
          <div id="chapter">
            <button id="chapter-add-button" @click="addChapter" :disabled="isChapterButtonDisabled"><i id="chapter-add-icon" class="mdi mdi-library-plus mdi-light mdi-24px"></i></button>
            <button id="chapter-list-button" @click="openChapterList"><i id="chapter-list-icon" class="mdi mdi-menu-up mdi-light mdi-24px"></i></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'

export default {
  name: 'controller',
  methods: {
    addChapter () {
      this.$store.dispatch('Controller/addChapter', {
        currentTime: this.currentVideoTime,
        currentTimeText: this.currentTimeText
      })
    },
    toggleControllerOpacity (event) {
      this.$store.dispatch('Player/toggleControllerOpacity', {
        event: event
      })
    },
    ...mapActions('Controller', [
      'playVideo',
      'pauseVideo',
      'toggleMute',
      'openChapterList'
    ])
  },
  computed: {
    currentVideoTime: {
      get () {
        return this.$store.state.Player.currentVideoTime
      },
      set (value) {
        this.$store.dispatch('Controller/moveSeekBar', {
          value: value
        })
      }
    },
    currentVolume: {
      get () {
        return this.$store.state.Player.currentVolume
      },
      set (value) {
        this.$store.dispatch('Controller/moveVolumeBar', {
          value: value
        })
      }
    },
    ...mapState('Player', [
      'videoDuration',
      'isPlaying',
      'isMute',
      'controllerOpacity',
      'seekBarBackground',
      'volumeBarBackground'
    ]),
    ...mapState('Controller', [
      'isPlayButtonDisabled',
      'isSeekbarDisabled',
      'isChapterButtonDisabled'
    ]),
    ...mapGetters('Player', [
      'currentTimeText',
      'durationText'
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#footer {
  /* background-color: rgba(0, 0, 255, 0.5); */
  width: 100vw;
  height: 40%;
  max-height: 90px;
  display: flex;
  justify-content: center;
  -webkit-app-region: no-drag;
}
#controller {
  /* background-color: rgba(255, 0, 255, 0.5); */
  background-color: rgba(30, 30, 30, 0.8);
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  width: 90vw;
  margin-bottom: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
#time {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
#time > span {
  margin-left: auto;
  margin-right: auto;
  color: rgba(255, 255, 255, 1.0);
}
#seek-bar {
  width: 80%;
}
#control-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
#control-item-left {
  display: flex;
  width: 200px;
  justify-content: space-around;
}
#play-button, #pause-button {
  cursor: pointer;
  background-color: transparent;
  outline: none;
  border: none;
  padding: 0;
  width: 30px;
  height: 30px;
}
.play-button-enter-active, .play-button-leave-active {
  transition: opacity 0.1s;
}
.play-button-enter, .play-button-leave-to {
  opacity: 0.5;
}
#volume {
  display: flex;
  align-items: center;
}
#mute-button {
  cursor: pointer;
  background-color: transparent;
  border: none;
  outline: none;
  display: flex;
  align-items: center;
}
#volume-bar {
  display: flex;
  align-items: center;
  width: 70px;
}
#control-item-right {
  display: flex;
  width: 70px;
  justify-content: space-around;
}
#chapter {
  display: flex;
  padding: 0;
}
#chapter > button {
  padding: 0;
}
#chapter-add-button, #chapter-list-button {
  cursor: pointer;
  background-color: transparent;
  border: none;
  outline: none;
  display: flex;
  align-items: center;
}
#seek-bar {
  outline: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  border-radius: 50px;
  height: 6px;
  margin-top: auto;
  margin-bottom: auto;
  background-image: -webkit-gradient(linear, left top, right top, color-stop(0.01, #f44336), color-stop(0.01, #707070));
}
#seek-bar::-webkit-slider-thumb {
  -webkit-appearance: none;
  -moz-appearance: none;
  background-color: #f44336;
  width: 14px;
  height: 14px;
  border-radius: 50%;
}
#volume-bar {
  outline: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  border-radius: 50px;
  height: 6px;
  /* background-image: -webkit-gradient(linear, left top, right top, color-stop(0.01, #ffffff), color-stop(0.01, #707070)); */
}
#volume-bar::-webkit-slider-thumb {
  -webkit-appearance: none;
  -moz-appearance: none;
  background-color: #ffffff;
  width: 14px;
  height: 14px;
  border-radius: 50%;
}
input[type="range"]:hover {
  cursor: pointer;
}
</style>
