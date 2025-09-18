import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { DashboardCard } from '@/components/ui/dashboard-card';
import { Users, Building2, FileText, Calendar, Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DashboardAdmin = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'users' | 'allocations' | 'reports'>('dashboard');
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [userForm, setUserForm] = useState({
    matricula: '',
    nome: '',
    aniversario: '',
    foto: null as File | null
  });
  const [reportFilter, setReportFilter] = useState({
    period: 'day',
    date: new Date().toISOString().split('T')[0]
  });

  const { users, allocations, auditoriums, timeSlots, addUser, updateUser, deleteUser } = useData();
  const { toast } = useToast();

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      updateUser(editingUser, {
        matricula: userForm.matricula,
        nome: userForm.nome,
        aniversario: userForm.aniversario,
        role: 'user'
      });
      toast({ title: "Usuário atualizado com sucesso!" });
    } else {
      addUser({
        matricula: userForm.matricula,
        nome: userForm.nome,
        aniversario: userForm.aniversario,
        role: 'user'
      });
      toast({ title: "Usuário cadastrado com sucesso!" });
    }

    setShowUserModal(false);
    setEditingUser(null);
    setUserForm({ matricula: '', nome: '', aniversario: '', foto: null });
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user.id);
    setUserForm({
      matricula: user.matricula,
      nome: user.nome,
      aniversario: user.aniversario,
      foto: null
    });
    setShowUserModal(true);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      deleteUser(id);
      toast({ title: "Usuário excluído com sucesso!" });
    }
  };

  const getAuditoriumName = (id: string) => {
    return auditoriums.find(a => a.id === id)?.nome || id;
  };

  const getTimeSlotName = (id: string) => {
    return timeSlots.find(t => t.id === id)?.nome || id;
  };

  const getFilteredAllocations = () => {
    const today = new Date(reportFilter.date);
    
    return allocations.filter(allocation => {
      const allocDate = new Date(allocation.data);
      
      switch (reportFilter.period) {
        case 'day':
          return allocDate.toDateString() === today.toDateString();
        case 'week':
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          return allocDate >= weekStart && allocDate <= weekEnd;
        case 'month':
          return allocDate.getMonth() === today.getMonth() && 
                 allocDate.getFullYear() === today.getFullYear();
        default:
          return true;
      }
    });
  };

  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardCard
        title="Gerenciar Usuários"
        description="Cadastrar e editar usuários"
        icon={Users}
        variant="primary"
        onClick={() => setActiveView('users')}
      />
      
      <DashboardCard
        title="Visualizar Alocações"
        description="Ver todas as reservas"
        icon={Calendar}
        variant="success"
        onClick={() => setActiveView('allocations')}
      />
      
      <DashboardCard
        title="Relatórios"
        description="Gerar relatórios detalhados"
        icon={FileText}
        variant="info"
        onClick={() => setActiveView('reports')}
      />
      
      <DashboardCard
        title="Auditórios"
        description="Informações dos espaços"
        icon={Building2}
        variant="warning"
      >
        <div className="space-y-2">
          <div className="text-sm opacity-90">Total de usuários: {users.length}</div>
          <div className="text-sm opacity-90">Reservas ativas: {allocations.length}</div>
        </div>
      </DashboardCard>
    </div>
  );

  const renderUsers = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gerenciar Usuários</CardTitle>
        <Button onClick={() => setShowUserModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.filter(u => u.role === 'user').map(user => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={user.foto} />
                  <AvatarFallback>{user.nome.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{user.nome}</h4>
                  <p className="text-sm text-muted-foreground">Matrícula: {user.matricula}</p>
                  <p className="text-sm text-muted-foreground">
                    Nascimento: {new Date(user.aniversario).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderAllocations = () => (
    <Card>
      <CardHeader>
        <CardTitle>Todas as Alocações</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allocations.map(allocation => (
            <div key={allocation.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">{allocation.usuario}</h4>
                <p className="text-sm text-muted-foreground">
                  {getAuditoriumName(allocation.auditorio)} - {new Date(allocation.data).toLocaleDateString('pt-BR')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {getTimeSlotName(allocation.turno)} - Matrícula: {allocation.matricula}
                </p>
              </div>
              <Badge variant="secondary">Ativa</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderReports = () => (
    <Card>
      <CardHeader>
        <CardTitle>Relatórios de Alocação</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label>Período</Label>
              <Select value={reportFilter.period} onValueChange={(value) => 
                setReportFilter(prev => ({ ...prev, period: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Dia</SelectItem>
                  <SelectItem value="week">Semana</SelectItem>
                  <SelectItem value="month">Mês</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label>Data de Referência</Label>
              <Input
                type="date"
                value={reportFilter.date}
                onChange={(e) => setReportFilter(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-4">
              Relatório - {reportFilter.period === 'day' ? 'Diário' : 
                         reportFilter.period === 'week' ? 'Semanal' : 'Mensal'}
            </h4>
            
            <div className="space-y-2">
              {getFilteredAllocations().map(allocation => (
                <div key={allocation.id} className="p-3 bg-secondary rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{allocation.usuario}</p>
                      <p className="text-sm text-muted-foreground">
                        {getAuditoriumName(allocation.auditorio)} - {getTimeSlotName(allocation.turno)}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {new Date(allocation.data).toLocaleDateString('pt-BR')}
                    </Badge>
                  </div>
                </div>
              ))}
              
              {getFilteredAllocations().length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  Nenhuma alocação encontrada para o período selecionado.
                </p>
              )}
            </div>
            
            <div className="mt-4 p-4 bg-accent rounded-lg">
              <p className="font-medium">Resumo:</p>
              <p className="text-sm">Total de alocações: {getFilteredAllocations().length}</p>
              <p className="text-sm">
                Auditório Principal: {getFilteredAllocations().filter(a => a.auditorio === '1').length}
              </p>
              <p className="text-sm">
                Auditório Secundário: {getFilteredAllocations().filter(a => a.auditorio === '2').length}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Administrador</h1>
            <p className="text-muted-foreground">Sistema de Alocação de Auditórios</p>
          </div>
          
          {activeView !== 'dashboard' && (
            <Button variant="outline" onClick={() => setActiveView('dashboard')}>
              Voltar ao Dashboard
            </Button>
          )}
        </div>

        {activeView === 'dashboard' && renderDashboard()}
        {activeView === 'users' && renderUsers()}
        {activeView === 'allocations' && renderAllocations()}
        {activeView === 'reports' && renderReports()}
      </main>

      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUserSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Matrícula</Label>
              <Input
                value={userForm.matricula}
                onChange={(e) => setUserForm(prev => ({ ...prev, matricula: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input
                value={userForm.nome}
                onChange={(e) => setUserForm(prev => ({ ...prev, nome: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Data de Nascimento</Label>
              <Input
                type="date"
                value={userForm.aniversario}
                onChange={(e) => setUserForm(prev => ({ ...prev, aniversario: e.target.value }))}
                required
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit" className="flex-1">
                {editingUser ? 'Atualizar' : 'Cadastrar'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowUserModal(false);
                  setEditingUser(null);
                  setUserForm({ matricula: '', nome: '', aniversario: '', foto: null });
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default DashboardAdmin;