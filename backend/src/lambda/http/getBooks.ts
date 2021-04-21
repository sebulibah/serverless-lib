import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { getAllBooks } from '../../businessLogic/books'
import { createLogger } from '../../utils/logger'


const logger = createLogger('get-all-books')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info(`Processing event: ${event}`)

    try {
        const getAllItems = await getAllBooks(event)
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                items: getAllItems
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