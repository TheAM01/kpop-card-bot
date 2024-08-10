import {MongoClient} from "mongodb";
import "dotenv/config";

const uri = `mongodb+srv://foap:${process.env.MONGO_PASSWORD}@cluster0.ctb7cnr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri);

await client.connect();

export default client.db("bot-db");