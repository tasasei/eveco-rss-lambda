import { Router } from 'express';
import { Feed } from 'feed';

const baseUrl = 'https://www.start.gg'

const route = Router()
route.get('/rss', async (req, res) => {
  // get query parameters
  const values = req.query.addrState
  const queryAddrState = Array.isArray(values) ? values : values ? [values] : [];

  const feed = new Feed({
    id: 'rss-startgg',
    title: 'SSBU Event Info Startgg',
    copyright: 'SSBU',
  })
  const articleRes = await downloadArticles()
  articleRes
    .filter(a => queryAddrState.length < 1 || queryAddrState.includes(a.addrState))
    .forEach(a => {
      const { url, countryCode, name, startAt, addrState } = a
      const startDate = new Date(startAt * 1000)
      const startDateStr = startDate.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      feed.addItem({
        title: name,
        link: baseUrl + url,
        date: new Date(startAt * 1000),
        description: countryCode + ' ' + addrState + '\n' + startDateStr
      })
    })

  const response = feed.rss2()
  res.send(response)
})

const token = process.env.STARTGG_API_TOKEN
const endpoint = 'https://api.start.gg/gql/alpha'

// shema: https://smashgg-schema.netlify.app/reference/tournamentpagefilter.doc
const query = `
  query TournamentsByVideogames($perPage: Int, $videogameIds: [ID]) {
    tournaments(query: {
      perPage: $perPage
      page: 1
      sortBy: "startAt desc"
      filter: {
        upcoming: true
        videogameIds: $videogameIds
        countryCode: "JP"
      }
    }) {
      nodes {
        id
        name
        slug
        startAt
        addrState
        countryCode
        url
      }
    }
  }
`;

const variables = {
  "perPage": 100,
  // start.gg's SSBU id = 1386
  "videogameIds": [1386],
};

export async function downloadArticles(): Promise<{
  id: number
  name: string
  slug: number
  startAt: number
  addrState: string
  countryCode: string
  url: string
}[]> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })
    .then(res => res.json())
    .then(data => {
      const nodes = data?.data?.tournaments?.nodes
      if (!Array.isArray(nodes)) {
        console.error(data)
        return []
      }
      return nodes
    })
  return res
}

export { route }
