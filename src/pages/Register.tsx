import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, UserPlus, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/contexts/DataContext';

const Register = () => {
  const [formData, setFormData] = useState({
    matricula: '',
    nome: '',
    aniversario: '',
    foto: null as File | null
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addUser, users } = useData();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, foto: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if matricula already exists
      const existingUser = users.find(user => user.matricula === formData.matricula);
      if (existingUser) {
        toast({
          title: "Erro no cadastro",
          description: "Esta matrícula já está cadastrada no sistema.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Convert file to base64 if present
      let fotoBase64 = '';
      if (formData.foto) {
        const reader = new FileReader();
        fotoBase64 = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(formData.foto);
        });
      }

      // Add user
      addUser({
        matricula: formData.matricula,
        nome: formData.nome,
        aniversario: formData.aniversario,
        foto: fotoBase64,
        role: 'user'
      });

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Você pode fazer login com sua matrícula.",
      });

      navigate('/');
    } catch (error) {
      toast({
        title: "Erro no cadastro",
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
            <CardTitle className="text-center text-2xl">Cadastrar Usuário</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="matricula">Matrícula</Label>
                <Input
                  id="matricula"
                  name="matricula"
                  type="text"
                  value={formData.matricula}
                  onChange={handleInputChange}
                  placeholder="Digite sua matrícula"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  name="nome"
                  type="text"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Digite seu nome completo"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aniversario">Data de Nascimento</Label>
                <Input
                  id="aniversario"
                  name="aniversario"
                  type="date"
                  value={formData.aniversario}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="foto">Foto (opcional)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="foto"
                    name="foto"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={loading}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('foto')?.click()}
                    disabled={loading}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {formData.foto ? formData.foto.name : 'Selecionar foto'}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  "Cadastrando..."
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Cadastrar
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Já tem cadastro?{' '}
                <Link to="/" className="text-primary hover:underline font-medium">
                  Fazer Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;