import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { createLogger } from '../../utils/logger'
import { getAllTodos } from '../../helpers/todos'

const logger = createLogger('GetTodosLambda')

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    logger.info('executing get todos lambda ', event)

    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]

    const todos = await getAllTodos(jwtToken)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ items: todos })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
