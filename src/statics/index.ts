import { Icons } from '@/components/ui/icons';

export const TOOL_TIP_DELAY = 200;
export const ONGOING = 'on-going';
export const EXPIRING = 'expiring';

export const NAV_LINKS = [
    { href: '/', icon: Icons.House, label: 'Home' },
    { href: '/dashboard', icon: Icons.LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/task', icon: Icons.ClipboardList, label: 'Tasks' },
    { href: '/dashboard/expireing', icon: Icons.CalendarX2, label: 'Expireing' },
    { href: '/dashboard/history', icon: Icons.History, label: 'History' },
    // { href: '#', icon: Icons.Settings, label: 'Settings' },
];
