import Vue from 'vue'
import Vuex from 'vuex'
import VueYoutube from 'vue-youtube'

Vue.use(Vuex)
Vue.use(VueYoutube)

// const VIDEO_ID = 'tpxVMAu1O0Q'
// const VIDEO_ID = '4DmWPUhZ8lM'

const Player = {
  namespaced: true,
  state: {
    height: window.innerHeight,
    width: window.innerWidth,
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
      //
      commit('cueVideo', 'tpxVMAu1O0Q', {root: true})
    },
    playingAction ({commit, state, rootState}) {
      if (rootState.videoDuration === 0) {
        // 動画時間の取得
        rootState.player.getDuration().then((value) => {
          commit('setDuration', value, {root: true})
          commit('muteVideo', null, {root: true})
        }).catch(() => {
          console.log('error')
        })
      }
    },
    endAction ({commit, state}) {
      commit('initButton', null, {root: true})
      commit('stopTimer', null, {root: true})
    }
  }
}

const Header = {
  namespaced: true,
  state: {
    url: ''
  },
  mutations: {
    initUrl (state) {
      state.url = ''
    },
    updateUrl (state, url) {
      state.url = url
    }
  },
  actions: {
    searchAction ({commit, state, rootState}) {
      if (state.url !== '') {
        let splitUrl = state.url.match(/v=[0-9a-zA-Z-_]+/)
        if (splitUrl !== null) {
          // 動画を右クリック，「動画のURLをコピー」用 /\/[0-9a-zA-Z-_]{11}/
          let id = splitUrl[0].substr(2)
          commit('cueVideo', id, {root: true})
          commit('initButton', null, {root: true})
        }
        commit('initUrl')
      }
    },
    urlAction ({commit, state}, {url}) {
      commit('updateUrl', url)
    }
  },
  getters: {}
}

const Controller = {
  namespaced: true,
  state: {
    chapterList: [],
    isSeekbarDisabled: true
  },
  mutations: {
    addChapter (state, {currentTime, currentTimeText}) {
      state.chapterList.push({time: currentTime, text: currentTimeText})
      state.chapterList.sort((a, b) => {
        if (a.time < b.time) {
          return -1
        }
        if (a.time > b.time) {
          return 1
        }
      })
    },
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
    chapterButtonAction ({commit, state}, {currentTime, currentTimeText}) {
      const containsChapter = (chapterList, currentTime) => {
        for (let i = 0; i < chapterList.length; i++) {
          if (chapterList[i].time === currentTime) {
            return true
          }
        }
        return false
      }
      if (containsChapter(state.chapterList, currentTime) === false) {
        commit('addChapter', {currentTime, currentTimeText})
      }
    },
    seekBarAction ({commit, state, rootState}, {value}) {
      if (rootState.isPlaying === false) {
        commit('pauseVideo', null, {root: true})
      }
      commit('updateCurrentVideoTime', parseInt(value, 10), {root: true})
      commit('seekVideo', null, {root: true})
    },
    volumeBarAction ({commit, state, rootState}, {value}) {
      commit('unMuteVideo', null, {root: true})
      commit('setVolume', parseInt(value, 10), {root: true})
    },
    timerAction ({commit, state, rootState}) {
      let loop = () => {
        rootState.player.getCurrentTime().then((value) => {
          commit('updateCurrentVideoTime', value, {root: true})
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
    currentVideoTime: 0,
    currentTimeText: '00:00',
    videoDuration: 0,
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
    cueVideo (state, id) {
      state.videoDuration = 0
      state.player.cueVideoById(id)
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
    seekVideo (state) {
      state.player.seekTo(state.currentVideoTime, true)
    },
    setDuration (state, value) {
      state.videoDuration = value
      let hours = Math.floor(state.videoDuration / 60 / 60)
      let minutes = ('0' + (Math.floor(state.videoDuration / 60) % 60).toString(10)).substr(-2)
      let seconds = ('0' + Math.floor(state.videoDuration % 60).toString(10)).substr(-2)
      state.durationText = minutes + ':' + seconds
      if (hours > 0) {
        state.durationText = ('0' + hours.toString(10)).substr(-2) + ':' + state.durationText
      }
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
    updateCurrentVideoTime (state, value) {
      state.currentVideoTime = Math.floor(value)
      let minutes = ('0' + (Math.floor(state.currentVideoTime / 60) % 60).toString(10)).substr(-2)
      let seconds = ('0' + Math.floor(state.currentVideoTime % 60).toString(10)).substr(-2)
      let durationHours = Math.floor(state.videoDuration / 60 / 60)
      if (durationHours > 0) {
        let hours = ('0' + Math.floor(state.currentVideoTime / 60 / 60).toString(10)).substr(-2)
        state.currentTimeText = hours + ':' + minutes + ':' + seconds
      } else {
        state.currentTimeText = minutes + ':' + seconds
      }
    }
  },
  modules: {
    Player,
    Header,
    Controller
  },
  strict: process.env.NODE_ENV !== 'production'
})