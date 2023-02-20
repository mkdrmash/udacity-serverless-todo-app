import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { deleteTodo } from '../../helpers/todos'

const logger = createLogger('DeleteTodoLambda')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Remove a TODO item by id
    logger.info('executing delete todo lambda ', event)

    await deleteTodo(todoId)

    return {
      statusCode: 200,
      body: "deleted"
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
