import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center shadow-elegant">
        <CardContent className="p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-primary rounded-full p-4">
              <Building2 className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
          
          <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Página não encontrada</h2>
          <p className="text-muted-foreground mb-6">
            A página que você está procurando não existe ou foi movida.
          </p>
          
          <Link to="/">
            <Button className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Início
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
