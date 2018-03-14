<template>
  <div id="footer">
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
#footer {
  background-color: rgba(0, 0, 255, 0.3);
  /* footerを画面下に配置 */
  position: absolute;
  bottom: 0px;
  left: 0px;
  z-index: 1;
  /* widthをスクリーンに合わせる */
  width: 100vw;
  /* electronのドラッグ領域から外す */
  -webkit-app-region: no-drag;
}
#controller {
  background-color: rgba(0, 255, 255, 0.3);
  /* 子要素のボタンなどを中央配置 */
  text-align: center;
  /* controllerを中央配置(width指定時) */
  margin: auto;
  /* controllerのwidth */
  /* width: 90vw; */
}
.time {
  color: white;
}
#chapterList {
  color: white;
  list-style: none;
}
</style>
