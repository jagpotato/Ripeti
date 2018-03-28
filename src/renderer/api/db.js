import Datastore from 'nedb'
import path from 'path'
import {remote} from 'electron'

const db = new Datastore({
  filename: path.join(remote.app.getPath('userData'), 'chapterlist.json'),
  autoload: true
})

export default {
  searchVideoId (id) {
    return new Promise((resolve) => {
      db.findOne({'videoId': id}, (err, docs) => {
        if (err) {
          console.log(err)
        }
        resolve(docs)
      })
    })
  },
  insertVideoId (id) {
    return new Promise((resolve) => {
      db.insert({videoId: id, chapterList: [], playbackDate: ''})
      resolve()
    })
  },
  updatePlaybackDate (id, date) {
    db.update({'videoId': id}, {$set: {playbackDate: date}})
  },
  updateChapterList (id, chapterList) {
    db.update({'videoId': id}, {$set: {chapterList: chapterList}})
  },
  getHistory () {
    return new Promise((resolve) => {
      db.find({}, (err, docs) => {
        if (err) {
          console.log(err)
        }
        resolve(docs)
      })
    })
  },
  remove (id) {
    db.remove({'videoId': id}, {})
  }
}
