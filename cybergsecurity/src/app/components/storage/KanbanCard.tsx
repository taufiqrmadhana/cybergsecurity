import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import type { Contract, ContractCategory } from '@/app/types/contract'; 

interface KanbanCardProps {
  contract: Contract; 
  index: number;
  onClick: () => void;
}

const getCategoryDisplay = (category: ContractCategory) => {
  return category.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
};

export const KanbanCard = ({ contract, index, onClick }: KanbanCardProps) => {
  return (
    <Draggable draggableId={String(contract.id)} index={index}>
      {(provided, snapshot) => (
        <div 
          className="bg-white p-4 rounded-lg shadow-md border border-slate-200 mb-3 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={onClick}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            // Styling tambahan saat item sedang di-drag
            opacity: snapshot.isDragging ? 0.9 : 1,
            backgroundColor: snapshot.isDragging ? '#f1f5f9' : 'white',
          }}
        >
          <h4 className="font-semibold text-sm text-slate-800 truncate">{contract.title}</h4>
          <p className="text-xs text-slate-500 mt-1">Deadline: {contract.deadline}</p>
          <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
            {getCategoryDisplay(contract.category)}
          </span>
        </div>
      )}
    </Draggable>
  );
};