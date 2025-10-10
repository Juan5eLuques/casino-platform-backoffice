// Enums
export enum BackofficeRole {
   SUPER_ADMIN = 'SUPER_ADMIN',
   BRAND_ADMIN = 'BRAND_ADMIN',
   CASHIER = 'CASHIER',
   PLAYER = 'PLAYER',
}

export enum EntityStatus {
   ACTIVE = 'ACTIVE',
   INACTIVE = 'INACTIVE',
   SUSPENDED = 'SUSPENDED',
}

export enum BrandStatus {
   ACTIVE = 'ACTIVE',
   INACTIVE = 'INACTIVE',
   MAINTENANCE = 'MAINTENANCE',
}

export enum PlayerStatus {
   ACTIVE = 'ACTIVE',
   INACTIVE = 'INACTIVE',
   SUSPENDED = 'SUSPENDED',
   BANNED = 'BANNED',
}

// Auth types
export interface BackofficeUser {
   id: string;
   username: string;
   role: BackofficeRole;
   operatorId?: string;
   operator?: {
      id: string;
      name: string;
   };
   status: EntityStatus;
   createdAt: string;
   lastLoginAt?: string;
   assignedPlayersCount?: number;
}

export interface LoginCredentials {
   username: string;
   password: string;
}

export interface AuthResponse {
   success: boolean;
   user: BackofficeUser;
   expiresAt: string;
}

// Brand types
export interface Brand {
   id: string;
   operatorId: string;
   code: string;
   name: string;
   domain: string;
   adminDomain: string;
   corsOrigins: string[];
   locale: string;
   status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
   theme: {
      primaryColor: string;
      secondaryColor?: string;
      logo?: string;
   };
   settings: {
      maxBetAmount: number;
      currency: string;
      timezone: string;
   };
   playersCount?: number;
   gamesCount?: number;
   createdAt: string;
}

// Operator types
export interface Operator {
   id: string;
   name: string;
   taxId?: string;
   status: EntityStatus;
   brandsCount?: number;
   usersCount?: number;
   createdAt: string;
}

// Player types
export interface Player {
   id: string;
   brandId: string;
   username: string;
   email: string;
   externalId?: string;
   status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BANNED';
   balance: number;
   createdAt: string;
   lastLoginAt?: string;
   totalBets?: number;
   totalWins?: number;
   sessionsCount?: number;
   assignedCashiers?: AssignedCashier[];
}

export interface AssignedCashier {
   cashierId: string;
   cashierUsername: string;
   assignedAt: string;
}

// Transaction types
export interface Transaction {
   id: string;
   delta: number;
   reason: 'BET' | 'WIN' | 'ROLLBACK' | 'ADMIN_GRANT' | 'ADMIN_DEDUCT';
   externalRef?: string;
   comment?: string;
   createdAt: string;
   balanceAfter: number;
   meta?: Record<string, any>;
}

export interface WalletInfo {
   playerId: string;
   balance: number;
   currency: string;
   lastTransactionAt?: string;
   recentTransactions: Transaction[];
}

// Game types
export interface Game {
   id: string;
   code: string;
   provider: string;
   name: string;
   category: 'SLOT' | 'TABLE' | 'POKER' | 'LIVE' | 'OTHER';
   enabled: boolean;
   createdAt: string;
   activeBrands?: number;
   meta?: {
      rtp?: number;
      volatility?: string;
      maxWin?: number;
   };
}

export interface BrandGame {
   gameId: string;
   code: string;
   name: string;
   provider: string;
   enabled: boolean;
   displayOrder: number;
   tags: string[];
}

// API Response types
export interface ApiResponse<T> {
   success?: boolean;
   data?: T;
   message?: string;
   errorMessage?: string;
}

export interface PaginatedResponse<T> {
   data: T[];
   pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
   };
}

export interface ApiError {
   title: string;
   detail: string;
   status: number;
   instance?: string;
}

// Audit types
export interface AuditLog {
   id: string;
   action: string;
   targetType: string;
   targetId: string;
   meta?: Record<string, any>;
   createdAt: string;
   user: {
      id: string;
      username: string;
      role: BackofficeRole;
   };
}

export interface ProviderAuditLog {
   id: string;
   provider: string;
   action: string;
   sessionId?: string;
   playerId?: string;
   brandCode?: string;
   meta?: Record<string, any>;
   createdAt: string;
}

// Provider Config types
export interface ProviderConfig {
   provider: string;
   enabled: boolean;
   apiUrl?: string;
   credentials?: {
      apiKey?: string;
      secretKey?: string;
      merchantId?: string;
   };
   settings?: Record<string, any>;
   lastRotatedAt?: string;
}

// Brand Settings types
export interface BrandSettings {
   maxBetAmount: number;
   currency: string;
   timezone: string;
   supportEmail?: string;
   supportPhone?: string;
   termsUrl?: string;
   privacyUrl?: string;
   minWithdrawal?: number;
   maxWithdrawal?: number;
   dailyWithdrawalLimit?: number;
   [key: string]: any;
}

// Filter types
export interface PlayerFilters {
   brandId?: string;
   status?: Player['status'];
   search?: string;
   assignedToCashier?: string;
   hasBalance?: boolean;
   page?: number;
   limit?: number;
}

