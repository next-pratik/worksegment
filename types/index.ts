export type UserRole = 'worker' | 'recruiter';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
}

export interface WorkerProfile extends User {
    role: 'worker';
    phone: string;
    city: string;
    locality?: string;
    primarySkill: string;
    otherSkills: string[];
    experienceYears: number;
    availability: 'full-time' | 'part-time';
    dailyWage?: number;
    monthlyWage?: number;
    bio?: string;
}

export interface RecruiterProfile extends User {
    role: 'recruiter';
    phone: string;
    city: string;
    organizationName?: string;
    type: 'individual' | 'contractor' | 'business';
}

export interface Job {
    id: string;
    recruiterId: string;
    title: string;
    skillRequired: string;
    description: string;
    location: string;
    duration: string;
    paymentType: 'daily' | 'monthly' | 'contract';
    budget: number;
    experienceRequired: number;
    status: 'open' | 'closed';
    createdAt: string;
}

export interface Application {
    id: string;
    jobId: string;
    workerId: string;
    status: 'applied' | 'accepted' | 'rejected' | 'completed';
    appliedAt: string;
}
