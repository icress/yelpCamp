const mongoose = require('mongoose');

describe('Insert', () => {
    let connection;
    let db;

    beforeAll(async () => {
        connection = await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
        db = await mongoose.connection
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('Add user to db', async () => {
        const users = db.collection('users');

        const mockUser = {_id: 'some-user-id', name: 'John'};
        await users.insertOne(mockUser);

        const insertedUser = await users.findOne({_id: 'some-user-id'});
        expect(insertedUser).toEqual(mockUser);
    });
});

describe('Delete', () => {
    
    beforeAll(async () => {
        connection = await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
        db = await mongoose.connection
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('Delete user from db', async () => {
        const users = db.collection('users');
        await users.deleteOne({_id: 'some-user-id'});
        const noOne = await users.findOne({_id: 'some-user-id'});
        expect(noOne).toEqual(null);
    });
});

describe('Insert', () => {
    let connection;
    let db;

    beforeAll(async () => {
        connection = await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
        db = await mongoose.connection
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('Add campground to db', async () => {
        const camps = db.collection('campgrounds');

        const mockCamp = {_id: 'some-camp-id', name: 'Redfish Lake'};
        await camps.insertOne(mockCamp);

        const insertedCamp = await camps.findOne({_id: 'some-camp-id'});
        expect(insertedCamp).toEqual(mockCamp);
    });
});

describe('Delete', () => {
    
    beforeAll(async () => {
        connection = await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
        db = await mongoose.connection
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('Delete campground from db', async () => {
        const camps = db.collection('campgrounds');
        await camps.deleteOne({_id: 'some-camp-id'});
        const noWhere = await camps.findOne({_id: 'some-camp-id'});
        expect(noWhere).toEqual(null);
    });
});

describe('Insert', () => {
    let connection;
    let db;

    beforeAll(async () => {
        connection = await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
        db = await mongoose.connection
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('Add review to db', async () => {
        const reviews = db.collection('reviews');

        const mockReview = {_id: 'some-review-id', description: 'I love this place!!!'};
        await reviews.insertOne(mockReview);

        const insertedReview = await reviews.findOne({_id: 'some-review-id'});
        expect(insertedReview).toEqual(mockReview);
    });
});

describe('Delete', () => {
    
    beforeAll(async () => {
        connection = await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
        db = await mongoose.connection
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('Delete review from db', async () => {
        const reviews = db.collection('reviews');
        await reviews.deleteOne({_id: 'some-review-id'});
        const noReview = await reviews.findOne({_id: 'some-review-id'});
        expect(noReview).toEqual(null);
    });
});