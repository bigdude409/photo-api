// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('photo-api');

// Create a new document in the collection.
// db.getCollection('users').insertOne({
//     name: 'Chip',
//     email: 'chip@chip.com',
//     password: 'password',
//     createdAt: new Date(),
//     updatedAt: new Date(),
// });

// db.getCollection('users').find({ email: 'chipwiley@outlook.com' });
// db.getCollection('users').find({ _id: '679c03e92016fbb94ebe84e4' });

db.getCollection('media').deleteMany({});
