const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/jobmarketplace')
    .then(async () => {
        console.log('Connected to MongoDB');

        // Define minimal schema to read users
        const UserSchema = new mongoose.Schema({
            name: String,
            email: String,
            role: String
        });

        // Check if model already exists to avoid overwrite error
        const User = mongoose.models.User || mongoose.model('User', UserSchema);

        const users = await User.find({});
        console.log(`Found ${users.length} users:`);
        users.forEach(u => console.log(`${u._id} - ${u.email} (${u.role})`));

        process.exit(0);
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
