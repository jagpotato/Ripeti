<template>
  <div id="player" @click="closeChapterList">
    <div id="youtube">
      <youtube :height="height" :width="width" :player-vars="playerVars" ref="youtube" @ready="ready" @playing="playing" @cued="cued" @ended="end"></youtube>
    </div>
    <div id="cover">
      <Header></Header>
      <div id="content">
        <ul id="chapter-list" v-show="isChapterDisplayed">
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
    },
    cued () {
      this.$store.dispatch('Player/initChapterList')
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
    closeChapterList (event) {
      this.$store.dispatch('Player/closeChapterList', {
        event: event
      })
    },
    ...mapActions('Player', {
      playing: 'getVideoDuration',
      end: 'endVideo'
    })
  },
  computed: {
    ...mapState('Player', [
      'height',
      'width',
      'playerVars',
      'isChapterDisplayed'
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
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
  width: 95vw;
}
#chapter-list {
  width: 120px;
  height: 120px;
  list-style: none;
  background-color: rgba(30, 30, 30, 0.9);
  padding: 0;
  overflow: auto;
}
#chapter-list > li {
  text-align: center;
  margin-top: 3px;
  margin-bottom: 3px;
}
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {}
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
