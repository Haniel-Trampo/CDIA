import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertLeadSchema, type InsertLead } from "@shared/schema";

interface AddLeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const regions = ["Centro", "Zona Sul", "Zona Norte", "Zona Oeste"];
const origins = ["Site Institucional", "Redes Sociais", "Indicação", "Outros"];
const statuses = ["novo", "em_contato", "interessado", "arquivado"];
const professionalTypes = ["CLT", "MEI", "Pessoa Jurídica", "Aposentado", "Outros"];
const maritalStatuses = ["Solteiro", "Casado", "Divorciado", "Viúvo"];

export function AddLeadModal({ open, onOpenChange }: AddLeadModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  const form = useForm<InsertLead>({
    resolver: zodResolver(insertLeadSchema),
    defaultValues: {
      name: "",
      phone: "",
      origin: "",
      email: "",
      status: "novo",
      professionalType: "",
      maritalStatus: "",
      grossIncome: "",
      interestRegions: [],
      interestedProperty: "",
      downPayment: "",
      documents: [],
    },
  });

  const createLeadMutation = useMutation({
    mutationFn: async (data: InsertLead) => {
      const response = await apiRequest("POST", "/api/leads", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      toast({
        title: "Lead criado com sucesso",
        description: "O novo lead foi adicionado ao sistema.",
      });
      onOpenChange(false);
      form.reset();
      setSelectedRegions([]);
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar lead",
        description: "Ocorreu um erro ao criar o lead. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertLead) => {
    const leadData = {
      ...data,
      interestRegions: selectedRegions,
    };
    createLeadMutation.mutate(leadData);
  };

  const handleRegionChange = (region: string, checked: boolean) => {
    if (checked) {
      setSelectedRegions([...selectedRegions, region]);
    } else {
      setSelectedRegions(selectedRegions.filter(r => r !== region));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Adicionar Novo Lead
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              <X size={16} />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Required Fields */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Informações Obrigatórias</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="Nome completo"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  {...form.register("phone")}
                  placeholder="(11) 99999-9999"
                />
                {form.formState.errors.phone && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.phone.message}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="origin">Origem do Lead *</Label>
                <Select onValueChange={(value) => form.setValue("origin", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a origem" />
                  </SelectTrigger>
                  <SelectContent>
                    {origins.map((origin) => (
                      <SelectItem key={origin} value={origin}>
                        {origin}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.origin && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.origin.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Optional Fields */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Informações Opcionais</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <Label htmlFor="status">Status da Negociação</Label>
                <Select onValueChange={(value) => form.setValue("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.replace("_", " ").charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="professionalType">Tipo Profissional</Label>
                <Select onValueChange={(value) => form.setValue("professionalType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {professionalTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="maritalStatus">Estado Civil</Label>
                <Select onValueChange={(value) => form.setValue("maritalStatus", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estado civil" />
                  </SelectTrigger>
                  <SelectContent>
                    {maritalStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="grossIncome">Renda Bruta</Label>
                <Input
                  id="grossIncome"
                  {...form.register("grossIncome")}
                  placeholder="R$ 5.000"
                />
              </div>
              <div>
                <Label htmlFor="downPayment">Valor de Entrada Disponível</Label>
                <Input
                  id="downPayment"
                  {...form.register("downPayment")}
                  placeholder="R$ 50.000"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Regiões de Interesse</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {regions.map((region) => (
                    <div key={region} className="flex items-center space-x-2">
                      <Checkbox
                        id={region}
                        checked={selectedRegions.includes(region)}
                        onCheckedChange={(checked) => handleRegionChange(region, checked as boolean)}
                      />
                      <Label htmlFor={region} className="text-sm">
                        {region}
                      </Label>
                    </div>
                  ))}
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
              disabled={createLeadMutation.isPending}
            >
              <Save className="mr-2" size={16} />
              {createLeadMutation.isPending ? "Salvando..." : "Salvar Lead"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
