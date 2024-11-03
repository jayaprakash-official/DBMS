const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');

const app = express();
app.use(cors());

const mongoURI = 'mongodb://127.0.0.1:27017/'; 
const dbName = 'Student';  

app.get('/getGrades/:roll_no', async (req, res) => {
  let client;
  try {
    const rollNo = parseInt(req.params.roll_no);

    if (isNaN(rollNo) || rollNo <= 0) {
      return res.status(400).json({ error: 'Invalid roll number' });
    }

    client = await MongoClient.connect(mongoURI);
    const db = client.db(dbName);
    const collection = db.collection('Student'); 

    console.log("Roll number received:", rollNo); 

    
    const result = await collection.find({ roll_no: rollNo }).toArray();

    console.log("Database result:", result); 

    if (result.length === 0) {
      return res.status(404).json({ error: 'No results found for this roll number' });
    }

    const grades = result.map(student => ({
      roll_no: student.roll_no, 
      name: student.name,      
      dept: student.dept,       
      subject: student.subject,
      grade: student.grade
    }));

    res.json(grades);
  } catch (err) {
    console.error('Error fetching grades:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  } finally {
    if (client) {
      client.close();
    }
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});