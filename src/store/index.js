import Vue from 'vue'
import Vuex from 'vuex'
import VueYoutube from 'vue-youtube'

Vue.use(Vuex)
Vue.use(VueYoutube)

const VIDEO_ID = 'tpxVMAu1O0Q'
// const VIDEO_ID = '4DmWPUhZ8lM'

const Player = {
  namespaced: true,
  state: {
    player: '',
    height: window.innerHeight,
    width: window.innerWidth,
    videoId: VIDEO_ID,
    playerVars: {
      controls: 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0
    },
    movieDuration: 1000,
    currentMovieTime: 0,
    isPlayButtonDisabled: true,
    isPauseButtonDisabled: true
  },
  mutations: {
    initPlayer (state, value) {
      state.player = value
    },
    playVideo (state) {
      state.player.playVideo()
    },
    pauseVideo (state) {
      state.player.pauseVideo()
    },
    resize (state) {
      state.player.setSize(window.innerWidth, window.innerHeight)
    },
    seekMovie (state, value) {
      state.currentMovieTime = parseInt(value, 10)
      state.player.seekTo(state.currentMovieTime, true)
    },
    initButton (state) {
      state.isPlayButtonDisabled = false
      state.isPauseButtonDisabled = true
    },
    toggleButton (state) {
      state.isPlayButtonDisabled = !state.isPlayButtonDisabled
      state.isPauseButtonDisabled = !state.isPauseButtonDisabled
    },
    setDuration (state, value) {
      state.movieDuration = value
      state.player.mute()
      // this.player.playVideo()
    }
  },
  actions: {
    removeEventAction ({commit, state}) {
      window.removeEventListener('resize', function () {
        commit('resize')
      }, false)
    },
    readyAction ({commit, state}, {value}) {
      commit('initPlayer', value)
      window.addEventListener('resize', function () {
        commit('resize')
      }, false)
      commit('initButton')
      state.player.getDuration().then((value) => {
        commit('setDuration', value)
      }).catch(() => {
        console.log('error')
      })
    },
    playButtonAction ({commit, state}) {
      commit('toggleButton')
      commit('playVideo')
    },
    pauseButtonAction ({commit, state}) {
      commit('toggleButton')
      commit('pauseVideo')
    },
    seekBarAction ({commit, state}, {value}) {
      commit('seekMovie', value)
    }
  }
}

// const Controller = {
//   state: {},
//   mutations: {},
//   actions: {},
//   getters: {}
// }

export default new Vuex.Store({
  state: {},
  mutations: {},
  modules: {
    Player
    // Controller
  }
})
