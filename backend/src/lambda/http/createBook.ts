import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateBookRequest } from '../../requests/CreateBookRequest'

import { createBook } from '../../businessLogic/books'
import { createLogger } from '../../utils/logger'

const logger = createLogger('create-book')

export const handler: APIGatewayProxyHandler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>{
    const newBook: CreateBookRequest = JSON.parse(event.body)
    logger.info(`Processing ${event}`)

    try {
        const newItem = await createBook(event, newBook)
        return {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                item: newItem
            })
        }
    } catch (e) {
        logger.error(`Error: ${e.message}`)
        return {
            statusCode: 500,
            body: e.message
        }
    }
}