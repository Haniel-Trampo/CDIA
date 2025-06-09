import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Save, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertPropertySchema, type InsertProperty } from "@shared/schema";

interface AddPropertyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const propertyTypes = ["Apartamento", "Casa", "Cobertura", "Terreno", "Comercial"];

export function AddPropertyModal({ open, onOpenChange }: AddPropertyModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertProperty>({
    resolver: zodResolver(insertPropertySchema),
    defaultValues: {
      title: "",
      type: "",
      code: "",
      description: "",
      salePrice: "",
      evaluationPrice: "",
      condominiumFee: "",
      iptu: "",
      builder: "",
      zipCode: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      bedrooms: 0,
      bathrooms: 0,
      garages: 0,
      squareMeters: "",
      amenities: [],
      images: [],
      referencePoints: [],
      status: "disponivel",
    },
  });

  const handleZipCodeChange = async (zipCode: string) => {
    const cleanZipCode = zipCode.replace(/\D/g, "");
    if (cleanZipCode.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanZipCode}/json/`);
        const data = await response.json();
        if (!data.erro) {
          form.setValue("street", data.logradouro);
          form.setValue("neighborhood", data.bairro);
          form.setValue("city", data.localidade);
          form.setValue("state", data.uf);
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  const createPropertyMutation = useMutation({
    mutationFn: async (data: InsertProperty) => {
      const response = await apiRequest("POST", "/api/properties", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      toast({
        title: "Imóvel criado com sucesso",
        description: "O novo imóvel foi adicionado ao catálogo.",
      });
      onOpenChange(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar imóvel",
        description: "Ocorreu um erro ao criar o imóvel. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertProperty) => {
    createPropertyMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Imóvel</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="title">Título do Imóvel</Label>
                <Input
                  id="title"
                  {...form.register("title")}
                  placeholder="Apartamento moderno na zona sul"
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.title.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="type">Tipo de Imóvel</Label>
                <Select onValueChange={(value) => form.setValue("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.type && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.type.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="code">Código do Imóvel</Label>
                <Input
                  id="code"
                  {...form.register("code")}
                  placeholder="AP001"
                />
              </div>
              <div>
                <Label htmlFor="salePrice">Valor de Venda</Label>
                <Input
                  id="salePrice"
                  {...form.register("salePrice")}
                  placeholder="450000"
                />
                {form.formState.errors.salePrice && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.salePrice.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="evaluationPrice">Valor de Avaliação</Label>
                <Input
                  id="evaluationPrice"
                  {...form.register("evaluationPrice")}
                  placeholder="430000"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  {...form.register("description")}
                  placeholder="Descreva as principais características do imóvel..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Características</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bedrooms">Quartos</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  {...form.register("bedrooms", { valueAsNumber: true })}
                  placeholder="2"
                />
              </div>
              <div>
                <Label htmlFor="bathrooms">Banheiros</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  {...form.register("bathrooms", { valueAsNumber: true })}
                  placeholder="2"
                />
              </div>
              <div>
                <Label htmlFor="garages">Garagens</Label>
                <Input
                  id="garages"
                  type="number"
                  {...form.register("garages", { valueAsNumber: true })}
                  placeholder="1"
                />
              </div>
              <div>
                <Label htmlFor="squareMeters">Metros Quadrados</Label>
                <Input
                  id="squareMeters"
                  {...form.register("squareMeters")}
                  placeholder="80"
                />
              </div>
              <div>
                <Label htmlFor="condominiumFee">Condomínio</Label>
                <Input
                  id="condominiumFee"
                  {...form.register("condominiumFee")}
                  placeholder="450"
                />
              </div>
              <div>
                <Label htmlFor="iptu">IPTU</Label>
                <Input
                  id="iptu"
                  {...form.register("iptu")}
                  placeholder="180"
                />
              </div>
            </div>
          </div>

          {/* Address and Images */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Localização e Imagens</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="address">Endereço Completo</Label>
                <Input
                  id="address"
                  {...form.register("address")}
                  placeholder="Rua das Flores, 123 - Vila Madalena, São Paulo - SP"
                />
                {form.formState.errors.address && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.address.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="builder">Construtora Responsável</Label>
                <Input
                  id="builder"
                  {...form.register("builder")}
                  placeholder="Construtora ABC"
                />
              </div>
              <div>
                <Label>Imagens</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                  <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-sm text-gray-600">Clique para fazer upload ou arraste as imagens aqui</p>
                  <p className="text-xs text-gray-500 mt-1">Funcionalidade de upload será implementada</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createPropertyMutation.isPending}
            >
              <Save className="mr-2" size={16} />
              {createPropertyMutation.isPending ? "Salvando..." : "Salvar Imóvel"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
