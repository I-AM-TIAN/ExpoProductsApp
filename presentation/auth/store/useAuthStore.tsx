import { authCheckStatus, authLogin } from "@/core/auth/actions/auth-actions";
import { User } from "@/core/auth/interface/user";

import { create } from "zustand";

export type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  status: AuthStatus;
  token?: string;
  user?: User;

  login: (email: string, password: string) => Promise<boolean>;
  checkStatus: () => Promise<void>;
  logout: () => Promise<void>;
  changeStatus: (token?: string, user?: User) => boolean;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  //Properties
  status: 'checking',
  token: undefined,
  user: undefined,

  changeStatus: (token?: string, user?: User) => {
    if(!token || !user) {
      set({ status: 'unauthenticated', user: undefined, token: undefined });
      return false;
    }

    set({
      status: 'authenticated',
      user: user,
      token: token,
    });

    return true;
  },

  //Actions
  login: async (email: string, password: string) => {
    const resp = await authLogin(email, password);
    return get().changeStatus( resp?.token, resp?.user );
  },

  checkStatus: async () => {
    const resp = await authCheckStatus();
    get().changeStatus( resp?.token, resp?.user );
  },

  logout: async () => {
    set({ status: 'unauthenticated', user: undefined, token: undefined });
  },
}))