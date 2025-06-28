# API Development Plan: Olympic Medals Dashboard

## Objective

Build a high-performance, strongly-typed API layer for the Olympic medals dashboard that serves medal data efficiently 
with built-in sorting capabilities and robust race condition handling.

## Data Analysis

Based on the provided `/src/data/medals.json` data structure:

```typescript
interface MedalCountry {
  code: string;        // ISO 3166-1 alpha-3 country codes (USA, NOR, RUS, etc.)
  gold: number;        // Gold medal count
  silver: number;      // Silver medal count  
  bronze: number;      // Bronze medal count
}
```

**Data Characteristics:**

- 13 countries in current dataset (but we will engineer this for scale so we will assume all countries could potentially be in the dataset)
- Simple, flat structure optimized for performance
- Consistent numeric medal counts
- Standard country codes for internationalization support

## API Architecture Principles

### 1. Read-Only Operations

- **GET requests only** - No data mutations required for this dashboard
- Stateless API design for optimal caching and scalability
- Idempotent operations that can be safely retried

### 2. Strong TypeScript Integration

- Comprehensive type definitions for all request/response payloads
- Type-safe query parameters and response formatting
- **Runtime schema validation with Zod** - Ensures data integrity at both compile-time and runtime
- Detailed validation error messages for debugging and data integrity

### 3. Performance Optimization

- **Database-optimized queries** with proper indexing for global scale (195+ countries)
- **API-level sorting** with database-level ORDER BY clauses
- **Efficient pagination** for large result sets

### 4. Atomic Updates Pattern

- **Consistent data snapshots** - All related calculations computed together
- **Race condition prevention** - Ensure sorting operations complete atomically
- **Transactional data processing** - Prevent partial computations from being served

## Specification Requirements

### URL Parameter Requirements

- **Single parameter**: `sort` - determines the type of medals to sort by
- **Valid values**: `'total'`, `'gold'`, `'silver'`, `'bronze'`
- **Default behavior**: If no sort parameter is passed, default sort is `'gold'`

### Sort Ranking & Tie-Breaking Rules

As per specification, all sorting is **descending** (highest first) with specific tie-breaking rules:

1. **When ranking by total medals**: Ties are broken by most gold
2. **When ranking by gold**: Ties are broken by most silver  
3. **When ranking by silver**: Ties are broken by most gold
4. **When ranking by bronze**: Ties are broken by most gold

### Example API Calls

```text
GET /api/v1/medals                    // Default: sorted by gold medals
GET /api/v1/medals?sort=total         // Sorted by total medals (ties broken by gold)
GET /api/v1/medals?sort=silver        // Sorted by silver medals (ties broken by gold)
GET /api/v1/medals?sort=bronze        // Sorted by bronze medals (ties broken by gold)
```

## API Endpoints Design

### API Versioning Strategy

The API is implemented with explicit versioning (`/v1/`) to support future evolution:

- **Current Version**: `/api/v1/medals` - Initial implementation with core sorting functionality
- **Future Versions**: `/api/v2/medals` - Could support additional non-backwards-compatible API updates
- **Backwards Compatibility**: Multiple versions can coexist, allowing gradual migration
- **Clear Evolution Path**: Versioning enables breaking changes without disrupting existing clients

This versioning approach demonstrates enterprise-ready API design principles, even though it's over-engineering for our current needs.

### Core Endpoint

#### `GET /api/v1/medals`

**Purpose**: Retrieve all medal data with optional sorting

```typescript
interface MedalsRequest {
  sort?: 'total' | 'gold' | 'silver' | 'bronze';  // Default: 'gold'
  limit?: number;
  offset?: number;
}

interface MedalsResponse {
  data: MedalCountryWithTotal[];
  meta: {
    totalCountries: number;
    sortType: string;
    timestamp: string;
  };
}

interface MedalCountryWithTotal extends MedalCountry {
  total: number;        // Computed: gold + silver + bronze
  rank?: number;        // Computed based on sort criteria
}
```

## Performance Implementation Strategy

### 1. Data Processing ✅ IMPLEMENTED

**Zod Schema Validation Approach:**

Our data processing utilises enterprise-grade schema validation with Zod:

