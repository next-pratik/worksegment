"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Building2, User, Hammer } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RecruiterRegister() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [type, setType] = useState<'individual' | 'contractor' | 'business'>('individual');

    // State for form fields
    const [formData, setFormData] = useState({
        name: '', // Maps to Organization Name if business, or simple name
        phone: '',
        city: ''
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
                    organizationName: type === 'business' ? formData.name : undefined,
                    recruiterType: type,
                    email: `${formData.phone}@recruiter.com`, // Auto-generate email
                    password: 'password123',
                    role: 'recruiter'
                })
            });

            const data = await res.json();
            if (data.success) {
                localStorage.setItem('user', JSON.stringify(data.user));
                router.push('/recruiter/dashboard');
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

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-8 sm:p-12">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sign up to Hire</h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">Find the right people for your jobs.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">I am hiring as a:</label>
                                <div className="grid grid-cols-3 gap-3">
                                    <div
                                        onClick={() => setType('individual')}
                                        className={cn("cursor-pointer border-2 rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all", type === 'individual' ? "border-blue-600 bg-blue-50 dark:bg-zinc-800" : "border-transparent bg-gray-50 dark:bg-zinc-800")}
                                    >
                                        <User className={cn("w-6 h-6", type === 'individual' ? "text-blue-600" : "text-gray-500")} />
                                        <span className={cn("text-xs font-semibold", type === 'individual' ? "text-blue-700" : "text-gray-600")}>Individual</span>
                                    </div>
                                    <div
                                        onClick={() => setType('contractor')}
                                        className={cn("cursor-pointer border-2 rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all", type === 'contractor' ? "border-blue-600 bg-blue-50 dark:bg-zinc-800" : "border-transparent bg-gray-50 dark:bg-zinc-800")}
                                    >
                                        <Hammer className={cn("w-6 h-6", type === 'contractor' ? "text-blue-600" : "text-gray-500")} />
                                        <span className={cn("text-xs font-semibold", type === 'contractor' ? "text-blue-700" : "text-gray-600")}>Contractor</span>
                                    </div>
                                    <div
                                        onClick={() => setType('business')}
                                        className={cn("cursor-pointer border-2 rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all", type === 'business' ? "border-blue-600 bg-blue-50 dark:bg-zinc-800" : "border-transparent bg-gray-50 dark:bg-zinc-800")}
                                    >
                                        <Building2 className={cn("w-6 h-6", type === 'business' ? "text-blue-600" : "text-gray-500")} />
                                        <span className={cn("text-xs font-semibold", type === 'business' ? "text-blue-700" : "text-gray-600")}>Business</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {type === 'business' ? 'Organization Name' : 'Full Name'}
                                </label>
                                <Input required name="name" onChange={handleChange} placeholder={type === 'business' ? "e.g. Acme Construction" : "e.g. Amit Sharma"} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                                <Input required type="tel" name="phone" onChange={handleChange} placeholder="+91 98765 43210" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                                <Input required name="city" onChange={handleChange} placeholder="e.g. Mumbai" />
                            </div>
                        </div>

                        <Button type="submit" className="w-full text-lg h-12" disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                            Create Account
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
