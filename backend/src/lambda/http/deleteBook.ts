import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteBook } from '../../businessLogic/books'
import { createLogger } from '../../utils/logger'


const logger = createLogger('delete-book')

export const handler: APIGatewayProxyHandler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info(`Processing event: ${event}`)
    const bookId = event.pathParameters.bookId
    try {
        const deleteItem = await deleteBook(bookId, event)
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                deleteItem
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