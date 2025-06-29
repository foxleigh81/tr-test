# Integration Plan: Olympic Medals Dashboard Components

## Objective

Integrate the existing `@/components/data-display/table-heading` and `@/components/data-display/table-row` components into
a complete, functioning Olympic medals dashboard with server-side initial data loading and client-side sorting capabilities.

## Requirements Analysis

### Functional Requirements

1. **Server-Side Initial Data Loading**
   - Fetch medal data on server using existing `/api/v1/medals` endpoint
   - Respect URL `sort` parameter for initial data ordering
   - Single data fetch per page load for optimal performance

2. **Client-Side Table Display**
   - Centrally aligned table layout using existing components
   - `TableHeading` component for sortable column headers
   - `TableRow` components for each country's medal data
   - Responsive design that works across device sizes

3. **Client-Side Sorting Without Refetch**
   - Click handlers on `TableHeading` to trigger client-side re-sorting
   - No API calls after initial load - pure client-side data manipulation
   - Sorting logic extracted to `@/utils` for reusability and testing
   - Maintain same tie-breaking rules as server-side API

4. **State Machine for Loading/Error Handling**
   - Clear separation between loading, success, and error states
   - Appropriate ARIA labels for accessibility during loading
   - Graceful error handling for malformed data or network issues
   - Only one state active at a time (no loading + error simultaneously)

### Non-Functional Requirements

- **Performance**: Client-side sorting should be instantaneous
- **Accessibility**: Proper ARIA states during loading and error conditions
- **SEO**: Server-side rendering with initial data for better search indexing
- **Maintainability**: Clear separation of concerns between server/client logic

## Technical Architecture

### Component Structure

```text

app/page.tsx (instant redirect to dashboard page)

app/dashboard/page.tsx (Server Component)
├── Fetches initial data from /api/v1/medals?sort={urlParam}
├── Passes data to client component
└── Handles server-side errors

app/dashboard/DashboardClient.tsx (Client Component)
├── Receives initial data as props
├── Manages client-side sorting state
├── Handles loading/error state machine
├── Renders table with existing components
│   ├── TableHeading (sort handlers)
│   └── TableRow[] (data display)
└── Implements optimistic UI updates
```

### Data Flow Pattern

1. **Initial Load**: Server → API → Client Component (props)
2. **Sorting**: Client State → Utils Function → Re-render
3. **Error/Loading**: State Machine → UI State → ARIA Labels

### State Management Strategy

**State Machine States:**

- `loading`: Initial or refetch data loading
- `success`: Data loaded successfully, displaying table
- `error`: Error occurred, displaying error message

**Client State:**

- Current sort type (`gold`, `silver`, `bronze`, `total`)
- Current medal data (sorted array)
- UI state (loading/success/error)
- Error message (if applicable)

## Implementation Phases

### Phase 1: Server Component Setup ✅ Prerequisites Met

**Existing Foundation:**

- [x] `/api/v1/medals` endpoint with sort parameter support
- [x] Zod validation and error handling in API layer
- [x] TypeScript interfaces for medal data

**Implementation Tasks:**

- [ ] Create `/app/dashboard/page.tsx` server component
- [ ] Implement URL parameter reading for initial sort
- [ ] Server-side data fetching with error handling
- [ ] Props interface for passing data to client component

### Phase 2: Client Component Architecture

**Core Client Component:**

- [ ] Create `/app/dashboard/DashboardClient.tsx`
- [ ] Implement state machine for loading/success/error states
- [ ] Props interface for receiving server data
- [ ] Central table layout with responsive design

**State Management:**

- [ ] Client-side state for current sort type
- [ ] Sorted data array state
- [ ] UI state machine implementation
- [ ] Error state handling with user-friendly messages

### Phase 3: Client-Side Sorting Logic

**Utility Function Development:**

- [ ] Create `/src/utils/client-sorting.ts`
- [ ] Implement sorting function matching server-side tie-breaking rules
- [ ] Function signature: `sortMedalDataClient(data, sortType) => sortedData`
- [ ] Pure function for predictable testing

**Component Integration:**

- [ ] Connect `TableHeading` onSort callbacks to client sorting
- [ ] Implement optimistic UI updates
- [ ] Handle sorting state transitions
- [ ] Maintain consistent sort indicators

**Testing Requirements:**

- [ ] Unit tests for client sorting utility
- [ ] Test all sort types (`gold`, `silver`, `bronze`, `total`)
- [ ] Test tie-breaking rules match server implementation
- [ ] Edge cases: empty data, single country, ties

### Phase 4: Loading and Error States

**Loading State Implementation:**

- [ ] Loading skeleton during initial data fetch
- [ ] ARIA live regions for screen reader announcements
- [ ] Prevent user interaction during loading states
- [ ] Graceful transition from loading to success/error

