const mongoose = require('mongoose');

async function run() {
    const uri = 'mongodb://127.0.0.1:27017';
    console.log('Connecting to MongoDB Root...');

    const conn = await mongoose.createConnection(uri).asPromise();
    const admin = conn.db.admin();

    // List all databases
    const dbs = await admin.listDatabases();
    console.log('Databases found:', dbs.databases.map(d => d.name));

    for (const dbInfo of dbs.databases) {
        const dbName = dbInfo.name;
        if (dbName === 'admin' || dbName === 'local' || dbName === 'config') continue;

        console.log(`\nInspecting DB: ${dbName}`);
        const dbConn = conn.useDb(dbName);

        // List collections
        const collections = await dbConn.db.listCollections().toArray();
        const userCol = collections.find(c => c.name === 'users');

        if (userCol) {
            console.log(` -> Found 'users' collection.`);
            const collection = dbConn.collection('users');
            try {
                const indexes = await collection.indexes();
                const badIndex = indexes.find(i => i.name === 'username_1');
                if (badIndex) {
                    console.log(` -> DROPPING Rogue index 'username_1'...`);
                    await collection.dropIndex('username_1');
                    console.log(' -> DROPPED.');
                } else {
                    console.log(' -> Clean (no username_1 index).');
                }
            } catch (e) {
                console.log(' -> Error checking indexes:', e.message);
            }
        } else {
            console.log(' -> No users collection.');
        }
    }

    console.log('\nDone.');
    await conn.close();
    process.exit(0);
}

run();
