import { MapPin, Calendar, IndianRupee, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface JobCardProps {
    job: {
        _id?: string;
        id?: string;
        title: string;
        description: string;
        location: string;
        budget?: number;
        salary?: string;
        paymentType?: string;
        type?: string;
        postedAt?: string;
        createdAt?: string;
        skillRequired?: string;
        tags?: string[];
    };
    onApply?: () => void;
    isApplied?: boolean;
    status?: 'applied' | 'accepted' | 'rejected' | 'completed';
}

export function JobCard({ job, onApply, isApplied, status }: JobCardProps) {
    const displaySalary = job.budget ? `₹${job.budget}` : job.salary;
    const displayType = job.paymentType ? job.paymentType : job.type;
    const displayDate = job.createdAt ? new Date(job.createdAt).toLocaleDateString() : job.postedAt;

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">{job.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> {job.location}
                    </p>
                </div>
                {status && (
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
            ${status === 'applied' ? 'bg-blue-100 text-blue-800' : ''}
            ${status === 'accepted' ? 'bg-green-100 text-green-800' : ''}
            ${status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
            ${status === 'completed' ? 'bg-gray-100 text-gray-800' : ''}
          `}>
                        {status}
                    </span>
                )}
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 line-clamp-2">
                {job.description}
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                <div className="flex items-center gap-1">
                    <IndianRupee className="w-4 h-4" />
                    <span className="font-semibold text-gray-900 dark:text-gray-200">{displaySalary}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span className="capitalize">{displayType}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{displayDate}</span>
                </div>
            </div>

            <div className="flex items-center justify-between mt-auto">
                <div className="flex gap-2">
                    {job.tags?.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded text-xs text-gray-600 dark:text-gray-400">
                            {tag}
                        </span>
                    ))}
                </div>
                <Button
                    onClick={onApply}
                    disabled={isApplied}
                    variant={isApplied ? "outline" : "default"}
                >
                    {isApplied ? (status ? 'View Details' : 'Applied') : 'Apply Now'}
                </Button>
            </div>
        </div>
    );
}
