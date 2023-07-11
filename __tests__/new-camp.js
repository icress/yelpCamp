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

    test('Should add campground to db', async () => {
        const camps = db.collection('campgrounds');

        const mockCamp = {_id: 'some-camp-id', name: 'Redfish lake'};
        await camps.insertOne(mockCamp);

        const insertedCamp = await camps.findOne({_id: 'some-camp-id'});
        expect(insertedCamp).toEqual(mockCamp);
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

    test('Delete campground from db', async () => {
        const camps = db.collection('campgrounds');
        await camps.deleteOne({_id: 'some-camp-id'})
        const noWhere = await camps.findOne({_id: 'some-camp-id'})
        expect(noWhere).toEqual(null)
    });
});