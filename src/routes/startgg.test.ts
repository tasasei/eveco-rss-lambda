import 'dotenv/config'
import { downloadArticles } from './startgg'
import { Feed } from 'feed';

test('downloadArticles', async () => {
  const baseUrl = 'https://www.start.gg'
  const queryAddrState = ['東京都']
  const articleRes = await downloadArticles()
  const feed = new Feed({
      id: 'rss-startgg',
      title: 'SSBU Event Info Startgg',
      copyright: 'SSBU',
    })
  articleRes
    .filter(a => {
      return queryAddrState.length < 1 || queryAddrState.includes(a.addrState)
    })
    .forEach(a => {
      const { url, countryCode, name, startAt, addrState } = a
      console.log(a)
      feed.addItem({
        title: name,
        link: baseUrl + url,
        date: new Date(startAt * 1000),
        description: countryCode + ' ' + addrState
      })
    })
  console.log(articleRes)
})
