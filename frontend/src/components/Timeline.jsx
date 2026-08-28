import React from 'react';
import { CheckCircle2, Clock, XCircle, ShieldCheck, Building2, Wrench, CheckCheck } from 'lucide-react';

const Timeline = ({ complaint }) => {
  const isRejected = complaint.status === 'rejected';

  const steps = [
    {
      id: 1,
      title: 'Report Submitted',
      description: `Reported by citizen on ${new Date(complaint.createdAt).toLocaleDateString()}`,
      completed: true,
      current: complaint.status === 'pending_verification',
      icon: <Clock className="w-5 h-5 text-blue-600" />,
    },
    {
      id: 2,
      title: isRejected ? 'Verification Failed (Rejected)' : 'Physical Verification (Councillor)',
      description: isRejected
        ? `Reason: ${complaint.rejectionReason}`
        : complaint.verificationNotes || 'Pending physical inspection by Councillor Admin',
      completed: ['accepted', 'assigned', 'in_progress', 'resolved'].includes(complaint.status),
      failed: isRejected,
      current: complaint.status === 'accepted',
      icon: isRejected ? (
        <XCircle className="w-5 h-5 text-red-600" />
      ) : (
        <ShieldCheck className="w-5 h-5 text-indigo-600" />
      ),
    },
    {
      id: 3,
      title: 'Department Assigned',
      description: complaint.assignedDepartmentName
        ? `Forwarded to ${complaint.assignedDepartmentName}`
        : 'Awaiting assignment to responsible department',
      completed: ['assigned', 'in_progress', 'resolved'].includes(complaint.status),
      current: complaint.status === 'assigned',
      icon: <Building2 className="w-5 h-5 text-purple-600" />,
    },
    {
      id: 4,
      title: 'Work In Progress',
      description: complaint.progressNotes || 'Department team active on field',
      completed: complaint.status === 'resolved',
      current: complaint.status === 'in_progress',
      icon: <Wrench className="w-5 h-5 text-cyan-600" />,
    },
    {
      id: 5,
      title: 'Work Completed & Closed',
      description: complaint.resolvedAt
        ? `Resolved on ${new Date(complaint.resolvedAt).toLocaleDateString()}`
        : 'Awaiting resolution proof photo',
      completed: complaint.status === 'resolved',
      current: complaint.status === 'resolved',
      icon: <CheckCheck className="w-5 h-5 text-emerald-600" />,
    },
  ];

  return (
    <div className="py-2">
      <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center">
        Real-Time Issue Progress Tracker
      </h4>
      <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
        {steps.map((step) => {
          let circleBg = 'bg-white border-2 border-slate-300 text-slate-400';
          if (step.failed) circleBg = 'bg-red-100 border-2 border-red-500 text-red-600';
          else if (step.completed) circleBg = 'bg-emerald-100 border-2 border-emerald-500 text-emerald-700';
          else if (step.current) circleBg = 'bg-blue-100 border-2 border-blue-600 text-blue-700 animate-pulse';

          return (
            <div key={step.id} className="relative flex items-start space-x-3">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center z-10 ${circleBg}`}
              >
                {step.failed ? (
                  <XCircle className="w-4 h-4 text-red-600" />
                ) : step.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <span className="text-xs font-bold">{step.id}</span>
                )}
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{step.title}</span>
                  {step.completed && (
                    <span className="text-[10px] text-emerald-600 font-semibold uppercase bg-emerald-50 px-2 py-0.5 rounded-full">
                      Done
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
