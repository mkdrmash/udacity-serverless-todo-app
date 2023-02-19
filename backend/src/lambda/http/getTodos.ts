import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getTodosForUser } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('GetTodos')

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    try {
      logger.info('getting todos ', event)

      const userId = getUserId(event)

      const result = await getTodosForUser(userId)

      if (result.Count !== 0) {
        return {
          statusCode: 200,
          body: JSON.stringify({ items: result.Items })
        }
      } else {
        return {
          statusCode: 200,
          body: JSON.stringify({ items: [] })
        }
      }
    } catch (error) {
      logger.info('getting todos error ', error)

      return {
        statusCode: 500,
        body: JSON.stringify({ error })
      }
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
