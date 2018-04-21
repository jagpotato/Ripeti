import Vue from 'vue'
import Vuex from 'vuex'
import VueYoutube from 'vue-youtube'
import db from '@/api/db'
import youtubeData from '@/api/youtube'

Vue.use(Vuex)
Vue.use(VueYoutube)

/******************
*******************
* Player
*******************
*******************/
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
    currentVolume: 50,
    isEnd: false,
    isPlaying: false,
    isMute: false,
    isChapterDisplayed: false,
    isPlaylist: false,
    playlistItems: [],
    playlistPosition: 0,
    controllerOpacity: 0,
    seekBarBackground: '',
    volumeBarBackground: ''
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
    setPlaylist (state, items) {
      state.playlistItems = items.slice()
      state.playlistPosition = 0
      state.isPlaylist = true
    },
    endPlaylist (state) {
      state.playlistItems = []
      state.playlistPosition = 0
      state.isPlaylist = false
    },
    setPlaylistPosition (state, position) {
      state.playlistPosition = position
    },
    playVideo (state) {
      if (state.isEnd === true) {
        state.isEnd = false
      }
      state.isPlaying = true
      state.player.playVideo()
    },
    pauseVideo (state) {
      state.isPlaying = false
      state.player.pauseVideo()
    },
    setEndFlag (state) {
      state.isPlaying = false
      state.isEnd = true
    },
    toggleMute (state) {
      state.isMute = !state.isMute
      if (state.isMute === true) {
        state.player.mute()
      } else {
        state.player.unMute()
      }
    },
    setVolume (state, value) {
      state.isMute = false
      state.player.unMute()
      state.currentVolume = value
      const point = state.currentVolume / 100
      state.volumeBarBackground = '-webkit-gradient(linear, left top, right top, ' + 'color-stop(' + point + ', #ffffff), ' + 'color-stop(' + point + ', #707070))'
      state.player.setVolume(state.currentVolume)
    },
    resize (state) {
      state.player.setSize(window.innerWidth, window.innerHeight)
    },
    seekVideo (state) {
      state.player.seekTo(state.currentVideoTime, true)
    },
    setDuration (state, value) {
      state.videoDuration = Math.round(value)
    },
    updateCurrentVideoTime (state, value) {
      state.currentVideoTime = Math.ceil(value)
      let point = state.currentVideoTime / state.videoDuration
      if (point < 0.2) {
        point += 0.01
      }
      state.seekBarBackground = '-webkit-gradient(linear, left top, right top, ' + 'color-stop(' + point + ', #f44336), ' + 'color-stop(' + point + ', #707070))'
    },
    toggleChapterListDisplay (state) {
      state.isChapterDisplayed = !state.isChapterDisplayed
    },
    setControllerOpacity (state, opacity) {
      state.controllerOpacity = opacity
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
      commit('Controller/disablePlayButton', null, {root: true})
      commit('setVolume', state.currentVolume)
    },
    async initChapterList ({commit, state, rootState}) {
      const dbData = await db.searchVideoId(state.videoId)
      if (dbData === null) {
        // dbにvideoIdが存在しない場合，追加
        await db.insertVideoId(state.videoId)
        // historyListに追加
        youtubeData.getVideoTitle(state.videoId)
          .then((title) => {
            const id = state.videoId
            commit('History/addHistory', {id, title}, {root: true})
          })
      }
      commit('Controller/loadChapterList', dbData, {root: true})
    },
    getVideoDuration ({commit, state}) {
      if (state.videoDuration === 0) {
        // 動画時間の取得
        state.player.getDuration().then((value) => {
          commit('setDuration', value)
        }).catch(() => {
          console.log('error')
        })
      }
    },
    toggleControllerOpacity ({commit, state}, {event}) {
      switch (event.type) {
        case 'mouseenter':
          commit('setControllerOpacity', 1)
          break
        case 'mouseleave':
          commit('setControllerOpacity', 0)
          break
        default: break
      }
    },
    endVideo ({commit, state}) {
      if (state.isPlaylist === true) {
        commit('setPlaylistPosition', state.playlistPosition + 1)
        commit('cueVideo', state.playlistItems[state.playlistPosition])
        commit('Controller/disablePlayButton', null, {root: true})
      } else {
        commit('setEndFlag')
        commit('Controller/stopTimer', null, {root: true})
      }
    }
  }
}