export interface UserFilters {
   page?: number;
   pageSize?: number;
   globalScope?: boolean;     // Solo SUPER_ADMIN puede usar true
   username?: string;         // Filtro por username (contiene)
   userType?: 'BACKOFFICE' | 'PLAYER';  // Nuevo: BACKOFFICE o PLAYER
   role?: 'SUPER_ADMIN' | 'BRAND_ADMIN' | 'CASHIER' | 'PLAYER';
   status?: 'ACTIVE' | 'INACTIVE';      // Filtro por status
   createdByUserId?: string;  // Filtro por creador
   parentCashierId?: string;  // Filtro por cashier padre
}

export interface BrandFilters {
   operatorId?: string;
   status?: Brand['status'];
   domain?: string;
   page?: number;
   limit?: number;
}

export interface GameFilters {
   provider?: string;
   enabled?: boolean;
   search?: string;
   page?: number;
   limit?: number;
}

// Dashboard types
export interface DashboardMetrics {
   totalPlayersActive: number;
   totalBalance: number;
   transactionsToday: number;
   usersOnline: number;
   revenueMonth: number;
}

export interface ActivityData {
   date: string;
   players: number;
   transactions: number;
   revenue: number;
}

export interface CreateBrandForm {
   operatorId: string;
   code: string;
   name: string;
   domain: string;
   adminDomain: string;
   corsOrigins: string[];
   locale: string;
   status: Brand['status'];
   theme: {
      primaryColor: string;
      secondaryColor?: string;
      logo?: string;
   };
   settings: {
      maxBetAmount: number;
      currency: string;
      timezone: string;
   };
}

export interface WalletAdjustment {
   amount: number;
   reason: 'ADMIN_GRANT' | 'ADMIN_DEDUCT';
   comment?: string;
   externalRef?: string;
}

// Unified User Creation Form - según nueva API
export interface CreateUserForm {
   username: string;          // Requerido: nombre de usuario
   password: string;          // Requerido: contraseña
   role?: number;             // 0: SUPER_ADMIN, 1: BRAND_ADMIN, 2: CASHIER, 3: PLAYER
   commissionPercent?: number; // Solo para CASHIER, opcional para otros roles
   email?: string;            // Email válido (principalmente para jugadores)
}// Response unificado para cualquier tipo de usuario según nueva API
export interface UserResponse {
   id: string;
   userType: 'BACKOFFICE' | 'PLAYER';  // Tipo principal del usuario
   username: string;
   email?: string;                     // Para jugadores principalmente
   role?: 'SUPER_ADMIN' | 'BRAND_ADMIN' | 'CASHIER' | 'PLAYER';
   status: 'ACTIVE' | 'INACTIVE';
   brandId?: string;
   brandName?: string;
   walletBalance?: number;             // Balance actual del usuario
   createdAt: string;
   createdByUserId?: string;
   createdByUsername?: string;
   createdByRole?: string;
   
   // Campos adicionales específicos
   commissionPercent?: number;         // Para CASHIER
   parentCashierId?: string;          // Para CASHIER subordinados
   subordinatesCount?: number;
   lastLoginAt?: string;
}// Update User Request - para actualizar cualquier tipo de usuario
export interface UpdateUserForm {
   username?: string;         // Nuevo username
   password?: string;         // Nueva contraseña
   status?: string;           // Nuevo status

   // Para usuarios de backoffice
   role?: 'SUPER_ADMIN' | 'BRAND_ADMIN' | 'CASHIER';
   commissionRate?: number;   // Nueva comisión

   // Para jugadores
   email?: string;            // Nuevo email
   playerStatus?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

// Wallet Adjustment para jugadores
export interface AdjustWalletRequest {
   amount: number;            // Positivo = crédito, Negativo = débito
   reason: string;            // Descripción del ajuste
}

export interface WalletAdjustmentResponse {
   success: boolean;
   newBalance: number;
   ledgerEntryId: number;
   message: string;
}

// Nuevos tipos para Transacciones según la API
export interface TransactionResponse {
   id: string;
   type: 'TRANSFER' | 'MINT';
   fromUserId?: string;
   fromUserType?: 'BACKOFFICE' | 'PLAYER';
   fromUsername?: string;
   toUserId?: string;
   toUserType?: 'BACKOFFICE' | 'PLAYER';
   toUsername?: string;
   amount: number;
   previousBalanceFrom?: number;
   newBalanceFrom?: number;
   previousBalanceTo?: number;
   newBalanceTo?: number;
   description: string;
   createdByUserId: string;
   createdByUsername: string;
   createdByRole: string;
   createdAt: string;
}

export interface CreateTransactionRequest {
   fromUserId: string;
   fromUserType: 'BACKOFFICE' | 'PLAYER';
   toUserId: string;
   toUserType: 'BACKOFFICE' | 'PLAYER';
   amount: number;
   idempotencyKey: string;    // Único por operación
   description: string;
}

export interface TransactionFilters {
   userId?: string;           // Filtra por usuario origen o destino
   userType?: 'BACKOFFICE' | 'PLAYER';
   fromDate?: string;         // ISO date string
   toDate?: string;           // ISO date string
   description?: string;      // Filtra por descripción
   globalScope?: boolean;     // Solo SUPER_ADMIN
   page?: number;
   pageSize?: number;
}

export interface UserBalanceResponse {
   userId: string;
   userType: 'BACKOFFICE' | 'PLAYER';
   balance: number;
   currency: string;
   lastTransactionAt?: string;
}

// Notification types
export interface Notification {
   id: string;
   type: 'success' | 'error' | 'warning' | 'info';
   title: string;
   message: string;
   createdAt: string;
   read: boolean;
}