const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Blog = require('./models/Blog');
const Event = require('./models/Event');

// Load env vars
dotenv.config();

const dummyEvents = [
    { title: 'Charity Marathon 2026', date: '2026-03-15', location: 'City Park', description: 'Join us for a 5k run to raise funds for education.', image: 'https://images.unsplash.com/photo-1595821557929-e1ae6724a7d6?q=80&w=800&auto=format&fit=crop' },
    { title: 'Medical Camp', date: '2026-04-10', location: 'Rural Center', description: 'Free checkups and medicine distribution for villagers.', image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=800&auto=format&fit=crop' },
    { title: 'Tree Plantation Drive', date: '2026-06-05', location: 'Green Belt Area', description: 'Planting 1000 trees this World Environment Day.', image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=800&auto=format&fit=crop' },
    { title: 'Education Seminar', date: '2026-07-20', location: 'Community Hall', description: 'Discussing the future of rural education.', image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop' },
];

const dummyBlogs = [
    { title: 'Empowering Women', authorName: 'Sarah J.', content: 'Women empowerment is not just a buzzword...', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop', published: true },
    { title: 'Clean Water Initiative', authorName: 'Mike T.', content: 'Access to clean water changes everything...', image: 'https://images.unsplash.com/photo-1563974465492-cce7d5d7e5d8?q=80&w=800&auto=format&fit=crop', published: true },
    { title: 'Digital Literacy', authorName: 'Anita R.', content: 'Bridging the digital divide one tablet at a time.', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop', published: true },
];

const seedMedia = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        // Seed Events
        for (const evt of dummyEvents) {
            const exists = await Event.findOne({ title: evt.title });
            if (!exists) {
                await Event.create(evt);
                console.log(`Added Event: ${evt.title}`);
            }
        }

        // Seed Blogs
        for (const blog of dummyBlogs) {
            const exists = await Blog.findOne({ title: blog.title });
            if (!exists) {
                // Determine mock author ID if needed, or just let it be null since schema defines ref but not required strict
                // Actually schema says 'author' is Ref to User. 
                // We'll skip setting author ref for now as it's optional in schema (no required: true)
                await Blog.create({
                    ...blog,
                    slug: blog.title.toLowerCase().replace(/ /g, '-')
                });
                console.log(`Added Blog: ${blog.title}`);
            }
        }

        console.log("Seeding Complete.");
        process.exit();
    } catch (error) {
        console.error("Seeding Error:", error);
        process.exit(1);
    }
};

seedMedia();