/******************
*******************
* Header
*******************
*******************/
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
    searchVideo ({commit, state, rootState, dispatch}) {
      if (state.url !== '') {
        const splitUrl = state.url.match(/v=[0-9a-zA-Z-_]+|list=[0-9a-zA-Z-_]+/)
        // /\/[0-9a-zA-Z-_]{11}/ 動画を右クリック，「動画のURLをコピー」用
        // 動画の読み込み
        if (/^v=/.test(splitUrl) === true) {
          if (rootState.Player.isPlaylist === true) {
            commit('Player/endPlaylist', null, {root: true})
          }
          const id = splitUrl[0].substr(2)
          commit('Player/cueVideo', id, {root: true})
          commit('Controller/disablePlayButton', null, {root: true})
        // プレイリストの読み込み
        } else if (/^list=/.test(splitUrl) === true) {
          const playlistId = splitUrl[0].substr(5)
          let playlistItems = []
          youtubeData.getPlaylist(playlistId)
            .then((items) => {
              for (let item of items) {
                playlistItems.push(item.snippet.resourceId.videoId)
              }
              // dbに再生リスト登録
              dispatch('searchPlaylistDB', {playlistId, playlistItems})
              commit('Player/setPlaylist', playlistItems, {root: true})
              commit('Player/cueVideo', playlistItems[0], {root: true})
              commit('Controller/disablePlayButton', null, {root: true})
            })
        }
        commit('initUrl')
      }
    },
    async searchPlaylistDB ({commit, state}, {playlistId, playlistItems}) {
      const dbData = await db.searchPlaylistId(playlistId)
      if (dbData === null) {
        await db.insertPlaylistId(playlistId, playlistItems)
        youtubeData.getPlaylistTitle(playlistId, playlistItems[0])
          .then(({src, title}) => {
            commit('Playlist/addPlaylist', {playlistId, src, title, playlistItems}, {root: true})
          })
      }
    },
    inputUrl ({commit, state}, {url}) {
      commit('updateUrl', url)
    },
    openMenu ({commit, state}) {
      commit('Menu/toggleMenu', null, {root: true})
    }
  }
}

