//Calculates the average weight for each gender category by joining the User table with the Health_Record table based on the user ID. It then computes the average weight for each gender group using the AVG function and groups the results by the gender column from the User table.
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
        '$lookup': {
          'from': 'health_records', 
          'localField': '_id', 
          'foreignField': 'user_id', 
          'as': 'health_record_info'
        }
      }, {
        '$unwind': {
          'path': '$health_record_info',
          'preserveNullAndEmptyArrays': true
        }
      }, {
        '$group': {
          '_id': '$gender', 
          'avgWeight': {
            '$avg': '$health_record_info.weight'
          }
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
