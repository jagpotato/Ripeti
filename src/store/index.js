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
    currentMovieTime: '0',
    isPlayButtonDisabled: false,
    isPauseButtonDisabled: true
  },
  mutations: {
    addEvent (state) {
      console.log('addevent')
      window.addEventListener('resize', state.resize, false)
    },
    removeEvent (state) {
      window.removeEventListener('resize', state.resize, false)
    },
    playVideo (state) {
      state.toggleButton()
      state.player.playVideo()
    },
    pauseVideo (state) {
      state.toggleButton()
      state.player.pauseVideo()
    },
    resize (state) {
      state.player.setSize(window.innerWidth, window.innerHeight)
    },
    seekMovie (state) {
      state.player.seekTo(parseInt(state.currentMovieTime, 10), true)
    },
    toggleButton (state) {
      state.isPlayButtonDisabled = !state.isPlayButtonDisabled
      state.isPauseButtonDisabled = !state.isPauseButtonDisabled
    },
    ready (state, value) {
      state.movieDuration = value
      state.player.mute()
      // this.player.playVideo()
    }
  },
  actions: {
    addEventAction ({commit, state}) {
      commit('addEvent')
    },
    removeEventAction ({commit, state}) {
      commit('removeEvent')
    },
    readyAction ({commit, state}) {
      state.player.getDuration().then((value) => {
        commit('ready', value)
      }).catch(() => {
        console.log('error')
      })
    },
    playButtonAction ({commit, state}) {
      commit('playVideo')
    },
    pauseButtonAction ({commit, state}) {
      commit('pauseVideo')
    }
  },
  getters: {
    // getPlayer (state) {
    //   return state.$refs.youtube.player
    // }
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
