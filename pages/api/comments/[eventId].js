import {
  connectDatabase,
  insertDocument,
  fetchAllDocuments,
} from '../../../lib/db-utils';

const handler = async (req, res) => {
  const { eventId } = req.query;

  let client;
  try {
    client = await connectDatabase();
  } catch (e) {
    res.status(500).json({ message: 'Connecting to the database failed' });
    return;
  }

  if (req.method === 'POST') {
    const { email, name, text } = req.body;
    if (!isInputValid(email, name, message)) {
      res.status(422).json({ message: 'Invalid Input' });
      client.close();
      return;
    }
    const comment = { email, name, text, eventId };

    let result;
    try {
      result = await insertDocument(client, 'comments', comment);
      comment._id = results.insertedId;
      res.status(201).json({ message: 'Added comment.', comment });
    } catch (error) {
      res.status(500).json({ message: 'Inserting data failed' });
    }
  }

  if (req.method === 'GET') {
    let document;
    try {
      document = await fetchAllDocuments(client, 'comments', { _id: -1 });
      res.status(201).json({ comments: document });
    } catch (error) {
      res.status(500).json({ message: 'Getting comments failed' });
    }
  }

  client.close();
};

export default handler;
