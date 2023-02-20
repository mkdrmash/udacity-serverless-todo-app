import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createLogger } from '../../utils/logger'
import { createTodo } from '../../helpers/todos'

const logger = createLogger('CreateTodoLambda')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item

    logger.info('executing create todo lambda ', event)

    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]

    const newItem = await createTodo(newTodo, jwtToken)

    return {
      statusCode: 201,
      body: JSON.stringify({ item: newItem })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
