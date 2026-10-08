module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/drin-platform/src/lib/saipos-api.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Serviço para integração com a API da Saipos
__turbopack_context__.s([
    "SaiposAPIService",
    ()=>SaiposAPIService,
    "default",
    ()=>__TURBOPACK__default__export__,
    "normalizeDailyResponse",
    ()=>normalizeDailyResponse,
    "normalizeSalesResponse",
    ()=>normalizeSalesResponse,
    "normalizeStoresResponse",
    ()=>normalizeStoresResponse,
    "saiposAPI",
    ()=>saiposAPI,
    "saiposHTTP",
    ()=>saiposHTTP
]);
class SaiposAPIService {
    config;
    constructor(config){
        this.config = config;
    }
    // Método para testar a conexão com a API real
    async testConnection() {
        try {
            if (!this.config.apiKey) {
                throw new Error('API Key não configurada');
            }
            const baseUrl = this.config.baseUrl || 'https://data.saipos.io/v1';
            const token = this.config.apiKey.trim();
            // Remover "Bearer " se o usuário colou com o prefixo
            const cleanToken = token.replace(/^Bearer\s+/i, '');
            console.log('🔗 Testando conexão real com Saipos...');
            // Usar o novo cliente da API para testar a conexão
            // Criar data de hoje para o teste
            const today = new Date();
            const todayISO = today.toISOString().split('T')[0];
            const startDateTime = `${todayISO}T00:00:00`;
            const endDateTime = `${todayISO}T23:59:59`;
            // Importar o cliente da API
            const { fetchSaiposSales } = await __turbopack_context__.A("[project]/drin-platform/src/lib/saipos-api-client.ts [app-route] (ecmascript, async loader)");
            try {
                // Usar o novo cliente com parâmetros corretos da documentação
                const result = await fetchSaiposSales({
                    token: cleanToken,
                    startDate: startDateTime,
                    endDate: endDateTime,
                    withDate: 'created_at',
                    dataColumnsFilter: 'default',
                    limit: 1,
                    offset: 0
                });
                if (result.success) {
                    console.log('✅ Conexão com Saipos estabelecida!');
                    return true;
                } else {
                    throw new Error(result.error || 'Falha ao conectar com a API Saipos');
                }
            } catch (fetchError) {
                // Erro de rede ou conexão
                const networkError = fetchError instanceof Error ? fetchError.message : String(fetchError);
                const errorName = fetchError instanceof Error ? fetchError.name : 'UnknownError';
                const errorCause = fetchError instanceof Error && 'cause' in fetchError ? String(fetchError.cause) : '';
                console.error('❌ Erro de rede ao conectar com Saipos:', {
                    message: networkError,
                    name: errorName,
                    cause: errorCause,
                    url: `${baseUrl}/sales/sales`
                });
                // Verificar se foi abortado por timeout
                if (errorName === 'AbortError' || networkError.includes('aborted') || networkError.includes('Timeout')) {
                    throw new Error(`Timeout ao conectar com a API Saipos (15s). Verifique se a URL está correta: ${baseUrl}`);
                }
                // Mensagens mais específicas baseadas no tipo de erro
                if (networkError.includes('fetch failed') || networkError.includes('Failed to fetch')) {
                    // Tentar obter mais informações do erro
                    const detailedMessage = errorCause || networkError;
                    throw new Error(`Não foi possível conectar com a API Saipos. Verifique:\n1. URL: ${baseUrl}\n2. Token válido\n3. Conexão com internet\n\nDetalhes: ${detailedMessage}`);
                }
                if (networkError.includes('ECONNREFUSED')) {
                    throw new Error(`Conexão recusada. Verifique se a URL base está correta: ${baseUrl}`);
                }
                if (networkError.includes('ENOTFOUND') || networkError.includes('getaddrinfo')) {
                    throw new Error(`URL não encontrada. Verifique se a URL base está correta: ${baseUrl}`);
                }
                if (networkError.includes('ETIMEDOUT') || networkError.includes('timeout')) {
                    throw new Error(`Timeout ao conectar com a API Saipos. Tente novamente mais tarde.`);
                }
                if (networkError.includes('SSL') || networkError.includes('TLS') || networkError.includes('certificate')) {
                    throw new Error(`Erro de certificado SSL. Verifique se a URL usa HTTPS: ${baseUrl}`);
                }
                if (networkError.includes('401') || networkError.includes('403')) {
                    throw new Error(`Token inválido ou sem permissão. Verifique se o Bearer Token está correto.`);
                }
                // Re-throw o erro original se tiver mensagem útil
                throw new Error(networkError || 'Erro de conexão desconhecido');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error('❌ Erro ao testar conexão com Saipos:', errorMessage);
            throw error; // Propagar o erro para mostrar mensagem específica
        }
    }
    // Método para obter dados de vendas da API real da Saipos
    async getSalesData(startDate, endDate) {
        try {
            if (!this.config.apiKey) {
                throw new Error('API Key não configurada');
            }
            console.log(`📊 Buscando dados reais de vendas da Saipos: ${startDate} até ${endDate}`);
            const token = this.config.apiKey.trim().replace(/^Bearer\s+/i, '');
            // Converter datas para formato ISO com hora
            const startDateTime = `${startDate}T00:00:00`;
            const endDateTime = `${endDate}T23:59:59`;
            // Usar o endpoint search_sales com parâmetros corretos
            const url = `${this.config.baseUrl}/search_sales?p_date_column_filter=shift_date&p_filter_date_start=${encodeURIComponent(startDateTime)}&p_filter_date_end=${encodeURIComponent(endDateTime)}&p_limit=300&p_offset=0`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
            }
            const apiData = await response.json();
            console.log('✅ Dados reais carregados da Saipos:', apiData);
            // Converter dados da API para o formato esperado
            const dataArray = Array.isArray(apiData) ? apiData : Array.isArray(apiData?.data) ? apiData.data : [];
            const normalized = normalizeSalesResponse(dataArray);
            // Converter NormalizedSalesData para SaiposSalesData
            return normalized.map((n)=>({
                    date: n.date,
                    totalSales: n.totalSales,
                    totalOrders: n.totalOrders,
                    averageTicket: n.totalOrders > 0 ? n.totalSales / n.totalOrders : 0,
                    uniqueCustomers: 0,
                    totalRevenue: n.totalSales,
                    ordersByChannel: {
                        delivery: n.qtdDelivery,
                        counter: n.qtdBalcao,
                        hall: 0,
                        ticket: 0
                    },
                    topProducts: [],
                    salesByOrigin: []
                }));
        } catch (error) {
            console.error('❌ Erro ao obter dados de vendas:', error);
            throw error; // Propagar erro em vez de retornar mock
        }
    }
    // Métodos mockados REMOVIDOS - todos os dados devem ser reais
    // Não usar dados mockados em nenhuma circunstância
    // Todos os dados devem vir da API Saipos ou do banco de dados
    // Método para converter dados da API Saipos para o formato interno
    convertSalesData() {
        return [];
    }
    // Método para obter lista de lojas da API real da Saipos
    async getStores() {
        try {
            if (!this.config.apiKey) {
                throw new Error('API Key não configurada');
            }
            console.log('🏪 Buscando lojas reais da Saipos...');
            // Fazer chamada real para a API da Saipos
            const response = await fetch(`${this.config.baseUrl}/stores`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.config.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
            }
            const apiData = await response.json();
            console.log('✅ Lojas reais carregadas da Saipos:', apiData);
            // Converter dados da API para o formato esperado
            const normalized = normalizeStoresResponse(apiData);
            return normalized;
        } catch (error) {
            console.error('❌ Erro ao obter lojas:', error);
            // SEMPRE lançar erro - nunca retornar dados mockados
            // Todos os dados devem ser reais, vindos da API ou do banco de dados
            throw error;
        }
    }
    // Método mockado REMOVIDO - todos os dados devem ser reais
    // Não usar dados mockados em nenhuma circunstância
    // Todos os dados devem vir da API Saipos ou do banco de dados
    // Método para converter dados de lojas da API Saipos para o formato interno
    convertStoresData() {
        return [];
    }
    // Método para obter dados em tempo real da API real da Saipos
    async getRealTimeData() {
        try {
            if (!this.config.apiKey) {
                throw new Error('API Key não configurada');
            }
            console.log('⚡ Buscando dados em tempo real da Saipos...');
            // Fazer chamada real para a API da Saipos
            const response = await fetch(`${this.config.baseUrl}/realtime`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.config.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
            }
            const apiData = await response.json();
            console.log('✅ Dados em tempo real carregados da Saipos:', apiData);
            // Converter dados da API para o formato esperado
            const normalized = normalizeDailyResponse(apiData);
            return normalized;
        } catch (error) {
            console.error('❌ Erro ao obter dados em tempo real:', error);
            // Em caso de erro, retornar dados vazios
            return {
                date: new Date().toISOString().split('T')[0],
                totalSales: 0,
                totalOrders: 0,
                averageTicket: 0,
                uniqueCustomers: 0,
                totalRevenue: 0,
                ordersByChannel: {
                    delivery: 0,
                    counter: 0,
                    hall: 0,
                    ticket: 0
                },
                topProducts: []
            };
        }
    }
    // Método para converter dados em tempo real da API Saipos para o formato interno
    convertRealTimeData(apiData) {
        return normalizeDailyResponse(apiData);
    }
    // Método para obter relatório diário da API real da Saipos
    async getDailyReport(date) {
        try {
            if (!this.config.apiKey) {
                throw new Error('API Key não configurada');
            }
            console.log(`📊 Gerando relatório diário real da Saipos para: ${date}`);
            const token = this.config.apiKey.trim().replace(/^Bearer\s+/i, '');
            // Converter data para formato ISO com hora
            const startDateTime = `${date}T00:00:00`;
            const endDateTime = `${date}T23:59:59`;
            // Usar o endpoint search_sales com filtro de data específica
            const url = `${this.config.baseUrl}/search_sales?p_date_column_filter=shift_date&p_filter_date_start=${encodeURIComponent(startDateTime)}&p_filter_date_end=${encodeURIComponent(endDateTime)}&p_limit=300&p_offset=0`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
            }
            const apiData = await response.json();
            console.log('✅ Relatório diário real carregado da Saipos:', apiData);
            // Converter dados da API para o formato esperado
            const normalized = normalizeDailyResponse(apiData);
            return normalized;
        } catch (error) {
            console.error('❌ Erro ao obter relatório diário:', error);
            // Em caso de erro, retornar dados vazios
            return {
                date: date,
                totalSales: 0,
                totalOrders: 0,
                averageTicket: 0,
                uniqueCustomers: 0,
                totalRevenue: 0,
                ordersByChannel: {
                    delivery: 0,
                    counter: 0,
                    hall: 0,
                    ticket: 0
                },
                topProducts: []
            };
        }
    }
    // Método para converter dados de relatório diário da API Saipos para o formato interno
    convertDailyReportData(apiData) {
        return normalizeDailyResponse(apiData);
    }
}
const saiposAPI = new SaiposAPIService({
    apiKey: ("TURBOPACK compile-time value", "your_saipos_api_key_here") || '',
    baseUrl: ("TURBOPACK compile-time value", "https://api.saipos.com") || 'https://data.saipos.io/v1'
});
const __TURBOPACK__default__export__ = SaiposAPIService;
const saiposHTTP = {
    async getStores () {
        // Nota: endpoint de lojas pode não existir na API de dados
        // Retornar array vazio se não houver endpoint específico
        return [];
    },
    async getSalesData (startDate, endDate, _token, apiId) {
        // Usar rota API do Next.js como proxy para evitar CORS
        const params = new URLSearchParams({
            startDate,
            endDate
        });
        if (apiId) {
            params.append('apiId', apiId);
        }
        const res = await fetch(`/api/saipos/sales?${params.toString()}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            cache: 'no-store'
        });
        if (!res.ok) {
            const errorData = await res.json().catch(()=>({}));
            throw new Error(errorData.error || 'Erro ao buscar dados de vendas');
        }
        return res.json();
    },
    async getDailyReport (date, _token, apiId) {
        // Usar rota API do Next.js como proxy para evitar CORS
        const params = new URLSearchParams({
            date
        });
        if (apiId) {
            params.append('apiId', apiId);
        }
        const res = await fetch(`/api/saipos/daily?${params.toString()}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            cache: 'no-store'
        });
        if (!res.ok) {
            const errorData = await res.json().catch(()=>({}));
            throw new Error(errorData.error || 'Erro ao buscar relatório diário');
        }
        return res.json();
    }
};
// Função para calcular a data comercial baseada no horário de operação
// A loja funciona das 17:00 até 23:30
// Se a venda aconteceu antes das 17h, ela pertence ao dia anterior
function getBusinessDate(date) {
    const START_HOUR = 17; // 17:00
    const d = new Date(date);
    const hour = d.getHours();
    // Se a venda aconteceu antes das 17h, ela pertence ao dia anterior
    if (hour < START_HOUR) {
        d.setDate(d.getDate() - 1);
    }
    // Retorna YYYY-MM-DD
    return d.toISOString().split("T")[0];
}
function asArray(value) {
    return Array.isArray(value) ? value : [];
}
function getProp(obj, key) {
    return obj ? obj[key] : undefined;
}
function toStringVal(value, fallback = '') {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    return fallback;
}
function toNumberVal(value, fallback = 0) {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        const n = Number(value);
        return Number.isFinite(n) ? n : fallback;
    }
    return fallback;
}
// Helper para pegar valor total da venda (suporta ambos os nomes de campo)
function getTotalSaleValue(sale) {
    // A API pode retornar total_amount OU total_sale_value
    return toNumberVal(sale.total_amount || sale.total_sale_value);
}
function normalizeStoresResponse(apiJson) {
    try {
        const root = apiJson ?? {};
        const candidate = Array.isArray(apiJson) ? apiJson : getProp(root, 'data') ?? getProp(root, 'stores') ?? getProp(root, 'results');
        const list = asArray(candidate);
        if (!Array.isArray(list)) return [];
        return list.map((itemObj, idx)=>({
                id: toStringVal(itemObj.id ?? itemObj.store_id ?? itemObj.uuid ?? idx + 1),
                name: toStringVal(itemObj.name ?? itemObj.fantasy_name ?? itemObj.tradingName ?? `Loja ${idx + 1}`),
                address: toStringVal(itemObj.address),
                phone: toStringVal(itemObj.phone),
                status: itemObj.active === false ? 'inactive' : 'active',
                cnpj: toStringVal(itemObj.cnpj) || undefined,
                city: toStringVal(itemObj.city) || undefined,
                state: toStringVal(itemObj.state) || undefined,
                zipCode: toStringVal(itemObj.zipCode) || undefined,
                lastSync: toStringVal(getProp(itemObj, 'last_sync')) || undefined,
                apiId: toStringVal(getProp(itemObj, 'apiId')) || undefined
            }));
    } catch  {
        return [];
    }
}
function normalizeSalesResponse(sales) {
    const grouped = {};
    for (const sale of sales){
        // Usar shift_date como prioridade (data do turno conforme documentação)
        const saleDate = sale.shift_date ?? sale.sale_date ?? sale.created_at ?? new Date().toISOString();
        const dateKey = new Date(saleDate).toISOString().split("T")[0];
        if (!grouped[dateKey]) {
            grouped[dateKey] = {
                date: dateKey,
                totalOrders: 0,
                canceledOrders: 0,
                totalSales: 0,
                qtdDelivery: 0,
                qtdBalcao: 0,
                qtdIFood: 0,
                qtdTelefone: 0,
                qtdCentralPedidos: 0,
                qtdDeliveryDireto: 0,
                totalItems: 0,
                totalDeliveryFee: 0,
                totalAdditions: 0,
                totalDiscounts: 0,
                totalSalesDelivery: 0,
                totalSalesBalcao: 0
            };
        }
        const g = grouped[dateKey];
        g.totalOrders++;
        // Cancelados
        if (sale.status?.toLowerCase().includes("cancel")) g.canceledOrders++;
        // Valores - usar campos da documentação oficial da API Saipos
        // Quando p_data_columns_filter=all, retorna: total_amount, total_discount, total_increase
        // total_amount já inclui descontos e acréscimos
        const value = Number(sale.total_amount ?? sale.total_value ?? sale.amount_total ?? sale.total ?? sale.valor_total ?? sale.amount ?? 0);
        g.totalSales += value;
        // Tipo de pedido usando id_sale_type da documentação
        // 1=Entrega, 2=Retirada/Balcão, 3=Salão/mesa, 4=Ficha/Senha
        const saleType = sale.id_sale_type ?? 0;
        if (saleType === 1) {
            // Delivery
            g.qtdDelivery++;
            g.totalSalesDelivery += value;
            g.totalDeliveryFee += Number(sale.delivery_fee ?? 0);
        } else if (saleType === 2) {
            // Balcão/Retirada
            g.qtdBalcao++;
            g.totalSalesBalcao += value;
        } else {
            const type = sale.order_type?.toLowerCase() ?? "";
            if (type.includes("delivery")) {
                g.qtdDelivery++;
                g.totalSalesDelivery += value;
                g.totalDeliveryFee += Number(sale.delivery_fee ?? 0);
            } else {
                g.qtdBalcao++;
                g.totalSalesBalcao += value;
            }
        }
        // Canais - usar partner_sale da documentação
        let channelName = '';
        if (sale.partner_sale) {
            channelName = String(sale.partner_sale.desc_store_partner ?? sale.partner_sale.name ?? '').toLowerCase();
        }
        if (!channelName) {
            channelName = String(sale.desc_sale ?? sale.origin_name ?? sale.channel ?? sale.origin ?? '').toLowerCase();
        }
        if (channelName.includes("ifood")) g.qtdIFood++;
        else if (channelName.includes("telefone")) g.qtdTelefone++;
        else if (channelName.includes("central")) g.qtdCentralPedidos++;
        else if (channelName.includes("delivery direto") || channelName.includes("direto")) g.qtdDeliveryDireto++;
        // Itens e adicionais
        // Se tiver items array, contar itens reais
        if (sale.items && Array.isArray(sale.items)) {
            const validItems = sale.items.filter((item)=>!item.deleted);
            g.totalItems += validItems.reduce((sum, item)=>sum + (item.quantity || 0), 0);
        } else {
            g.totalItems += Number(sale.total_items ?? 0);
        }
        // Usar total_increase e total_discount da documentação
        g.totalAdditions += Number(sale.total_increase ?? sale.additional_value ?? 0);
        g.totalDiscounts += Number(sale.total_discount ?? sale.discount_value ?? 0);
    }
    return Object.values(grouped).map((g)=>({
            ...g,
            averageTicketDelivery: g.qtdDelivery > 0 ? g.totalSalesDelivery / g.qtdDelivery : 0,
            averageTicketBalcao: g.qtdBalcao > 0 ? g.totalSalesBalcao / g.qtdBalcao : 0
        }));
}
function normalizeDailyResponse(apiJson) {
    try {
        // Verificar se é null ou undefined
        if (apiJson === null || apiJson === undefined) {
            const today = new Date().toISOString().split('T')[0];
            return {
                date: today,
                totalSales: 0,
                totalOrders: 0,
                averageTicket: 0,
                uniqueCustomers: 0,
                totalRevenue: 0,
                ordersByChannel: {
                    delivery: 0,
                    counter: 0,
                    hall: 0,
                    ticket: 0
                },
                topProducts: [],
                salesByOrigin: []
            };
        }
        // Se a API retornou array diretamente
        let salesArray = [];
        if (Array.isArray(apiJson)) {
            salesArray = apiJson;
        } else if (apiJson && typeof apiJson === 'object') {
            // Se retornou no formato { data: [...] }
            const root = apiJson;
            const candidate = getProp(root, 'data') ?? getProp(root, 'results') ?? getProp(root, 'sales') ?? getProp(root, 'items');
            if (Array.isArray(candidate)) {
                salesArray = candidate;
            } else {
                // Se nenhum dos formatos reconhecidos, retornar array vazio no objeto padrão
                const today = new Date().toISOString().split('T')[0];
                return {
                    date: today,
                    totalSales: 0,
                    totalOrders: 0,
                    averageTicket: 0,
                    uniqueCustomers: 0,
                    totalRevenue: 0,
                    ordersByChannel: {
                        delivery: 0,
                        counter: 0,
                        hall: 0,
                        ticket: 0
                    },
                    topProducts: [],
                    salesByOrigin: []
                };
            }
        } else {
            // Se nenhum dos formatos reconhecidos, retornar array vazio no objeto padrão
            const today = new Date().toISOString().split('T')[0];
            return {
                date: today,
                totalSales: 0,
                totalOrders: 0,
                averageTicket: 0,
                uniqueCustomers: 0,
                totalRevenue: 0,
                ordersByChannel: {
                    delivery: 0,
                    counter: 0,
                    hall: 0,
                    ticket: 0
                },
                topProducts: [],
                salesByOrigin: []
            };
        }
        if (salesArray.length === 0) {
            const today = new Date().toISOString().split('T')[0];
            return {
                date: today,
                totalSales: 0,
                totalOrders: 0,
                averageTicket: 0,
                uniqueCustomers: 0,
                totalRevenue: 0,
                ordersByChannel: {
                    delivery: 0,
                    counter: 0,
                    hall: 0,
                    ticket: 0
                },
                topProducts: [],
                salesByOrigin: []
            };
        }
        // Agrupar vendas por data comercial antes de processar
        // Isso garante que vendas após meia-noite até 17h sejam agrupadas no dia anterior
        const salesByBusinessDate = new Map();
        salesArray.forEach((sale)=>{
            const shiftDate = toStringVal(sale.shift_date ?? sale.created_at ?? sale.date ?? sale.sale_date ?? new Date().toISOString());
            const saleDateObj = new Date(shiftDate);
            const businessDate = getBusinessDate(saleDateObj);
            if (!salesByBusinessDate.has(businessDate)) {
                salesByBusinessDate.set(businessDate, []);
            }
            salesByBusinessDate.get(businessDate).push(sale);
        });
        // Processar todas as vendas agrupadas (normalmente será um único dia, mas pode ter vendas do dia anterior)
        // Pegar a data comercial mais recente (ou a primeira se houver apenas uma)
        const businessDates = Array.from(salesByBusinessDate.keys()).sort();
        const dateOnly = businessDates.length > 0 ? businessDates[businessDates.length - 1] : new Date().toISOString().split('T')[0];
        // Usar todas as vendas do dia comercial mais recente (ou todas se houver apenas um dia)
        const salesToProcess = businessDates.length === 1 ? salesByBusinessDate.get(dateOnly) || [] : salesByBusinessDate.get(dateOnly) || [];
        const firstSale = salesToProcess.length > 0 ? salesToProcess[0] : salesArray[0];
        console.log('🔍 DEBUG - Primeira venda:', JSON.stringify(firstSale).substring(0, 500));
        console.log('🔍 DEBUG - Campos disponíveis na venda:', Object.keys(firstSale));
        console.log('🔍 DEBUG - total_amount:', firstSale.total_amount);
        console.log('🔍 DEBUG - total_sale_value:', firstSale.total_sale_value);
        console.log('🔍 DEBUG - id_sale_type:', firstSale.id_sale_type);
        // Verificar estrutura de partner_sale (canal/origem)
        const partnerSale = getProp(firstSale, 'partner_sale');
        console.log('🔍 DEBUG - partner_sale:', partnerSale);
        const origin = getProp(firstSale, 'origin');
        console.log('🔍 DEBUG - origin:', origin);
        const desc_sale = getProp(firstSale, 'desc_sale');
        console.log('🔍 DEBUG - desc_sale:', desc_sale);
        // Calcular totais por tipo de venda (id_sale_type)
        // 1=Delivery, 2=Retirada, 3=Salão, 4=Ficha
        const deliverySales = salesToProcess.filter((s)=>toNumberVal(s.id_sale_type) === 1);
        const counterSales = salesToProcess.filter((s)=>toNumberVal(s.id_sale_type) === 2);
        const hallSales = salesToProcess.filter((s)=>toNumberVal(s.id_sale_type) === 3);
        const ticketSales = salesToProcess.filter((s)=>toNumberVal(s.id_sale_type) === 4);
        // Calcular valores totais usando total_amount ou total_sale_value (já inclui descontos e acréscimos)
        const totalRevenue = salesToProcess.reduce((sum, s)=>sum + getTotalSaleValue(s), 0);
        const totalOrders = salesToProcess.length;
        const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        console.log('🔍 DEBUG - Total calculado:', totalRevenue);
        console.log('🔍 DEBUG - Pedidos:', totalOrders);
        console.log('🔍 DEBUG - Ticket médio:', averageTicket);
        // Extrair clientes únicos (contar apenas id_customer únicos)
        const customerIds = new Set();
        salesToProcess.forEach((s)=>{
            const customer = getProp(s, 'customer');
            if (customer && typeof customer === 'object') {
                const customerId = toStringVal(customer.id_customer);
                if (customerId) {
                    customerIds.add(customerId);
                }
            }
        });
        const uniqueCustomers = customerIds.size;
        console.log('🔍 DEBUG - Clientes únicos:', uniqueCustomers);
        // Extrair produtos mais vendidos dos itens (incluindo complementos)
        const productMap = new Map();
        salesToProcess.forEach((sale)=>{
            const items = asArray(getProp(sale, 'items'));
            items.forEach((item)=>{
                // Ignorar itens deletados
                if (item.deleted === true) return;
                const itemName = toStringVal(item.desc_sale_item || item.desc_store_item || 'Item sem nome');
                const quantity = toNumberVal(item.quantity);
                const unitPrice = toNumberVal(item.unit_price);
                // Adicionar preço de complementos (choices)
                let additionalPrice = 0;
                const choices = asArray(getProp(item, 'choices'));
                choices.forEach((choice)=>{
                    additionalPrice += toNumberVal(choice.aditional_price);
                });
                const itemTotal = (unitPrice + additionalPrice) * quantity;
                if (productMap.has(itemName)) {
                    const existing = productMap.get(itemName);
                    existing.quantity += quantity;
                    existing.revenue += itemTotal;
                } else {
                    productMap.set(itemName, {
                        quantity,
                        revenue: itemTotal,
                        name: itemName
                    });
                }
            });
        });
        const topProducts = Array.from(productMap.values()).sort((a, b)=>b.revenue - a.revenue).slice(0, 10).map((p)=>({
                name: p.name,
                quantity: p.quantity,
                revenue: p.revenue
            }));
        console.log('🔍 DEBUG - Top produtos:', topProducts.slice(0, 3));
        // Calcular breakdown por canal/origem
        const originMap = new Map();
        salesToProcess.forEach((sale)=>{
            // Tentar diferentes campos para identificar o canal
            let originName = 'Sem origem';
            // Verificar partner_sale (marketplace)
            const partnerSale = getProp(sale, 'partner_sale');
            if (partnerSale && typeof partnerSale === 'object') {
                const partnerObj = partnerSale;
                const partnerName = toStringVal(partnerObj.desc_store_partner || partnerObj.name || partnerObj.partner);
                if (partnerName && partnerName !== 'null' && partnerName !== '') {
                    originName = partnerName;
                }
            }
            // Se não encontrou em partner_sale, verificar desc_sale
            if (originName === 'Sem origem') {
                const descSale = toStringVal(getProp(sale, 'desc_sale'));
                if (descSale && descSale !== 'null' && descSale !== '') {
                    originName = descSale;
                }
            }
            // Se ainda não encontrou, verificar campo origin
            if (originName === 'Sem origem') {
                const origin = toStringVal(getProp(sale, 'origin'));
                if (origin && origin !== 'null' && origin !== '') {
                    originName = origin;
                }
            }
            // Normalizar nomes comuns
            originName = originName.toLowerCase();
            if (originName.includes('ifood')) originName = 'iFood';
            else if (originName.includes('telefone') || originName.includes('phone')) originName = 'Telefone';
            else if (originName.includes('delivery direto') || originName.includes('direto')) originName = 'Delivery Direto';
            else if (originName.includes('central')) originName = 'Central de Pedidos';
            else if (originName.includes('whatsapp') || originName.includes('wa')) originName = 'WhatsApp';
            else if (originName.includes('facebook')) originName = 'Facebook';
            else if (originName.includes('anota')) originName = 'Anota.ai';
            else originName = originName.charAt(0).toUpperCase() + originName.slice(1);
            const saleValue = getTotalSaleValue(sale);
            if (originMap.has(originName)) {
                const existing = originMap.get(originName);
                existing.quantity += 1;
                existing.revenue += saleValue;
            } else {
                originMap.set(originName, {
                    quantity: 1,
                    revenue: saleValue
                });
            }
        });
        const salesByOrigin = Array.from(originMap.entries()).map(([origin, data])=>({
                origin,
                quantity: data.quantity,
                revenue: data.revenue
            })).sort((a, b)=>b.revenue - a.revenue);
        console.log('🔍 DEBUG - Vendas por canal/origem:', salesByOrigin);
        console.log('🔍 DEBUG - Total de vendas processadas:', salesToProcess.length);
        const result = {
            date: dateOnly,
            totalSales: totalRevenue,
            totalOrders: totalOrders,
            averageTicket: averageTicket,
            uniqueCustomers: uniqueCustomers,
            totalRevenue: totalRevenue,
            deliverySales: deliverySales.reduce((sum, s)=>sum + getTotalSaleValue(s), 0),
            counterSales: counterSales.reduce((sum, s)=>sum + getTotalSaleValue(s), 0),
            hallSales: hallSales.reduce((sum, s)=>sum + getTotalSaleValue(s), 0),
            ticketSales: ticketSales.reduce((sum, s)=>sum + getTotalSaleValue(s), 0),
            ordersByChannel: {
                delivery: deliverySales.length,
                counter: counterSales.length,
                hall: hallSales.length,
                ticket: ticketSales.length
            },
            topProducts: topProducts,
            salesByOrigin: salesByOrigin
        };
        console.log('✅ DEBUG - Resultado final:', result);
        return result;
    } catch (error) {
        console.error('Erro ao normalizar resposta diária:', error);
        const today = new Date().toISOString().split('T')[0];
        return {
            date: today,
            totalSales: 0,
            totalOrders: 0,
            averageTicket: 0,
            uniqueCustomers: 0,
            totalRevenue: 0,
            ordersByChannel: {
                delivery: 0,
                counter: 0,
                hall: 0,
                ticket: 0
            },
            topProducts: []
        };
    }
}
}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/drin-platform/src/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "db",
    ()=>db,
    "ensureConnection",
    ()=>ensureConnection
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
const db = global.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]({
    log: ("TURBOPACK compile-time truthy", 1) ? [
        'error',
        'warn'
    ] : "TURBOPACK unreachable",
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
});
// Garantir que apenas uma instância do Prisma existe
if ("TURBOPACK compile-time truthy", 1) global.prisma = db;
async function ensureConnection() {
    try {
        await db.$connect();
    } catch (error) {
        // Se a conexão já estiver ativa, ignorar o erro
        if (error instanceof Error && !error.message.includes('already connected')) {
            console.warn('⚠️ Aviso ao verificar conexão:', error.message);
        }
    }
}
// Graceful shutdown - desconectar quando o processo terminar
if ("TURBOPACK compile-time truthy", 1) {
    process.on('beforeExit', async ()=>{
        await db.$disconnect();
    });
}
}),
"[project]/drin-platform/src/lib/user-api-service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UserAPIService",
    ()=>UserAPIService,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$saipos$2d$api$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/lib/saipos-api.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/lib/db.ts [app-route] (ecmascript)");
