import mongoose, { Schema, Document } from 'mongoose';

// --- Types ---
export interface IJob extends Document {
    title: string;
    skillRequired: string;
    description: string;
    location: string;
    duration: string;
    paymentType: 'daily' | 'monthly' | 'contract';
    budget: number;
    experienceRequired: number;
    recruiterId: mongoose.Types.ObjectId;
    createdAt: Date;
}

export interface IApplication extends Document {
    jobId: mongoose.Types.ObjectId;
    workerId: mongoose.Types.ObjectId;
    recruiterId: mongoose.Types.ObjectId;
    status: 'applied' | 'accepted' | 'rejected' | 'completed';
    appliedAt: Date;
}

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string; // In a real app, hash this!
    role: 'worker' | 'recruiter';
    phone: string;
    city: string;
    // Worker fields
    locality?: string;
    primarySkill?: string;
    experienceYears?: number;
    availability?: string;
    dailyWage?: number;
    bio?: string;
    // Recruiter fields
    organizationName?: string;
    recruiterType?: string;
}

// --- Schemas ---

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['worker', 'recruiter'], required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    // Worker specific
    locality: { type: String },
    primarySkill: { type: String },
    experienceYears: { type: Number },
    availability: { type: String },
    dailyWage: { type: Number },
    bio: { type: String },
    // Recruiter specific
    organizationName: { type: String },
    recruiterType: { type: String },
}, { timestamps: true });

const JobSchema = new Schema<IJob>({
    title: { type: String, required: true },
    skillRequired: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    duration: { type: String, required: true },
    paymentType: { type: String, enum: ['daily', 'monthly', 'contract'], required: true },
    budget: { type: Number, required: true },
    experienceRequired: { type: Number, required: true },
    recruiterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const ApplicationSchema = new Schema<IApplication>({
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    workerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recruiterId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Denormalized for easy querying
    status: { type: String, enum: ['applied', 'accepted', 'rejected', 'completed'], default: 'applied' },
    appliedAt: { type: Date, default: Date.now },
});

// --- Models ---
// Prevent overwrite on hot reload
export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const Job = mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);
export const Application = mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);
