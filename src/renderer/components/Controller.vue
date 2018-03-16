<template>
  <div id="footer">
    <div id="controller">
      <div id="time">
        <span>{{currentTimeText}}</span>
        <input id="seek-bar" type="range" v-model="currentVideoTime" min="0" :max="videoDuration" :disabled="isSeekbarDisabled" :style="{backgroundImage: seekBarBackground}">
        <span>{{durationText}}</span>
      </div>
      <div id="control-item">
        <div id="control-item-left">
          <button id="pause-button" @click="pauseVideo" v-if="isPlaying" :disabled="isPauseButtonDisabled"><i class="mdi mdi-pause mdi-light mdi-24px"></i></button>
          <button id="play-button" @click="playVideo" v-else :disabled="isPlayButtonDisabled"><i class="mdi mdi-play mdi-light mdi-24px"></i></button>
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
            <button id="add-chapter-button" @click="addChapter"><i class="mdi mdi-clock mdi-light mdi-24px"></i></button>
            <button id="chapter-list-button" @click="openChapterList"><i class="mdi mdi-menu-up mdi-light mdi-24px"></i></button>
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
      'seekBarBackground',
      'volumeBarBackground'
    ]),
    ...mapState('Controller', [
      'isPlayButtonDisabled',
      'isPauseButtonDisabled',
      'isSeekbarDisabled'
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
  background-color: rgba(0, 0, 255, 0.5);
  width: 100vw;
  height: 80px;
  display: flex;
  justify-content: center;
}
#controller {
  background-color: rgba(255, 0, 255, 0.5);
  width: 90vw;
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
  background-color: transparent;
  outline: none;
  border: 1px solid #000000;
  padding: 0;
  width: 30px;
  height: 30px;
}
#play-button:hover, #pause-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
#volume {
  display: flex;
  align-items: center;
}
#mute-button {
  background-color: transparent;
  border: none;
  outline: none;
  display: flex;
  align-items: center;
}
#mute-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
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
#add-chapter-button, #chapter-list-button {
  background-color: transparent;
  border: none;
  outline: none;
  display: flex;
  align-items: center;
}
#add-chapter-button:hover, #chapter-list-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
#seek-bar {
  outline: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 50px;
  height: 6px;
  background-image: -webkit-gradient(linear, left top, right top, color-stop(0.01, #f44336), color-stop(0.01, #ffffff));
}
#seek-bar::-webkit-slider-thumb {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: #f44336;
  width: 15px;
  height: 15px;
  border-radius: 50%;
}
#volume-bar {
  outline: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 50px;
  height: 6px;
  /* background-image: -webkit-gradient(linear, left top, right top, color-stop(0.01, #ffffff), color-stop(0.01, #555555)); */
}
#volume-bar::-webkit-slider-thumb {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: #ffffff;
  width: 15px;
  height: 15px;
  border-radius: 50%;
}
</style>
