import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { User, Job, Application } from '@/models/schema';

export async function GET() {
    try {
        await connectToDatabase();

        // Clear existing data
        // Clear existing data
        try { await User.collection.drop(); } catch (e) { } // Drop collection to reset indexes
        try { await Job.collection.drop(); } catch (e) { }
        try { await Application.collection.drop(); } catch (e) { }

        // --- 1. RECRUITERS ---
        const recruitersData = [
            { name: "Acme Construction", email: "recruiter1@demo.com", city: "Mumbai", type: "business", phone: "9990000001" }, // The main test account
            { name: "Rahul Sharma", email: "recruiter2@demo.com", city: "Pune", type: "individual", phone: "9990000002" },
            { name: "Urban Home Soln", email: "recruiter3@demo.com", city: "Bangalore", type: "business", phone: "9990000003" },
        ];

        const recruiters = await Promise.all(recruitersData.map(r =>
            User.create({
                name: r.name,
                email: r.email,
                password: "password123",
                role: "recruiter",
                phone: r.phone,
                city: r.city,
                organizationName: r.type === "business" ? r.name : undefined,
                recruiterType: r.type
            })
        ));

        // --- 2. WORKERS ---
        // Creating workers for every skill category
        const skills = ['Carpenter', 'Plumber', 'Electrician', 'Driver', 'Painter', 'Mechanic', 'Maid', 'Helper'];
        const workersData: any[] = [];

        // Create 2 workers for each skill
        skills.forEach((skill, index) => {
            workersData.push({
                name: `${skill} Person A`,
                skill: skill,
                exp: 3 + index,
                wage: 500 + (index * 50),
                city: "Mumbai"
            });
            workersData.push({
                name: `${skill} Person B`,
                skill: skill,
                exp: 1,
                wage: 400 + (index * 50),
                city: "Pune"
            });
        });

        const workers = await Promise.all(workersData.map((w, i) =>
            User.create({
                name: w.name,
                email: `worker${i + 1}@demo.com`,
                password: "password123",
                role: "worker",
                phone: `90000000${i + 10}`, // unique phones
                city: w.city,
                primarySkill: w.skill,
                experienceYears: w.exp,
                dailyWage: w.wage,
                availability: "full-time",
                bio: `Experienced ${w.skill} looking for work in ${w.city}.`
            })
        ));

        // --- 3. JOBS ---
        const jobsData = [
            // Jobs for Recruiter 1 (Acme)
            { title: "Carpenter Needed for Office Renovation", skill: "Carpenter", loc: "Andheri, Mumbai", budget: 1500, type: "daily", recIdx: 0 },
            { title: "Urgent Plumber Required", skill: "Plumber", loc: "Bandra, Mumbai", budget: 800, type: "daily", recIdx: 0 },
            { title: "Electrician for Wiring", skill: "Electrician", loc: "Juhu, Mumbai", budget: 2000, type: "contract", recIdx: 0 },
            { title: "House Painter Needed", skill: "Painter", loc: "Dadar, Mumbai", budget: 1200, type: "daily", recIdx: 0 },

            // Jobs for Recruiter 2 (Rahul)
            { title: "Personal Driver Needed", skill: "Driver", loc: "Pune", budget: 15000, type: "monthly", recIdx: 1 },
            { title: "Helper for Shifting", skill: "Helper", loc: "Pune", budget: 600, type: "daily", recIdx: 1 },

            // Jobs for Recruiter 3 (Urban)
            { title: "Mechanic for Garage", skill: "Mechanic", loc: "Bangalore", budget: 18000, type: "monthly", recIdx: 2 },
            { title: "Full-time Maid", skill: "Maid", loc: "Bangalore", budget: 12000, type: "monthly", recIdx: 2 },
        ];

        const jobs = await Promise.all(jobsData.map(j =>
            Job.create({
                title: j.title,
                skillRequired: j.skill,
                description: `We are looking for a skilled ${j.skill} at ${j.loc}. Good pay.`,
                location: j.loc,
                duration: j.type === 'monthly' ? "6 Months" : "2 Days",
                paymentType: j.type,
                budget: j.budget,
                experienceRequired: 2,
                recruiterId: recruiters[j.recIdx]._id
            })
        ));

        // --- 4. APPLICATIONS ---
        // Ensure Recruiter 1 has applicants to seeing
        // Carpenter A applies to Carpenter Job (Recruiter 1)
        await Application.create({ jobId: jobs[0]._id, workerId: workers.find(w => w.primarySkill === 'Carpenter')?._id, recruiterId: recruiters[0]._id, status: 'pending' });

        // Plumber A applies to Plumber Job (Recruiter 1) -> Accepted
        await Application.create({ jobId: jobs[1]._id, workerId: workers.find(w => w.primarySkill === 'Plumber')?._id, recruiterId: recruiters[0]._id, status: 'accepted' });

        // Electrician A applies to Electrician Job (Recruiter 1) -> Rejected
        await Application.create({ jobId: jobs[2]._id, workerId: workers.find(w => w.primarySkill === 'Electrician')?._id, recruiterId: recruiters[0]._id, status: 'rejected' });

        // Wrong skill application (Helper applies to Carpenter job) - to test
        await Application.create({ jobId: jobs[0]._id, workerId: workers.find(w => w.primarySkill === 'Helper')?._id, recruiterId: recruiters[0]._id, status: 'pending' });


        return NextResponse.json({
            success: true,
            message: "Database seeded with rich dataset successfully",
            summary: {
                recruiters: recruiters.length,
                workers: workers.length,
                jobs: jobs.length
            },
            credentials: {
                recruiter: "recruiter1@demo.com / password123",
                worker: "worker1@demo.com / password123"
            }
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
