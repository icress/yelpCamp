const mongoose = require('mongoose');

describe('insert', () => {
    let connection;
    let db;

    beforeAll(async () => {
        connection = await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
        db = await mongoose.connection
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('Should add user to db', async () => {
        const users = db.collection('users');

        const mockUser = {_id: 'some-user-id', name: 'John'};
        await users.insertOne(mockUser);

        const insertedUser = await users.findOne({_id: 'some-user-id'});
        expect(insertedUser).toEqual(mockUser);
    });
});

describe('delete', () => {
    
    beforeAll(async () => {
        connection = await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
        db = await mongoose.connection
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('Delete user from db', async () => {
        const users = db.collection('users');
        await users.deleteOne({_id: 'some-user-id'})
        const noOne = await users.findOne({_id: 'some-user-id'})
        expect(noOne).toEqual(null)
    })
})