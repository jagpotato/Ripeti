<template>
  <transition name="menu-content">
    <div id="history" v-show="isHistoryDisplayed">
      <ul id="history-list">
        <li class="list-item" v-for="history in historyList" :key="history.videoId">
          <div class="list-img-area"><img class="list-img" :src="history.thumbnail" @click="selectHistory(history)"></div>
          <div class="list-title" @click="selectHistory(history)">{{history.title}}</div>
          <div class="list-remove-button" @click="removeHistory(history)"></div>
        </li>
      </ul>
    </div>
  </transition>
</template>

<script>
import {mapState, mapActions} from 'vuex'
export default {
  methods: {
    selectHistory (history) {
      this.$store.dispatch('History/selectHistory', {
        videoId: history.videoId
      })
    },
    removeHistory (history) {
      this.$store.dispatch('History/removeHistory', {
        videoId: history.videoId
      })
    },
    ...mapActions('History', [
      'openHistory'
    ])
  },
  computed: {
    ...mapState('History', [
      'historyList',
      'isHistoryDisplayed'
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#history {
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
#history-list {
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
