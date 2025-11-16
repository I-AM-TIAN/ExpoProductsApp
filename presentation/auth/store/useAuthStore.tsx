import { authCheckStatus, authLogin, authRegister, type RegisterData } from "@/core/auth/actions/auth-actions";
import { User } from "@/core/auth/interface/user";
import { SecureStorageAdapter } from "@/helpers/adapters/secure-storage.adapter";

import { create } from "zustand";

export type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  status: AuthStatus;
  token?: string;
  user?: User;

  login: (email: string, password: string) => Promise<boolean>;
  register: (registerData: RegisterData) => Promise<boolean>;
  checkStatus: () => Promise<void>;
  logout: () => Promise<void>;
  changeStatus: (token?: string, user?: User) => Promise<boolean>;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  //Properties
  status: 'checking',
  token: undefined,
  user: undefined,

  changeStatus: async (token?: string, user?: User) => {
    if(!token || !user) {
      set({ status: 'unauthenticated', user: undefined, token: undefined });
      await SecureStorageAdapter.deleteItem('token');
      return false;
    }

    set({
      status: 'authenticated',
      user: user,
      token: token,
    });

    await SecureStorageAdapter.setItem('token', token);
    return true;
  },

  //Actions
  login: async (email: string, password: string) => {
    try {
      const resp = await authLogin(email, password);
      return get().changeStatus( resp?.token, resp?.user );
    } catch (error) {
      console.error('Error en login store:', error);
      return false;
    }
  },

  register: async (registerData: RegisterData) => {
    try {
      const resp = await authRegister(registerData);
      return get().changeStatus( resp?.token, resp?.user );
    } catch (error) {
      console.error('Error en register store:', error);
      return false;
    }
  },

  checkStatus: async () => {
    const resp = await authCheckStatus();
    get().changeStatus( resp?.token, resp?.user );
  },

  logout: async () => {
    await SecureStorageAdapter.deleteItem('token');
    set({ status: 'unauthenticated', user: undefined, token: undefined });
  },

  updateUser: (user: User) => {
    set({ user });
  },
}))