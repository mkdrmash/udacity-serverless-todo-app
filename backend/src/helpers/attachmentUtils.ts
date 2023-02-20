import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('GenerateAttachmentURL')

// TODO: Implement the fileStogare logic
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

const attachmentBucket = process.env.ATTACHMENT_S3_BUCKET
const signedUrlExpiration = process.env.SIGNED_URL_EXPIRATION

export const createAttachmentPresignedUrl = (todoId: string): string => {
  logger.info("generating s3 storage upload url for todo ", todoId)

  return s3.getSignedUrl('putObject', {
    Bucket: attachmentBucket,
    Key: todoId,
    Expires: parseInt(signedUrlExpiration)
  })
}
