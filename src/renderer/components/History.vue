<template>
  <div id="history">
    <ul>
      <button>History</button>
      <li v-for="history in historyList" :key="history.videoId" @click="selectHistory(history)"><img :src="history.thumbnail"></li>
    </ul>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  methods: {
    selectHistory (history) {
      this.$store.dispatch('History/selectHistory', {
        videoId: history.videoId
      })
    }
  },
  computed: {
    ...mapState('History', [
      'historyList'
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#history {
  background-color: rgba(255, 0, 255, 0.1);
  width: 100%;
  height: 100%;
}
ul {
  width: 100%;
  height: 100%;
  list-style: none;
  padding: 0;
  overflow: auto;
}
li {
  cursor: pointer;
}
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(70, 70, 70, 1.0);
  border-radius: 10px;
}
button {
  width: 100%;
  cursor: pointer;
  background-color: transparent;
  border: none;
  outline: none;
}
button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
