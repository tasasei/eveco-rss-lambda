import { Router } from 'express';
import { parse } from 'node-html-parser'
import { Feed } from 'feed';

const route = Router()
route.get('/rss', async (req, res) => {
  const values = req.query.region
  const region = Array.isArray(values) ? values : values ? [values] : [];

  const feed = new Feed({
    id: 'rss-eveco-ssbu',
    title: 'SSBU Event Info Eveco',
    copyright: 'SSBU',
  })

  const articleRes = await downloadArticles()
  articleRes
    .filter(a => region.length < 1 || region.includes(a.region))
    .forEach(a => {
      const { link, region, title, date } = a
      feed.addItem({
        title: title,
        link,
        date,
        description: region
      })
    })
  const response = feed.rss2()
  res.send(response)
})

export async function downloadArticles() {
  const res = await fetch('https://www.eveco.app/category/_DUYf5x4ndq')
  const d = await res.text()
  const root = parse(d);
  const elements = root.querySelectorAll('main div div div a')

  const articles = elements.map(e => {
    const title = e.getElementsByTagName('h2')[0].innerText
    const link = 'https://www.eveco.app' + e.attributes['href']

    let prevEl = e.previousElementSibling
    let dateStr: string = ''
    while (!dateStr && prevEl) {
      if (prevEl.tagName.toLowerCase() == 'div') {
        // date
        dateStr = prevEl.getElementsByTagName('span')[0].innerText
      }
      prevEl = prevEl.previousElementSibling
    }
    const dateMatch = dateStr.matchAll(/[0-9]+/g)
    const month = Number(dateMatch.next().value[0]) - 1
    const date = Number(dateMatch.next().value[0])
    const now = new Date()
    const currentMonth = now.getMonth()
    const year = month < currentMonth ? now.getFullYear() + 1 : now.getFullYear()

    const hour = e.querySelector('div.text-default-500')?.innerText.match(/^[0-9]+/)
    const timeoffset = 9

    const eventDate = new Date(Date.UTC(year, month, date, timeoffset, 0))
    const region = e.querySelector('div.text-gray-100 > div:last-child')?.innerText || ''
    return {
      title,
      link,
      region,
      date: eventDate,
    }
  })

  return articles
}

export { route }
