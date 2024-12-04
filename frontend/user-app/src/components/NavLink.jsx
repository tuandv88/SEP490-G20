import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { IconBase } from 'react-icons';



export function NavLink({ to, label, icon: Icon, className }) {
  return (
    <Link 
      to={to} 
      className={cn(
        'text-base font-medium text-muted-foreground transition-all duration-300 hover:text-primary relative group flex items-center gap-2',
        className
      )}
    >
      <Icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
      {label}
      <span className='absolute inset-x-0 -bottom-1 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out' />
    </Link>
  );
}