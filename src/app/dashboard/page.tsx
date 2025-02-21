import { ISearchParams } from '@/types';
import { DashboardWrapper } from '@/app/dashboard/components/dashboardWrapper';

const HomePage = ({ searchParams }: ISearchParams) => {
    return <DashboardWrapper searchParams={searchParams} />;
};
export default HomePage;
