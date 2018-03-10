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
    }
  },
  mutations: {
  },
  actions: {
    removeEventAction ({commit, state}) {
      window.removeEventListener('resize', function () {
        commit('resize', null, {root: true})
      }, false)
    },
    readyAction ({commit, state, rootState}, {value}) {
      commit('initPlayer', value, {root: true})

      window.addEventListener('resize', function () {
        commit('resize', null, {root: true})
      }, false)
      rootState.player.getDuration().then((value) => {
        commit('setDuration', value, {root: true})
        commit('muteVideo', null, {root: true})
      }).catch(() => {
        console.log('error')
      })
    }
  }
}

const Controller = {
  namespaced: true,
  state: {
    isPlayButtonDisabled: true,
    isPauseButtonDisabled: true
  },
  mutations: {
    initButton (state) {
      state.isPlayButtonDisabled = false
      state.isPauseButtonDisabled = true
    },
    toggleButton (state) {
      state.isPlayButtonDisabled = !state.isPlayButtonDisabled
      state.isPauseButtonDisabled = !state.isPauseButtonDisabled
    }
  },
  actions: {
    initButtonAction ({commit, state}) {
      commit('initButton')
    },
    playButtonAction ({commit, state}) {
      commit('toggleButton')
      commit('playVideo', null, {root: true})
    },
    pauseButtonAction ({commit, state}) {
      commit('toggleButton')
      commit('pauseVideo', null, {root: true})
    },
    seekBarAction ({commit, state}, {value}) {
      commit('seekMovie', value, {root: true})
    }
  },
  getters: {}
}

export default new Vuex.Store({
  state: {
    player: '',
    currentMovieTime: 0,
    movieDuration: 1000
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
    muteVideo (state) {
      state.player.mute()
    },
    resize (state) {
      state.player.setSize(window.innerWidth, window.innerHeight)
    },
    seekMovie (state, value) {
      state.currentMovieTime = parseInt(value, 10)
      state.player.seekTo(state.currentMovieTime, true)
    },
    setDuration (state, value) {
      state.movieDuration = value
    }
  },
  modules: {
    Player,
    Controller
  }
})
