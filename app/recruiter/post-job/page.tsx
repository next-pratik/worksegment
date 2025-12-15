"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from 'next/link';

export default function PostJob() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.role !== 'recruiter') {
                alert("You must be a Recruiter to post jobs. Please login as a Recruiter.");
                router.push('/auth/login?role=recruiter');
                return;
            }
            setUser(parsedUser);
        } else {
            router.push('/auth/login?role=recruiter');
        }
    }, [router]);

    // State for form fields
    const [formData, setFormData] = useState({
        title: '',
        skillRequired: '',
        description: '',
        location: '',
        duration: '',
        paymentType: 'daily',
        budget: '',
        experienceRequired: ''
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsLoading(true);

        try {
            const res = await fetch('/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    recruiterId: user.id
                })
            });

            const data = await res.json();
            if (data.success) {
                router.push('/recruiter/dashboard');
            } else {
                alert(data.error || 'Failed to post job');
            }
        } catch (err) {
            alert('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black pb-20">
            <Navbar />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                <Link href="/recruiter/dashboard" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 mb-6 inline-flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>

                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-8 sm:p-12">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Post a New Job</h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">Fill in the details to find the best workers.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title</label>
                                <Input required name="title" onChange={handleChange} placeholder="e.g. Carpenter needed for small repairs" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Required Skill</label>
                                <select name="skillRequired" onChange={handleChange} className="flex h-10 w-full rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-white">
                                    <option value="">Select skill required</option>
                                    <option value="carpenter">Carpenter</option>
                                    <option value="plumber">Plumber</option>
                                    <option value="electrician">Electrician</option>
                                    <option value="driver">Driver</option>
                                    <option value="painter">Painter</option>
                                    <option value="mechanic">Mechanic</option>
                                    <option value="maid">Maid</option>
                                    <option value="helper">Helper</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Description</label>
                                <textarea
                                    name="description"
                                    onChange={handleChange}
                                    className="flex min-h-[120px] w-full rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-white"
                                    placeholder="Describe the work in detail..."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                                    <Input required name="location" onChange={handleChange} placeholder="e.g. Bandra West, Mumbai" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
                                    <Input required name="duration" onChange={handleChange} placeholder="e.g. 2 Days, 1 Month" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Type</label>
                                    <select name="paymentType" onChange={handleChange} className="flex h-10 w-full rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-white">
                                        <option value="daily">Daily Wage</option>
                                        <option value="monthly">Monthly Salary</option>
                                        <option value="contract">Fixed Contract</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Budget (₹)</label>
                                    <Input required name="budget" type="number" onChange={handleChange} placeholder="e.g. 1500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Min Experience (Yrs)</label>
                                    <Input required name="experienceRequired" type="number" onChange={handleChange} placeholder="e.g. 2" />
                                </div>
                            </div>

                        </div>

                        <Button type="submit" className="w-full text-lg h-12" disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                            Post Job
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
