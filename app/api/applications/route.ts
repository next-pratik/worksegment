import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Application, User } from '@/models/schema';

// GET /api/applications?jobId=...
export async function GET(request: Request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const jobId = searchParams.get('jobId');

        if (!jobId) {
            return NextResponse.json({ error: 'Job ID required' }, { status: 400 });
        }

        // Fetch applications and populate worker details
        const applications = await Application.find({ jobId })
            .populate('workerId', 'name primarySkill experienceYears phone')
            .sort({ appliedAt: -1 });

        const formattedApps = applications.map((app: any) => ({
            id: app._id,
            name: app.workerId.name,
            skill: app.workerId.primarySkill || 'Generic',
            experience: app.workerId.experienceYears ? `${app.workerId.experienceYears} Years` : 'N/A',
            phone: app.workerId.phone,
            status: app.status
        }));

        return NextResponse.json({ success: true, applications: formattedApps });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/applications (Apply to job)
export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const body = await request.json();

        const existing = await Application.findOne({
            jobId: body.jobId,
            workerId: body.workerId
        });

        if (existing) {
            return NextResponse.json({ error: 'Already applied' }, { status: 400 });
        }

        const app = await Application.create({
            jobId: body.jobId,
            workerId: body.workerId,
            recruiterId: body.recruiterId,
            status: 'pending'
        });

        return NextResponse.json({ success: true, application: app });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
