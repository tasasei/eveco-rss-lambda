import 'dotenv/config'
import { downloadArticles } from './startgg'

test('downloadArticles', async () => {
  const articleRes = await downloadArticles()
  console.log(articleRes)
})