<template>
  <div id="history">
    <button id="history-open-button" @click="openHistory">
      <i class="mdi mdi-history mdi-light mdi-18px"></i>
      <span>History</span>
    </button>
    <ul v-show="isHistoryDisplayed">
      <li v-for="history in historyList" :key="history.videoId">
        <button id="history-button" @click="selectHistory(history)"><img :src="history.thumbnail"></button>
        <button id="history-remove-button" @click="removeHistory(history)"><i class="mdi mdi-close mdi-light mdi-24px"></i></button>
      </li>
    </ul>
  </div>
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
  /* background-color: rgba(255, 0, 255, 0.1); */
  width: 100%;
  height: 100%;
}
#history-open-button {
  width: 100%;
  height: 40px;
  padding-left: 20px;
  text-align: left;
  font-size: 18px;
  color: rgba(255, 255, 255, 1.0);
}
#history-open-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
span {
  margin-left: 10px;
}
ul {
  width: 100%;
  height: 100%;
  list-style: none;
  padding: 0;
  overflow: auto;
}
li {
  text-align: center;
  display: flex;
  justify-content: center;
}
#history-button {
  width: 50%;
}
img {
  width: 100px;
}
#history-remove-button {
  width: 30px;
  height: 30px;
  margin-bottom: auto;
}
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(70, 70, 70, 1.0);
  border-radius: 10px;
}
button {
  cursor: pointer;
  background-color: transparent;
  border: none;
  outline: none;
}
</style>
