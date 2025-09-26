'use client';

import { AlertTriangle, CheckCircle, FilePenLine, Clock } from 'lucide-react';

const deadlines = [
    { Icon: AlertTriangle, bgColor: 'bg-red-100', iconColor: 'text-red-600', title: 'Service Agreement - TechCorp', status: 'Review needed', due: 'Overdue by 2 days', dueColor: 'text-red-600' },
    { Icon: Clock, bgColor: 'bg-orange-100', iconColor: 'text-orange-600', title: 'NDA - StartupXYZ', status: 'Signature required', due: 'Due in 1 day', dueColor: 'text-orange-600' },
    { Icon: FilePenLine, bgColor: 'bg-blue-50', iconColor: 'text-blue-600', title: 'Employment Contract - Jane S...', status: 'Legal review needed', due: 'Due in 2 days', dueColor: 'text-slate-500' },
    { Icon: CheckCircle, bgColor: 'bg-green-50', iconColor: 'text-green-600', title: 'Vendor Agreement - SupplyCo', status: 'Final approval needed', due: 'Due in 4 days', dueColor: 'text-slate-500' },
];

export const DeadlineList = () => {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-slate-800">Approaching Deadlines</h3>
                <a href="#" className="text-sm font-medium text-blue-default hover:underline">View All</a>
            </div>
            <div className="space-y-4">
                {deadlines.map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center ${item.bgColor}`}>
                            <item.Icon className={`h-5 w-5 ${item.iconColor}`} />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-sm text-slate-800">{item.title}</p>
                            <p className="text-xs text-slate-500">{item.status}</p>
                            <p className={`text-xs font-medium ${item.dueColor}`}>{item.due}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};