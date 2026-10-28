"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Key, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import { useApp } from "@/contexts/app-context";

interface APIConfig {
  id: string;
  name: string;
  /** Chave mascarada para exibição, ex: "••••a1b2". Nunca a chave completa. */
  keyPreview: string;
  hasKey: boolean;
  baseUrl: string;
  type: "saipos" | "custom";
  status: "connected" | "disconnected" | "error";
  lastTest?: string;
}

/** Estado do formulário de criação de nova conexão (ainda não salva). */
interface NewAPIForm {
  name: string;
  /** Chave nova digitada pelo usuário antes de salvar. */
  apiKey: string;
  baseUrl: string;
  type: "saipos" | "custom";
}

export function APIConfigDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [configs, setConfigs] = useState<APIConfig[]>([]);
  const [newConfig, setNewConfig] = useState<Partial<NewAPIForm>>({
    name: "",
    apiKey: "",
    baseUrl: "https://data.saipos.io/v1",
    type: "saipos",
  });
  const [isTesting, setIsTesting] = useState<string | null>(null);
  const { addToast, connectedAPIs, createUserAPI, deleteUserAPI, testUserAPI, userId } = useApp();

  // Sincronizar configs locais com o contexto global
  useEffect(() => {
    const localConfigs: APIConfig[] = connectedAPIs.map(api => ({
      id: api.id,
      name: api.name,
      keyPreview: api.keyPreview || "••••••••",
      hasKey: api.hasKey ?? false,
      baseUrl: api.baseUrl || "https://data.saipos.io/v1",
      type: api.type === "saipos" ? "saipos" : "custom",
      status: api.status,
      lastTest: api.lastTest,
    }));
    setConfigs(localConfigs);
  }, [connectedAPIs]);

  const handleAddConfig = async () => {
    if (!newConfig.name || !newConfig.apiKey) {
      addToast("Preencha todos os campos obrigatórios", "error");
      return;
    }

    if (!userId) {
      addToast("Usuário não identificado", "error");
      return;
    }

    try {
      await createUserAPI({
        name: newConfig.name!,
        type: newConfig.type as 'saipos' | 'custom' | 'whatsapp',
        apiKey: newConfig.apiKey!,
        baseUrl: newConfig.baseUrl
      });
      
      setNewConfig({
        name: "",
        apiKey: "",
        baseUrl: "https://data.saipos.io/v1",
        type: "saipos",
      });
    } catch (error) {
      console.error('Erro ao criar API:', error);
    }
  };

  const handleTestConnection = async (config: APIConfig) => {
    setIsTesting(config.id);
    
    try {
      await testUserAPI(config.id);
    } catch (error) {
      console.error('Erro ao testar API:', error);
    } finally {
      setIsTesting(null);
    }
  };

  const handleDeleteConfig = async (configId: string) => {
    try {
      await deleteUserAPI(configId);
    } catch (error) {
      console.error('Erro ao deletar API:', error);
    }
  };

  const getStatusIcon = (status: APIConfig["status"]) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: APIConfig["status"]) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Conectado</Badge>;
      case "error":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Erro</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Desconectado</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-[#141415] border-[#374151] text-white hover:bg-[#374151]">
          <Settings className="mr-2 h-4 w-4" />
          Configurar APIs
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#141415] border-[#374151] text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Configuração de APIs</DialogTitle>
          <DialogDescription className="text-gray-400">
            Configure suas APIs para conectar com sistemas externos como Saipos
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Lista de configurações existentes */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">APIs Configuradas</h3>
            {configs.map((config) => (
              <Card key={config.id} className="bg-[#1a1a1a] border-[#374151]">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(config.status)}
                      <div>
                        <CardTitle className="text-white text-base">{config.name}</CardTitle>
                        <CardDescription className="text-gray-400 text-sm">
                          {config.type === "saipos" ? "Saipos API" : "API Personalizada"}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(config.status)}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTestConnection(config)}
                          disabled={isTesting === config.id}
                          className="bg-[#001F05]/20 border-[#001F05]/30 text-[#001F05] hover:bg-[#001F05]/30"
                        >
                          {isTesting === config.id ? "Testando..." : "Testar"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteConfig(config.id)}
                          className="bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="text-gray-400">URL Base</Label>
                      <p className="text-white font-mono">{config.baseUrl}</p>
                    </div>
                    <div>
                      <Label className="text-gray-400">API Key</Label>
                      <p className="text-white font-mono">
                        {config.hasKey ? config.keyPreview : "Não configurada"}
                      </p>
                    </div>
                  </div>
                  {config.lastTest && (
                    <div className="mt-3 text-xs text-gray-500">
                      Último teste: {new Date(config.lastTest).toLocaleString('pt-BR')}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Formulário para nova configuração */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Adicionar Nova API</h3>
            <Card className="bg-[#1a1a1a] border-[#374151]">
              <CardHeader>
                <CardTitle className="text-white text-base">Configuração da API</CardTitle>
                <CardDescription className="text-gray-400">
                  Configure uma nova conexão com a API da Saipos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="name" className="text-gray-400">Nome da API</Label>
                    <Input
                      id="name"
                      value={newConfig.name || ""}
                      onChange={(e) => setNewConfig(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: PDV Principal"
                      className="bg-[#141415] border-[#374151] text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type" className="text-gray-400">Tipo</Label>
                    <select
                      id="type"
                      value={newConfig.type || "saipos"}
                      onChange={(e) => setNewConfig(prev => ({ ...prev, type: e.target.value as "saipos" | "custom" }))}
                      className="w-full p-2 bg-[#141415] border border-[#374151] rounded-md text-white"
                    >
                      <option value="saipos">Saipos</option>
                      <option value="custom">Personalizada</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="baseUrl" className="text-gray-400">URL Base</Label>
                  <Input
                    id="baseUrl"
                    value={newConfig.baseUrl || ""}
                    onChange={(e) => setNewConfig(prev => ({ ...prev, baseUrl: e.target.value }))}
                    placeholder="https://api.saipos.com"
                    className="bg-[#141415] border-[#374151] text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="apiKey" className="text-gray-400">Chave da API (Bearer Token)</Label>
                  <Textarea
                    id="apiKey"
                    value={newConfig.apiKey || ""}
                    onChange={(e) => setNewConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                    placeholder="Cole aqui sua chave da API da Saipos (Bearer Token)"
                    className="bg-[#141415] border-[#374151] text-white min-h-[120px] max-h-[200px] resize-none overflow-y-auto font-mono text-sm break-all"
                    style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Cole o Bearer Token completo que você recebeu da Saipos
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleAddConfig}
            className="bg-[#001F05] hover:bg-[#001F05]/80 text-white"
          >
            <Key className="mr-2 h-4 w-4" />
            Adicionar API
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
