export interface BookItem {
    userId: string
    bookId: string
    createdAt: string
    title: string
    dueDate: string
    completed: boolean
    attachmentUrl?: string
}
