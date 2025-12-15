"use client";

import { Navbar } from "@/components/shared/Navbar";
import { JobCard } from "@/components/features/JobCard";
import { CheckCircle2, Briefcase, Search, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const SKILLS = ['Carpenter', 'Plumber', 'Electrician', 'Driver', 'Painter', 'Mechanic', 'Maid', 'Helper'];

export default function WorkerDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'matched' | 'applied'>('matched');

    const [jobs, setJobs] = useState<any[]>([]);
    const [appliedJobs, setAppliedJobs] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);
    const [filterSkill, setFilterSkill] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            // Default filter to user's skill
            setFilterSkill(parsedUser.primarySkill || '');
            fetchJobs(parsedUser.primarySkill || '');
            // In a real app we would fetch applied jobs here too
        } else {
            router.push('/auth/login?role=worker');
        }
    }, [router]);

    const fetchJobs = async (skill: string) => {
        setLoading(true);
        try {
            const query = skill ? `?skill=${skill}` : '';
            const res = await fetch(`/api/jobs${query}`);
            const data = await res.json();
            if (data.success) {
                setJobs(data.jobs);
            }
        } catch (error) {
            console.error("Failed to fetch jobs", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (jobId: string) => {
        if (!user) return;

        // Optimistic update (UI only for demo, real implementations need state sync)
        if (confirm("Are you sure you want to apply for this job?")) {
            try {
                const res = await fetch('/api/applications', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        jobId,
                        workerId: user.id,
                        recruiterId: jobs.find(j => j._id === jobId)?.recruiterId // Need to ensure job object has this
                    })
                });
                const data = await res.json();

                if (data.success) {
                    alert("Application Submitted Successfully!");
                    // Refresh jobs or remove from list if you want
                } else {
                    alert(data.error || "Failed to apply");
                }
            } catch (err) {
                alert("Something went wrong");
            }
        }
    };

    const handleFilterChange = (skill: string) => {
        setFilterSkill(skill);
        fetchJobs(skill);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black pb-20">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white shadow-lg">
                    <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0] || 'Worker'}!</h1>
                    <p className="opacity-90">Find the jobs that match your skills.</p>
                    <div className="mt-6 flex flex-wrap gap-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-300" />
                            <span>Status: Available</span>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
                    <Button
                        variant={filterSkill === '' ? "default" : "outline"}
                        onClick={() => handleFilterChange('')}
                        size="sm"
                    >
                        All Jobs
                    </Button>
                    {SKILLS.map(skill => (
                        <Button
                            key={skill}
                            variant={filterSkill.toLowerCase() === skill.toLowerCase() ? "default" : "outline"}
                            onClick={() => handleFilterChange(skill)}
                            size="sm"
                        >
                            {skill}
                        </Button>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-8 max-w-md">
                    <button
                        onClick={() => setActiveTab('matched')}
                        className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 
              ${activeTab === 'matched'
                                ? 'bg-white text-blue-700 shadow dark:bg-zinc-800 dark:text-blue-400'
                                : 'text-blue-600 hover:bg-white/[0.12] hover:text-blue-800 dark:text-blue-200'}`}
                    >
                        Jobs For You
                    </button>
                    {/* Applied Tab Placeholder - Future Work */}
                    <button
                        onClick={() => setActiveTab('applied')}
                        className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 
              ${activeTab === 'applied'
                                ? 'bg-white text-blue-700 shadow dark:bg-zinc-800 dark:text-blue-400'
                                : 'text-blue-600 hover:bg-white/[0.12] hover:text-blue-800 dark:text-blue-200'}`}
                    >
                        My Applications
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {activeTab === 'matched' ? (
                            jobs.length > 0 ? (
                                jobs.map(job => (
                                    <JobCard
                                        key={job._id}
                                        job={job}
                                        onApply={() => handleApply(job._id)}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-20 text-gray-500">
                                    No jobs found for {filterSkill || 'available categories'}. Try changing the filter.
                                </div>
                            )
                        ) : (
                            <div className="col-span-full text-center py-20 text-gray-500">
                                No applications yet.
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
