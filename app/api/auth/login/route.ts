import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { User } from '@/models/schema';

// POST /api/auth/login
export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const { email, password } = await request.json();

        const user = await User.findOne({ email });

        // In a real app, compare hashed passwords!
        if (!user || user.password !== password) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
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
