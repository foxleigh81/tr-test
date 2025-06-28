# ADR 003: Use TypeScript for type safety and developer experience

- **Date created**: 28/06/2025
- **Driver**: Alex Foxleigh (Foxy)

## Status

![accepted]

## Context

While TypeScript was mentioned as a preference in the project specification, this decision would have been made regardless.
In the modern era of JavaScript development, TypeScript has become the sensible choice for almost all projects.

TypeScript provides:

- Static type checking that catches errors at compile time
- Enhanced IDE support with better autocomplete and refactoring
- Self-documenting code through type annotations
- Better maintainability in larger codebases
- Excellent integration with modern tooling and frameworks
- Gradual adoption path from JavaScript

The benefits of TypeScript significantly outweigh the minimal setup overhead, especially for projects that are designed to scale.

## Discussions

- Alex Foxleigh - TypeScript was specified in the requirements, but this aligns perfectly with modern development best
practices. The type safety and developer experience improvements make it an obvious choice for any serious application development.

## Decision

Use TypeScript throughout the project for all JavaScript/TypeScript files.

## Consequences

**Positive:**

- Compile-time error detection reduces runtime bugs
- Enhanced developer experience with better IDE support
- Self-documenting code through type annotations
- Easier refactoring and maintenance as the codebase grows
- Better team collaboration through explicit contracts
- Strong ecosystem support with most libraries providing TypeScript definitions

**Negative:**

- Slight learning curve for developers unfamiliar with TypeScript
- Additional build step and configuration
- Some overhead in writing type annotations, though this pays dividends quickly

[proposed]: https://img.shields.io/badge/Proposed-yellow?style=for-the-badge
[accepted]: https://img.shields.io/badge/Accepted-green?style=for-the-badge
[superceded]: https://img.shields.io/badge/Superceded-orange?style=for-the-badge
[rejected]: https://img.shields.io/badge/Rejected-red?style=for-the-badge
[deprecated]: https://img.shields.io/badge/Deprecated-grey?style=for-the-badge 