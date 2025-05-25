import { Router } from 'express';
import { Feed } from 'feed';

const baseUrl = 'https://www.start.gg'

const route = Router()
route.get('/rss', async (req, res) => {
  const feed = new Feed({
    id: 'rss-startgg',
    title: 'SSBU Event Info Startgg',
    copyright: 'SSBU',
  })
  const articleRes = await downloadArticles()
  articleRes
    .forEach(a => {
      const { url, countryCode, name, startAt, addrState } = a
      feed.addItem({
        title: name,
        link: baseUrl + url,
        date: new Date(startAt * 1000),
        description: countryCode + ' ' + addrState
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
      sortBy: "startAt asc"
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
