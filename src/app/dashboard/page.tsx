import { ISerchParams } from '@/types';
import { DashboardWrapper } from '@/app/dashboard/components/dashboardWrapper';


const HomePage = ({ searchParams }: ISerchParams) => {
    return <DashboardWrapper searchParams={searchParams} />;
};
export default HomePage;