**Error State Handling:**

- [ ] Network error detection and user-friendly messages
- [ ] Data validation error handling
- [ ] Retry mechanisms where appropriate
- [ ] ARIA error announcements

**State Machine Logic:**

```typescript
type UIState = 'loading' | 'success' | 'error';

// Only one state active at a time
// Clear transitions between states
// Proper cleanup on state changes
```

## Technical Implementation Details

### Server-Side Data Fetching

**URL Parameter Handling:**

```typescript
// In server component
const searchParams = useSearchParams();
const sortParam = searchParams.get('sort') || 'gold';
const validatedSort = isValidSortType(sortParam) ? sortParam : 'gold';
```

**Error Boundary Strategy:**

- Server component catches API errors
- Passes error state to client component as props
- Client component handles error display
- Graceful degradation if API is unavailable

### Client-Side Sorting Implementation

**Utility Function Requirements:**

- Pure function for predictable behaviour
- Same tie-breaking logic as server-side API
- TypeScript types matching existing interfaces
- Performance optimized for typical dataset sizes

**Expected Function Signature:**

```typescript
export function sortMedalDataClient(
  data: MedalCountryWithTotal[],
  sortType: MedalSortType
): MedalCountryWithTotal[]
```

### State Machine Implementation

**State Transitions:**

- `loading` → `success` (data loaded successfully)
- `loading` → `error` (data loading failed)
- `success` → `loading` (manual refresh/retry)
- `error` → `loading` (retry attempt)

**State Management:**

```typescript
type DashboardState = {
  ui: 'loading' | 'success' | 'error';
  data: MedalCountryWithTotal[];
  sortType: MedalSortType;
  error?: string;
};
```

## Accessibility Considerations

### ARIA Implementation

**Loading States:**

- `aria-live="polite"` for loading announcements
- `aria-busy="true"` during data operations
- Loading spinners with `aria-label`

**Error States:**

- `aria-live="assertive"` for error announcements
- `role="alert"` for critical error messages
- Descriptive error messages for screen readers

**Table Accessibility:**

- `role="table"` with proper `thead`/`tbody` structure
- Column headers with appropriate `scope` attributes
- Sort state announced via `aria-sort`

### Keyboard Navigation

- Existing `TableHeading` keyboard support maintained
- Focus management during state transitions
- Skip links for large data tables

## Performance Considerations

### Client-Side Sorting Performance

- Efficient sorting algorithm for typical dataset sizes (13-200 countries)
- Avoid unnecessary re-renders during sorting
- Memoization of sorted results where beneficial

### Loading State Performance

- Skeleton loaders instead of blank states
- Progressive enhancement approach
- Optimistic UI updates for perceived performance

## Integration with Existing Architecture

### Component Compatibility

**Existing Components:**

- `TableHeading`: Already implements sort callbacks and optimistic updates
- `TableRow`: Already handles data validation and error states
- `CountryFlag`: Already integrated in table rows
- `Medal`: Already used in table headings

**Utility Functions:**

- Server-side sorting: `/src/utils/medals.ts`
- Client-side sorting: `/src/utils/client-sorting.ts` (new)
- Country validation: `/src/utils/countries.ts`

### API Integration

- Leverage existing `/api/v1/medals` endpoint
- Maintain consistent data format between server/client
- Use existing Zod schemas for data validation

## Success Criteria

### Functional Success

- [ ] Page loads with server-rendered initial data
- [ ] URL sort parameter correctly influences initial sort
- [ ] Client-side sorting works without API calls
- [ ] All loading/error states display correctly
- [ ] State machine prevents invalid state combinations

### Performance Success

- [ ] Initial page load under 2 seconds
- [ ] Client-side sorting under 100ms
- [ ] Smooth transitions between states
- [ ] No unnecessary re-renders

### Accessibility Success

- [ ] All ARIA states correctly announced
- [ ] Keyboard navigation fully functional
- [ ] Screen reader compatibility verified
- [ ] Loading states clearly communicated

## Risk Mitigation

### Data Synchronization

**Risk**: Client-side sorting differs from server-side sorting
**Mitigation**: Shared sorting logic testing, identical tie-breaking rules

### State Management Complexity

**Risk**: Complex state transitions leading to bugs
**Mitigation**: Simple state machine, comprehensive testing, clear state flow

### Performance with Large Datasets

**Risk**: Client-side sorting becomes slow with many countries
**Mitigation**: Performance testing, fallback to server-side sorting if needed

This integration plan provides a clear roadmap for combining our existing components into a complete, accessible, and performant dashboard application while maintaining the architectural principles established in our component-driven development approach. 
