import "dotenv/config"
import { parse } from "mongodb-uri"
import { entities } from "../Entities"
const { MONGOHQ_URL } = process.env

export const databaseConfig = () => {
  // Get correct connection args based on NODE_ENV
  const { username, password, database, hosts, options } = parse(MONGOHQ_URL!)
  const hostName = hosts.map(a => a.host).join(",")

  if (hostName === "localhost" || hostName === "kaws-mongodb") {
    return {
      url: MONGOHQ_URL,
      type: "mongodb",
      entities,
    }
  } else {
    return {
      type: "mongodb",
      username,
      password,
      database,
      ...options,
      host: hostName,
      port: 27017,
      ssl: true,
      entities,
    }
  }
}

export const databaseURL = MONGOHQ_URL
