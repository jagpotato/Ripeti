import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

const youtubeDataAPI = 'https://www.googleapis.com/youtube/v3/playlistItems?'
const key = '&key=' + process.env.API_KEY
const maxResults = '&maxResults=50'
// const pageToken = '&pageToken=CDIQAA'

export default {
  async getPlaylist (playlistId) {
    try {
      playlistId = 'playlistId=' + playlistId
      const part = '&part=snippet'
      const request = youtubeDataAPI + playlistId + part + maxResults + key
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
  }
}