;
;
// Usar a mesma instância do PrismaClient para evitar vazamento de conexões
const prisma = __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"];
// Verificar se DATABASE_URL está configurada
if (!process.env.DATABASE_URL) {
    console.error('⚠️ DATABASE_URL não está configurada! Configure-a nas variáveis de ambiente.');
}
class UserAPIService {
    // Criar nova API para usuário
    static async createAPI(data) {
        try {
            // Limitar a até 4 conexões Saipos por usuário
            if (data.type === 'saipos') {
                const count = await prisma.userAPI.count({
                    where: {
                        userId: data.userId,
                        type: 'saipos'
                    }
                });
                if (count >= 4) {
                    throw new Error('Limite de 4 conexões Saipos atingido');
                }
            }
            // Para APIs Saipos, sempre usar URL fixa
            const finalBaseUrl = data.type === 'saipos' ? 'https://data.saipos.io/v1' : data.baseUrl || 'https://data.saipos.io/v1';
            // Criar API primeiro
            const api = await prisma.userAPI.create({
                data: {
                    userId: data.userId,
                    name: data.name,
                    type: data.type,
                    apiKey: data.apiKey,
                    baseUrl: finalBaseUrl,
                    status: 'disconnected',
                    storeId: `temp_${Date.now()}` // Temporário, será atualizado abaixo
                }
            });
            // Gerar storeId único baseado no id da API
            const storeId = `store_${api.id}`;
            // Atualizar com o storeId real
            const updatedApi = await prisma.userAPI.update({
                where: {
                    id: api.id
                },
                data: {
                    storeId
                }
            });
            console.log(`✅ API ${data.name} criada para usuário ${data.userId} com storeId: ${storeId}`);
            return updatedApi;
        } catch (error) {
            console.error('❌ Erro ao criar API:', error);
            throw new Error('Erro ao criar configuração da API');
        }
    }
    // Obter todas as APIs de um usuário
    static async getUserAPIs(userId) {
        try {
            const apis = await prisma.userAPI.findMany({
                where: {
                    userId
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            console.log(`📱 ${apis.length} APIs encontradas para usuário ${userId}`);
            return apis;
        } catch (error) {
            console.error('❌ Erro ao buscar APIs:', error);
            throw new Error('Erro ao buscar configurações das APIs');
        }
    }
    // Atualizar API
    static async updateAPI(apiId, data) {
        try {
            // Buscar a API para verificar o tipo
            const existingAPI = await prisma.userAPI.findUnique({
                where: {
                    id: apiId
                }
            });
            // Se for API Saipos e baseUrl foi enviada, garantir que seja sempre a URL fixa
            const updateData = {
                ...data
            };
            if (existingAPI?.type === 'saipos' && data.baseUrl !== undefined) {
                updateData.baseUrl = 'https://data.saipos.io/v1';
            }
            const api = await prisma.userAPI.update({
                where: {
                    id: apiId
                },
                data: {
                    ...updateData,
                    updatedAt: new Date()
                }
            });
            console.log(`✅ API ${apiId} atualizada`);
            return api;
        } catch (error) {
            console.error('❌ Erro ao atualizar API:', error);
            throw new Error('Erro ao atualizar configuração da API');
        }
    }
    // Deletar API
    static async deleteAPI(apiId) {
        try {
            await prisma.userAPI.delete({
                where: {
                    id: apiId
                }
            });
            console.log(`✅ API ${apiId} removida`);
        } catch (error) {
            console.error('❌ Erro ao deletar API:', error);
            throw new Error('Erro ao remover configuração da API');
        }
    }
    // Obter API específica
    static async getAPI(apiId) {
        try {
            const api = await prisma.userAPI.findUnique({
                where: {
                    id: apiId
                }
            });
            return api;
        } catch (error) {
            console.error('❌ Erro ao buscar API:', error);
            throw new Error('Erro ao buscar configuração da API');
        }
    }
    // Testar conexão e atualizar status
    static async testAndUpdateAPI(apiId) {
        try {
            const api = await this.getAPI(apiId);
            if (!api) {
                throw new Error('API não encontrada');
            }
            console.log(`🔗 Testando conexão com ${api.name}...`);
            console.log(`📍 URL: ${api.baseUrl}`);
            console.log(`🔑 API Key: ${api.apiKey.substring(0, 12)}...`);
            // Para APIs Saipos, sempre usar URL fixa
            const finalBaseUrl = api.type === 'saipos' ? 'https://data.saipos.io/v1' : api.baseUrl || 'https://data.saipos.io/v1';
            // Teste REAL: tentar buscar lojas com o token
            const client = new __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$saipos$2d$api$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SaiposAPIService"]({
                apiKey: api.apiKey,
                baseUrl: finalBaseUrl
            });
            let status = 'error';
            let errorMessage = null;
            try {
                const ok = await client.testConnection();
                if (ok) {
                    // opcional: verificar se retorna ao menos uma loja
                    try {
                        await client.getStores().catch(()=>{});
                        status = 'connected';
                    } catch  {
                        // Se getStores falhar mas testConnection passou, ainda consideramos conectado
                        status = 'connected';
                    }
                } else {
                    // Se testConnection retornou false mas não lançou erro, é uma falha silenciosa
                    status = 'error';
                    errorMessage = 'Falha ao conectar com a API Saipos. Verifique o token e a URL.';
                    throw new Error(errorMessage);
                }
            } catch (e) {
                const msg = e instanceof Error ? e.message : String(e);
                console.error('Falha no teste real:', msg);
                status = 'error';
                errorMessage = msg;
                // Se o erro for "fetch failed", tentar fornecer mais contexto
                if (msg.includes('fetch failed') || msg.includes('Failed to fetch')) {
                    throw new Error(`Não foi possível conectar com a API Saipos. Possíveis causas:\n1. URL incorreta: ${api.baseUrl}\n2. Token inválido\n3. API não acessível do servidor\n4. Problema de rede/firewall`);
                }
                // Re-throw para propagar mensagem de erro específica
                throw new Error(msg);
            }
            // Atualizar status no banco
            const updatedAPI = await this.updateAPI(apiId, {
                status,
                lastTest: new Date()
            });
            if (status === 'connected') {
                console.log(`✅ Teste concluído: ${status}`);
            } else {
                console.log(`⚠️ Teste concluído: ${status}`);
            }
            return updatedAPI;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error('❌ Erro ao testar API:', errorMessage);
            // Marcar como erro no banco
            try {
                await this.updateAPI(apiId, {
                    status: 'error',
                    lastTest: new Date()
                });
            } catch (e) {
                console.error('Erro ao atualizar status no banco:', e);
            }
            // Re-throw com mensagem específica
            throw new Error(errorMessage);
        }
    }
    // Obter APIs conectadas de um usuário
    static async getConnectedAPIs(userId) {
        try {
            const apis = await prisma.userAPI.findMany({
                where: {
                    userId,
                    status: 'connected'
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            console.log(`🔗 ${apis.length} APIs conectadas para usuário ${userId}`);
            return apis;
        } catch (error) {
            console.error('❌ Erro ao buscar APIs conectadas:', error);
            throw new Error('Erro ao buscar APIs conectadas');
        }
    }
}
const __TURBOPACK__default__export__ = UserAPIService;
}),
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[project]/drin-platform/src/stack.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "stackServerApp",
    ()=>stackServerApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$stack$2d$app$2f$apps$2f$interfaces$2f$server$2d$app$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/@stackframe/stack/dist/esm/lib/stack-app/apps/interfaces/server-app.js [app-route] (ecmascript)");
;
const stackServerApp = new __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$stack$2d$app$2f$apps$2f$interfaces$2f$server$2d$app$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["StackServerApp"]({
    tokenStore: 'nextjs-cookie',
    projectId: ("TURBOPACK compile-time value", "26dbad35-bdd4-497b-b94c-142f01758197"),
    publishableClientKey: ("TURBOPACK compile-time value", "pck_1cazbav6n1k56a1q2fxre50xe5508qaneev49hzpcf390"),
    secretServerKey: process.env.STACK_SECRET_SERVER_KEY,
    urls: {
        signIn: '/auth/login',
        signUp: '/auth/register',
        afterSignIn: '/dashboard',
        afterSignUp: '/dashboard',
        afterSignOut: '/',
        handler: '/handler'
    }
});
}),
"[project]/drin-platform/src/lib/stack-auth-sync.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getUserByStackId",
    ()=>getUserByStackId,
    "syncStackAuthUser",
    ()=>syncStackAuthUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/lib/db.ts [app-route] (ecmascript)");
