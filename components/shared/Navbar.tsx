"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Briefcase, User, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Check for user in localStorage on mount
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        router.push('/');
        router.refresh(); // Refresh to clear any server/client state mismatch visuals if any
    };

    return (
        <nav className="border-b bg-white dark:bg-black sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            WorkConnect
                        </Link>
                    </div>
                    <div className="hidden sm:flex sm:items-center sm:space-x-4">
                        <Link href="/auth/login?role=worker">
                            <span className="text-gray-700 dark:text-gray-200 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                                Find Work
                            </span>
                        </Link>
                        <Link href="/auth/login?role=recruiter">
                            <span className="text-gray-700 dark:text-gray-200 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                                Post a Job
                            </span>
                        </Link>

                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    Hello, {user.name.split(' ')[0]}
                                </span>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleLogout}
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                                >
                                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                                </Button>
                            </div>
                        ) : (
                            <Link href="/auth/login">
                                <span className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Sign In</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
