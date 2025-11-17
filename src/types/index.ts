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
   gameId: string;           // UUID del juego
   code: string;             // Código único del juego
   name: string;             // Nombre del juego
   provider: string;         // Proveedor (pragmatic, evolution, etc.)
   type: 'SLOT' | 'LIVE_CASINO'; // Tipo de juego
   category: string | null;  // Categoría (video-slots, roulette, etc.)
   imageUrl: string | null;  // URL de la imagen/thumbnail
   rtp: number | null;       // Return to Player % (ej: 96.51)
   volatility: string | null; // LOW, MEDIUM, HIGH (solo para slots)
   minBet: number | null;    // Apuesta mínima
   maxBet: number | null;    // Apuesta máxima
   isFeatured: boolean;      // Si es destacado
   isNew: boolean;           // Si es nuevo
   enabled: boolean;         // Si está habilitado
   displayOrder: number;     // Orden de visualización
   tags: string[];           // Tags adicionales
   createdAt?: string;
   activeBrands?: number;
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

export interface AuditPaginatedResponse<T> {
   data: T[];
   page: number;
   pageSize: number;
   totalCount: number;
   totalPages: number;
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
   userId: string;
   username: string;
   userRole: string;
   operatorName: string | null;
   action: string;
   targetType: string;
   targetId: string;
   meta?: Record<string, any>;
   createdAt: string;
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
   globalScope?: boolean;          // Solo SUPER_ADMIN puede usar true
   username?: string;              // Filtro por username (contiene)
   userType?: 'BACKOFFICE' | 'PLAYER';  // BACKOFFICE o PLAYER
   role?: 'SUPER_ADMIN' | 'BRAND_ADMIN' | 'CASHIER' | 'PLAYER';
   status?: 'ACTIVE' | 'INACTIVE'; // Filtro por status
   createdByUserId?: string;       // Filtro por creador
   parentCashierId?: string;       // Filtro por cashier padre
   createdFrom?: string;           // Fecha de creación desde (ISO)
   createdTo?: string;             // Fecha de creación hasta (ISO)
}

export interface BrandFilters {
   operatorId?: string;
   status?: Brand['status'];
   domain?: string;
   page?: number;
   limit?: number;
}

export interface GameFilters {
   page?: number;
   pageSize?: number;
   type?: 'SLOT' | 'LIVE_CASINO';
   category?: string;
   provider?: string;
   featured?: boolean;
   enabled?: boolean;
   search?: string;
}

export interface CatalogGamesResponse {
   games: Game[];
   page: number;
   pageSize: number;
   totalCount: number;
   totalPages: number;
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
   username: string;                  // Requerido: nombre de usuario
   password?: string;                 // Opcional para player, requerido para backoffice
   role?: number;                     // Rol númerico según API: 0-3
   email?: string;                    // Email válido (solo para jugadores)
   externalId?: string;               // ID externo (solo para jugadores)
   parentCashierId?: string;          // GUID del cashier padre (solo para CASHIER subordinado)
   commissionPercent?: number;        // Comisión en porcentaje 0-100 (solo para CASHIER)
}// Response unificado para cualquier tipo de usuario según nueva API
export interface UserResponse {
   id: string;
   userType: 'BACKOFFICE' | 'PLAYER';  // Tipo principal del usuario
   username: string;
   email?: string;                     // Para jugadores principalmente
   role?: 'SUPER_ADMIN' | 'BRAND_ADMIN' | 'CASHIER' | 'PLAYER' | null;
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
   parentCashierId?: string | null;   // Para CASHIER subordinados
   parentCashierUsername?: string | null;  // Username del cashier padre
   subordinatesCount?: number;
   lastLoginAt?: string | null;
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

// Transaction Types según la nueva API unificada
export type TransactionType =
   | 'MINT'         // Crear dinero (solo SUPER_ADMIN)
   | 'TRANSFER'     // Transferencia
   | 'DEPOSIT'      // Depósito
   | 'WITHDRAWAL'   // Retiro
   | 'BONUS'        // Bonificación
   | 'ADJUSTMENT'   // Ajuste manual
   | 'BET'          // Apuesta (sistema)
   | 'WIN'          // Ganancia (sistema)
   | 'ROLLBACK';    // Revertir transacción

// Nuevos tipos para Transacciones según la API
export interface TransactionResponse {
   id: string;
   brandId: string;
   type: TransactionType;
   fromUserId?: string | null;
   fromUserType?: 'BACKOFFICE' | 'PLAYER' | null;
   fromUsername?: string | null;
   toUserId?: string | null;
   toUserType?: 'BACKOFFICE' | 'PLAYER' | 'HOUSE' | null;
   toUsername?: string | null;
   amount: number;
   previousBalanceFrom?: number | null;
   newBalanceFrom?: number | null;
   previousBalanceTo?: number | null;
   newBalanceTo?: number | null;
   description: string;
   transactionType: TransactionType;
   createdByUserId: string;
   createdByUsername: string;
   createdByRole: string;
   idempotencyKey: string;
   createdAt: string;
}

// Request para crear transacción - Nueva API Unificada
export interface CreateTransactionRequest {
   fromUserId?: string | null;        // ID usuario origen (null para MINT)
   fromUserType?: 'BACKOFFICE' | 'PLAYER' | null;  // Tipo origen (null para MINT)
   toUserId: string;                  // ID usuario destino
   toUserType: 'BACKOFFICE' | 'PLAYER';  // Tipo destino
   amount: number;                    // Monto en formato decimal
   transactionType: TransactionType;  // Tipo de transacción
   idempotencyKey: string;            // Clave de idempotencia (REQUERIDO)
   description?: string;              // Descripción opcional
}

// Request para rollback
export interface RollbackTransactionRequest {
   externalRef: string;           // Referencia externa de la transacción a revertir
}

export interface TransactionFilters {
   page?: number;                 // Número de página (default: 1)
   pageSize?: number;             // Elementos por página (default: 20, max: 100)
   playerId?: string;             // Filtrar por jugador específico
   userId?: string;               // Alias para playerId (retrocompatibilidad)
   transactionType?: TransactionType;  // Filtrar por tipo de transacción
   fromDate?: string;             // Fecha desde (ISO 8601)
   toDate?: string;               // Fecha hasta (ISO 8601)
   externalRef?: string;          // Buscar por referencia externa
   globalScope?: boolean;         // Ver todas las brands (solo SUPER_ADMIN)
}

export interface UserBalanceResponse {
   userId: string;
   userType: 'BACKOFFICE' | 'PLAYER';
   username: string;
   balance: number;
   role?: string;
   brandId?: string;
   brandName?: string;
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

// User Tree types
export enum UserType {
   BACKOFFICE = 'BACKOFFICE',
   PLAYER = 'PLAYER',
}

export interface UserTreeNode {
   id: string;
   username: string;
   userType: UserType;
   role: BackofficeRole | null;
   status: EntityStatus;
   createdAt: string;
   balance: number;
   commissionPercent: number | null;
   hasChildren: boolean;
   directChildrenCount: number;
   children: UserTreeNode[] | null;
}

export interface UserTreeResponse {
   rootUserId: string;
   rootUsername: string;
   rootUserType: UserType;
   role: BackofficeRole | null;
   tree: UserTreeNode;
}

export interface UserTreeParams {
   userId: string;
   maxDepth?: number;
   includeInactive?: boolean;
}
// Re-export brand assets types
export * from './brandAssets';
