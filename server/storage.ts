import { 
  leads, 
  properties, 
  sales, 
  messages,
  type Lead, 
  type InsertLead,
  type Property,
  type InsertProperty,
  type Sale,
  type InsertSale,
  type Message,
  type InsertMessage
} from "@shared/schema";

export interface IStorage {
  // Leads
  getLeads(): Promise<Lead[]>;
  getLead(id: number): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: number, lead: Partial<InsertLead>): Promise<Lead | undefined>;
  deleteLead(id: number): Promise<boolean>;
  
  // Properties
  getProperties(): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;
  
  // Sales
  getSales(): Promise<Sale[]>;
  getSale(id: number): Promise<Sale | undefined>;
  createSale(sale: InsertSale): Promise<Sale>;
  updateSale(id: number, sale: Partial<InsertSale>): Promise<Sale | undefined>;
  deleteSale(id: number): Promise<boolean>;
  
  // Messages
  getMessages(leadId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Dashboard metrics
  getDashboardMetrics(): Promise<{
    newLeads: number;
    closedSales: number;
    activeProperties: number;
    messagesSent: number;
  }>;
}

export class MemStorage implements IStorage {
  private leads: Map<number, Lead>;
  private properties: Map<number, Property>;
  private sales: Map<number, Sale>;
  private messages: Map<number, Message>;
  private currentLeadId: number;
  private currentPropertyId: number;
  private currentSaleId: number;
  private currentMessageId: number;

  constructor() {
    this.leads = new Map();
    this.properties = new Map();
    this.sales = new Map();
    this.messages = new Map();
    this.currentLeadId = 1;
    this.currentPropertyId = 1;
    this.currentSaleId = 1;
    this.currentMessageId = 1;
  }

  // Leads
  async getLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values());
  }

  async getLead(id: number): Promise<Lead | undefined> {
    return this.leads.get(id);
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = this.currentLeadId++;
    const lead: Lead = { 
      ...insertLead, 
      id,
      email: insertLead.email || null,
      status: insertLead.status || "novo",
      professionalType: insertLead.professionalType || null,
      maritalStatus: insertLead.maritalStatus || null,
      grossIncome: insertLead.grossIncome || null,
      interestRegions: insertLead.interestRegions || null,
      interestedProperties: insertLead.interestedProperties || null,
      downPayment: insertLead.downPayment || null,
      documents: insertLead.documents || null,
      preferredRooms: insertLead.preferredRooms || null,
      preferredBathrooms: insertLead.preferredBathrooms || null,
      preferredGarages: insertLead.preferredGarages || null,
      preferredAmenities: insertLead.preferredAmenities || null,
      hasDependents: insertLead.hasDependents || false,
      dependents: insertLead.dependents || null
    };
    this.leads.set(id, lead);
    return lead;
  }

  async updateLead(id: number, updates: Partial<InsertLead>): Promise<Lead | undefined> {
    const existing = this.leads.get(id);
    if (!existing) return undefined;
    
    const updated: Lead = { ...existing, ...updates };
    this.leads.set(id, updated);
    return updated;
  }

  async deleteLead(id: number): Promise<boolean> {
    return this.leads.delete(id);
  }

  // Properties
  async getProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }

  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.currentPropertyId++;
    const property: Property = { 
      ...insertProperty, 
      id,
      code: insertProperty.code || null,
      status: insertProperty.status || "disponivel",
      description: insertProperty.description || null,
      evaluationPrice: insertProperty.evaluationPrice || null,
      condominiumFee: insertProperty.condominiumFee || null,
      iptu: insertProperty.iptu || null,
      builder: insertProperty.builder || null,
      zipCode: insertProperty.zipCode || null,
      number: insertProperty.number || null,
      complement: insertProperty.complement || null,
      bedrooms: insertProperty.bedrooms || null,
      bathrooms: insertProperty.bathrooms || null,
      garages: insertProperty.garages || null,
      squareMeters: insertProperty.squareMeters || null,
      amenities: insertProperty.amenities || null,
      images: insertProperty.images || null,
      referencePoints: insertProperty.referencePoints || null
    };
    this.properties.set(id, property);
    return property;
  }

  async updateProperty(id: number, updates: Partial<InsertProperty>): Promise<Property | undefined> {
    const existing = this.properties.get(id);
    if (!existing) return undefined;
    
    const updated: Property = { ...existing, ...updates };
    this.properties.set(id, updated);
    return updated;
  }

  async deleteProperty(id: number): Promise<boolean> {
    return this.properties.delete(id);
  }

  // Sales
  async getSales(): Promise<Sale[]> {
    return Array.from(this.sales.values());
  }

  async getSale(id: number): Promise<Sale | undefined> {
    return this.sales.get(id);
  }

  async createSale(insertSale: InsertSale): Promise<Sale> {
    const id = this.currentSaleId++;
    const sale: Sale = { 
      ...insertSale, 
      id,
      status: insertSale.status || "em_processo"
    };
    this.sales.set(id, sale);
    return sale;
  }

  async updateSale(id: number, updates: Partial<InsertSale>): Promise<Sale | undefined> {
    const existing = this.sales.get(id);
    if (!existing) return undefined;
    
    const updated: Sale = { ...existing, ...updates };
    this.sales.set(id, updated);
    return updated;
  }

  async deleteSale(id: number): Promise<boolean> {
    return this.sales.delete(id);
  }

  // Messages
  async getMessages(leadId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(msg => msg.leadId === leadId);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const message: Message = { 
      ...insertMessage, 
      id,
      timestamp: new Date(),
      messageType: insertMessage.messageType || "text"
    };
    this.messages.set(id, message);
    return message;
  }

  // Dashboard metrics
  async getDashboardMetrics() {
    const currentDate = new Date();
    const thirtyDaysAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    return {
      newLeads: this.leads.size,
      closedSales: Array.from(this.sales.values()).filter(sale => sale.status === "finalizada").length,
      activeProperties: Array.from(this.properties.values()).filter(prop => prop.status === "disponivel").length,
      messagesSent: Array.from(this.messages.values()).filter(msg => msg.sender === "user").length,
    };
  }
}

export const storage = new MemStorage();
