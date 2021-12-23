import { AxiosResponse } from "axios";
import { createContext, useState } from "react";

import { signIn, signUp, SignInData, SignUpData, me, IUserDto } from '../services/resources/user';

interface IContextData {
    user: IUserDto;
    userSignIn: (userData: SignInData) => Promise<IUserDto>;
    userSignUp: (userData: SignUpData) => Promise<IUserDto>;
    me: () => Promise<AxiosResponse<IUserDto, any>>;
}

export const AuthContext = createContext<IContextData>({} as IContextData)

export const AuthProvider: React.FC = ({children}) => {

    const[user, setUser] = useState<IUserDto>(() => {
        const user = localStorage.getItem('@Inter:User');

        if(user) {
          return JSON.parse(user);
        }
    
        return {} as IUserDto;
      });

    const userSignIn = async (userData: SignInData) => {
        const {data} = await signIn(userData);

        if(data?.status === 'error'){
            return data;
        }

        if(data.accessToken){
            localStorage.setItem('@Inter:Token', data.accessToken);
        }

        return getCurrentUser();
    }

    const getCurrentUser = async () => {
        const {data} = await me();
        setUser(data);
        localStorage.setItem('@Inter:User', JSON.stringify(user));
        return data;
    }

    const userSignUp = async (userData: SignUpData) => {
        const {data} = await signUp(userData);

        localStorage.setItem('@Inter:Token', data.accessToken);

        return getCurrentUser();
    }

    return(
        <AuthContext.Provider value={{ user, userSignIn, userSignUp, me }}>
            {children}
        </AuthContext.Provider>
    ) 
}