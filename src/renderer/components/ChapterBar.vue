<template>
  <div id="chapter-bar">
    <svg height="20">
      <rect id="base-rect" x="7" y="10" :width="baseBarWidth" height="6" fill="#ffffff"></rect>
      <rect v-for="pos in chapterPosition" :key="pos.x" :x="pos.x" y="10" width="2" height="6" fill="#ff0000"></rect>
      <!-- <rect v-for="rect in rects" :key="rect.x" :x="x" y="10" width="3" height="6" fill="#ff0000"></rect> -->
    </svg>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'chapterBar',
  methods: {
  },
  computed: {
    ...mapState('ChapterBar', [
      'baseBarWidth',
      'chapterPosition'
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#chapter-bar {
  display: flex;
  justify-content: center;
  margin-bottom: auto;
}
#chapter-bar > svg {
  display: flex;
  justify-content: center;
  width: 80%;
}
#base-rect {
  /* width: 100%; */
}
</style>
