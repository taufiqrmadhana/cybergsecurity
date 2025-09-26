'use client';

export type ColumnDef<T> = {
  accessorKey: keyof T;
  header: string;
  className?: string; 
  cell?: (row: T) => React.ReactNode; 
};

interface DataTableProps<T extends { id: string | number }> {
  data: T[];
  columns: ColumnDef<T>[];
  selectedItem: T | null;
  onSelectItem: (item: T) => void;
  gridClassName: string; 
}

export const DataTable = <T extends { id: string | number }>({
  data,
  columns,
  selectedItem,
  onSelectItem,
  gridClassName,
}: DataTableProps<T>) => {
  return (
    <div className="flex-1 overflow-y-auto pr-2 min-h-0">
      {/* Header Tabel */}
      <div className={`grid ${gridClassName} gap-4 sticky top-0 bg-slate-50 p-3 rounded-t-lg text-sm font-semibold text-slate-600 border-b`}>
        {columns.map((col) => (
          <div key={String(col.accessorKey)} className={col.className}>
            {col.header}
          </div>
        ))}
      </div>
      {/* Body Tabel */}
      <div className="divide-y divide-slate-100">
        {data.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectItem(item)}
            className={`grid ${gridClassName} gap-4 p-3 cursor-pointer transition-colors group ${
              selectedItem?.id === item.id ? 'bg-blue-50' : 'hover:bg-slate-50'
            }`}
          >
            {columns.map((col) => (
              <div key={String(col.accessorKey)} className={`${col.className} text-sm text-slate-500 min-w-0`}>
                {col.cell ? col.cell(item) : String(item[col.accessorKey])}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};