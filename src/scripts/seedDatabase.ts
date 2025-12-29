import axios from 'axios';
import connectDatabase from '../config/database';
import User from '../models/User';
import Album from '../models/Album';
import Photo from '../models/Photo';
import bcrypt from 'bcryptjs';

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Clear existing data
    await User.deleteMany({});
    await Album.deleteMany({});
    await Photo.deleteMany({});

    console.log('📥 Fetching data from JSONPlaceholder...');

    // Fetch JSONPlaceholder data
    const [usersRes, albumsRes, photosRes] = await Promise.all([
      axios.get('https://jsonplaceholder.typicode.com/users'),
      axios.get('https://jsonplaceholder.typicode.com/albums'),
      axios.get('https://jsonplaceholder.typicode.com/photos')
    ]);

    // Create users
    console.log('👤 Creating users...');
    const userMap = new Map();
    const hashedPassword = await bcrypt.hash('demo123', 10);

    for (const user of usersRes.data) {
      const newUser = await User.create({
        name: user.name,
        email: user.email,
        username: user.username,
        password: hashedPassword,
        phone: user.phone,
        website: user.website,
        address: user.address,
        company: user.company
      });
      userMap.set(user.id, newUser._id);
    }

    // Create albums
    console.log('📁 Creating albums...');
    const albumMap = new Map();
    for (const album of albumsRes.data) {
      const newAlbum = await Album.create({
        id: album.id,
        title: album.title,
        userId: userMap.get(album.userId)
      });
      albumMap.set(album.id, newAlbum._id);
    }

    // Create photos (first 1000)
    console.log('📸 Creating photos...');
    for (const photo of photosRes.data.slice(0, 1000)) {
      const albumUserId = Math.ceil(photo.albumId / 10);
      await Photo.create({
        id: photo.id,
        title: photo.title,
        url: photo.url,
        thumbnailUrl: photo.thumbnailUrl,
        albumId: albumMap.get(photo.albumId),
        userId: userMap.get(albumUserId)
      });
    }

    console.log('✅ Database seeded successfully!');
    console.log(`   - Users: ${usersRes.data.length}`);
    console.log(`   - Albums: ${albumsRes.data.length}`);
    console.log(`   - Photos: 1000`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedDatabase();
