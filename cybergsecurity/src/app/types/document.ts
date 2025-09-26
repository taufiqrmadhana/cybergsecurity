export type Document = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  category: string;
  description: string;
  workflow: 'New' | 'On Verification' | 'On Review' | 'Conflict' | 'Accepted'; 
};