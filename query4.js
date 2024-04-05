//Retrieves distinct usernames along with the corresponding dates and blood pressure readings from the Health_Record table for users whose blood pressure measurements indicate hypertension.
const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("DB_Project_2");
    const collection = database.collection("health_records");

    const agg = [
      {
        '$match': {
          'blood_pressure': {
            '$gte': 140
          }
        }
      }, {
        '$group': {
          '_id': '$user_id', 
          'dates': { '$push': '$date' },
          'blood_pressures': { '$push': '$blood_pressure' }
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
          'dates': 1,
          'blood_pressures': 1,
          '_id': 0
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
