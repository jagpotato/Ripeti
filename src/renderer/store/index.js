import Vue from 'vue'
import Vuex from 'vuex'
import VueYoutube from 'vue-youtube'
import Datastore from 'nedb'
import path from 'path'

Vue.use(Vuex)
Vue.use(VueYoutube)

const db = new Datastore({
  filename: path.join(__dirname, 'db', 'chapterList.db'),
  autoload: true
})

// const VIDEO_ID = 'tpxVMAu1O0Q'
// const VIDEO_ID = '4DmWPUhZ8lM'
// v=4DmWPUhZ8lM
// https://www.youtube.com/watch?v=9ydA4cXjers

const Player = {
  namespaced: true,
  state: {
    player: '',
    videoId: '',
    height: window.innerHeight,
    width: window.innerWidth,
    playerVars: {
      controls: 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0
    },
    currentVideoTime: 0,
    videoDuration: 0,
    currentVolume: 0,
    isEnd: false
  },
  getters: {
    getHours (state) {
      return (time) => {
        return Math.floor(time / 60 / 60)
      }
    },
    getMinutes (state) {
      return (time) => {
        return Math.floor(time / 60) % 60
      }
    },
    getSeconds (state) {
      return (time) => {
        return Math.floor(time % 60)
      }
    },
    durationText (state, getters) {
      const hours = getters.getHours(state.videoDuration)
      const minutes = ('0' + getters.getMinutes(state.videoDuration)).substr(-2)
      const seconds = ('0' + getters.getSeconds(state.videoDuration)).substr(-2)
      let text = minutes + ':' + seconds
      if (hours > 0) {
        text = ('0' + hours).substr(-2) + ':' + text
      }
      return text
    },
    currentTimeText (state, getters) {
      const minutes = ('0' + getters.getMinutes(state.currentVideoTime)).substr(-2)
      const seconds = ('0' + getters.getSeconds(state.currentVideoTime)).substr(-2)
      const durationHours = getters.getHours(state.videoDuration)
      let text
      if (durationHours > 0) {
        let hours = ('0' + getters.getHours(state.currentVideoTime)).substr(-2)
        text = hours + ':' + minutes + ':' + seconds
      } else {
        text = minutes + ':' + seconds
      }
      return text
    }
  },
  mutations: {
    initPlayer (state, value) {
      state.player = value
    },
    cueVideo (state, id) {
      state.videoId = id
      state.videoDuration = 0
      state.player.cueVideoById(state.videoId)
    },
    playVideo (state) {
      if (state.isEnd === true) {
        state.isEnd = false
      }
      state.player.playVideo()
    },
    pauseVideo (state) {
      state.player.pauseVideo()
    },
    setEndFlag (state) {
      state.isEnd = true
    },
    muteVideo (state) {
      state.player.mute()
    },
    setVolume (state, value) {
      state.player.unMute()
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
    },
    updateCurrentVideoTime (state, value) {
      state.currentVideoTime = Math.floor(value)
    }
  },
  actions: {
    removeEvent ({commit, state}) {
      window.removeEventListener('resize', () => {
        commit('resize')
      }, false)
    },
    initApp ({commit, state}, {value}) {
      // youtube playerを初期化
      commit('initPlayer', value)
      // resizeイベントを追加
      window.addEventListener('resize', () => {
        commit('resize')
      }, false)
      // play，pauseボタンの初期化
      commit('Controller/initButton', null, {root: true})
      //
      commit('cueVideo', 'tpxVMAu1O0Q')
    },
    initChapterList ({commit, state}) {
      db.findOne({'videoId': state.videoId}, (err, docs) => {
        if (err) {
          console.log(err)
        }
        if (docs === null) {
          // dbにvideoIdが存在しない場合，追加
          db.insert({videoId: state.videoId, chapterList: []})
        }
        // dbからchapterListを取得
        commit('Controller/loadChapterList', docs, {root: true})
      })
    },
    getVideoDuration ({commit, state}) {
      if (state.videoDuration === 0) {
        // 動画時間の取得
        state.player.getDuration().then((value) => {
          commit('setDuration', value)
          commit('muteVideo')
        }).catch(() => {
          console.log('error')
        })
      }
    },
    endVideo ({commit, state}) {
      commit('setEndFlag')
      commit('Controller/initButton', null, {root: true})
      commit('Controller/stopTimer', null, {root: true})
    }
  }
}

