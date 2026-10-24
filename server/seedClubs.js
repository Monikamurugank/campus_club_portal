require('dotenv').config();
const mongoose = require('mongoose');
const Club = require('./models/Club');

const clubs = [
  {
    name: 'Photography Club',
    description: 'Explore the art of photography — from composition and lighting to editing and exhibitions. Open to beginners and enthusiasts alike.',
    category: 'Cultural',
    facultyCoordinator: 'Dr. Priya Sharma',
    meetingDetails: 'Every Saturday 10AM, Media Lab',
  },
  {
    name: 'Nature Club',
    description: 'Connect with nature through treks, bird watching, environmental drives, and awareness campaigns on campus and beyond.',
    category: 'Social',
    facultyCoordinator: 'Prof. Ramesh Nair',
    meetingDetails: 'Every Sunday 7AM, Main Gate',
  },
  {
    name: 'Kala Club',
    description: 'A platform for students passionate about fine arts, painting, sketching, and traditional Indian art forms.',
    category: 'Cultural',
    facultyCoordinator: 'Prof. Meena Iyer',
    meetingDetails: 'Every Wednesday 4PM, Art Room 102',
  },
  {
    name: 'Music Club',
    description: 'For lovers of music — classical, western, or fusion. Participate in jam sessions, concerts, and inter-college competitions.',
    category: 'Cultural',
    facultyCoordinator: 'Dr. Anil Menon',
    meetingDetails: 'Every Tuesday & Friday 5PM, Music Room',
  },
  {
    name: 'Journal Club',
    description: 'Develop writing, journalism, and editorial skills. Publish the college newsletter and cover campus events.',
    category: 'Literary',
    facultyCoordinator: 'Prof. Sunita Rao',
    meetingDetails: 'Every Monday 4PM, Library Conference Room',
  },
  {
    name: 'Heritage Club',
    description: 'Celebrate and preserve Indian cultural heritage through heritage walks, cultural fests, and historical discussions.',
    category: 'Cultural',
    facultyCoordinator: 'Dr. Kavitha Pillai',
    meetingDetails: 'Every Thursday 4PM, Seminar Hall B',
  },
  {
    name: 'Rotaract Club',
    description: 'A Rotary-affiliated club focused on community service, leadership development, and professional networking for students.',
    category: 'Social',
    facultyCoordinator: 'Prof. George Thomas',
    meetingDetails: 'Every Friday 4PM, Room 201',
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const club of clubs) {
      await Club.findOneAndUpdate(
        { name: club.name },
        club,
        { upsert: true, new: true }
      );
      console.log(`✓ ${club.name}`);
    }

    console.log('\nAll clubs seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seed();
