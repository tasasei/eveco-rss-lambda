import { Feed } from 'feed';
import { LambdaFunctionURLHandler, LambdaFunctionURLResult } from 'aws-lambda'
import { downloadArticles } from './api'

export const handler: LambdaFunctionURLHandler = async (event, context): Promise<LambdaFunctionURLResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  // As Lambda URL Function
  const region = event.queryStringParameters?.region?.split(',') || []

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

  return {
    statusCode: 200,
    body: response,
  };
};
