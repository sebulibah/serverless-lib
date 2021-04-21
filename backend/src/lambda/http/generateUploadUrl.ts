import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { generateUploadURL } from '../../businessLogic/books'
import { createLogger } from '../../utils/logger'


const logger = createLogger('generate-upload-url')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info(`Processing event: ${event}`)
    const bookId = event.pathParameters.bookId
    try {
        const uploadUrl = await generateUploadURL(bookId)
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                uploadUrl
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