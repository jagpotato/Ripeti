<template>
  <div id="header">
    <button id="menu-button" @click="openMenu" disabled><i class="mdi mdi-menu mdi-light mdi-24px"></i></button>
    <div id="search">
      <input type="url" v-model="url">
      <button id="search-button" @click="submitUrl"><i class="mdi mdi-magnify mdi-light mdi-24px"></i></button>
    </div>
    <button id="close-button" @click="closeWindow"><i class="mdi mdi-close mdi-light mdi-24px"></i></button>
  </div>
</template>

<script>
import {mapActions} from 'vuex'

export default {
  methods: {
    ...mapActions('Header', {
      submitUrl: 'searchVideo',
      openMenu: 'openMenu'
    }),
    closeWindow () {
      window.close()
    }
  },
  computed: {
    url: {
      get () {
        return this.$store.state.Header.url
      },
      set (value) {
        this.$store.dispatch('Header/inputUrl', {
          url: value
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#header {
  /* background-color: rgba(0, 255, 0, 0.2); */
  background-color: rgba(30, 30, 30, 0.8);
  width: 100vw;
  height: 20%;
  max-height: 50px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: space-between;
  -webkit-app-region: no-drag;
  opacity: 0;
}
#header:hover {
  opacity: 1;
}
#search {
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.8);
  height: 70%;
  margin-top: auto;
  margin-bottom: auto;
}
input[type="url"] {
  outline: none;
  border: none;
  width: 300px;
  min-width: 300px;
  font-size: 20px;
  color: rgba(255, 255, 255, 1.0);
  background-color: rgba(0, 0, 0, 0);
}
button {
  cursor: pointer;
  background-color: transparent;
  border: none;
  outline: none;
}
#menu-button:hover, #close-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
