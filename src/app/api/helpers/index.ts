import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export { default as db } from './prismaClient';

export const successResponse = (data: unknown, message: string = 'Request successful') => {
    return NextResponse.json({
        success: true,
        message,
        data,
    });
};

export const errorResponse = (message: string, statusCode: number = 500, error?: unknown) => {
    if ((error as { code: string })?.code === 'P2003') {
        return NextResponse.json(
            {
                success: false,
                message: 'Please remove related records first',
                data: null,
            },
            { status: statusCode },
        );
    }

    return NextResponse.json(
        {
            success: false,
            message,
            data: null,
        },
        { status: statusCode },
    );
};

export const zodErrorResponse = (error: ZodError) => {
    const errorMessage = error.issues.map((issue) => issue.message).join(', ');
    return errorResponse(errorMessage, 400);
};
