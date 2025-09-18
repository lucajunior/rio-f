import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Building2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <nav className="bg-primary text-primary-foreground shadow-elegant">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center space-x-3">
            <Building2 className="h-8 w-8" />
            <div>
              <h1 className="font-bold text-lg">Alocação de Auditórios</h1>
              <p className="text-xs opacity-90">SESI/SENAI</p>
            </div>
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="opacity-90">Olá, </span>
              <span className="font-medium">{user.nome}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-primary-foreground hover:bg-primary-hover"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};