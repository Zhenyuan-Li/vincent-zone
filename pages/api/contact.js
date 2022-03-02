import {
  connectDatabase,
  insertDocument,
  isInputValid,
} from '../../lib/db-utils';

async function handler(req, res) {
  // Connect database
  let client;
  try {
    client = await connectDatabase();
  } catch (e) {
    res.status(500).json({ message: 'Connecting to the database failed' });
    return;
  }

  // Route: POST /api/contact
  if (req.method === 'POST') {
    const { email, name, message } = req.body;

    if (!isInputValid(email, name, message)) {
      res.status(422).json({ message: 'Invalid Input' });
      client.close();
      return;
    }
    const newMsg = { email, name, message };

    let result;
    try {
      result = await insertDocument(client, 'messages', newMsg);
      newMsg.id = result.insertedId;
    } catch (err) {
      res.status(500).json({
        message: 'Storing message failed.',
      });
    }
    client.close();

    res.status(201).json({ message: 'Successfully stored message!', newMsg });
  }
}

export default handler;
