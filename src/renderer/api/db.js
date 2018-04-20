import Datastore from 'nedb'
import path from 'path'
import {remote} from 'electron'

const chapterListDB = new Datastore({
  filename: path.join(remote.app.getPath('userData'), 'chapterlist.json'),
  autoload: true
})

const playlistDB = new Datastore({
  filename: path.join(remote.app.getPath('userData'), 'playlist.json'),
  autoload: true
})

export default {
  // chapterList
  searchVideoId (id) {
    return new Promise((resolve) => {
      chapterListDB.findOne({'videoId': id}, (err, docs) => {
        if (err) {
          console.log(err)
        }
        resolve(docs)
      })
    })
  },
  insertVideoId (id) {
    return new Promise((resolve) => {
      chapterListDB.insert({videoId: id, chapterList: [], playbackDate: ''})
      resolve()
    })
  },
  updatePlaybackDate (id, date) {
    chapterListDB.update({'videoId': id}, {$set: {playbackDate: date}})
  },
  updateChapterList (id, chapterList) {
    chapterListDB.update({'videoId': id}, {$set: {chapterList: chapterList}})
  },
  getHistory () {
    return new Promise((resolve) => {
      chapterListDB.find({}, (err, docs) => {
        if (err) {
          console.log(err)
        }
        resolve(docs)
      })
    })
  },
  remove (id) {
    chapterListDB.remove({'videoId': id}, {})
  },
  // playlist
  searchPlaylistId (id) {
    return new Promise((resolve) => {
      playlistDB.findOne({'playlistId': id}, (err, docs) => {
        if (err) {
          console.log(err)
        }
        resolve(docs)
      })
    })
  },
  insertPlaylistId (id, items) {
    return new Promise((resolve) => {
      playlistDB.insert({playlistId: id, items: items})
      resolve()
    })
  }
}
