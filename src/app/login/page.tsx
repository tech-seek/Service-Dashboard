import { Metadata } from 'next';
import React from 'react';
import { LoginContainer } from './components';

export const metadata: Metadata = {
    title: 'Login',
};
const LoginPage =  () => {
    return <LoginContainer />;
};

export default LoginPage;
