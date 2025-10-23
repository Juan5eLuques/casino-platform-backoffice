// ====================================
// Dashboard Types
// ====================================

export interface DashboardOverviewResponse {
   finanzas: FinancesSummary;
   casino: CasinoSummary;
   usuarios: UsersCountsResponse;
   alertas: AlertsSummary;
}

// ====================================
// Finanzas
// ====================================

export interface FinancesSummary {
   period: PeriodInfo;
   scope: ScopeInfo;
   fichas: FichasInfo;
   cargas: TransactionSummary;
   depositosA: TransactionSummary;
   retiros: TransactionSummary;
   links: {
      reporteMensual: string;
   };
}

export interface PeriodInfo {
   from: string; // ISO 8601
   to: string; // ISO 8601
   timezone: string;
}

export interface ScopeInfo {
   type: 'DIRECT' | 'TREE' | 'GLOBAL';
   userId: string; // GUID
   brandId: string; // GUID
}

export interface FichasInfo {
   balanceActual: number;
   deltaDelDia: number;
   breakdown: {
      houseBalance: number;
      cashiersBalance: number;
      playersBalance: number;
   };
}

export interface TransactionSummary {
   total: number;
   count: number;
   promedio: number;
}

// ====================================
// Casino
// ====================================

export interface CasinoSummary {
   period: PeriodInfo;
   jugado: number;
   pagado: number;
   netwin: number;
   comisionPorcentaje: number;
   comision: number;
   totalAPagar: number;
   kpIs: CasinoKPIs;
   links: {
      reporteMensual: string;
   };
}

export interface CasinoKPIs {
   holdPercentage: number;
   rondasTotales: number;
   apuestaPromedio: number;
   jugadoresActivos: number;
}

// ====================================
// Usuarios
// ====================================

export interface UsersCountsResponse {
   jugadoresDirectos: number;
   agentesDirectos: number;
   totalJugadores: number;
   totalAgentes: number;
   breakdown: UsersBreakdown;
}

export interface UsersBreakdown {
   jugadoresActivos: number;
   jugadoresInactivos: number;
   agentesPorNivel: {
      [key: string]: number; // ej: "nivel2": 5, "nivel3": 3
   };
}

// ====================================
// Alertas
// ====================================

export interface AlertsSummary {
   alertas: Alert[];
   estadoOperativo: OperationalStatus;
}

export interface Alert {
   tipo: string; // "FLOAT_BAJO", "SALDO_NEGATIVO", etc.
   severidad: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
   count: number;
   total?: number; // Monto total (opcional)
   link?: string; // URL para más detalles (opcional)
   mensaje: string;
}

export interface OperationalStatus {
   cajerosActivos: number;
   jugadoresOnline: number;
   floatTotal: number;
   transaccionesPendientes: number;
}

// ====================================
// Request Params
// ====================================

export type DashboardScope = 'DIRECT' | 'TREE' | 'GLOBAL';

export interface DashboardParams {
   scope: DashboardScope;
   from?: string; // ISO 8601
   to?: string; // ISO 8601
   timezone?: string;
}

// ====================================
// UI State Types
// ====================================

export type PeriodPreset = 'today' | 'week' | 'month' | 'custom';

export interface DashboardFilters {
   scope: DashboardScope;
   from?: Date;
   to?: Date;
   autoRefresh: boolean;
}
