/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';

import { useRouter } from 'next/navigation';
import React, { memo, useState } from 'react';
import { TLoginPlayload } from '@/types/user';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import CustomForm from '@/components/ui/customForm/customForm';
import RotatingDotsLoader from '@/components/ui/rotating-dots-loader';
import { onLoginAction } from '@/app/actions/login';
import useShowToast from '@/app/hooks/useShowToast';
import { loginFromFields } from '../static';


const LoginContainer = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useShowToast();
    const router = useRouter()
    const handleLogin = async (val: Record<string, unknown>) => {
        try {
            setIsLoading(true);
            const body: TLoginPlayload = {
                userName: val.userName as string,
                password: val.password as string,
            };
            const data = await onLoginAction(body);
            if (data?.error) {
                showToast(false, String(data?.error));
            } else {
                showToast(true, 'Login successful');
                router.refresh();
            }
        } catch (error) {
            setIsLoading(true);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <section className='container'>
            <div className='grid place-items-center h-dvh'>
                {isLoading ? (
                    <RotatingDotsLoader />
                ) : (
                    <Card className='w-full max-w-96'>
                        <CardHeader>
                            <h1 className='text-lg md:text-xl font-bold'>
                                Login into your account
                            </h1>
                        </CardHeader>
                        <CardContent>
                            <CustomForm
                                resetOnSuccess={false}
                                onSubmit={handleLogin}
                                fields={loginFromFields}
                            />
                        </CardContent>
                    </Card>
                )}
            </div>
        </section>
    );
};

export default memo(LoginContainer);