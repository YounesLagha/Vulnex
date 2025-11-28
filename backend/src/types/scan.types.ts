// Types spécifiques aux scans de sécurité

import { ID, Timestamp, ScanStatus, SeverityLevel, SecurityGrade } from './common.types';

// Configuration d'un scan
export interface ScanConfig {
    url: string;
    userId?: ID;
    options: ScanOptions;
}

// Options de scan
export interface ScanOptions {
    includeHeaders: boolean;
    includeSsl: boolean;
    includePorts: boolean;
    includeTechnologies: boolean;
    customPorts?: number[];
    timeout?: number;
}

// Entité complète d'un scan (stockée en base de données)
export interface Scan {
    id: ID;
    url: string;
    status: ScanStatus;
    userId?: ID;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    completedAt?: Timestamp;
    results?: ScanResultData;
    error?: string;
}

// Résultats bruts d'un scan
export interface ScanResultData {
    headers?: HeadersScanResult;
    ssl?: SslScanResult;
    ports?: PortsScanResult;
    technologies?: TechnologiesScanResult;
    score?: ScoreData;
    recommendations?: RecommendationData[];
}

// Résultat du scan des headers HTTP
export interface HeadersScanResult {
    score: number;
    scannedAt: Timestamp;
    headers: {
        [headerName: string]: HeaderInfo;
    };
    missingHeaders: string[];
    recommendations: string[];
}

// Information sur un header HTTP
export interface HeaderInfo {
    present: boolean;
    value?: string;
    secure: boolean;
    weight: number;
    recommendation?: string;
}

// Résultat du scan SSL/TLS
export interface SslScanResult {
    score: number;
    grade: SecurityGrade;
    scannedAt: Timestamp;
    hasHttps: boolean;
    certificate?: CertificateInfo;
    protocols: ProtocolInfo[];
    ciphers: CipherInfo[];
    vulnerabilities: VulnerabilityInfo[];
}

// Information sur le certificat SSL
export interface CertificateInfo {
    valid: boolean;
    issuer: string;
    subject: string;
    serialNumber: string;
    validFrom: Timestamp;
    validTo: Timestamp;
    daysUntilExpiration: number;
    selfSigned: boolean;
    signatureAlgorithm: string;
}

// Information sur un protocole SSL/TLS
export interface ProtocolInfo {
    name: string;
    version: string;
    enabled: boolean;
    secure: boolean;
}

// Information sur un cipher
export interface CipherInfo {
    name: string;
    strength: number;
    secure: boolean;
}

// Résultat du scan de ports
export interface PortsScanResult {
    score: number;
    scannedAt: Timestamp;
    totalScanned: number;
    openPorts: OpenPortInfo[];
    closedPorts: number[];
    filteredPorts: number[];
}

// Information sur un port ouvert
export interface OpenPortInfo {
    port: number;
    protocol: 'tcp' | 'udp';
    service: string;
    version?: string;
    state: 'open' | 'filtered' | 'closed';
    risk: SeverityLevel;
    recommendation?: string;
}

// Résultat de la détection de technologies
export interface TechnologiesScanResult {
    score: number;
    scannedAt: Timestamp;
    technologies: TechnologyInfo[];
    frameworks: TechnologyInfo[];
    cms?: TechnologyInfo;
    server?: TechnologyInfo;
    analytics: TechnologyInfo[];
}

// Information sur une technologie détectée
export interface TechnologyInfo {
    name: string;
    version?: string;
    category: string;
    confidence: number;
    icon?: string;
    website?: string;
    outdated?: boolean;
    latestVersion?: string;
    vulnerabilities?: KnownVulnerability[];
}

// Vulnérabilité connue d'une technologie
export interface KnownVulnerability {
    id: string;
    severity: SeverityLevel;
    description: string;
    cveId?: string;
    publishedDate?: Timestamp;
}

// Données du score de sécurité
export interface ScoreData {
    total: number;
    grade: SecurityGrade;
    calculatedAt: Timestamp;
    breakdown: ScoreBreakdownData;
    history?: ScoreHistoryEntry[];
}

// Décomposition détaillée du score
export interface ScoreBreakdownData {
    headers: CategoryScore;
    ssl: CategoryScore;
    ports: CategoryScore;
    technologies: CategoryScore;
    misconfiguration: CategoryScore;
}

// Score par catégorie
export interface CategoryScore {
    score: number;
    maxScore: number;
    weight: number;
    weightedScore: number;
    issues: number;
}

// Entrée d'historique de score
export interface ScoreHistoryEntry {
    date: Timestamp;
    score: number;
    grade: SecurityGrade;
}

// Donnée de recommandation
export interface RecommendationData {
    id: string;
    severity: SeverityLevel;
    category: string;
    title: string;
    description: string;
    solution: string;
    impact: string;
    priority: number;
    resources?: ResourceLink[];
    affectedComponents?: string[];
}

// Lien vers une ressource externe
export interface ResourceLink {
    title: string;
    url: string;
    type: 'documentation' | 'tutorial' | 'tool' | 'article';
}

// Informations de vulnérabilité générique
export interface VulnerabilityInfo {
    id: string;
    name: string;
    severity: SeverityLevel;
    description: string;
    affected?: string;
    fixed?: boolean;
    cveId?: string;
}

// Statistiques d'un scan
export interface ScanStatistics {
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    warningChecks: number;
    duration: number; // en millisecondes
}
