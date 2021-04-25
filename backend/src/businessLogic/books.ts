import * as uuid from 'uuid'

import { APIGatewayProxyEvent } from 'aws-lambda';
import { BookItem } from '../models/BookItem'
import { BookAccess } from '../dataLayer/bookAccess'
import { CreateBookRequest } from '../requests/CreateBookRequest'
import { UpdateBookRequest } from '../requests/UpdateBookRequest'
import { getUserId } from '../lambda/utils'


const bookAccess = new BookAccess()

export async function createBook(
    event: APIGatewayProxyEvent,
    createBookRequest: CreateBookRequest): Promise<BookItem>{
    const itemId = uuid.v4()
    const userId = getUserId(event)

    const book = {
        userId,
        bookId: itemId,
        createdAt: new Date().toISOString(),
        title: createBookRequest.title,
        dueDate: createBookRequest.dueDate,
        completed: false
    }
    await bookAccess.createBook(book)
    return book
}

export async function getAllBooks(event: APIGatewayProxyEvent): Promise<BookItem[]>{
    const userId = getUserId(event)
    return await bookAccess.getAllBooks(userId)
}

export async function updateBook(
    bookId: string,
    event: APIGatewayProxyEvent,
    updateBookRequest: UpdateBookRequest): Promise<BookItem>{

    const userId = getUserId(event)

    return await bookAccess.updateBook({
        userId,
        bookId,
        createdAt: new Date().toISOString(),
        title: updateBookRequest.title,
        dueDate: updateBookRequest.dueDate,
        completed: updateBookRequest.completed
    })
}

export async function deleteBook(
    bookId: string,
    event: APIGatewayProxyEvent
    ): Promise<string>{

    const userId = getUserId(event)
    return await bookAccess.deleteBook(userId, bookId)

}

export async function generateUploadURL(bookId: string): Promise<string> {
    return bookAccess.generateUploadUrl(bookId)
}
