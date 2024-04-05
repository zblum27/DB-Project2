//Retrieves the usernames and the total sum of calories burned for users who have burned more than 500 calories across all their activities.
const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("DB_Project_2");
    const collection = database.collection("activities");

    const agg = [
      {
        '$group': {
          '_id': '$user_id', 
          'totalCalories': {
            '$sum': '$calories_burned'
          }
        }
      }, {
        '$match': {
          'totalCalories': {
            '$gt': 500
          }
        }
      }, {
        '$lookup': {
          'from': 'users', 
          'localField': '_id', 
          'foreignField': '_id', 
          'as': 'user_info'
        }
      }, {
        '$unwind': '$user_info'
      }, {
        '$project': {
          'username': '$user_info.username', 
          'totalCalories': 1
        }
      }
    ];

    const result = await collection.aggregate(agg).toArray();
    console.log(result);
  } catch (err) {
    console.error("An error occurred:", err);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
