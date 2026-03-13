const mongoose = require('mongoose');
require('dotenv').config();

const volunteerTaskSchema = new mongoose.Schema({
    volunteer: mongoose.Schema.Types.ObjectId,
    status: String,
    assignedHours: Number
});
const VolunteerTask = mongoose.model('VolunteerTask', volunteerTaskSchema);

const volunteerSchema = new mongoose.Schema({
    user: mongoose.Schema.Types.ObjectId,
    totalHours: Number,
    completedTasks: Number
});
const Volunteer = mongoose.model('Volunteer', volunteerSchema);

async function testCalc() {
    await mongoose.connect(process.env.MONGO_URI);
    
    const vol = await Volunteer.findOne({});
    if (!vol) { console.log('No volunteers'); process.exit(0); }
    
    console.log(`Testing Volunteer: ${vol._id}`);
    
    // Test multiple query styles
    const tasks1 = await VolunteerTask.find({ volunteer: vol._id });
    console.log(`Query by ObjectId: Found ${tasks1.length} tasks`);
    
    const tasks2 = await VolunteerTask.find({ volunteer: vol._id.toString() });
    console.log(`Query by String ID: Found ${tasks2.length} tasks`);
    
    const allTasks = await VolunteerTask.find({});
    const manualMatch = allTasks.filter(t => t.volunteer && t.volunteer.toString() === vol._id.toString());
    console.log(`Manual match in JS: Found ${manualMatch.length} tasks`);

    if (manualMatch.length > 0) {
        console.log('Task Details:');
        manualMatch.forEach(t => {
            console.log(`- ID: ${t._id}, Status: ${t.status}, Hrs: ${t.assignedHours} (Type: ${typeof t.assignedHours})`);
        });
    }

    process.exit(0);
}

testCalc();
