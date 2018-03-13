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
    currentTimeText: '00:00',
    videoDuration: 0,
    durationText: '00:00',
    currentVolume: 0,
    isEnd: false
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
    play (state) {
      if (state.isEnd === true) {
        state.isEnd = false
      }
      state.player.playVideo()
    },
    pause (state) {
      state.player.pauseVideo()
    },
    setEndFlag (state) {
      state.isEnd = true
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
  actions: {
    removeEvent ({commit, state}) {
      window.removeEventListener('resize', function () {
        commit('resize')
      }, false)
    },
    initApp ({commit, state}, {value}) {
      // youtube playerを初期化
      commit('initPlayer', value)
      // resizeイベントを追加
      window.addEventListener('resize', function () {
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
    searchVideo ({commit, state}) {
      if (state.url !== '') {
        let splitUrl = state.url.match(/v=[0-9a-zA-Z-_]+/)
        // 動画を右クリック，「動画のURLをコピー」用 /\/[0-9a-zA-Z-_]{11}/
        if (splitUrl !== null) {
          let id = splitUrl[0].substr(2)
          commit('Player/cueVideo', id, {root: true})
          commit('Controller/initButton', null, {root: true})
        }
        commit('initUrl')
      }
    },
    inputUrl ({commit, state}, {url}) {
      commit('updateUrl', url)
    }
  },
  getters: {}
}

const Controller = {
  namespaced: true,
  state: {
    chapterList: [],
    isPlayButtonDisabled: true,
    isPauseButtonDisabled: true,
    isSeekbarDisabled: true
  },
  mutations: {
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
      // console.log(state.chapterList)
      // console.log(currentTime, currentTimeText)
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
    playVideo ({commit, state}) {
      commit('toggleButton')
      if (state.isSeekbarDisabled === true) {
        commit('enableSeekbar')
      }
      commit('Player/play', null, {root: true})
    },
    pauseVideo ({commit, state}) {
      commit('toggleButton')
      commit('stopTimer', null, {root: true})
      commit('Player/pause', null, {root: true})
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
        commit('Player/pause', null, {root: true})
      }
      commit('Player/updateCurrentVideoTime', parseInt(value, 10), {root: true})
      commit('Player/seekVideo', null, {root: true})
    },
    moveVolumeBar ({commit, state}, {value}) {
      commit('Player/unMuteVideo', null, {root: true})
      commit('Player/setVolume', parseInt(value, 10), {root: true})
    }
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
  }
}

export default new Vuex.Store({
  state: {
    timer: ''
  },
  mutations: {
    updateTimer (state, timer) {
      state.timer = timer
    },
    stopTimer (state) {
      cancelAnimationFrame(state.timer)
    }
  },
  actions: {
    startTimer ({commit, state}) {
      let loop = () => {
        state.Player.player.getCurrentTime().then((value) => {
          commit('Player/updateCurrentVideoTime', value)
          commit('updateTimer', requestAnimationFrame(loop))
        }).catch(() => {
          console.log('error')
        })
      }
      loop()
    }
  },
  modules: {
    Player,
    Header,
    Controller
  },
  strict: process.env.NODE_ENV !== 'production'
})
