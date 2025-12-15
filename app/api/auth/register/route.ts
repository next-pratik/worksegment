import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { User } from '@/models/schema';

// POST /api/auth/register
export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const body = await request.json();

        // Basic validation
        if (!body.email || !body.password || !body.name || !body.role) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const existingUser = await User.findOne({ email: body.email });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        let user;
        try {
            user = await User.create(body);
        } catch (err: any) {
            // Self-healing: If duplicate key on 'username' (ghost index), drop it and retry
            if (err.code === 11000 && (err.keyPattern?.username || err.message.includes('username_1'))) {
                console.log("Detected ghost 'username_1' index. Dropping and retrying...");
                await User.collection.dropIndex('username_1');
                user = await User.create(body);
            } else {
                throw err; // Re-throw other errors
            }
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
