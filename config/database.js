const mongoose = require('mongoose');

async function connectDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/freshbites';

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });

  return mongoose.connection;
}

module.exports = {
  connectDatabase,
};