;
// ---------------------------------------------------------------------------
// Cache em memória para syncStackAuthUser
// Evita 4-6 queries por requisição em rotas autenticadas (>60 rotas)
// ---------------------------------------------------------------------------
const _syncCache = new Map();
const _SYNC_CACHE_TTL_MS = 60_000; // 60 segundos
/**
 * Sincroniza usuário do Stack Auth com o banco de dados local
 * Cria o usuário se não existir, atualiza se já existir
 */ async function _syncStackAuthUserImpl(stackUser) {
    try {
        console.log('🔄 Sincronizando usuário Stack Auth:', {
            id: stackUser.id,
            email: stackUser.primaryEmail
        });
        if (!stackUser.primaryEmail) {
            throw new Error('Email do usuário não está disponível');
        }
        // Verificar se o StackUser já existe
        console.log('📊 Buscando StackUser no banco...');
        // Garantir que a conexão está ativa
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensureConnection"])();
        let dbStackUser = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].stackUser.findUnique({
            where: {
                id: stackUser.id
            },
            include: {
                user: true
            }
        }).catch((error)=>{
            console.error('❌ Erro ao buscar StackUser:', error);
            const errorMsg = error instanceof Error ? error.message : String(error);
            // Detectar erros específicos
            if (errorMsg.includes('closed the connection') || errorMsg.includes('connection closed')) {
                throw new Error(`Erro ao acessar banco de dados: Conexão foi fechada. Possível causa: tabelas não criadas ou conexão perdida. Execute: GET /api/admin/sync-database?secret=YOUR_ADMIN_SECRET`);
            }
            if (errorMsg.includes('does not exist') || errorMsg.includes('relation') || errorMsg.includes('table')) {
                throw new Error(`Erro ao acessar banco de dados: Tabelas não foram criadas. Execute: GET /api/admin/sync-database?secret=YOUR_ADMIN_SECRET`);
            }
            throw new Error(`Erro ao acessar banco de dados: ${errorMsg}. Possível causa: tabelas não criadas. Execute: GET /api/admin/sync-database?secret=YOUR_ADMIN_SECRET`);
        });
        // Se não existe, criar novo
        if (!dbStackUser) {
            console.log('➕ Criando novo StackUser...');
            dbStackUser = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].stackUser.create({
                data: {
                    id: stackUser.id,
                    primaryEmail: stackUser.primaryEmail,
                    displayName: stackUser.displayName || '',
                    profileImageUrl: stackUser.profileImageUrl,
                    primaryEmailVerified: stackUser.primaryEmailVerified,
                    lastActiveAt: new Date()
                },
                include: {
                    user: true
                }
            }).catch((error)=>{
                console.error('❌ Erro ao criar StackUser:', error);
                throw new Error(`Erro ao criar usuário: ${error.message}`);
            });
            console.log('✅ StackUser criado:', dbStackUser.id);
        } else {
            console.log('✅ StackUser encontrado:', dbStackUser.id);
            // Atualizar dados do StackUser
            dbStackUser = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].stackUser.update({
                where: {
                    id: stackUser.id
                },
                data: {
                    primaryEmail: stackUser.primaryEmail,
                    displayName: stackUser.displayName || dbStackUser.displayName,
                    profileImageUrl: stackUser.profileImageUrl || dbStackUser.profileImageUrl,
                    primaryEmailVerified: stackUser.primaryEmailVerified || dbStackUser.primaryEmailVerified,
                    lastActiveAt: new Date()
                },
                include: {
                    user: true
                }
            });
        }
        // Se o StackUser já tem um User associado, retornar
        if (dbStackUser.user) {
            return dbStackUser.user;
        }
        // Buscar se já existe um User com esse email
        const existingUser = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.findUnique({
            where: {
                email: stackUser.primaryEmail
            }
        });
        if (existingUser) {
            // Associar StackUser existente ao User existente
            await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.update({
                where: {
                    id: existingUser.id
                },
                data: {
                    stackUserId: dbStackUser.id,
                    fullName: stackUser.displayName || existingUser.fullName
                }
            });
            await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].stackUser.update({
                where: {
                    id: dbStackUser.id
                },
                data: {
                    userId: existingUser.id
                }
            });
            return existingUser;
        }
        // Criar novo User baseado nos dados do Stack Auth
        const newUser = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.create({
            data: {
                email: stackUser.primaryEmail,
                username: generateUsernameFromEmail(stackUser.primaryEmail),
                fullName: stackUser.displayName || '',
                password: null,
                isAdmin: false,
                stackUserId: dbStackUser.id
            }
        });
        // Atualizar StackUser com referência ao User
        await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].stackUser.update({
            where: {
                id: dbStackUser.id
            },
            data: {
                userId: newUser.id
            }
        });
        return newUser;
    } catch (error) {
        console.error('Erro ao sincronizar usuário do Stack Auth:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        // Re-throw se já for um erro tratado
        if (errorMessage.includes('Erro ao acessar banco de dados') || errorMessage.includes('Erro ao conectar ao banco')) {
            throw error;
        }
        if (errorMessage.includes('DATABASE_URL') || errorMessage.includes('Environment variable not found')) {
            throw new Error('Variável de ambiente DATABASE_URL não configurada. Configure-a nas variáveis de ambiente da Vercel.');
        }
        if (errorMessage.includes('does not exist') || errorMessage.includes('relation') && errorMessage.includes('does not exist')) {
            throw new Error('Tabelas do banco de dados não foram criadas. Execute: GET /api/admin/sync-database?secret=YOUR_ADMIN_SECRET');
        }
        if (errorMessage.includes('closed the connection') || errorMessage.includes('connection closed')) {
            throw new Error('Conexão com o banco de dados foi fechada. Possível causa: tabelas não criadas ou conexão perdida. Execute: GET /api/admin/sync-database?secret=YOUR_ADMIN_SECRET');
        }
        throw error;
    }
}
async function syncStackAuthUser(stackUser) {
    const now = Date.now();
    const hit = _syncCache.get(stackUser.id);
    if (hit && now - hit.cachedAt < _SYNC_CACHE_TTL_MS && hit.primaryEmail === stackUser.primaryEmail && (hit.displayName ?? null) === (stackUser.displayName ?? null) && (hit.profileImageUrl ?? null) === (stackUser.profileImageUrl ?? null)) {
        return hit.result;
    }
    const result = await _syncStackAuthUserImpl(stackUser);
    _syncCache.set(stackUser.id, {
        result,
        cachedAt: Date.now(),
        primaryEmail: stackUser.primaryEmail,
        displayName: stackUser.displayName,
        profileImageUrl: stackUser.profileImageUrl
    });
    return result;
}
/**
 * Gera um username único a partir do email
 */ function generateUsernameFromEmail(email) {
    const baseUsername = email.split('@')[0].toLowerCase();
    const timestamp = Date.now().toString(36);
    return `${baseUsername}_${timestamp}`;
}
async function getUserByStackId(stackUserId) {
    try {
        const stackUser = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].stackUser.findUnique({
            where: {
                id: stackUserId
            },
            include: {
                user: true
            }
        });
        return stackUser?.user || null;
    } catch (error) {
        console.error('Erro ao buscar usuário por Stack ID:', error);
        return null;
    }
}
}),
"[project]/drin-platform/app/api/user-apis/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$user$2d$api$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/lib/user-api-service.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$stack$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/stack.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$stack$2d$auth$2d$sync$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/drin-platform/src/lib/stack-auth-sync.ts [app-route] (ecmascript)");
const dynamic = 'force-dynamic';
;
;
;
;
async function GET() {
    try {
        // Identificar usuário autenticado via Stack Auth e garantir sync no DB
        const stackUser = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$stack$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stackServerApp"].getUser({
            or: 'return-null'
        });
        if (!stackUser) return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Não autenticado'
        }, {
            status: 401
        });
        let dbUser;
        try {
            dbUser = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$stack$2d$auth$2d$sync$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["syncStackAuthUser"])({
                id: stackUser.id,
                primaryEmail: stackUser.primaryEmail,
                displayName: stackUser.displayName,
                profileImageUrl: stackUser.profileImageUrl,
                primaryEmailVerified: stackUser.primaryEmailVerified ? new Date() : null
            });
        } catch (e) {
            const message = e?.message || 'Falha ao sincronizar usuário';
            return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: message
            }, {
                status: 500
            });
        }
        const apis = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$user$2d$api$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UserAPIService"].getUserAPIs(dbUser.id);
        return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            apis
        });
    } catch (error) {
        console.error('Erro ao buscar APIs:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Erro interno do servidor'
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const stackUser = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$stack$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stackServerApp"].getUser({
            or: 'return-null'
        });
        if (!stackUser) return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Não autenticado'
        }, {
            status: 401
        });
        let dbUser;
        try {
            dbUser = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$stack$2d$auth$2d$sync$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["syncStackAuthUser"])({
                id: stackUser.id,
                primaryEmail: stackUser.primaryEmail,
                displayName: stackUser.displayName,
                profileImageUrl: stackUser.profileImageUrl,
                primaryEmailVerified: stackUser.primaryEmailVerified ? new Date() : null
            });
        } catch (e) {
            const message = e?.message || 'Falha ao sincronizar usuário';
            return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: message
            }, {
                status: 500
            });
        }
        const body = await request.json();
        if (!body.name || !body.apiKey) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Campos obrigatórios: name, apiKey'
            }, {
                status: 400
            });
        }
        try {
            const api = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$user$2d$api$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UserAPIService"].createAPI({
                ...body,
                userId: dbUser.id
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                api
            }, {
                status: 201
            });
        } catch (e) {
            const message = e?.message || 'Falha ao salvar API';
            console.error('Erro ao criar API:', e);
            const status = message.includes('Limite de 4 conexões Saipos') ? 400 : 500;
            return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: message
            }, {
                status
            });
        }
    } catch (error) {
        const message = error?.message || 'Erro interno do servidor';
        console.error('Erro ao criar API:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: message
        }, {
            status: 500
        });
    }
}
async function PUT(request) {
    try {
        const { searchParams } = new URL(request.url);
        const apiId = searchParams.get('id');
        if (!apiId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'ID da API é obrigatório'
            }, {
                status: 400
            });
        }
        // Garantir usuário autenticado
        const stackUser = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$stack$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stackServerApp"].getUser({
            or: 'return-null'
        });
        if (!stackUser) return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Não autenticado'
        }, {
            status: 401
        });
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$stack$2d$auth$2d$sync$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["syncStackAuthUser"])({
                id: stackUser.id,
                primaryEmail: stackUser.primaryEmail,
                displayName: stackUser.displayName,
                profileImageUrl: stackUser.profileImageUrl,
                primaryEmailVerified: stackUser.primaryEmailVerified ? new Date() : null
            });
        } catch  {
            return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Falha ao sincronizar usuário'
            }, {
                status: 500
            });
        }
        const body = await request.json();
        // Opcional: checar ownership (não implementado aqui por brevidade)
        const api = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$user$2d$api$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UserAPIService"].updateAPI(apiId, body);
        return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            api
        });
    } catch (error) {
        const message = error?.message || 'Erro interno do servidor';
        console.error('Erro ao atualizar API:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: message
        }, {
            status: 500
        });
    }
}
async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const apiId = searchParams.get('id');
        if (!apiId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'ID da API é obrigatório'
            }, {
                status: 400
            });
        }
        // Garantir usuário autenticado
        const stackUser = await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$stack$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stackServerApp"].getUser({
            or: 'return-null'
        });
        if (!stackUser) return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Não autenticado'
        }, {
            status: 401
        });
        // Opcional: checar ownership (não implementado aqui)
        await __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$src$2f$lib$2f$user$2d$api$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UserAPIService"].deleteAPI(apiId);
        return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: 'API removida com sucesso'
        });
    } catch (error) {
        const message = error?.message || 'Erro interno do servidor';
        console.error('Erro ao deletar API:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$drin$2d$platform$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__59fec0cf._.js.map