/**
 * Fields in a request to create a single TODO item.
 */
export interface CreateTodoRequest {
  name: string
  dueDate: string
  todoId: string,
  userId: string,
  done: boolean,
  createdAt: string,
  attachmentUrl: string
}
