import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { KanbanCard } from './KanbanCard';
import type { Contract } from '@/app/types/contract';

interface KanbanColumnProps {
  columnId: string;
  title: string;
  contracts: Contract[];
  onSelectContract: (contract: Contract) => void;
}

export const KanbanColumn = ({ columnId, title, contracts, onSelectContract }: KanbanColumnProps) => {
  return (
    <div className="flex flex-col w-64 flex-shrink-0 bg-slate-100 rounded-lg p-3 shadow-inner h-full">
      <h3 className="font-bold text-base text-slate-700 mb-4 border-b pb-2 border-slate-300">
        {title} <span className="text-slate-500 font-normal">({contracts.length})</span>
      </h3>

      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div 
            className="flex-1 overflow-y-auto pr-2"
            {...provided.droppableProps}
            ref={provided.innerRef}
            // Tambahkan background styling saat di-hover/drag
            style={{
              backgroundColor: snapshot.isDraggingOver ? 'rgba(0,0,0,0.05)' : 'transparent',
              minHeight: '20px'
            }}
          >
            {contracts.map((contract, index) => (
              <KanbanCard 
                key={contract.id} 
                contract={contract}
                index={index}
                onClick={() => onSelectContract(contract)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};