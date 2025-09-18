import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { DashboardCard } from '@/components/ui/dashboard-card';
import { Calendar, Building2, Clock, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const DashboardUser = () => {
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [allocationForm, setAllocationForm] = useState({
    auditorio: '',
    data: '',
    turno: ''
  });

  const { auditoriums, timeSlots, allocations, addAllocation, deleteAllocation } = useData();
  const { user } = useAuth();
  const { toast } = useToast();

  const userAllocations = allocations.filter(allocation => allocation.matricula === user?.matricula);

  const handleAllocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    const success = addAllocation({
      auditorio: allocationForm.auditorio,
      data: allocationForm.data,
      turno: allocationForm.turno,
      usuario: user.nome,
      matricula: user.matricula
    });

    if (success) {
      toast({
        title: "Alocação realizada com sucesso!",
        description: "Seu auditório foi reservado.",
      });
      setShowAllocationModal(false);
      setAllocationForm({ auditorio: '', data: '', turno: '' });
    } else {
      toast({
        title: "Erro na alocação",
        description: "Horário não disponível ou você já possui uma reserva neste período.",
        variant: "destructive",
      });
    }
  };

  const handleCancelAllocation = (id: string) => {
    deleteAllocation(id);
    toast({
      title: "Reserva cancelada",
      description: "Sua reserva foi cancelada com sucesso.",
    });
  };

  const getAuditoriumName = (id: string) => {
    return auditoriums.find(a => a.id === id)?.nome || id;
  };

  const getTimeSlotName = (id: string) => {
    return timeSlots.find(t => t.id === id)?.nome || id;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard do Usuário</h1>
          <p className="text-muted-foreground">Gerencie suas reservas de auditórios</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Nova Reserva"
            description="Reservar um auditório"
            icon={Calendar}
            variant="primary"
            onClick={() => setShowAllocationModal(true)}
          />
          
          <DashboardCard
            title="Auditórios"
            description="Ver auditórios disponíveis"
            icon={Building2}
            variant="success"
          >
            <div className="space-y-2">
              {auditoriums.map(audit => (
                <div key={audit.id} className="text-sm opacity-90">
                  {audit.nome} - {audit.capacidade} lugares
                </div>
              ))}
            </div>
          </DashboardCard>
          
          <DashboardCard
            title="Horários"
            description="Turnos disponíveis"
            icon={Clock}
            variant="info"
          >
            <div className="space-y-2">
              {timeSlots.map(slot => (
                <div key={slot.id} className="text-sm opacity-90">
                  {slot.nome}: {slot.inicio} - {slot.fim}
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Minhas Reservas</CardTitle>
          </CardHeader>
          <CardContent>
            {userAllocations.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Você não possui reservas ativas.
              </p>
            ) : (
              <div className="space-y-4">
                {userAllocations.map(allocation => (
                  <div key={allocation.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{getAuditoriumName(allocation.auditorio)}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(allocation.data).toLocaleDateString('pt-BR')} - {getTimeSlotName(allocation.turno)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Ativa</Badge>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelAllocation(allocation.id)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Dialog open={showAllocationModal} onOpenChange={setShowAllocationModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Reserva</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAllocationSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Auditório</Label>
              <Select value={allocationForm.auditorio} onValueChange={(value) => 
                setAllocationForm(prev => ({ ...prev, auditorio: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o auditório" />
                </SelectTrigger>
                <SelectContent>
                  {auditoriums.map(audit => (
                    <SelectItem key={audit.id} value={audit.id}>
                      {audit.nome} ({audit.capacidade} lugares)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Data</Label>
              <Input
                type="date"
                value={allocationForm.data}
                onChange={(e) => setAllocationForm(prev => ({ ...prev, data: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Turno</Label>
              <Select value={allocationForm.turno} onValueChange={(value) => 
                setAllocationForm(prev => ({ ...prev, turno: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o turno" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(slot => (
                    <SelectItem key={slot.id} value={slot.id}>
                      {slot.nome} ({slot.inicio} - {slot.fim})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2">
              <Button type="submit" className="flex-1">Reservar</Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowAllocationModal(false)}
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

export default DashboardUser;