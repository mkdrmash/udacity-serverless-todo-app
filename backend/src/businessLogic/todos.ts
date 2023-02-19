import * as AWS from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE
const attachmentBucket = process.env.ATTACHMENT_S3_BUCKET
const todosCreatedAtIndex = process.env.TODOS_CREATED_AT_INDEX
const signedUrlExpiration = process.env.SIGNED_URL_EXPIRATION

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

export const createTodo = async (todoId, userId, newTodo) => {
  const newItem = {
    todoId: todoId,
    userId: userId,
    done: false,
    createdAt: new Date(),
    attachmentUrl: `https://${attachmentBucket}.s3.amazonaws.com/${todoId}`,
    ...newTodo
  }

  await docClient
    .put({
      TableName: todosTable,
      Item: newItem
    })
    .promise()

  return newItem
}

export const deleteTodo = async (todoId) => {
  return await docClient
    .delete({
      TableName: todosTable,
      Key: {
        todoId: todoId
      }
    })
    .promise()
}

export const getTodosForUser = async (userId) => {
  return await docClient
    .query({
      TableName: todosTable,
      IndexName: todosCreatedAtIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    })
    .promise()
}

export const createAttachmentPresignedUrl = (todoId) => {
  return s3.getSignedUrl('putObject', {
    Bucket: attachmentBucket,
    Key: todoId,
    Expires: parseInt(signedUrlExpiration)
  })
}

export const updateTodo = async (todoId, updatedTodo) => {
  return await docClient
    .update({
      TableName: todosTable,
      Key: {
        todoId: todoId
      },
      UpdateExpression: 'SET #name = :name, #dueDate = :dueDate, #done = :done',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#dueDate': 'dueDate',
        '#done': 'done'
      },
      ExpressionAttributeValues: {
        ':name': updatedTodo.name,
        ':dueDate': updatedTodo.dueDate,
        ':done': updatedTodo.done
      }
    })
    .promise()
}
