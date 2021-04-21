import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateBookRequest } from '../../requests/UpdateBookRequest'
import { updateBook } from '../../businessLogic/books'
import { createLogger } from '../../utils/logger'


const logger = createLogger('update-book')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info(`Processing event: ${event}`)
    const bookId = event.pathParameters.bookId
    const updatedBook: UpdateBookRequest = JSON.parse(event.body)
    
    try {
        const updatedItem = await updateBook(bookId, event, updatedBook)
        return {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                updatedItem
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