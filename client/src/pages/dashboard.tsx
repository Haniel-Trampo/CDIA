import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Handshake, Home, MessageCircle, TrendingUp } from "lucide-react";

const timeFilters = [
  { value: "1d", label: "1 dia" },
  { value: "7d", label: "7 dias" },
  { value: "14d", label: "14 dias" },
  { value: "1m", label: "1 mês" },
  { value: "3m", label: "3 meses" },
  { value: "6m", label: "6 meses" },
  { value: "1y", label: "1 ano" },
  { value: "all", label: "Todo período" },
];

const leadSources = [
  { name: "Site Institucional", percentage: 45, color: "bg-primary" },
  { name: "Redes Sociais", percentage: 28, color: "bg-green-500" },
  { name: "Indicação", percentage: 18, color: "bg-orange-500" },
  { name: "Outros", percentage: 9, color: "bg-blue-500" },
];

const recentActivities = [
  {
    id: 1,
    type: "lead",
    icon: Users,
    iconBg: "bg-primary",
    title: "Novo lead adicionado",
    description: "Contato interessado em apartamentos na zona sul",
    time: "2 horas atrás",
  },
  {
    id: 2,
    type: "sale",
    icon: Handshake,
    iconBg: "bg-green-500",
    title: "Venda finalizada",
    description: "Apartamento na Rua das Flores vendido com sucesso",
    time: "5 horas atrás",
  },
  {
    id: 3,
    type: "property",
    icon: Home,
    iconBg: "bg-blue-500",
    title: "Novo imóvel cadastrado",
    description: "Casa no Bairro Central adicionada ao catálogo",
    time: "1 dia atrás",
  },
];

export default function Dashboard() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
  });

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date Filter */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">Período:</label>
        <Select defaultValue="1m">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timeFilters.map((filter) => (
              <SelectItem key={filter.value} value={filter.value}>
                {filter.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="text-primary" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Novos Leads</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics ? formatNumber(metrics.newLeads) : "0"}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="text-green-500 mr-1" size={16} />
              <span className="text-green-500 font-medium">+12%</span>
              <span className="text-gray-500 ml-2">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Handshake className="text-green-500" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Vendas Fechadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics ? formatNumber(metrics.closedSales) : "0"}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="text-green-500 mr-1" size={16} />
              <span className="text-green-500 font-medium">+8%</span>
              <span className="text-gray-500 ml-2">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Home className="text-orange-500" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Imóveis Ativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics ? formatNumber(metrics.activeProperties) : "0"}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="text-green-500 mr-1" size={16} />
              <span className="text-green-500 font-medium">+5%</span>
              <span className="text-gray-500 ml-2">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="text-blue-500" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Mensagens Enviadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics ? formatNumber(metrics.messagesSent) : "0"}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="text-green-500 mr-1" size={16} />
              <span className="text-green-500 font-medium">+15%</span>
              <span className="text-gray-500 ml-2">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Vendas por Período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="mx-auto text-gray-400 mb-2" size={48} />
                <p className="text-gray-500">Gráfico de vendas será implementado</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lead Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Origem dos Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leadSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 ${source.color} rounded-full`}></div>
                    <span className="ml-3 text-sm text-gray-700">{source.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{source.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`w-8 h-8 ${activity.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <Icon className="text-white" size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
