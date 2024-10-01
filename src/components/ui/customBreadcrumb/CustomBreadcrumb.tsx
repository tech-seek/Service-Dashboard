import Link from 'next/link';
import React, { FC } from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface IProps {
    pathName: string;
}

const CustomBreadcrumb: FC<IProps> = ({ pathName }) => {
    const segments = pathName.split('/').filter(Boolean);
    if (segments.length === 1) return null;
    return (
        <Breadcrumb className='hidden md:flex'>
            <BreadcrumbList>
                {segments.map((segment, index) => {
                    const isLast = index === segments.length - 1;
                    const href = `/${segments.slice(0, index + 1).join('/')}`; // Build the href

                    return (
                        <BreadcrumbItem key={href}>
                            <BreadcrumbLink asChild>
                                <Link href={href} className='capitalize'>
                                    {segment}
                                </Link>
                            </BreadcrumbLink>
                            {!isLast && <BreadcrumbSeparator />}
                        </BreadcrumbItem>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default CustomBreadcrumb;
