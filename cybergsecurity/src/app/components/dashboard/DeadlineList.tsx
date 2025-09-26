'use client';

import { FileText } from 'lucide-react';
import Link from 'next/link'; 

const deadlines = [
    { title: 'Service Agreement - TechCorp', status: 'Review needed', due: 'Overdue' },
    { title: 'NDA - StartupXYZ', status: 'Signature required', due: '1 day' },
    { title: 'Employment Contract - Jane S...', status: 'Legal review needed', due: '2 days' },
    { title: 'Vendor Agreement - SupplyCo', status: 'Final approval needed', due: '4 days' },
    { title: 'Partnership MoU - BizGroup', status: 'Drafting', due: '5 days' },
    { title: 'Lease Renewal - Office Space', status: 'Awaiting signature', due: '7 days' },
    { title: 'Software License - Adobe', status: 'Approved', due: '10 days' },
];

export const DeadlineList = () => {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h3 className="font-bold text-lg text-slate-800">Approaching Deadlines</h3>
                <Link href="#" className="text-sm font-medium text-[var(--color-blue-default)] hover:underline">View All</Link>
            </div>
            <div className="space-y-1 overflow-y-auto max-h-[400px] pr-2">
                {deadlines.map((item, index) => (
                    <div 
                        key={index} 
                        className="flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-slate-50 group"
                    >
                        <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-slate-400 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-sm text-slate-800 transition-colors group-hover:text-blue-default">{item.title}</p>
                                <p className="text-xs font-medium text-slate-500">{item.status}</p>
                            </div>
                        </div>
                        
                        <p className="text-sm font-medium whitespace-nowrap text-slate-500">
                            {item.due}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};