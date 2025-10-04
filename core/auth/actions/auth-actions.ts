import { productsApi } from "../api/productsApi";
import { User } from "../interface/user";

export interface AuthResponse {
    id: string;
    email: string;
    fullname: string;
    isActive: boolean;
    roles: string[];
    token: string;
}

const returnUserToken = (data: AuthResponse): { user: User; token: string } => {
    //const {id, email, fullname, isActive, roles, token} = data;
    const { token, ...user } = data;

    //const user: User = {
    //    id,
    //    email,
    //    fullname,
    //    isActive,
    //    roles,
    //}

    return { 
        user,
        token 
    };
};

export const authLogin = async (email: string, password: string) => {
    
    email = email.toLowerCase();

    try {

        const { data } = await productsApi.post<AuthResponse>('/auth/login', { email, password });
        
        return returnUserToken(data); 

    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar sesión');
    }
}

export const authCheckStatus = async () => {
    try {
        const { data } = await productsApi.get<AuthResponse>('/auth/check-status');
        return returnUserToken(data);
    } catch (error) {
        return null;
    }
}