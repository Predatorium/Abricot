'use client';

import { createContext, useContext, useState } from 'react';
import { getProfileAction, updateProfileAction, updatePasswordAction } from '@/actions/authActions';

const AuthContext = createContext(null);

/**
 * @param {object} props
 * @param {object|null} props.initialUser - passé par le Server Component parent (déjà résolu via getProfileAction)
 * @param {React.ReactNode} props.children
 */
export function AuthProvider({ initialUser = null, children }) {
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getProfileAction();
      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editProfile = async (profileData) => {
    const { data } = await updateProfileAction(profileData);
    setUser(data.user);
    return data.user;
  };

  const changePassword = ({ currentPassword, newPassword }) => {
    return updatePasswordAction({ currentPassword, newPassword });
  };

  const clearUser = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{ user, loading, error, setUser, refreshProfile, editProfile, changePassword, clearUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
}
