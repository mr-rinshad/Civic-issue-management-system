import React from 'react';
import { Clock, CheckCircle2, XCircle, Building2, Wrench, CheckCheck } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getBadgeConfig = (status) => {
    switch (status) {
      case 'pending_verification':
        return {
          label: 'Pending Verification',
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <Clock className="w-3.5 h-3.5 mr-1 text-amber-500" />,
        };
      case 'accepted':
        return {
          label: 'Verified & Accepted',
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-blue-500" />,
        };
      case 'rejected':
        return {
          label: 'Rejected',
          bg: 'bg-red-50 text-red-700 border-red-200',
          icon: <XCircle className="w-3.5 h-3.5 mr-1 text-red-500" />,
        };
      case 'assigned':
        return {
          label: 'Assigned to Dept',
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: <Building2 className="w-3.5 h-3.5 mr-1 text-purple-500" />,
        };
      case 'in_progress':
        return {
          label: 'Work in Progress',
          bg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
          icon: <Wrench className="w-3.5 h-3.5 mr-1 text-cyan-500 animate-spin" />,
        };
      case 'resolved':
        return {
          label: 'Resolved & Closed',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <CheckCheck className="w-3.5 h-3.5 mr-1 text-emerald-500" />,
        };
      default:
        return {
          label: status,
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: null,
        };
    }
  };

  const config = getBadgeConfig(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
};

export default StatusBadge;