/******************
*******************
* Controller
*******************
*******************/
const Controller = {
  namespaced: true,
  state: {
    timer: '',
    chapterList: [],
    isPlayButtonDisabled: true,
    isSeekbarDisabled: true,
    isChapterButtonDisabled: true
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
    },
    getDate (state) {
      return (date) => {
        const year = date.getFullYear().toString(10)
        const month = ('0' + (date.getMonth() + 1)).substr(-2)
        const day = ('0' + date.getDate()).substr(-2)
        const hours = ('0' + date.getHours()).substr(-2)
        const minutes = ('0' + date.getMinutes()).substr(-2)
        const seconds = ('0' + date.getSeconds()).substr(-2)
        return year + month + day + hours + minutes + seconds
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
    disablePlayButton (state) {
      state.isPlayButtonDisabled = true
    },
    enablePlayButton (state) {
      state.isPlayButtonDisabled = false
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
    },
    enableChapterButton (state) {
      state.isChapterButtonDisabled = false
    }
  },
  actions: {
    async playVideo ({commit, state, dispatch, rootState, getters, rootGetters}) {
      // initChapterListアクションを先に実行
      await dispatch('Player/initChapterList', null, {root: true})
      // 再生ボタンを使用可能にする
      commit('enablePlayButton')
      // シークバーを使用可能にする
      if (state.isSeekbarDisabled === true) {
        commit('enableSeekbar')
      }
      // チャプターボタンを使用可能にする
      if (state.isChapterButtonDisabled === true) {
        commit('enableChapterButton')
      }
      // dbに再生日時を登録
      const date = getters.getDate(new Date())
      db.updatePlaybackDate(rootState.Player.videoId, date)
      const index = rootGetters['History/getHistoryIndex'](rootState.Player.videoId)
      // 既に履歴にある場合，再生する動画を履歴の一番上に
      if (index !== -1) {
        commit('History/updateHistory', index, {root: true})
      }
      // requestAnimationFrame
      const loop = () => {
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
      commit('stopTimer')
      commit('Player/pauseVideo', null, {root: true})
    },
    addChapter ({commit, state, getters, rootState}, {currentTime, currentTimeText}) {
      // chapterListに同じ時間のchapterが含まれていない場合，chapterを追加
      if (getters.getChapterIndex(currentTime) === -1) {
        commit('addChapter', {currentTime, currentTimeText})
        db.updateChapterList(rootState.Player.videoId, state.chapterList)
      }
    },
    removeChapter ({commit, state, getters, rootState}, {value}) {
      const index = getters.getChapterIndex(value.time)
      commit('removeChapter', index)
      db.updateChapterList(rootState.Player.videoId, state.chapterList)
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
    },
    toggleMute ({commit, state}) {
      commit('Player/toggleMute', null, {root: true})
    },
    openChapterList ({commit, state}) {
      commit('Player/toggleChapterListDisplay', null, {root: true})
    }
  }
}

/******************
*******************
* Menu
*******************
*******************/
const Menu = {
  namespaced: true,
  state: {
    isMenuDisplayed: false
  },
  getters: {},
  mutations: {
    toggleMenu (state) {
      state.isMenuDisplayed = !state.isMenuDisplayed
    }
  },
  actions: {
    closeMenu ({commit, state, rootState}) {
      if (rootState.History.isHistoryDisplayed === true) {
        commit('History/toggleHistoryDisplay', null, {root: true})
      } else if (rootState.Playlist.isPlaylistDisplayed === true) {
        commit('Playlist/togglePlaylistDisplay', null, {root: true})
      }
      if (state.isMenuDisplayed === true) {
        commit('toggleMenu')
      }
    }
  }
}

/******************
*******************
* History
*******************
*******************/
const History = {
  namespaced: true,
  state: {
    historyList: [],
    isHistoryDisplayed: false,
    historyOpenButtonColor: ''
  },
  getters: {
    getHistoryIndex (state) {
      return (id) => {
        for (let i = 0; i < state.historyList.length; i++) {
          if (state.historyList[i].videoId === id) {
            return i
          }
        }
        return -1
      }
    }
  },
  mutations: {
    initHistory (state, {data, title}) {
      // dbDataを元にhisotryListを初期化
      const src = 'https://i.ytimg.com/vi/' + data.videoId + '/default.jpg'
      state.historyList.push({videoId: data.videoId, thumbnail: src, title: title, playbackDate: data.playbackDate})
      // playbackDateが大きい(最新)順にソート
      state.historyList.sort((a, b) => {
        if (a.playbackDate < b.playbackDate) {
          return 1
        }
        if (a.playbackDate > b.playbackDate) {
          return -1
        }
      })
    },
    addHistory (state, {id, title}) {
      const src = 'https://i.ytimg.com/vi/' + id + '/default.jpg'
      state.historyList.unshift({videoId: id, thumbnail: src, title: title, playbackDate: 0})
    },
    updateHistory (state, index) {
      const select = state.historyList.splice(index, 1)
      state.historyList.unshift(select[0])
    },
    toggleHistoryDisplay (state) {
      state.isHistoryDisplayed = !state.isHistoryDisplayed
    },
    setHistoryOpenButtonColor (state, color) {
      state.historyOpenButtonColor = color
    },
    removeHistory (state, index) {
      state.historyList.splice(index, 1)
    }
  },
  actions: {
    async getHistoryFromDB ({commit, state}) {
      // dbのvideoIdをhistoryListに格納
      const dbData = await db.getHistory()
      for (let data of dbData) {
        youtubeData.getVideoTitle(data.videoId)
          .then((title) => {
            commit('initHistory', {data, title})
          })
      }
    },
    toggleHistory ({commit, state, rootState}) {
      if (state.isHistoryDisplayed === false) {
        // Playlistを開いている場合，Playlistを閉じる
        if (rootState.Playlist.isPlaylistDisplayed === true) {
          commit('Playlist/setPlaylistOpenButtonColor', '', {root: true})
          commit('Playlist/togglePlaylistDisplay', null, {root: true})
        }
        commit('setHistoryOpenButtonColor', 'rgba(255, 255, 255, 0.2)')
      } else {
        commit('setHistoryOpenButtonColor', '')
      }
      commit('toggleHistoryDisplay')
    },
    selectHistory ({commit, state, rootState}, {videoId}) {
      if (rootState.Player.isPlaylist === true) {
        commit('Player/endPlaylist', null, {root: true})
      }
      commit('Player/cueVideo', videoId, {root: true})
      commit('Controller/disablePlayButton', null, {root: true})
    },
    removeHistory ({commit, getters}, {videoId}) {
      db.removeChapterList(videoId)
      const index = getters.getHistoryIndex(videoId)
      commit('removeHistory', index)
    }
  }
}

/******************
*******************
* Playlist
*******************
*******************/
const Playlist = {
  namespaced: true,
  state: {
    playlistList: [],
    isPlaylistDisplayed: false,
    playlistOpenButtonColor: ''
  },
  getters: {
    getPlaylistIndex (state) {
      return (id) => {
        for (let i = 0; i < state.playlistList.length; i++) {
          if (state.playlistList[i].playlistId === id) {
            return i
          }
        }
        return -1
      }
    }
  },
  mutations: {
    initPlaylistList (state, {data, src, title}) {
      state.playlistList.push({playlistId: data.playlistId, thumbnail: src, title: title, items: data.items})
    },
    addPlaylist (state, {playlistId, src, title, playlistItems}) {
      state.playlistList.unshift({playlistId: playlistId, thumbnail: src, title: title, items: playlistItems})
    },
    togglePlaylistDisplay (state) {
      state.isPlaylistDisplayed = !state.isPlaylistDisplayed
    },
    setPlaylistOpenButtonColor (state, color) {
      state.playlistOpenButtonColor = color
    },
    removePlaylist (state, index) {
      state.playlistList.splice(index, 1)
    }
  },
  actions: {
    async getPlaylistFromDB ({commit, state}) {
      const dbData = await db.getPlaylist()
      for (let data of dbData) {
        youtubeData.getPlaylistTitle(data.playlistId, data.items[0])
          .then(({src, title}) => {
            commit('initPlaylistList', {data, src, title})
          })
      }
    },
    togglePlaylist ({commit, state, rootState}) {
      if (state.isPlaylistDisplayed === false) {
        // Historyを開いている場合，Historyを閉じる
        if (rootState.History.isHistoryDisplayed === true) {
          commit('History/setHistoryOpenButtonColor', '', {root: true})
          commit('History/toggleHistoryDisplay', null, {root: true})
        }
        commit('setPlaylistOpenButtonColor', 'rgba(255, 255, 255, 0.2)')
      } else {
        commit('setPlaylistOpenButtonColor', '')
      }
      commit('togglePlaylistDisplay')
    },
    selectPlaylist ({commit, state}, {playlistItems}) {
      commit('Player/setPlaylist', playlistItems, {root: true})
      commit('Player/cueVideo', playlistItems[0], {root: true})
      commit('Controller/disablePlayButton', null, {root: true})
    },
    removePlaylist ({commit, getters}, {playlistId}) {
      db.removePlaylist(playlistId)
      const index = getters.getPlaylistIndex(playlistId)
      commit('removePlaylist', index)
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
    Controller,
    Menu,
    History,
    Playlist
  },
  strict: process.env.NODE_ENV !== 'production'
})
