import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Send, Paperclip, Smile, Home as HomeIcon, Bot, User } from "lucide-react";
import type { Lead, Message } from "@shared/schema";

const mockMessages: Message[] = [
  {
    id: 1,
    leadId: 1,
    content: "Olá! Gostaria de saber mais sobre apartamentos na zona sul da cidade. Tenho interesse em imóveis de 2 quartos.",
    sender: "client",
    timestamp: new Date("2024-01-15T14:25:00"),
    messageType: "text",
  },
  {
    id: 2,
    leadId: 1,
    content: "Olá! Que bom ter seu contato. Temos várias opções excelentes na zona sul. Você tem alguma preferência de bairro específico?",
    sender: "user",
    timestamp: new Date("2024-01-15T14:26:00"),
    messageType: "text",
  },
  {
    id: 3,
    leadId: 1,
    content: "Prefiro algo próximo ao metrô, se possível. Meu orçamento é de até R$ 400.000.",
    sender: "client",
    timestamp: new Date("2024-01-15T14:30:00"),
    messageType: "text",
  },
];

const aiSuggestions = [
  "Tenho apartamentos perfeitos próximos ao metrô Vila Madalena. Posso enviar algumas opções?",
  "Que tal agendar uma visita para este final de semana? Tenho horários disponíveis.",
  "Para seu orçamento, encontrei 3 opções excelentes. Quer que eu detalhe cada uma?",
];

export default function Chat() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState("ai");

  const { data: leads = [] } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
  });

  const getLeadInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  const statusColors = {
    novo: "bg-blue-100 text-blue-800",
    em_contato: "bg-yellow-100 text-yellow-800",
    interessado: "bg-green-100 text-green-800",
    arquivado: "bg-gray-100 text-gray-800",
  };

  const statusLabels = {
    novo: "Novo",
    em_contato: "Em contato",
    interessado: "Interessado",
    arquivado: "Arquivado",
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    // Message sending logic will be implemented
    setNewMessage("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    setNewMessage(suggestion);
  };

  return (
    <div className="flex h-full -m-6">
      {/* Client List Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Search and Filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative mb-4">
            <Input
              placeholder="Buscar conversas..."
              className="pl-10"
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Todos Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Status</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="aguardando">Aguardando</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Todas Regiões" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Regiões</SelectItem>
                <SelectItem value="centro">Centro</SelectItem>
                <SelectItem value="zona_sul">Zona Sul</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {leads.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Nenhuma conversa encontrada
            </div>
          ) : (
            leads.map((lead) => (
              <div
                key={lead.id}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                  selectedLead?.id === lead.id ? "bg-primary/10 border-r-2 border-primary" : ""
                }`}
                onClick={() => setSelectedLead(lead)}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground text-sm font-medium">
                      {getLeadInitials(lead.name)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{lead.name}</h4>
                      <span className="text-xs text-gray-500">14:30</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      Última mensagem da conversa...
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <Badge 
                        className={statusColors[lead.status as keyof typeof statusColors] || statusColors.novo}
                      >
                        {statusLabels[lead.status as keyof typeof statusLabels] || "Novo"}
                      </Badge>
                      {selectedLead?.id === lead.id && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedLead ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground text-sm font-medium">
                      {getLeadInitials(selectedLead.name)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{selectedLead.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{statusLabels[selectedLead.status as keyof typeof statusLabels] || "Novo"}</span>
                      <span>{selectedLead.interestRegions?.join(", ") || "Sem região definida"}</span>
                      <span>Última mensagem: 14:30</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button className="bg-green-500 hover:bg-green-600">
                    <HomeIcon className="mr-2" size={16} />
                    Sugerir Imóvel
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {mockMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.sender === "user" ? "justify-end" : ""
                  }`}
                >
                  {message.sender === "client" && (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-600 text-sm font-medium">
                        {getLeadInitials(selectedLead.name)}
                      </span>
                    </div>
                  )}
                  <div className="max-w-md">
                    <div
                      className={`rounded-lg p-3 ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <p
                      className={`text-xs text-gray-500 mt-1 ${
                        message.sender === "user" ? "text-right" : ""
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                  {message.sender === "user" && (
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="text-primary-foreground" size={16} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm">
                  <Paperclip size={16} />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="pr-12"
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button variant="ghost" size="sm" className="absolute right-3 top-1">
                    <Smile size={16} />
                  </Button>
                </div>
                <Button onClick={handleSendMessage}>
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-gray-400" size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione uma conversa</h3>
              <p className="text-gray-500">Escolha um lead da lista para iniciar uma conversa</p>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ai">Sugestões IA</TabsTrigger>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="catalog">Catálogo</TabsTrigger>
          </TabsList>

          <TabsContent value="ai" className="flex-1 p-4">
            <div className="space-y-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="text-white" size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-blue-900 mb-3">
                        Com base na conversa, sugiro estas abordagens:
                      </p>
                      <div className="space-y-2">
                        {aiSuggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="w-full text-left p-3 h-auto bg-white border-blue-200 hover:bg-blue-50"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            <p className="text-sm text-gray-900">{suggestion}</p>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Chat Input */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center space-x-2">
                  <Input placeholder="Pergunte à IA..." className="flex-1" />
                  <Button size="sm">
                    <Send size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="flex-1 p-4">
            {selectedLead ? (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Informações do Cliente</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nome</label>
                    <p className="text-sm text-gray-900">{selectedLead.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Telefone</label>
                    <p className="text-sm text-gray-900">{selectedLead.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-sm text-gray-900">{selectedLead.email || "Não informado"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Origem</label>
                    <p className="text-sm text-gray-900">{selectedLead.origin}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Regiões de Interesse</label>
                    <p className="text-sm text-gray-900">
                      {selectedLead.interestRegions?.join(", ") || "Não informado"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                Selecione um cliente para ver o perfil
              </div>
            )}
          </TabsContent>

          <TabsContent value="catalog" className="flex-1 p-4">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Catálogo de Imóveis</h4>
              <div className="text-center text-gray-500">
                Lista de imóveis será carregada aqui
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
