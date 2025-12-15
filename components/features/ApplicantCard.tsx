import { User, Phone, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ApplicantCardProps {
    applicant: {
        id: string;
        name: string;
        skill: string;
        experience: string;
        phone: string;
        status: 'pending' | 'accepted' | 'rejected';
    };
    onAccept: () => void;
    onReject: () => void;
}

export function ApplicantCard({ applicant, onAccept, onReject }: ApplicantCardProps) {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                    {applicant.name.charAt(0)}
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{applicant.name}</h4>
                    <div className="text-sm text-gray-500 flex gap-3">
                        <span>{applicant.skill}</span>
                        <span>•</span>
                        <span>{applicant.experience} Exp</span>
                    </div>
                </div>
            </div>

            {applicant.status === 'pending' ? (
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button size="sm" variant="outline" className="flex-1 sm:flex-none hover:bg-red-50 hover:text-red-600 hover:border-red-200" onClick={onReject}>
                        Reject
                    </Button>
                    <Button size="sm" className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700" onClick={onAccept}>
                        Accept
                    </Button>
                </div>
            ) : (
                <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1
            ${applicant.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
        `}>
                    {applicant.status === 'accepted' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                </div>
            )}
        </div>
    );
}
