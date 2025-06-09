import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const pageInfo = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Visão geral do seu negócio imobiliário"
  },
  "/leads": {
    title: "Gerenciar Leads",
    subtitle: "Gerencie seus prospects e clientes potenciais"
  },
  "/chat": {
    title: "Chat WhatsApp",
    subtitle: "Converse com seus clientes em tempo real"
  },
  "/properties": {
    title: "Catálogo de Imóveis",
    subtitle: "Gerencie seu portfólio de propriedades"
  },
  "/sales": {
    title: "Relatório de Vendas",
    subtitle: "Acompanhe o desempenho das suas vendas"
  }
};

export function Header() {
  const [location] = useLocation();
  const currentPage = pageInfo[location as keyof typeof pageInfo] || pageInfo["/dashboard"];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{currentPage.title}</h2>
          <p className="text-sm text-gray-600">{currentPage.subtitle}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2" size={16} />
            <span>Ação Rápida</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
