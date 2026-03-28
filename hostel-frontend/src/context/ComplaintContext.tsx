import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export type Status = 'Pending' | 'In Progress' | 'Resolved';
export type Category = 'WiFi' | 'Water' | 'Electricity' | 'Food' | 'Cleaning' | 'Other';

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  category: Category;
  status: Status;
  createdAt: string;
}

interface ComplaintContextType {
  complaints: Complaint[];
  addComplaint: (complaint: Omit<Complaint, 'id' | 'userId' | 'userName' | 'status' | 'createdAt'>) => Promise<void>;
  updateStatus: (id: string, status: Status) => Promise<void>;
  deleteComplaint: (id: string) => Promise<void>;
  isLoading: boolean;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: '1',
    userId: 'u1',
    userName: 'John Doe',
    title: 'WiFi not working in Room 302',
    description: 'The router seems to be down since morning. No connection even after restarting.',
    category: 'WiFi',
    status: 'Pending',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    userId: 'u2',
    userName: 'Jane Smith',
    title: 'Water leakage in bathroom',
    description: 'The tap in the 2nd floor bathroom is leaking continuously.',
    category: 'Water',
    status: 'In Progress',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '3',
    userId: 'u1',
    userName: 'John Doe',
    title: 'Electricity issue',
    description: 'The lights are flickering in the study room.',
    category: 'Electricity',
    status: 'Resolved',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];

export const ComplaintProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Mock fetch
    const fetchComplaints = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const saved = localStorage.getItem('complaints');
      if (saved) {
        setComplaints(JSON.parse(saved));
      } else {
        setComplaints(MOCK_COMPLAINTS);
        localStorage.setItem('complaints', JSON.stringify(MOCK_COMPLAINTS));
      }
      setIsLoading(false);
    };
    fetchComplaints();
  }, []);

  const addComplaint = async (data: any) => {
    if (!user) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newComplaint: Complaint = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      ...data
    };

    const updated = [newComplaint, ...complaints];
    setComplaints(updated);
    localStorage.setItem('complaints', JSON.stringify(updated));
    setIsLoading(false);
  };

  const updateStatus = async (id: string, status: Status) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const updated = complaints.map(c => c.id === id ? { ...c, status } : c);
    setComplaints(updated);
    localStorage.setItem('complaints', JSON.stringify(updated));
    setIsLoading(false);
  };

  const deleteComplaint = async (id: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const updated = complaints.filter(c => c.id !== id);
    setComplaints(updated);
    localStorage.setItem('complaints', JSON.stringify(updated));
    setIsLoading(false);
  };

  return (
    <ComplaintContext.Provider value={{ complaints, addComplaint, updateStatus, deleteComplaint, isLoading }}>
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (context === undefined) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};
