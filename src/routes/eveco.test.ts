import { downloadArticles } from './eveco'
import { Feed } from 'feed'

test('downloadArticles', async () => {
  const articleRes = await downloadArticles()
  // articleRes.data.article_list.forEach(a => {
  //   const { _id, url, hashtag, title, updated, thumbnail } = a
  //   const thumbnailReplaced = thumbnail?.replace(/\?.*$/, '')
  //   feed.addItem({
  //     title: title,
  //     id: _id,
  //     link: url,
  //     date: new Date(updated * 1000),
  //     enclosure: thumbnailReplaced ? {
  //       url: thumbnailReplaced && 'https://cmsapi-frontend.idolmaster-official.jp/sitern/api/idolmaster/Image/get?path=' + thumbnailReplaced,
  //       type: 'image/' + thumbnailReplaced.split('.').pop(),
  //       length: 0,
  //     } : undefined,
  //     description: title + '\n' + (hashtag || '') 
  //   })
  // })
  // const response = feed.rss2()
  console.log(articleRes)
})
