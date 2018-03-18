<template>
  <div id="header">
    <button id="menu-button"><i class="mdi mdi-menu mdi-light mdi-24px"></i></button>
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
      submitUrl: 'searchVideo'
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
  background-color: rgba(0, 255, 0, 0.2);
  width: 100vw;
  height: 40px;
  display: flex;
  justify-content: space-between;
}
#search {
  display: flex;
}
input[type="url"] {
  outline: none;
  border: none;
  width: 400px;
  background-color: rgba(30, 30, 30, 0.6);
}
button {
  cursor: pointer;
  background-color: transparent;
  border: none;
  outline: none;
}
button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
#menu-button {}
#search-button {
  background-color: rgba(30, 30, 30, 0.6);
}
</style>
