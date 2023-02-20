//import { TodosAccess } from './todosAcess'
//import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'
import { parseUserId } from '../auth/utils'
import { TodosAccess } from './todosAcess'
import { createAttachmentPresignedUrl } from './attachmentUtils'

// TODO: Implement businessLogic
const todosAccess = new TodosAccess()

export async function getAllTodos(jwtToken: string): Promise<TodoItem[]> {
  const userId = parseUserId(jwtToken)
  return todosAccess.getAllTodos(userId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> {
  const itemId = uuid.v4()
  const userId = parseUserId(jwtToken)

  createTodoRequest.todoId = itemId
  createTodoRequest.userId = userId
  createTodoRequest.done = false
  createTodoRequest.createdAt = new Date().toISOString()

  return await todosAccess.createTodo(createTodoRequest)
}

export async function updateTodo(
  updateTodoRequest: UpdateTodoRequest,
  todoId: string
) {
  return await todosAccess.updateTodo(updateTodoRequest, todoId)
}

export async function deleteTodo(todoId: string) {
  return await todosAccess.deleteTodo(todoId)
}

export function attachmentUrl(todoId: string): string {
  return createAttachmentPresignedUrl(todoId)
}
