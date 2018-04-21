<template>
  <div id="menu">
    <div id="menu-stage" v-show="isMenuDisplayed" @click="closeMenu"></div>
    <transition name="menu-list">
      <div id="menu-list" v-show="isMenuDisplayed">
        <div id="menu-close-button-area">
          <div id="menu-close-button" @click="closeMenu"></div>
        </div>
        <div id="history-open-button" @click="toggleHistory" :style="{backgroundColor: historyOpenButtonColor}">
          <div>History</div>
        </div>
        <History></History>
        <div id="playlist-open-button" @click="togglePlaylist" :style="{backgroundColor: playlistOpenButtonColor}">
          <div>Playlist</div>
        </div>
        <Playlist></Playlist>
      </div>
    </transition>
  </div>
</template>

<script>
import History from '@/components/History'
import Playlist from '@/components/Playlist'
import {mapState, mapActions} from 'vuex'

export default {
  methods: {
    ...mapActions('Menu', [
      'closeMenu'
    ]),
    ...mapActions('History', [
      'toggleHistory'
    ]),
    ...mapActions('Playlist', [
      'togglePlaylist'
    ])
  },
  computed: {
    ...mapState('Menu', [
      'isMenuDisplayed'
    ]),
    ...mapState('History', [
      'historyOpenButtonColor'
    ]),
    ...mapState('Playlist', [
      'playlistOpenButtonColor'
    ])
  },
  components: {
    History,
    Playlist
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#menu-stage {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  -webkit-app-region: no-drag;
}
#menu-list {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 150px;
  height: 100vh;
  background-color: rgba(42, 42, 42, 1.0);
  -webkit-app-region: no-drag;
}
#menu-close-button-area {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
}
#menu-close-button {
  width: 30px;
  height: 30px;
  margin-left: 10px;
  background-image: url('../assets/img/menu.svg');
  background-size: 100% 100%;
  cursor: pointer;
}
#history-open-button, #playlist-open-button {
  width: 100%;
  height: 40px;
  font-size: 20px;
  color: rgba(227, 227, 227, 1.0);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
#menu-close-button:hover, #history-open-button:hover, #playlist-open-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
#history-open-button > div, #playlist-open-button > div {
  position: relative;
  margin-left: 25px;
}
#history-open-button > div::before {
  content: '';
  width: 25px;
  height: 25px;
  position: absolute;
  top: 0;
  bottom: 0;
  right: auto;
  left: -35px;
  margin: auto;
  background-image: url('../assets/img/history.svg');
  background-size: 100% 100%;
}
#playlist-open-button > div::before {
  content: '';
  width: 25px;
  height: 25px;
  position: absolute;
  top: 0;
  bottom: 0;
  right: auto;
  left: -35px;
  margin: auto;
  background-image: url('../assets/img/playlist.svg');
  background-size: 100% 100%;
}
.menu-list-enter-active, .menu-list-leave-active {
  transition: all 0.3s;
}
.menu-list-enter, .menu-list-leave-to {
  transform: translateX(-100%)
}
</style>
