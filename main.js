const dotenv = require("dotenv");
dotenv.config();
const {startServer} = require("./server/server");
startServer(process.env.PORT, process.env.MONGO_URI, process.env.MONGO_DB_NAME);
