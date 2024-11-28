import React from 'react';
import { AdminManagement } from '../components/AdminManagement';
import { EmployeeManagement } from '../components/EmployeeManagement';
import { useState, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

export const EmployeeManagementPage: React.FC = () => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [error, setError] = useState('');

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'employee');
      
      if (error) throw error;

      if (data) {
        const formattedEmployees: User[] = data.map(emp => ({
          id: emp.id,
          email: emp.email,
          firstName: emp.first_name,
          lastName: emp.last_name,
          pin: emp.pin,
          role: emp.role,
          active: emp.active
        }));
        setEmployees(formattedEmployees);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to load employees');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="space-y-6">
      <AdminManagement onAdminCreated={() => {}} />
      <EmployeeManagement 
        employees={employees}
        onUpdate={fetchEmployees}
      />
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
};