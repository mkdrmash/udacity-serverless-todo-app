import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import * as uuid from 'uuid'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { createTodo } from '../../businessLogic/todos'

const logger = createLogger('CreateTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const newTodo: CreateTodoRequest = JSON.parse(event.body)
      // TODO: Implement creating a new TODO item

      logger.info('creating todo ', event)

      const todoId = uuid.v4()
      const userId = getUserId(event)

      const newItem = await createTodo(todoId, userId, newTodo)

      return {
        statusCode: 201,
        body: JSON.stringify({item: newItem})
      }
    } catch (error) {
      logger.info('creating todo error ', error)

      return {
        statusCode: 500,
        body: JSON.stringify({error})
      }
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
