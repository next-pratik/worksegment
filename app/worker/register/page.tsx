"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload } from "lucide-react";

export default function WorkerRegister() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // State for form fields
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        city: '',
        locality: '',
        primarySkill: '',
        experienceYears: 0,
        availability: 'full-time',
        dailyWage: 0,
        bio: ''
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    email: `${formData.phone}@worker.com`,
                    password: 'password123',
                    role: 'worker'
                })
            });

            const data = await res.json();
            if (data.success) {
                localStorage.setItem('user', JSON.stringify(data.user));
                router.push('/worker/dashboard');
            } else {
                alert(data.error || 'Registration failed');
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
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-8 sm:p-12">
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Worker Profile</h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">Start getting hired for your skills today.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Personal Info */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b pb-2 dark:border-zinc-800">Personal Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                    <Input required name="name" onChange={handleChange} placeholder="e.g. Rahul Kumar" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                                    <Input required type="tel" name="phone" onChange={handleChange} placeholder="+91 98765 43210" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                                    <Input required name="city" onChange={handleChange} placeholder="e.g. Mumbai" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Locality / Area</label>
                                    <Input required name="locality" onChange={handleChange} placeholder="e.g. Andheri East" />
                                </div>
                            </div>

                            {/* Photo Upload Simulation */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Photo</label>
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center border border-dashed border-gray-300 dark:border-zinc-700">
                                        <Upload className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <Button type="button" variant="outline" size="sm">Upload Photo</Button>
                                </div>
                            </div>
                        </div>

                        {/* Professional Info */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b pb-2 dark:border-zinc-800">Professional Details</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Primary Skill</label>
                                <select name="primarySkill" onChange={handleChange} className="flex h-10 w-full rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-white">
                                    <option value="">Select your main skill</option>
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Experience (Years)</label>
                                    <Input type="number" min="0" name="experienceYears" onChange={handleChange} placeholder="e.g. 5" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Availability</label>
                                    <select name="availability" onChange={handleChange} className="flex h-10 w-full rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-white">
                                        <option value="full-time">Full Time</option>
                                        <option value="part-time">Part Time</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expected Daily Wage (₹)</label>
                                <Input type="number" name="dailyWage" onChange={handleChange} placeholder="e.g. 800" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Short Bio</label>
                                <textarea
                                    name="bio"
                                    onChange={handleChange}
                                    className="flex min-h-[80px] w-full rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-white"
                                    placeholder="Describe your work experience and skills..."
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full text-lg h-12" disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                            Complete Registration
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
