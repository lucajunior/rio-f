import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Auditorium, TimeSlot, Allocation } from '@/types';

interface DataContextType {
  users: User[];
  auditoriums: Auditorium[];
  timeSlots: TimeSlot[];
  allocations: Allocation[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addAllocation: (allocation: Omit<Allocation, 'id' | 'createdAt'>) => boolean;
  deleteAllocation: (id: string) => void;
  isSlotAvailable: (auditorio: string, data: string, turno: string, excludeId?: string) => boolean;
  hasUserConflict: (matricula: string, data: string, turno: string, excludeId?: string) => boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      matricula: 'admin',
      nome: 'Administrador do Sistema',
      aniversario: '1990-01-01',
      role: 'admin'
    },
    {
      id: '2',
      matricula: '123456',
      nome: 'João Silva',
      aniversario: '1985-05-15',
      role: 'user'
    }
  ]);

  const [auditoriums] = useState<Auditorium[]>([
    { id: '1', nome: 'Auditório Principal', capacidade: 60 },
    { id: '2', nome: 'Auditório Secundário', capacidade: 30 }
  ]);

  const [timeSlots] = useState<TimeSlot[]>([
    { id: '1', nome: 'Manhã', inicio: '07:00', fim: '12:00' },
    { id: '2', nome: 'Tarde', inicio: '13:00', fim: '17:00' },
    { id: '3', nome: 'Noite', inicio: '18:00', fim: '22:00' }
  ]);

  const [allocations, setAllocations] = useState<Allocation[]>([]);

  useEffect(() => {
    const savedAllocations = localStorage.getItem('allocations');
    if (savedAllocations) {
      setAllocations(JSON.parse(savedAllocations));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('allocations', JSON.stringify(allocations));
  }, [allocations]);

  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString()
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers(prev => prev.map(user => user.id === id ? { ...user, ...userData } : user));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const isSlotAvailable = (auditorio: string, data: string, turno: string, excludeId?: string) => {
    return !allocations.some(allocation => 
      allocation.auditorio === auditorio &&
      allocation.data === data &&
      allocation.turno === turno &&
      allocation.id !== excludeId
    );
  };

  const hasUserConflict = (matricula: string, data: string, turno: string, excludeId?: string) => {
    return allocations.some(allocation => 
      allocation.matricula === matricula &&
      allocation.data === data &&
      allocation.turno === turno &&
      allocation.id !== excludeId
    );
  };

  const addAllocation = (allocationData: Omit<Allocation, 'id' | 'createdAt'>): boolean => {
    // Check if slot is available
    if (!isSlotAvailable(allocationData.auditorio, allocationData.data, allocationData.turno)) {
      return false;
    }

    // Check if user has conflict
    if (hasUserConflict(allocationData.matricula, allocationData.data, allocationData.turno)) {
      return false;
    }

    const newAllocation: Allocation = {
      ...allocationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    setAllocations(prev => [...prev, newAllocation]);
    return true;
  };

  const deleteAllocation = (id: string) => {
    setAllocations(prev => prev.filter(allocation => allocation.id !== id));
  };

  const value = {
    users,
    auditoriums,
    timeSlots,
    allocations,
    addUser,
    updateUser,
    deleteUser,
    addAllocation,
    deleteAllocation,
    isSlotAvailable,
    hasUserConflict
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};