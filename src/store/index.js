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
  mutations: {},
  actions: {
    removeEventAction ({commit, state}) {
      window.removeEventListener('resize', function () {
        commit('resize', null, {root: true})
      }, false)
    },
    readyAction ({commit, state, rootState}, {value}) {
      // youtube playerを初期化
      commit('initPlayer', value, {root: true})
      // resizeイベントを追加
      window.addEventListener('resize', function () {
        commit('resize', null, {root: true})
      }, false)
      // play，pauseボタンの初期化
      commit('initButton', null, {root: true})
      // 動画時間の取得
      rootState.player.getDuration().then((value) => {
        commit('setDuration', value, {root: true})
        commit('muteVideo', null, {root: true})
      }).catch(() => {
        console.log('error')
      })
    },
    endAction ({commit, state}) {
      commit('initButton', null, {root: true})
      commit('stopTimer', null, {root: true})
    }
  }
}

const Controller = {
  namespaced: true,
  state: {
    isSeekbarDisabled: true
  },
  mutations: {
    enableSeekbar (state) {
      state.isSeekbarDisabled = false
    }
  },
  actions: {
    playButtonAction ({commit, state}) {
      commit('toggleButton', null, {root: true})
      if (state.isSeekbarDisabled === true) {
        commit('enableSeekbar')
      }
      commit('playVideo', null, {root: true})
    },
    pauseButtonAction ({commit, state}) {
      commit('toggleButton', null, {root: true})
      commit('stopTimer', null, {root: true})
      commit('pauseVideo', null, {root: true})
    },
    seekBarAction ({commit, state, rootState}, {value}) {
      if (rootState.isPlaying === false) {
        commit('pauseVideo', null, {root: true})
      }
      commit('updateCurrentMovieTime', parseInt(value, 10), {root: true})
      commit('seekMovie', null, {root: true})
    },
    volumeBarAction ({commit, state, rootState}, {value}) {
      commit('unMuteVideo', null, {root: true})
      commit('setVolume', parseInt(value, 10), {root: true})
    },
    timerAction ({commit, state, rootState}) {
      let loop = () => {
        rootState.player.getCurrentTime().then((value) => {
          commit('updateCurrentMovieTime', value, {root: true})
          commit('updateTimer', requestAnimationFrame(loop), {root: true})
        }).catch(() => {
          console.log('error')
        })
      }
      loop()
    }
  },
  getters: {}
}

export default new Vuex.Store({
  state: {
    player: '',
    timer: '',
    currentMovieTime: 0,
    currentTimeText: '00:00',
    movieDuration: 1000,
    durationText: '00:00',
    currentVolume: 0,
    isPlaying: false,
    isPlayButtonDisabled: true,
    isPauseButtonDisabled: true
  },
  mutations: {
    initPlayer (state, value) {
      state.player = value
    },
    playVideo (state) {
      if (state.isPlaying === false) {
        state.isPlaying = true
      }
      state.player.playVideo()
    },
    pauseVideo (state) {
      state.player.pauseVideo()
    },
    muteVideo (state) {
      state.player.mute()
    },
    unMuteVideo (state) {
      state.player.unMute()
    },
    setVolume (state, value) {
      state.currentVolume = value
      state.player.setVolume(state.currentVolume)
    },
    resize (state) {
      state.player.setSize(window.innerWidth, window.innerHeight)
    },
    seekMovie (state) {
      state.player.seekTo(state.currentMovieTime, true)
    },
    setDuration (state, value) {
      state.movieDuration = value
      let minutes = ('0' + Math.floor(state.movieDuration / 60).toString(10)).substr(-2)
      let seconds = ('0' + Math.floor(state.movieDuration % 60).toString(10)).substr(-2)
      state.durationText = minutes + ':' + seconds
    },
    initButton (state) {
      state.isPlaying = false
      state.isPlayButtonDisabled = false
      state.isPauseButtonDisabled = true
    },
    toggleButton (state) {
      state.isPlayButtonDisabled = !state.isPlayButtonDisabled
      state.isPauseButtonDisabled = !state.isPauseButtonDisabled
    },
    updateTimer (state, timer) {
      state.timer = timer
    },
    stopTimer (state) {
      cancelAnimationFrame(state.timer)
    },
    updateCurrentMovieTime (state, value) {
      state.currentMovieTime = Math.floor(value)
      let minutes = ('0' + Math.floor(state.currentMovieTime / 60).toString(10)).substr(-2)
      let seconds = ('0' + Math.floor(state.currentMovieTime % 60).toString(10)).substr(-2)
      state.currentTimeText = minutes + ':' + seconds
    }
  },
  modules: {
    Player,
    Controller
  }
})
