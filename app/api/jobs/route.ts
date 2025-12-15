import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Job, User } from '@/models/schema';

// GET /api/jobs
export async function GET(request: Request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const recruiterId = searchParams.get('recruiterId');
        const skill = searchParams.get('skill');

        let query: any = {};
        if (recruiterId) query.recruiterId = recruiterId;
        if (skill) query.skillRequired = { $regex: skill, $options: 'i' };

        const jobs = await Job.find(query).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, jobs });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/jobs
export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const body = await request.json();

        // Validate recruiterId exists
        const recruiter = await User.findById(body.recruiterId);
        if (!recruiter || recruiter.role !== 'recruiter') {
            return NextResponse.json({ error: 'Recruiter account not found or invalid role. Please try logging out and back in.' }, { status: 403 });
        }

        const job = await Job.create(body);
        return NextResponse.json({ success: true, job });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
