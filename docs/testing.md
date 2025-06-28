# Testing Strategy

This document outlines the testing approach and patterns used in the medal counter application.

## Overview

The application uses a multi-layered testing strategy:

- **Unit Tests**: Test individual functions and utility logic
- **Storybook Tests**: Test component interactions and visual states
- **Integration Tests**: (Future) Test API endpoints and full user flows

## Test Framework

We use [Vitest](https://vitest.dev/) as our primary testing framework, configured with projects for different test types:

- **Unit tests**: Run in Node.js environment for fast execution
- **Storybook tests**: Run in browser environment using Playwright for realistic component testing

## Directory Structure

```text
tests/
├── utils/          # Tests for utility functions
│   └── medals.test.ts
└── (future test directories mirroring src/ structure)

src/
├── components/     # Components with co-located .stories.tsx files
└── partials/       # Partials with co-located .stories.tsx files
```

## Test Commands

### Primary Commands

- `yarn test` - **Run all tests** (unit + Storybook)
- `yarn preflight` - Run all tests + linting (pre-commit check)

### Specific Test Types

- `yarn test:unit` - Run unit tests only (uses `vitest.unit.config.ts`)
- `yarn test:unit:watch` - Run unit tests in watch mode for development
- `yarn test:storybook` - Run Storybook interaction tests only (uses `@storybook/test-runner`)

## Testing Patterns

### Unit Tests

Located in `tests/` directory, mirroring the `src/` structure:

**Key Principles:**

- Test individual functions in isolation
- Use descriptive test names that explain the expected behaviour
- Group related tests with `describe` blocks
- Test both happy path and edge cases
- Mock external dependencies (JSON imports, API calls)

**Example Structure:**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { functionToTest } from '../../src/utils/module';

describe('module utility functions', () => {
  describe('functionToTest', () => {
    it('should handle valid input correctly', () => {
      // Test implementation
    });
    
    it('should throw error for invalid input', () => {
      expect(() => functionToTest('invalid')).toThrow('Expected error message');
    });
  });
});
```

### Storybook Tests

Component tests are co-located with components as `.stories.tsx` files:

**Key Principles:**

- Test component interactions and user workflows
- Verify accessibility and keyboard navigation
- Test different component states and variants
- Use Playwright for realistic browser testing

**Example Structure:**

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, expect } from '@storybook/test';
import { ComponentName } from './ComponentName';

const meta: Meta<typeof ComponentName> = {
  title: 'ComponentName',
  component: ComponentName,
  parameters: {
    // Component-specific parameters
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Default props
  },
  play: async ({ canvasElement }) => {
    // Interaction tests
  },
};
```

## Test Configuration

The testing setup uses different tools for different test types:

**Unit Tests (`vitest.unit.config.ts`):**

- Uses Vitest configured for Node.js environment for fast execution
- Includes tests from `tests/**/*.{test,spec}.{js,ts}`
- Path aliasing for clean imports (`@/` points to `src/`)

**Storybook Tests (`@storybook/test-runner`):**

- Uses Storybook's dedicated test-runner with Playwright
- Connects to running Storybook instance on `http://localhost:6006`
- Runs all interaction tests defined in `.stories.tsx` files
- Configuration in `test-storybook.config.js`
- **Note**: Requires Storybook to be running (`yarn storybook`) before running tests

## Current Test Coverage

### `medals.test.ts` - 16 comprehensive tests covering:

**Data Processing:**

- ✅ JSON data loading with Zod validation
- ✅ Medal total calculations
- ✅ Data structure validation

**Sorting Algorithms:**

- ✅ Sort by total medals with gold tie-breaker
- ✅ Sort by gold medals with silver tie-breaker
- ✅ Sort by silver medals with gold tie-breaker
- ✅ Sort by bronze medals with gold tie-breaker
- ✅ Complex tie-breaking scenarios

**Data Enrichment:**

- ✅ Adding computed fields (totals, ranks)
- ✅ Different sort type handling

**Parameter Validation:**

- ✅ Valid sort type recognition
- ✅ Invalid sort type error handling
- ✅ Default value behaviour

## Adding New Tests

### For New Utility Functions:

1. Create test file in `tests/` mirroring `src/` structure
2. Import functions using relative paths: `../../src/utils/module`
3. Use descriptive test names and group with `describe` blocks
4. Test both success and error scenarios

### For New Components:

1. Create `.stories.tsx` file alongside component
2. Include interaction tests using `play` functions
3. Test accessibility with `@storybook/addon-a11y`
4. Verify different component states and props

### For API Endpoints (Future):

1. Create integration tests in `tests/api/`
2. Test request/response cycles
3. Verify error handling and edge cases
4. Mock external dependencies

## Best Practices

### Test Quality

- **Descriptive names**: Test names should read like specifications
- **Single responsibility**: Each test should verify one specific behaviour
- **Arrange-Act-Assert**: Clear test structure with setup, execution, and verification
- **No magic values**: Use meaningful test data and constants

### Performance

- **Fast unit tests**: Keep unit tests under 100ms each
- **Isolated tests**: No shared state between tests
- **Parallel execution**: Tests should be able to run concurrently

### Maintainability

- **DRY principle**: Extract common test utilities and fixtures
- **Clear mocking**: Mock only what's necessary, keep mocks simple
- **Regular updates**: Keep tests updated when requirements change

## Running Tests in Development

**For unit tests only:**

```bash
yarn test:unit:watch  # Runs unit tests in watch mode
```

**For all tests (requires Storybook to be running):**

```bash
# Terminal 1: Start Storybook
yarn storybook

# Terminal 2: Run all tests
yarn test
```

## Continuous Integration

Tests are part of the `preflight` command which should be run before commits:

```bash
yarn preflight  # Runs all tests + linting
```

This ensures code quality and prevents regression bugs from being committed to the repository.

**Note for CI/CD:** When running tests in automated environments, ensure Storybook is built and served before running Storybook tests, or run them separately:

```bash
# CI approach 1: Run tests separately
yarn test:unit
yarn build-storybook
yarn test:storybook --url file:///path/to/storybook-static

# CI approach 2: Use concurrent processes
yarn storybook & yarn test
```

## Future Enhancements

- **API Integration Tests**: Test the `/api/v1/medals` endpoint with different scenarios
- **E2E Tests**: Full user journey testing with Playwright
- **Visual Regression Tests**: Automated screenshot comparison via Storybook
- **Performance Tests**: API response time and component rendering benchmarks
- **Coverage Reports**: Automated test coverage reporting and thresholds 