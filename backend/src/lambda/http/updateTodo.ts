import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'
import { updateTodo } from '../../helpers/todos'

const logger = createLogger('UpdateTodoLambda')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    logger.info('executing update todo lambda ', event)

    await updateTodo(updatedTodo, todoId)

    return {
      statusCode: 200,
      body: "updated"
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
