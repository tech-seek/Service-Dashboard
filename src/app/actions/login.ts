'use server'

import { signIn, signOut } from "@/auth";
import { TLoginPlayload } from "@/types/user";
import { CredentialsSignin } from "next-auth";

export const onLoginAction = async (body: TLoginPlayload) => {
     try {
        const {userName,password}=body
        const res = await signIn('credentials', {
            userName,
            password,
        });
        return res
    } catch (err) {
        if (err instanceof CredentialsSignin) {
            return { error: err.cause };
        }
    }
};

export const onLogoutAction = async () => {
    await signOut();
}