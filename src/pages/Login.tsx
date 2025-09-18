import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(matricula, senha);
      
      if (success) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para o dashboard...",
        });
        
        // Navigate based on user credentials
        if (matricula === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        toast({
          title: "Erro no login",
          description: "Matrícula ou senha incorretos.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro no sistema",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary rounded-full p-4">
              <Building2 className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Sistema de Alocação</h1>
          <p className="text-muted-foreground mt-2">SESI/SENAI - Auditórios</p>
        </div>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Acesso ao Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="matricula">Matrícula</Label>
                <Input
                  id="matricula"
                  type="text"
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                  placeholder="Digite sua matrícula"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Digite sua senha"
                  required
                  disabled={loading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  "Entrando..."
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Entrar
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Não tem cadastro?{' '}
                <Link to="/cadastrar" className="text-primary hover:underline font-medium">
                  Clique Aqui!
                </Link>
              </p>
              <p className="text-xs text-muted-foreground">
                Problemas para logar? Entre em contato com o administrador.
              </p>
            </div>

            <div className="mt-4 p-3 bg-accent rounded-lg">
              <p className="text-xs text-accent-foreground font-medium mb-1">Dados para teste:</p>
              <p className="text-xs text-accent-foreground">Admin: admin / admin123</p>
              <p className="text-xs text-accent-foreground">Usuário: 123456 / 123456</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;