import React from 'react';
import { Clock, CheckCircle2, XCircle, Building2, Wrench, CheckCheck } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getBadgeConfig = (status) => {
    switch (status) {
      case 'pending_verification':
        return {
          label: 'Pending Verification',
          bg: 'bg-[#FFFF00]/10 text-[#FFFF00] border-[#FFFF00]/30',
          icon: <Clock className="w-3.5 h-3.5 mr-1 text-[#FFFF00]" />,
        };
      case 'accepted':
        return {
          label: 'Verified & Accepted',
          bg: 'bg-[#DFFF00]/10 text-[#DFFF00] border-[#DFFF00]/30',
          icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#DFFF00]" />,
        };
      case 'rejected':
        return {
          label: 'Rejected',
          bg: 'bg-red-500/10 text-red-400 border-red-500/30',
          icon: <XCircle className="w-3.5 h-3.5 mr-1 text-red-400" />,
        };
      case 'assigned':
        return {
          label: 'Assigned to Dept',
          bg: 'bg-[#CCFF00]/10 text-[#CCFF00] border-[#CCFF00]/30',
          icon: <Building2 className="w-3.5 h-3.5 mr-1 text-[#CCFF00]" />,
        };
      case 'in_progress':
        return {
          label: 'Work in Progress',
          bg: 'bg-[#FFFF00]/15 text-[#FFFF00] border-[#FFFF00]/40',
          icon: <Wrench className="w-3.5 h-3.5 mr-1 text-[#FFFF00] animate-spin" />,
        };
      case 'resolved':
        return {
          label: 'Resolved & Closed',
          bg: 'bg-[#CCFF00]/20 text-[#CCFF00] border-[#CCFF00]/50 shadow-[0_0_10px_rgba(204,255,0,0.2)]',
          icon: <CheckCheck className="w-3.5 h-3.5 mr-1 text-[#CCFF00]" />,
        };
      default:
        return {
          label: status,
          bg: 'bg-zinc-800 text-zinc-300 border-zinc-700',
          icon: null,
        };
    }
  };

  const config = getBadgeConfig(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-extrabold border backdrop-blur-md ${config.bg}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
};

export default StatusBadge;
