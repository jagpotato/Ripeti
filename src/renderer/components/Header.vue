<template>
  <div id="header">
    <div id="search">
      <input type="url" v-model="url">
      <button id="searchButton" @click="clickSearchButton">search</button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    clickSearchButton () {
      this.$store.dispatch('Header/searchAction')
    }
  },
  computed: {
    url: {
      get () {
        return this.$store.state.Header.url
      },
      set (value) {
        this.$store.dispatch('Header/urlAction', {
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
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 1;
}
</style>
