<template>
  <div id="history">
    <button id="history-open-button">
      <i class="mdi mdi-history mdi-light mdi-18px"></i>
      <span>History</span>
    </button>
    <ul>
      <li v-for="history in historyList" :key="history.videoId" @click="selectHistory(history)">
        <button id="history-button"><img :src="history.thumbnail"></button>
        <button id="history-remove-button"><i class="mdi mdi-close mdi-light mdi-24px"></i></button>
      </li>
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
  cursor: pointer;
  text-align: center;
  display: flex;
  justify-content: space-around;
}
#history-button {
  width: 50%;
}
img {
  width: 100px;
}
#history-remove-button {
  width: 50%;
  height: 30px;
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
