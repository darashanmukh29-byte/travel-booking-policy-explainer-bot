
import React from 'react';
import { QuickAction } from '../types';
import { QUICK_ACTIONS } from '../constants';

interface QuickActionsProps {
  onSelect: (action: QuickAction) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onSelect }) => {
  return (
    <div className="flex overflow-x-auto pb-2 -mx-1 no-scrollbar space-x-2">
      {QUICK_ACTIONS.map((action, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(action)}
          className="flex-shrink-0 flex items-center space-x-2 bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all rounded-full px-4 py-2 shadow-sm text-sm text-slate-700 font-medium"
        >
          <span className="text-lg">{action.icon}</span>
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
