import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
const XAWS = AWSXRay.captureAWS(AWS)

import { createLogger } from '../utils/logger'
import { BookItem } from '../models/BookItem'
//import { BookUpdate } from '../models/BookUpdate'

const logger = createLogger('book-access')

export class BookAccess {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
        private readonly booksTable = process.env.BOOKS_TABLE,
        private readonly bucketName = process.env.S3_BUCKET,
        private readonly indexName = process.env.INDEX_NAME
    ){}

    async createBook(book: BookItem):Promise<BookItem> {
        logger.info('Creating new book')

        const newBook = {
            ...book,
            attachmentUrl: `https://${this.bucketName}.s3.amazonaws.com/${book.bookId}`
        }
        await this.docClient.put({
            TableName: this.booksTable,
            Item: newBook
        })
        .promise()
        logger.info(`Created book: ${book.bookId}`)

        return newBook
    }
    
    async getAllBooks(userId: string): Promise<BookItem[]>{
        logger.info(`Getting all books for user: ${userId}`)

        const result = await this.docClient.query({
            TableName: this.booksTable,
            IndexName: this.indexName,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
            ':userId': userId
            },
        }).promise()

        logger.info('Returned books')
        console.log(result.Items)

        const items = result.Items
        return items as BookItem[]
    }

    async updateBook(book: BookItem): Promise<BookItem>{
        logger.info(`Updating book: ${book.title}`)

        const updateExpression = 'set title = :title, dueDate = :dueDate, completed = :completed'

        await this.docClient.update({
            TableName: this.booksTable,
            Key: {
                userId: book.userId,
                bookId: book.bookId
            },
            UpdateExpression: updateExpression,
            ConditionExpression: 'bookId = :bookId',
            ExpressionAttributeValues: {
                ':title': book.title,
                ':dueDate': book.dueDate,
                ':completed': book.completed,
                ":bookId": book.bookId
            },
            ReturnValues: 'UPDATED_NEW'
        })
        .promise()
        logger.info(`Updated book: ${book.bookId}`)

        return book
    }

    async deleteBook(userId: string, bookId: string): Promise<string> {
        logger.info(`Deleting book: ${bookId}`)
        await this.docClient.delete({
            TableName: this.booksTable,
            Key: {
                userId,
                bookId
            },
            ConditionExpression: 'bookId = :bookId',
            ExpressionAttributeValues: {
            ':bookId': bookId
            }
        })
        .promise()
        logger.info('Deleted book')
        return userId
    }

    async generateUploadUrl(bookId: string){
        logger.info('Generating upload URL')

        return this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: bookId,
            Expires: 300,
        })
    }
}


const createDynamoDBClient = () => {
    return new XAWS.DynamoDB.DocumentClient()
}
