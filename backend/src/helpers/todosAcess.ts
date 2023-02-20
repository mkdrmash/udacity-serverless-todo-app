import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
export class TodosAccess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly todosCreatedAtIndex = process.env.TODOS_CREATED_AT_INDEX,
    private readonly attachmentBucket = process.env.ATTACHMENT_S3_BUCKET
  ) {}

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    logger.info('getting all todos')

    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        IndexName: this.todosCreatedAtIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    const items = result.Items
    return items as TodoItem[]
  }

  async createTodo(todoItem: TodoItem): Promise<TodoItem> {
    logger.info('creating todo')

    todoItem.attachmentUrl = `https://${this.attachmentBucket}.s3.amazonaws.com/${todoItem.todoId}`
    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: todoItem
      })
      .promise()

    return todoItem
  }

  async updateTodo(todoUpdate: TodoUpdate, todoId: string) {
    logger.info('updating todo')

    return await this.docClient
    .update({
      TableName: this.todosTable,
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
        ':name': todoUpdate.name,
        ':dueDate': todoUpdate.dueDate,
        ':done': todoUpdate.done
      }
    })
    .promise()
  }

  async deleteTodo(todoId: string) {
    logger.info('deleting todo')

    return await this.docClient
    .delete({
      TableName: this.todosTable,
      Key: {
        todoId: todoId
      }
    })
    .promise()
  }
}
