<template>
  <div id="player">
    <div id="youtube">
      <youtube :height="height" :width="width" :player-vars="playerVars" ref="youtube" @ready="ready" @playing="getVideoDuration" @cued="cued" @ended="endVideo"></youtube>
    </div>
    <div id="cover">
      <Header></Header>
      <div id="content">
        <ul id="chapter-list" v-show="isChapterDisplayed" @mouseenter="toggleControllerOpacity" @mouseleave="toggleControllerOpacity" :style="{opacity: controllerOpacity}">
          <li v-for="chapter in chapterList" :key="chapter.time">
            <button id="chapter-button" @click="selectChapter(chapter)">{{chapter.text}}</button>
            <button id="chapter-remove-button" @click="removeChapter(chapter)"><i id="chapter-remove-icon" class="mdi mdi-minus mdi-light mdi-18px"></i></button>
          </li>
        </ul>
      </div>
      <Controller></Controller>
    </div>
    <Menu></Menu>
  </div>
</template>

<script>
import Header from '@/components/Header'
import Controller from '@/components/Controller'
import Menu from '@/components/Menu'
import {mapState, mapActions} from 'vuex'

export default {
  name: 'player',
  beforeDestroy () {
    this.$store.dispatch('Player/removeEvent')
  },
  methods: {
    ready () {
      this.$store.dispatch('Player/initApp', {
        value: this.$refs.youtube.player
      })
      this.$store.dispatch('History/getHistoryFromDB')
      this.$store.dispatch('Playlist/getPlaylistFromDB')
    },
    cued () {
      this.$store.dispatch('Controller/playVideo')
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
    toggleControllerOpacity (event) {
      this.$store.dispatch('Player/toggleControllerOpacity', {
        event: event
      })
    },
    ...mapActions('Player', [
      'getVideoDuration',
      'endVideo'
    ])
  },
  computed: {
    ...mapState('Player', [
      'height',
      'width',
      'playerVars',
      'isControllerDisplayed',
      'isChapterDisplayed',
      'controllerOpacity'
    ]),
    ...mapState('Controller', [
      'chapterList'
    ])
  },
  components: {
    Header,
    Controller,
    Menu
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#youtube {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100vw;
  height: 100vh;
}
#cover {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100vw;
  height: 100vh;
}
#content {
  /* background-color: rgba(255, 255, 0, 0.3); */
  display: flex;
  justify-content: flex-end;
  margin-left: auto;
  margin-right: auto;
  width: 100vw;
  height: 100%;
  -webkit-app-region: drag;
}
#chapter-list {
  width: 120px;
  height: 120px;
  list-style: none;
  background-color: rgba(30, 30, 30, 0.8);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  margin-top: auto;
  margin-bottom: 0;
  margin-right: 5vw;
  padding: 0;
  overflow: auto;
  -webkit-app-region: no-drag;
}
#chapter-list > li {
  text-align: center;
  margin-top: 3px;
  margin-bottom: 3px;
}
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(150, 150, 150, 1.0);
  border-radius: 10px;
}
button {
  font-size: 15px;
  color: #ffffff;
  background-color: transparent;
  border: none;
  outline: none;
  padding: 0;
}
button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
#chapter-remove-button {
  background-color: transparent;
  border: none;
  outline: none;
  border-radius: 50%;
  padding: 0;
  vertical-align: top;
}
#chapter-remove-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
</style>
