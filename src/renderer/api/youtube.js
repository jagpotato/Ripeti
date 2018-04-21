import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

const playlistsAPI = 'https://www.googleapis.com/youtube/v3/playlists?'
const playlistItemsAPI = 'https://www.googleapis.com/youtube/v3/playlistItems?'
const videosAPI = 'https://www.googleapis.com/youtube/v3/videos?'
const key = '&key=' + process.env.API_KEY
const maxResults = '&maxResults=50'
// const pageToken = '&pageToken=CDIQAA'

export default {
  async getPlaylist (playlistId) {
    try {
      playlistId = 'playlistId=' + playlistId
      const part = '&part=snippet'
      const request = playlistItemsAPI + playlistId + part + maxResults + key
      let response = await axios.get(request)
      let items = response.data.items
      // console.log(response.data.items.length)
      if (response.data.pageInfo.totalResults > 50) {
        const total = response.data.pageInfo.totalResults
        let count = 50
        let nextPageToken
        while (count !== total) {
          nextPageToken = response.data.nextPageToken
          response = await axios.get(request + '&pageToken=' + nextPageToken)
          items = items.concat(response.data.items)
          count += response.data.items.length
        }
      }
      return items
    } catch (error) {
      console.error(error)
    }
  },
  async getVideoTitle (videoId) {
    try {
      videoId = 'id=' + videoId
      const part = '&part=snippet'
      const request = videosAPI + videoId + part + key
      const response = await axios.get(request)
      return response.data.items[0].snippet.title
    } catch (error) {
      console.error(error)
    }
  },
  async getPlaylistTitle (playlistId, firstVideoId) {
    try {
      playlistId = 'id=' + playlistId
      const part = '&part=snippet'
      let request = playlistsAPI + playlistId + part + key
      let response = await axios.get(request)
      const playlistTitle = response.data.items[0].snippet.title
      firstVideoId = 'id=' + firstVideoId
      request = videosAPI + firstVideoId + part + key
      response = await axios.get(request)
      const thumbnailSrc = response.data.items[0].snippet.thumbnails.default.url
      return {src: thumbnailSrc, title: playlistTitle}
    } catch (error) {
      console.error(error)
    }
  }
}
