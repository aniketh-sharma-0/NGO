const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Project = require('./models/Project');

// Load env vars
dotenv.config();

// Demo Data extracted from Projects.jsx
const demoProjects = [
    // GOVERNMENT PROJECTS
    {
        title: 'Rural Road Development',
        category: 'Government',
        status: 'Ongoing',
        description: 'Constructing all-weather roads to connect remote villages to the main highway, improving accessibility and economic opportunities for over 5000 residents.',
        location: 'Anantapur District',
        beneficiaries: '5000+ Villagers',
        sponsor: 'Govt of Andhra Pradesh',
        images: ['https://images.unsplash.com/photo-1596627689623-28c005b4b104?auto=format&fit=crop&q=80&w=800'],
        members: [{ name: 'Rk. Naidu', position: 'Project Lead' }, { name: 'S. Kumar', position: 'Site Engineer' }]
    },
    {
        title: 'Watershed Management Project',
        category: 'Government',
        status: 'Completed',
        description: 'Implementing sustainable water conservation structures to improve groundwater levels and support agriculture in drought-prone areas.',
        location: 'Dharmavaram Region',
        beneficiaries: '1200 Farmers',
        sponsor: 'NABARD',
        images: ['https://images.unsplash.com/photo-1588691866761-aa7a8f152345?q=80&w=800&auto=format&fit=crop'],
        members: [{ name: 'A. Rao', position: 'Hydrologist' }]
    },
    {
        title: 'Village Electrification Scheme',
        category: 'Government',
        status: 'Upcoming',
        description: 'Bringing solar-powered electricity to off-grid hamlets, ensuring every household has access to clean and reliable energy.',
        location: 'Tribal Hamlets',
        beneficiaries: '500 Households',
        sponsor: 'Ministry of Power',
        images: ['https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=800&auto=format&fit=crop'],
        members: [{ name: 'M. Reddy', position: 'Coordinator' }]
    },

    // CSR PROJECTS
    {
        title: 'Tech for Education',
        category: 'CSR',
        status: 'Upcoming',
        description: 'Partnering with tech giants to provide tablets and internet access to underprivileged schools in the district, bridging the digital divide.',
        location: 'Govt High Schools',
        beneficiaries: '2000 Students',
        sponsor: 'Tech Mahindra Foundation',
        images: ['https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=800'],
        members: [{ name: 'Sarah J.', position: 'Coordinator' }]
    },
    {
        title: 'Women Skill Development',
        category: 'CSR',
        status: 'Ongoing',
        description: 'Providing vocational training in tailoring and handicrafts to empower rural women with sustainable livelihood opportunities.',
        location: 'Skill Center, HQ',
        beneficiaries: '300 Women',
        sponsor: 'Reliance Foundation',
        images: ['https://images.unsplash.com/photo-1555529733-0e670560f7e1?q=80&w=800&auto=format&fit=crop'],
        members: [{ name: 'L. Devi', position: 'Trainer' }]
    },
    {
        title: 'Clean Drinking Water Plants',
        category: 'CSR',
        status: 'Completed',
        description: 'Installing RO water purification plants in schools and community centers to ensure access to safe drinking water.',
        location: '15 Villages',
        beneficiaries: '10,000+ Residents',
        sponsor: 'Tata Trusts',
        images: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop'],
        members: [{ name: 'K. Singh', position: 'Project Manager' }]
    },

    // CLIENT PROJECTS
    {
        title: 'Corporate Training Program',
        category: 'Client',
        status: 'Completed',
        description: 'Customized training modules for corporate employees focusing on CSR awareness, soft skills, and leadership development.',
        location: 'Bangalore & Hyderabad',
        beneficiaries: '500+ Employees',
        sponsor: 'Various Corporates',
        images: ['https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800'],
        members: []
    },
    {
        title: 'Impact Assessment Survey',
        category: 'Client',
        status: 'Ongoing',
        description: 'Conducting third-party impact assessment studies for external NGOs to evaluate the effectiveness of their social interventions.',
        location: 'Pan-India',
        beneficiaries: 'Partner NGOs',
        sponsor: 'International Agencies',
        images: ['https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop'],
        members: [{ name: 'Dr. P. Kumar', position: 'Lead Researcher' }]
    },
    {
        title: 'Capacity Building Workshop',
        category: 'Client',
        status: 'Upcoming',
        description: 'Organizing workshops for grassroots organizations to enhance their operational efficiency and fundraising capabilities.',
        location: 'District HQ',
        beneficiaries: '50 Local NGOs',
        sponsor: 'Civil Society Network',
        members: []
    }
];

const seedProjects = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        // Clear existing ONLY if user requested wipe? No, let's just seed if empty or append.
        // User asked: "Add the demo projects".
        // Safe bet: Check if specific titles exist, if not, add them.

        let count = 0;
        for (const project of demoProjects) {
            const exists = await Project.findOne({ title: project.title });
            if (!exists) {
                await Project.create(project);
                console.log(`Added: ${project.title}`);
                count++;
            } else {
                console.log(`Skipped (Exists): ${project.title}`);
            }
        }

        console.log(`Summary: Added ${count} new projects.`);
        process.exit();
    } catch (error) {
        console.error("Seeding Error:", error);
        process.exit(1);
    }
};

seedProjects();
