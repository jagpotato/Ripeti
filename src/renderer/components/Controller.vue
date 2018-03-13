<template>
  <div id="controller">
    <button @click="playVideo" :disabled="isPlayButtonDisabled">play</button>
    <button @click="pauseVideo" :disabled="isPauseButtonDisabled">pause</button>
    <span class="time">{{currentTimeText}}</span>
    <input id="seekbar" type="range" v-model="currentVideoTime" min="0" :max="videoDuration" :disabled="isSeekbarDisabled">
    <span class="time">{{durationText}}</span>
    <input id="volumebar" type="range" v-model="currentVolume" min="0" max="100">
    <button @click="addChapter">chapter</button>
    <ul id="chapterList">
      <li v-for="chapter in chapterList" :key="chapter.time">
        <span @click="selectChapter(chapter)">{{chapter.text}}</span>
        <button @click="removeChapter(chapter)">delete</button>
      </li>
    </ul>
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
    selectChapter (chapter) {
      this.$store.dispatch('Controller/moveSeekBar', {
        value: chapter.time.toString(10)
      })
    },
    removeChapter (chapter) {
      this.$store.dispatch('Controller/removeChapter', {
        value: chapter
      })
    },
    ...mapActions('Controller', [
      'playVideo',
      'pauseVideo'
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
      'videoDuration'
    ]),
    ...mapState('Controller', [
      'chapterList',
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
#controller {
  position: absolute;
  bottom: 0px;
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
