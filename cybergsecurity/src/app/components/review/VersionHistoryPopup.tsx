'use client';

import { useRef } from 'react';
import { useOnClickOutside } from '@/app/hooks/useOnclickOutside';
import { FileClock } from 'lucide-react';

const versions = [
  { id: 3, editor: 'Neo Cicero', time: '26 Sep 2025, 11:15 PM' },
  { id: 2, editor: 'Jane Doe', time: '25 Sep 2025, 08:42 AM' },
  { id: 1, editor: 'John Smith', time: '24 Sep 2025, 02:10 PM' },
];

interface VersionHistoryPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VersionHistoryPopup = ({ isOpen, onClose }: VersionHistoryPopupProps) => {
  const popupRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(popupRef, onClose);

  if (!isOpen) return null;

  return (
    <div
      ref={popupRef}
      className="absolute top-14 right-4 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 z-20
                 origin-top-right animate-scale-in-ver-top"
    >
      <div className="p-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-800">Version History</h3>
        <p className="text-xs text-slate-500">List of document edits</p>
      </div>
      <div className="p-2 max-h-64 overflow-y-auto">
        <ul className="space-y-1">
          {versions.map((version) => (
            <li
              key={version.id}
              className="p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileClock className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm font-semibold text-slate-700">Version {version.id}</p>
                  <p className="text-xs text-slate-500">{version.time}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};