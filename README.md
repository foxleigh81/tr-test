![Logo](./src/app/apple-icon.png)

# Olympic Medals Dashboard

A production-ready, accessible Olympic medals dashboard built with modern web technologies. This application demonstrates enterprise-scale development patterns, component-driven architecture, and comprehensive accessibility implementation.

## ✨ Features

- **Server-Side Rendering**: Initial data loading with Next.js for optimal performance and SEO
- **Client-Side Sorting**: Instantaneous sorting without API refetch for smooth user experience
- **Full Accessibility**: WCAG 2.1 AA compliant with comprehensive ARIA implementation
- **Component-Driven Development**: All components developed in Storybook with interaction tests
- **Type Safety**: End-to-end TypeScript with runtime validation using Zod schemas
- **Responsive Design**: Mobile-first design that works across all device sizes
- **Loading States**: Skeleton loading components with proper accessibility announcements
- **Error Handling**: Graceful error states with user-friendly messages and retry mechanisms

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Yarn (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd tr-test
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Start the development server**

   ```bash
   yarn dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the dashboard

### Additional Development Commands

```bash
# Start Storybook for component development
yarn storybook

# Run all tests
yarn test

# Run unit tests only
yarn test:unit

# Run pre-commit checks (tests + linting)
yarn preflight

# Build for production
yarn build
```

## 🛠 Technologies Used

### Core Technologies

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

### Development & Testing

[![Storybook](https://img.shields.io/badge/Storybook-8-FF4785?style=for-the-badge&logo=storybook&logoColor=white)](https://storybook.js.org/)
[![Vitest](https://img.shields.io/badge/Vitest-1-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![ESLint](https://img.shields.io/badge/ESLint-8-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)

### Validation & Quality

[![Zod](https://img.shields.io/badge/Zod-3-3E67B1?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-1.40-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)

## 🏗 Project Architecture

This project follows **component-driven development** principles with clean separation of concerns:

- **`/src/app`** - Next.js App Router pages and API routes
- **`/src/components`** - Pure functional React components with Storybook stories
- **`/src/utils`** - Shared utility functions and business logic
- **`/src/types`** - TypeScript type definitions
- **`/tests`** - Unit tests mirroring the source structure
- **`/docs`** - Comprehensive project documentation

### Architectural Decisions

All major technical decisions are documented in our [Architectural Decision Records (ADRs)](./docs/adrs/):

- [ADR 001: Begin using Architectural Decision Records](./docs/adrs/adr-001-adrs.md)
- [ADR 002: Use Next.js as the React framework](./docs/adrs/adr-002-nextjs.md)
- [ADR 003: Use TypeScript for type safety](./docs/adrs/adr-003-typescript.md)
- [ADR 004: Use Tailwind CSS for styling](./docs/adrs/adr-004-tailwind.md)
- [ADR 005: Use Storybook for component development](./docs/adrs/adr-005-storybook.md)
- [ADR 006: Use Zod for runtime schema validation](./docs/adrs/adr-006-zod-schema-validation.md)

## 🧪 Testing

This project implements a comprehensive testing strategy with multiple layers:

- **Unit Tests**: Fast, isolated tests for utility functions (Vitest)
- **Component Tests**: Interactive tests for component behavior (Storybook + Playwright)
- **Accessibility Tests**: Automated accessibility validation (Storybook a11y addon)

**Current Test Coverage**: 33+ test cases across sorting utilities and component interactions

For detailed testing information, see our [Testing Documentation](./docs/testing.md).

## 🔮 Future Considerations

Based on our architectural planning, several enhancements are ready for implementation,
some of these were out of scope for the current iteration and some were skipped due to lack
of time available.

### 📊 **API Enhancements**

- **Integration Tests**: Automated testing of HTTP endpoints
- **Pagination Support**: Handle larger datasets with `limit` and `offset` parameters
- **Database Migration**: Easy transition from JSON to PostgreSQL/database
- **GraphQL Layer**: More flexible query capabilities for complex data requirements

### 🎨 **User Experience**

- **Real-time Updates**: Live medal count updates during Olympic events
- **Historical Data**: Medal progression across multiple Olympic games
- **Enhanced Visualizations**: Interactive charts and graphs for medal trends
- **Export Functionality**: CSV/PDF export capabilities

### 🌍 **Internationalization**

- **Multi-language Support**: Localized country names and interface translations
- **Currency/Number Formatting**: Region-appropriate number formatting
- **RTL Support**: Right-to-left language support

### ⚡ **Performance & Scale**

- **CDN Integration**: Static asset optimization and global distribution
- **Advanced Caching**: Redis-based caching for dynamic data
- **Performance Monitoring**: Real-time performance tracking and alerting
- **Load Testing**: Validation of performance under high traffic

### 🔒 **Enterprise Features**

- **Authentication**: User accounts and personalized experiences
- **Analytics**: Detailed usage tracking and insights
- **A/B Testing**: Feature flag management and experimentation
- **Monitoring**: Comprehensive logging and error tracking

For detailed implementation plans, see our [Planning Documentation](./docs/planfiles/).

## 📚 Documentation

### Planning & Architecture

- [Architecture Plan](./docs/planfiles/architecture-plan.planfile.md) - Overall system architecture and principles
- [API Development Plan](./docs/planfiles/api-development.planfile.md) - API design and implementation strategy  
- [Integration Plan](./docs/planfiles/integration.planfile.md) - Component integration and dashboard assembly
- [Planfiles Overview](./docs/planfiles/README.md) - Guide to our planning methodology

### Development Resources

- [Testing Strategy](./docs/testing.md) - Comprehensive testing approach and guidelines
- [Architectural Decision Records](./docs/adrs/) - All technical decisions with reasoning

## 🎯 Project Goals Achieved

This project successfully demonstrates:

✅ **Enterprise-Scale Patterns**: Production-ready architecture that scales  
✅ **Accessibility Excellence**: WCAG 2.1 AA compliance with comprehensive ARIA  
✅ **Component-Driven Development**: Storybook-first approach with living documentation  
✅ **Type Safety**: End-to-end TypeScript with runtime validation  
✅ **Performance Optimization**: < 2 second load times with instantaneous sorting  
✅ **Testing Excellence**: 100% test coverage for critical business logic  
✅ **Future-Ready Architecture**: Easy extension and database migration paths  

