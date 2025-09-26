'use client';

import React from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { KanbanColumn } from './KanbanColumn';
import type { Contract, ContractStatus } from '@/app/types/contract'; 

interface KanbanBoardProps {
  contracts: Contract[];
  onSelectContract: (contract: Contract) => void;
  onUpdateStatus: (contractId: number | string, newStatus: ContractStatus) => void;
}

const COLUMNS: Record<ContractStatus, { id: ContractStatus; title: string }> = {
  NEW: { id: "NEW", title: "New Submissions" },
  ON_VERIFICATION: { id: "ON_VERIFICATION", title: "Legal Verification" },
  ON_REVIEW: { id: "ON_REVIEW", title: "Review by Management" },
  CONFLICT: { id: "CONFLICT", title: "Conflict" },
  ACCEPTED: { id: "ACCEPTED", title: "Accepted" },
};

const getContractsByStatus = (contracts: Contract[] = []) => { 
  return contracts.reduce((acc, contract) => {
    const statusKey = contract.status;
    if (!acc[statusKey]) {
      acc[statusKey] = [];
    }
    acc[statusKey].push(contract);
    return acc;
  }, {} as Record<ContractStatus, Contract[]>);
};


export const KanbanBoard = ({ contracts, onSelectContract, onUpdateStatus }: KanbanBoardProps) => {
  const contractsByStatus = getContractsByStatus(contracts);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    // FIX: Mengkonversi ID string dari DND ke Number agar cocok dengan ID di state
    const contractId = Number(draggableId); 
    const newStatus = destination.droppableId as ContractStatus;
    
    // Panggil handler dari StoragePage
    onUpdateStatus(contractId, newStatus);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
        <div 
          className="flex flex-row space-x-4 h-full overflow-x-auto overflow-y-hidden pb-4"
        >
          {Object.values(COLUMNS).map(column => (
            <KanbanColumn
              key={column.id}
              columnId={column.id}
              title={column.title}
              contracts={contractsByStatus[column.id] || []}
              onSelectContract={onSelectContract}
            />
          ))}
        </div>
    </DragDropContext>
  );
};