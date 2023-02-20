import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createLogger } from '../../utils/logger'
import { attachmentUrl } from '../../helpers/todos'

const logger = createLogger('GenerateAttachmentURLLambda')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    logger.info('executing upload url lambda ', event)

    const url = attachmentUrl(todoId)

    return {
      statusCode: 201,
      body: JSON.stringify({ uploadUrl: url })
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
