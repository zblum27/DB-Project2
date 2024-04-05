// Retrieve a list of unique usernames from the User table along with the count of how many times each username appears in the table.
const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();

    const database = client.db("DB_Project_2");
    const collection = database.collection("users");

    const agg = [
        {
          '$group': {
            '_id': '$username',
            'count': {
              '$sum': 1
            }
          }
        }
      ];

    const result = await collection.aggregate(agg).toArray();
    console.log(result);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);