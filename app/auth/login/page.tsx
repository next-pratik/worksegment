"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/Navbar";
import { Briefcase, User, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [role, setRole] = useState<"worker" | "recruiter">("worker");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const roleParam = searchParams.get("role");
        if (roleParam === "recruiter") {
            setRole("recruiter");
        } else {
            setRole("worker");
        }
    }, [searchParams]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            // Redirect based on role
            if (role === 'worker') {
                router.push('/worker/dashboard'); // We will build this next
            } else {
                router.push('/recruiter/dashboard'); // We will build this next
            }
        }, 1500);
    };

    return (
        <div className="w-full max-w-md space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800">
            <div className="text-center">
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Welcome back
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Please sign in to your account
                </p>
            </div>

            <div className="flex gap-4 p-1 bg-gray-100 dark:bg-zinc-800 rounded-lg">
                <button
                    onClick={() => setRole("worker")}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-all",
                        role === "worker"
                            ? "bg-white dark:bg-zinc-700 text-blue-600 shadow-sm"
                            : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    )}
                >
                    <User className="w-4 h-4" />
                    Worker
                </button>
                <button
                    onClick={() => setRole("recruiter")}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-all",
                        role === "recruiter"
                            ? "bg-white dark:bg-zinc-700 text-blue-600 shadow-sm"
                            : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    )}
                >
                    <Briefcase className="w-4 h-4" />
                    Recruiter
                </button>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email address
                        </label>
                        <div className="mt-1">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="block w-full rounded-md border border-gray-300 dark:border-zinc-700 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 bg-white dark:bg-zinc-800 dark:text-white sm:text-sm"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <div className="mt-1">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="block w-full rounded-md border border-gray-300 dark:border-zinc-700 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 bg-white dark:bg-zinc-800 dark:text-white sm:text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                            Remember me
                        </label>
                    </div>

                    <div className="text-sm">
                        <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                            Forgot password?
                        </a>
                    </div>
                </div>

                <div className="space-y-4">
                    <Button
                        type="submit"
                        className="w-full flex justify-center py-2.5"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Sign in as {role === 'worker' ? 'Worker' : 'Recruiter'}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-zinc-700" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white dark:bg-zinc-900 px-2 text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full flex justify-center items-center gap-2"
                        onClick={() => alert("Google Auth would trigger here")}
                    >
                        <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                            <path
                                d="M12.0003 20.45c4.656 0 8.5398-3.1507 9.8787-7.6186l-2.923-2.2743c-1.1187 2.4552-3.606 4.1802-6.5293 4.1802-4.0494 0-7.385-3.0906-7.8596-7.0544l-2.6163 2.0537c1.7892 4.9665 6.4716 8.7134 12.0495 8.7134z"
                                fill="#34A853"
                            />
                            <path
                                d="M3.604 6.7327C4.167 4.9702 5.3787 3.4907 6.953 2.5055l2.648 2.0007c-1.127.8182-1.928 2.0097-2.195 3.39L3.604 6.7327z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12.0003 3.55c1.889 0 3.6534.693 5.011 1.8327l2.846-2.846C17.785.8368 15.015 0 12.0003 0 6.4225 0 1.7402 3.747 0 8.7134l3.604-2.7386C4.0786 4.7495 7.9507 3.55 12.0003 3.55z"
                                fill="#EA4335"
                            />
                            <path
                                d="M24 12.0003c0-.853-.075-1.6366-.2176-2.404H12.0003v4.6133h6.819c-.313 1.6366-1.222 3.016-2.548 4.0954l2.923 2.2742c3.556-3.2307 4.8057-7.989 4.8057-12.261z"
                                fill="#4285F4"
                            />
                        </svg>
                        Google
                    </Button>
                </div>
            </form>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link href={role === 'worker' ? '/worker/register' : '/recruiter/register'} className="font-medium text-blue-600 hover:text-blue-500">
                    Register as a {role === 'worker' ? 'Worker' : 'Recruiter'}
                </Link>
            </p>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-black">
            <Navbar />
            <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <Suspense fallback={<div className="text-center">Loading...</div>}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
}
