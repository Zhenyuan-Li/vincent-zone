import { MongoClient } from 'mongodb';

async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, name, message } = req.body;

    if (
      !email ||
      !email.includes('@') ||
      !name ||
      name.trim() === '' ||
      !message ||
      message.trim() === ''
    ) {
      res.status(422).json({ message: 'Invalid Input!' });
      return;
    }

    const newMsg = {
      email,
      name,
      message,
    };
    // process.env.DB_URL
    let client;
    try {
      client = await MongoClient.connect(process.env.DB_URL);
    } catch (err) {
      res.status(500).json({
        message: 'Could not connect to database',
      });
    }
    try {
      const db = client.db();
      const result = await db.collection('messages').insertOne(newMsg);
      newMsg.id = result.insertedId;
    } catch (err) {
      res.status(500).json({
        message: 'Storing message failed.',
      });
    }
    client.close();

    console.log(newMsg);
    res.status(201).json({ message: 'Successfully stored message!', newMsg });
  }
}

export default handler;