const Header = {
  namespaced: true,
  state: {
    url: ''
  },
  getters: {},
  mutations: {
    initUrl (state) {
      state.url = ''
    },
    updateUrl (state, url) {
      state.url = url
    }
  },
  actions: {
    searchVideo ({commit, state}) {
      if (state.url !== '') {
        const splitUrl = state.url.match(/v=[0-9a-zA-Z-_]+/)
        // 動画を右クリック，「動画のURLをコピー」用 /\/[0-9a-zA-Z-_]{11}/
        if (splitUrl !== null) {
          const id = splitUrl[0].substr(2)
          commit('Player/cueVideo', id, {root: true})
          commit('Controller/initButton', null, {root: true})
        }
        commit('initUrl')
      }
    },
    inputUrl ({commit, state}, {url}) {
      commit('updateUrl', url)
    }
  }
}

const Controller = {
  namespaced: true,
  state: {
    timer: '',
    chapterList: [],
    isPlayButtonDisabled: true,
    isPauseButtonDisabled: true,
    isSeekbarDisabled: true
  },
  getters: {
    getChapterIndex (state) {
      return (time) => {
        for (let i = 0; i < state.chapterList.length; i++) {
          if (state.chapterList[i].time === time) {
            return i
          }
        }
        return -1
      }
    }
  },
  mutations: {
    updateTimer (state, timer) {
      state.timer = timer
    },
    stopTimer (state) {
      cancelAnimationFrame(state.timer)
    },
    initButton (state) {
      state.isPlayButtonDisabled = false
      state.isPauseButtonDisabled = true
    },
    toggleButton (state) {
      state.isPlayButtonDisabled = !state.isPlayButtonDisabled
      state.isPauseButtonDisabled = !state.isPauseButtonDisabled
    },
    loadChapterList (state, dbData) {
      if (dbData === null) {
        state.chapterList = []
      } else {
        state.chapterList = dbData.chapterList
      }
    },
    addChapter (state, {currentTime, currentTimeText}) {
      // ローカルのchapterListを更新
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
    removeChapter (state, index) {
      state.chapterList.splice(index, 1)
    },
    enableSeekbar (state) {
      state.isSeekbarDisabled = false
    }
  },
  actions: {
    playVideo ({commit, state, rootState}) {
      // pauseボタンを使用可能にする
      commit('toggleButton')
      // シークバーを使用可能にする
      if (state.isSeekbarDisabled === true) {
        commit('enableSeekbar')
      }
      // requestAnimationFrame
      let loop = () => {
        // 現在の再生時間を取得
        rootState.Player.player.getCurrentTime().then((value) => {
          commit('Player/updateCurrentVideoTime', value, {root: true})
          commit('updateTimer', requestAnimationFrame(loop))
        }).catch(() => {
          console.log('error')
        })
      }
      // 動画を再生
      commit('Player/playVideo', null, {root: true})
      // requestAnimationFrame開始
      loop()
    },
    pauseVideo ({commit, state}) {
      commit('toggleButton')
      commit('stopTimer')
      commit('Player/pauseVideo', null, {root: true})
    },
    addChapter ({commit, state, getters, rootState}, {currentTime, currentTimeText}) {
      // chapterListに同じ時間のchapterが含まれていない場合，chapterを追加
      if (getters.getChapterIndex(currentTime) === -1) {
        commit('addChapter', {currentTime, currentTimeText})
        db.update({'videoId': rootState.Player.videoId}, {$set: {chapterList: state.chapterList}})
      }
    },
    removeChapter ({commit, state, getters, rootState}, {value}) {
      const index = getters.getChapterIndex(value.time)
      commit('removeChapter', index)
      db.update({'videoId': rootState.Player.videoId}, {$set: {chapterList: state.chapterList}})
    },
    moveSeekBar ({commit, state, rootState}, {value}) {
      if (rootState.Player.isEnd === true) {
        commit('Player/pauseVideo', null, {root: true})
      }
      commit('Player/updateCurrentVideoTime', parseInt(value, 10), {root: true})
      commit('Player/seekVideo', null, {root: true})
    },
    moveVolumeBar ({commit, state}, {value}) {
      commit('Player/setVolume', parseInt(value, 10), {root: true})
    }
  }
}

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    Player,
    Header,
    Controller
  },
  strict: process.env.NODE_ENV !== 'production'
})
