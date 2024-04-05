 //Select the user ID, username, date, blood pressure, activity type, and duration from the User, Health_Record, and Activity tables, joining them together based on the user ID.
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
        '$unwind': '$health_record_info'
      }, {
        '$lookup': {
          'from': 'activities', 
          'localField': '_id', 
          'foreignField': 'user_id', 
          'as': 'activity_info'
        }
      }, {
        '$unwind': '$activity_info'
      }, {
        '$project': {
          'user_id': '$_id', 
          'username': 1, 
          'date': '$health_record_info.date', 
          'blood_pressure': '$health_record_info.blood_pressure', 
          'activity_type': '$activity_info.activity_type', 
          'duration': '$activity_info.duration'
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