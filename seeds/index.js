require('dotenv').config();
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Phorestaurant = require('../models/phorestaurant');
const cloudinary = require('cloudinary').v2;

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

// Set up Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const seedDB = async () => {
    await Phorestaurant.deleteMany({});
    // Replace this with user authentication logic to get the current user's ID
    const userId = '63ed1b00488616282eac1cc5'; // Example user ID

    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;

        // Fetch random images from Cloudinary
        const cloudinaryImages = await cloudinary.search.expression().execute();
        const images = cloudinaryImages.resources.map(resource => ({
            url: resource.secure_url,
            filename: resource.public_id
        }));

        const camp = new Phorestaurant({
            author: userId,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            images, // Assign the fetched images
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
        });

        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
}).catch(err => {
    console.error('Error in seeding:', err);
    mongoose.connection.close();
});