const { Redis } = require("@upstash/redis")

// Initialize Redis client from environment variables
const redis = Redis.fromEnv()

exports.counter = async (event) => {
  try {
    // Increment a counter in Redis
    const count = await redis.incr("pageviews")

    // Return the response
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: "Hello from Serverless!",
        count: count,
        timestamp: new Date().toISOString(),
      }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: error.message,
      }),
    }
  }
}

