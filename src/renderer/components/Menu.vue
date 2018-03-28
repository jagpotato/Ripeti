<template>
  <div id="menu">
    <div id="menu-stage" v-show="isMenuDisplayed" @click="closeMenu"></div>
    <transition name="menu-list">
      <div id="menu-list" v-show="isMenuDisplayed">
        <History></History>
      </div>
    </transition>
  </div>
</template>

<script>
import History from '@/components/History'
import {mapState, mapActions} from 'vuex'

export default {
  methods: {
    ...mapActions('Menu', [
      'closeMenu'
    ])
  },
  computed: {
    ...mapState('Menu', [
      'isMenuDisplayed'
    ])
  },
  components: {
    History
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
  transition-duration: 1s;
  -webkit-app-region: no-drag;
}
#menu-list {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 25%;
  height: 100vh;
  min-width: 150px;
  background-color: rgba(42, 42, 42, 1.0);
  -webkit-app-region: no-drag;
}
.menu-list-enter-active, .menu-list-leave-active {
  transition: all 0.3s;
}
.menu-list-enter, .menu-list-leave-to {
  transform: translateX(-100%)
}
</style>
