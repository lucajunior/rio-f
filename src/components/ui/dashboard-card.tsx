import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  variant?: 'primary' | 'success' | 'info' | 'warning';
  onClick?: () => void;
  children?: ReactNode;
}

const variantStyles = {
  primary: 'bg-primary text-primary-foreground',
  success: 'bg-success text-success-foreground',
  info: 'bg-info text-info-foreground',
  warning: 'bg-warning text-warning-foreground',
};

export const DashboardCard = ({ 
  title, 
  description, 
  icon: Icon, 
  variant = 'primary', 
  onClick,
  children 
}: DashboardCardProps) => {
  return (
    <Card className={`${variantStyles[variant]} shadow-card hover:shadow-elegant transition-all duration-200 cursor-pointer`} onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Icon className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="opacity-90 mb-4">{description}</p>
        {children || (
          <Button 
            variant="secondary" 
            className="w-full bg-white/20 hover:bg-white/30 border-0"
          >
            Acessar
          </Button>
        )}
      </CardContent>
    </Card>
  );
};