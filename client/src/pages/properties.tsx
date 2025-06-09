import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, FileUp, Search, Edit, Trash2, Bed, Bath, Car, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { AddPropertyModal } from "@/components/modals/add-property-modal";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Property } from "@shared/schema";

const statusColors = {
  disponivel: "bg-green-100 text-green-800",
  reservado: "bg-yellow-100 text-yellow-800",
  vendido: "bg-gray-100 text-gray-800",
};

const statusLabels = {
  disponivel: "Disponível",
  reservado: "Reservado",
  vendido: "Vendido",
};

export default function Properties() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState<number[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const deletePropertyMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/properties/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      toast({
        title: "Imóvel excluído",
        description: "O imóvel foi removido com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao excluir imóvel",
        description: "Ocorreu um erro ao excluir o imóvel.",
        variant: "destructive",
      });
    },
  });

  const handleSelectProperty = (propertyId: number) => {
    setSelectedProperties(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const formatPrice = (price: string | null) => {
    if (!price) return "Não informado";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(Number(price));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Catálogo de Imóveis</h3>
          <p className="text-sm text-gray-600">Gerencie seu portfólio de propriedades</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <FileUp className="mr-2" size={16} />
            Importar
          </Button>
          <Button onClick={() => setAddModalOpen(true)}>
            <Plus className="mr-2" size={16} />
            Adicionar Imóvel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="apartamento">Apartamento</SelectItem>
                  <SelectItem value="casa">Casa</SelectItem>
                  <SelectItem value="cobertura">Cobertura</SelectItem>
                  <SelectItem value="terreno">Terreno</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Negócio</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Venda e Aluguel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Venda e Aluguel</SelectItem>
                  <SelectItem value="venda">Venda</SelectItem>
                  <SelectItem value="aluguel">Aluguel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valor Mín.</label>
              <Input placeholder="R$ 100.000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valor Máx.</label>
              <Input placeholder="R$ 1.000.000" />
            </div>
            <div className="flex items-end">
              <Button variant="secondary" className="w-full">
                <Search className="mr-2" size={16} />
                Filtrar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Properties Grid */}
      {properties.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum imóvel cadastrado</h3>
            <p className="text-gray-500 mb-4">Adicione seu primeiro imóvel para começar a gerenciar seu catálogo.</p>
            <Button onClick={() => setAddModalOpen(true)}>
              <Plus className="mr-2" size={16} />
              Adicionar Primeiro Imóvel
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                  alt="Imóvel"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Checkbox
                    checked={selectedProperties.includes(property.id)}
                    onCheckedChange={() => handleSelectProperty(property.id)}
                  />
                </div>
                <div className="absolute top-4 right-4">
                  <Badge 
                    className={statusColors[property.status as keyof typeof statusColors] || statusColors.disponivel}
                  >
                    {statusLabels[property.status as keyof typeof statusLabels] || "Disponível"}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between text-white">
                    <Button variant="ghost" size="sm" className="p-2 bg-black/50 rounded-full hover:bg-black/75">
                      <ChevronLeft size={16} />
                    </Button>
                    <span className="bg-black/50 px-3 py-1 rounded-full text-sm">1/5</span>
                    <Button variant="ghost" size="sm" className="p-2 bg-black/50 rounded-full hover:bg-black/75">
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
                    <p className="text-sm text-gray-600">{property.address}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Heart size={16} />
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Bed className="mr-1" size={16} />
                    <span>{property.bedrooms || 0} quartos</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="mr-1" size={16} />
                    <span>{property.bathrooms || 0} banheiros</span>
                  </div>
                  <div className="flex items-center">
                    <Car className="mr-1" size={16} />
                    <span>{property.garages || 0} garagem</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(property.salePrice)}
                    </span>
                    <p className="text-sm text-gray-600">Valor de venda</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-semibold text-green-600">
                      {formatPrice(property.evaluationPrice)}
                    </span>
                    <p className="text-sm text-gray-600">Avaliação</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div>
                    <span className="text-gray-600">Condomínio:</span>
                    <span className="font-medium ml-1">
                      {property.condominiumFee ? formatPrice(property.condominiumFee) : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">IPTU:</span>
                    <span className="font-medium ml-1">
                      {property.iptu ? formatPrice(property.iptu) : "N/A"}
                    </span>
                  </div>
                </div>

                {property.builder && (
                  <div className="mb-4">
                    <span className="text-sm text-gray-600">Construtora:</span>
                    <span className="text-sm font-medium ml-1">{property.builder}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <Button variant="link" className="p-0 text-primary hover:text-primary/80">
                    Ver detalhes
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => deletePropertyMutation.mutate(property.id)}
                      disabled={deletePropertyMutation.isPending}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {properties.length > 0 && (
        <div className="text-center">
          <Button variant="outline">
            <Plus className="mr-2" size={16} />
            Carregar mais imóveis
          </Button>
        </div>
      )}

      <AddPropertyModal open={addModalOpen} onOpenChange={setAddModalOpen} />
    </div>
  );
}
