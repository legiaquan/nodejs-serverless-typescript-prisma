// This file helps you test your function locally
require("dotenv").config()
const { counter } = require("./handler")

async function test() {
  const result = await counter({})
  console.log(JSON.stringify(result, null, 2))
}

test()

