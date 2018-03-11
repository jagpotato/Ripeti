<template>
  <div id="controller">
    <button @click="clickPlayButton" :disabled="isPlayButtonDisabled">play</button>
    <button @click="clickPauseButton" :disabled="isPauseButtonDisabled">pause</button>
    <span class="time">{{currentTimeText}}</span>
    <input id="seekbar" type="range" v-model="currentVideoTime" min="0" :max="videoDuration" :disabled="isSeekbarDisabled">
    <span class="time">{{durationText}}</span>
    <input id="volumebar" type="range" v-model="currentVolume" min="0" max="100">
    <button @click="clickChapterButton">chapter</button>
    <ul id="chapterList">
      <li v-for="chapter in chapterList" :key="chapter.time" @click="selectChapter(chapter)">{{chapter.text}}</li>
    </ul>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'

export default {
  name: 'controller',
  methods: {
    clickPlayButton () {
      this.$store.dispatch('Controller/playButtonAction')
      this.$store.dispatch('Controller/timerAction')
    },
    clickChapterButton () {
      this.$store.dispatch('Controller/chapterButtonAction', {
        currentTime: this.currentVideoTime,
        currentTimeText: this.currentTimeText
      })
    },
    selectChapter (chapter) {
      this.$store.dispatch('Controller/seekBarAction', {
        value: chapter.time.toString(10)
      })
    },
    ...mapActions('Controller', {
      clickPauseButton: 'pauseButtonAction'
    })
  },
  computed: {
    currentVideoTime: {
      get () {
        return this.$store.state.currentVideoTime
      },
      set (value) {
        this.$store.dispatch('Controller/seekBarAction', {
          value: value
        })
      }
    },
    currentVolume: {
      get () {
        return this.$store.state.currentVolume
      },
      set (value) {
        this.$store.dispatch('Controller/volumeBarAction', {
          value: value
        })
      }
    },
    ...mapState('Controller', [
      'chapterList',
      'isSeekbarDisabled'
    ]),
    ...mapState([
      'currentTimeText',
      'videoDuration',
      'durationText',
      'isPlayButtonDisabled',
      'isPauseButtonDisabled'
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#controller {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 1;
}
.time {
  color: white;
}
#chapterList {
  color: white;
  list-style: none;
}
</style>
