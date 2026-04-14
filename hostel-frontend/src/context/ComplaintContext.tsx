import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../lib/api';

export type Status = 'Pending' | 'In Progress' | 'Resolved';
export type Category = 'WiFi' | 'Water' | 'Electricity' | 'Food' | 'Cleaning' | 'Other';

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  userRoom?: string;
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
  refreshComplaints: () => Promise<void>;
  isLoading: boolean;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

// Transform backend complaint data to frontend format
const transformComplaint = (item: any): Complaint => ({
  id: item._id,
  userId: item.userId?._id || item.userId,
  userName: item.userId?.name || 'Unknown',
  userEmail: item.userId?.email || '',
  userRoom: item.userId?.roomNumber || '',
  title: item.title,
  description: item.description,
  category: item.category,
  status: item.status,
  createdAt: item.createdAt,
});

export const ComplaintProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Fetch complaints from the backend API
  const fetchComplaints = useCallback(async () => {
    if (!user) {
      setComplaints([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.get('/complaints');
      const data = response.data.map(transformComplaint);
      setComplaints(data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Fetch on mount and when user changes
  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const addComplaint = async (data: any) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const response = await api.post('/complaints', {
        title: data.title,
        description: data.description,
        category: data.category,
      });
      const newComplaint = transformComplaint(response.data);
      setComplaints((prev) => [newComplaint, ...prev]);
    } catch (error) {
      console.error('Error creating complaint:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: Status) => {
    setIsLoading(true);
    try {
      const response = await api.put(`/complaints/${id}`, { status });
      const updatedComplaint = transformComplaint(response.data);
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? updatedComplaint : c))
      );
    } catch (error) {
      console.error('Error updating complaint:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteComplaint = async (id: string) => {
    setIsLoading(true);
    try {
      await api.delete(`/complaints/${id}`);
      setComplaints((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Error deleting complaint:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ComplaintContext.Provider value={{ complaints, addComplaint, updateStatus, deleteComplaint, refreshComplaints: fetchComplaints, isLoading }}>
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
