const mongoose = require('mongoose');

const DATABASES = ['jobmarketplace', 'test'];

async function cleanIndexes(dbName) {
    const uri = `mongodb://127.0.0.1:27017/${dbName}`;
    console.log(`\nChecking database: ${dbName}...`);

    try {
        const conn = await mongoose.createConnection(uri).asPromise();
        const collection = conn.collection('users');

        // Check if collection exists first to avoid error
        const collections = await conn.db.listCollections({ name: 'users' }).toArray();
        if (collections.length === 0) {
            console.log(`Collection 'users' not found in ${dbName}. Skipping.`);
            await conn.close();
            return;
        }

        const indexes = await collection.indexes();
        const badIndex = indexes.find(i => i.name === 'username_1');

        if (badIndex) {
            console.log(`[FOUND] Rogue index 'username_1' in ${dbName}. Dropping...`);
            await collection.dropIndex('username_1');
            console.log('[SUCCESS] Dropped index!');
        } else {
            console.log(`[OK] No 'username_1' index found in ${dbName}.`);
        }

        await conn.close();
    } catch (err) {
        console.error(`Error checking ${dbName}:`, err.message);
    }
}

async function run() {
    for (const db of DATABASES) {
        await cleanIndexes(db);
    }
    console.log('\n--- Cleanup Complete ---');
    process.exit(0);
}

run();
