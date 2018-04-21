<template>
  <transition name="menu-content">
    <div id="playlist" v-show="isPlaylistDisplayed">
      <ul id="playlist-list">
        <li class="list-item" v-for="playlist in playlistList" :key="playlist.playlistId">
          <div class="list-img-area"><img class="list-img" :src="playlist.thumbnail" @click="selectPlaylist(playlist)"></div>
          <div class="list-title" @click="selectPlaylist(playlist)">{{playlist.title}}</div>
          <div class="list-remove-button" @click="removePlaylist(playlist)"></div>
        </li>
      </ul>
    </div>
  </transition>
</template>

<script>
import {mapState} from 'vuex'
export default {
  methods: {
    selectPlaylist (playlist) {
      this.$store.dispatch('Playlist/selectPlaylist', {
        playlistItems: playlist.items
      })
    },
    removePlaylist (playlist) {
      this.$store.dispatch('Playlist/removePlaylist', {
        playlistId: playlist.playlistId
      })
    }
  },
  computed: {
    ...mapState('Playlist', [
      'playlistList',
      'isPlaylistDisplayed'
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#playlist {
  position: absolute;
  top: 0;
  left: 150px;
  z-index: 2;
  width: 300px;
  height: 100vh;
  background-color: rgba(42, 42, 42, 1.0);
  overflow: auto;
  -webkit-app-region: no-drag;
}
#playlist-list {
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(70, 70, 70, 1.0);
  border-radius: 10px;
}
.list-item {
  width: 100%;
  height: 100px;
  display: flex;
}
.list-img-area {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.list-img {
  cursor: pointer;
}
.list-title {
  flex: 1;
  color: rgba(227, 227, 227, 1.0);
  font-size: 15px;
  padding-top: 5px;
  cursor: pointer;
  overflow: hidden;
}
.list-remove-button {
  width: 30px;
  height: 30px;
  align-self: flex-start;
  background-image: url('../assets/img/remove.svg');
  background-size: 100% 100%;
  cursor: pointer;
  border-radius: 50%;
}
.list-remove-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
.menu-content-enter-active, .menu-content-leave-active {
  transition: all 0.3s;
}
.menu-content-enter, .menu-content-leave-to {
  opacity: 0;
}
</style>
