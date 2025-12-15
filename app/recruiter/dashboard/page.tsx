"use client";

import { Navbar } from "@/components/shared/Navbar";
import { ApplicantCard } from "@/components/features/ApplicantCard";
import { Plus, Users, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// Mock Applicants Data (Until we build the full applicant flow)
const MOCK_APPLICANTS = [
    {
        id: '101',
        name: 'Rahul Kumar',
        skill: 'Carpenter',
        experience: '5 Years',
        phone: '+91 98*** *****',
        status: 'pending' as const
    },
    {
        id: '102',
        name: 'Amit Singh',
        skill: 'Carpenter',
        experience: '3 Years',
        phone: '+91 99*** *****',
        status: 'accepted' as const
    }
];

interface Job {
    _id: string; // MongoDB ID
    title: string;
    description: string;
    location: string;
    budget: number;
    paymentType: string;
    duration: string;
    applicantsCount?: number;
}

// ... (imports remain)

export default function RecruiterDashboard() {
    const router = useRouter();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [activeJobId, setActiveJobId] = useState<string | null>(null);
    const [applicants, setApplicants] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            fetchJobs(parsedUser.id);
        } else {
            router.push('/auth/login?role=recruiter');
        }
    }, [router]);

    // Fetch Applicants when activeJobId changes
    useEffect(() => {
        if (activeJobId) {
            fetchApplicants(activeJobId);
        } else {
            setApplicants([]);
        }
    }, [activeJobId]);

    const fetchJobs = async (recruiterId: string) => {
        try {
            const res = await fetch(`/api/jobs?recruiterId=${recruiterId}`);
            const data = await res.json();
            if (data.success) {
                setJobs(data.jobs);
            }
        } catch (error) {
            console.error("Failed to fetch jobs", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchApplicants = async (jobId: string) => {
        try {
            // In a real app we'd have a loading state for this section too
            const res = await fetch(`/api/applications?jobId=${jobId}`);
            const data = await res.json();
            if (data.success) {
                setApplicants(data.applications);
            }
        } catch (error) {
            console.error("Failed to fetch applicants", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black pb-20">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Recruiter Dashboard</h1>
                        <p className="text-gray-600 dark:text-gray-400">Manage your job postings and applicants.</p>
                    </div>
                    <Link href="/recruiter/post-job">
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" /> Post New Job
                        </Button>
                    </Link>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Jobs List */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold dark:text-white">Active Postings ({jobs.length})</h2>
                            </div>
                            <div className="space-y-4">
                                {jobs.length === 0 ? (
                                    <div className="text-center py-10 bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-gray-300 dark:border-zinc-700">
                                        <p className="text-gray-500 text-sm">No jobs posted yet.</p>
                                    </div>
                                ) : (
                                    jobs.map(job => (
                                        <div
                                            key={job._id}
                                            onClick={() => setActiveJobId(job._id)}
                                            className={`cursor-pointer rounded-xl border p-4 transition-all ${activeJobId === job._id ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50 dark:bg-zinc-800' : 'border-gray-200 bg-white dark:bg-zinc-900 hover:border-blue-300'}`}
                                        >
                                            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{job.title}</h3>
                                            <p className="text-sm text-gray-500 mt-1 capitalize">₹{job.budget} • {job.paymentType}</p>
                                            <div className="mt-4 flex items-center gap-2 text-sm text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full w-fit">
                                                <Users className="w-4 h-4" />
                                                View Applicants
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Right Column: Applicants Details */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 min-h-[500px] p-6">
                                {activeJobId ? (
                                    <>
                                        <div className="border-b dark:border-zinc-800 pb-4 mb-6">
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                                Applicants for "{jobs.find(j => j._id === activeJobId)?.title}"
                                            </h2>
                                        </div>
                                        <div className="space-y-4">
                                            {applicants.length > 0 ? (
                                                applicants.map(applicant => (
                                                    <ApplicantCard
                                                        key={applicant.id}
                                                        applicant={applicant}
                                                        onAccept={() => console.log('Accept', applicant.id)}
                                                        onReject={() => console.log('Reject', applicant.id)}
                                                    />
                                                ))
                                            ) : (
                                                <div className="text-center py-12 text-gray-500">
                                                    No applicants found for this job yet.
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-500 text-center p-8">
                                        <Users className="w-16 h-16 mb-4 opacity-20" />
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Select a job to view applicants</h3>
                                        <p>Click on any job card from the left list to see real-time candidates.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
