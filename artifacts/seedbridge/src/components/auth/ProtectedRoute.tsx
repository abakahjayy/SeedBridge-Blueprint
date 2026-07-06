import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Redirect, useLocation } from 'wouter';

export function ProtectedRoute({ 
  children, 
  allowedRoles = [] 
}: { 
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { user, isLoading } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return <div className="flex-1 flex items-center justify-center p-8">Loading...</div>;
  }

  if (!user) {
    return <Redirect to={`/login?redirect=${encodeURIComponent(location)}`} />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to their respective dashboard if they try to access something they shouldn't
    return <Redirect to={`/${user.role}/dashboard`} />;
  }

  return <>{children}</>;
}