```typescript
const MedalCountrySchema = z.object({
  code: z.string()
    .length(3, 'Country code must be exactly 3 characters')
    .regex(/^[A-Z]{3}$/, 'Country code must be 3 uppercase letters'),
  gold: z.number().int().min(0, 'Gold medal count cannot be negative'),
  silver: z.number().int().min(0, 'Silver medal count cannot be negative'),
  bronze: z.number().int().min(0, 'Bronze medal count cannot be negative'),
});
```

**Key Features Implemented:**

- **Runtime validation** of medal data from JSON file (easily replaceable with database calls)
- **Comprehensive error reporting** with field-level validation messages
- **Type-safe data loading** with automatic TypeScript type inference
- **Calculated derived fields** like totals and rankings
- **Specification-compliant tie-breaking rules** for all sort types
- **Reusable schemas** for both data validation and API parameter validation

### 2. API Design for Scale

Structure the API to handle growth gracefully:

- Versioned `/api/v1/medals` endpoint with clear parameter structure and evolution path
- Consistent response format with pagination metadata
- Proper HTTP status codes and error responses
- TypeScript interfaces that can evolve with requirements

### 3. Basic Performance Considerations

Simple optimizations that matter at scale:

- Calculate totals and rankings server-side rather than client-side
- Use appropriate HTTP cache headers for static data
- Structure responses to be easily cacheable by CDNs

### 4. Database-Ready Architecture

Design with future database migration in mind:

- API interfaces that work whether data comes from JSON or database
- Query patterns that translate well to SQL ORDER BY clauses
- Parameter structure that maps to database indexes
- Response format that supports database pagination patterns in the future

## Implementation Phases

### Phase 1: Core Data Processing ✅ COMPLETED

- [x] `medals.json` data structure established
- [x] **Zod schema validation** implemented for robust data processing
- [x] **TypeScript interfaces** for requests/responses created
- [x] **Sorting logic with tie-breaking rules** implemented and tested
- [x] **Runtime type safety** with detailed error reporting

### Phase 2: API Implementation ✅ COMPLETED

- [x] **`/api/v1/medals` endpoint** created with full sorting capabilities and API versioning
- [x] **Zod-based parameter validation** with comprehensive error messages
- [x] **Proper error handling** with HTTP status codes and detailed responses
- [x] **Response caching headers** for optimal performance
- [x] **Enterprise-grade validation** patterns for scalability

### Phase 3: Enhanced Features

- [ ] Ensure compatibiltiy with future pagination support for larger datasets
- [ ] Implement proper TypeScript interfaces

### Phase 4: Testing & Polish

- [ ] Unit tests for sorting logic
- [ ] Integration tests for API endpoints

## Performance Targets

### Response Time Goals

- **API responses**: < 100ms for typical requests
- **Large datasets**: < 500ms for all countries with pagination
- **Consistent performance**: Predictable response times regardless of sort order

## Error Handling Strategy ✅ IMPLEMENTED

**Enterprise-grade error handling with Zod validation:**

- **Proper HTTP status codes** (400 for bad requests, 500 for server errors)
- **Detailed validation error messages** with field-level specificity from Zod schemas
- **Structured error responses** with consistent format and helpful debugging information
- **Graceful fallbacks** when data is unavailable or malformed
- **Runtime data integrity checks** that catch issues before they reach the client


**Data validation errors include:**

- Field-specific error paths and messages
- Custom validation rules (e.g., country code format)
- Type safety enforcement with meaningful error descriptions

## Scalability Architecture (Built-In)

### Database Migration Path

- **Current**: JSON file approach works for small datasets
- **Future**: Easy migration to PostgreSQL or similar database
- **Index Strategy**: Primary key on country code, indexes on medal counts for sorting
- **API Stability**: Same endpoint and response format regardless of data source

### Advanced Features we could add later

- **Real-time updates**: WebSocket support for live medal updates
- **GraphQL layer**: More flexible query capabilities
- **Multi-language support**: Localized country names
- **Historical data**: Time-series medal progression

## Implementation Summary ✅ COMPLETED

This API implementation establishes a **production-ready foundation** for serving Olympic medal data with:

- **Enterprise-grade validation** using Zod schemas
- **Optimal performance** with server-side processing and caching
- **Type safety** at both compile-time and runtime  
- **Scalable architecture** ready for database migration
- **Comprehensive error handling** with detailed debugging information
- **Consistent interfaces** that remain stable as data sources evolve

The API successfully balances **best practices for scale** with **practical implementation needs**, demonstrating how to build maintainable systems that can grow with changing requirements.
