# Planfiles

## What are Planfiles?

Planfiles are simple Markdown documents where developers and AI assistants collaborate to hash out a game plan **before**
diving into coding. Think of a planfile as a living blueprint for whatever feature or project you're tackling.

As described in [Use planfiles to assist your AI with your work](https://www.foxleigh.me/technically-minded/use-planfiles-to-assist-your-ai-with-your-work),
planfiles serve as a crucial bridge between human intent and AI execution, ensuring both parties are aligned on requirements,
constraints, and implementation details.

Note: I only use planfiles for working out complexity, so you will not see planfiles here for simpler things that I can 
build without having to plan in advance.

## How Planfiles Work

The typical planfile workflow involves two phases:

### Phase 1: AI-Generated Draft

Start by asking your AI assistant to create a rough plan in a separate Markdown file, explicitly stating 
"do not start writing any code yet." This prevents the AI from jumping straight to implementation without proper planning.

Generally, I will give the AI some specific rules to follow in the prompt. For example the prompt I used to create the
[Architecture plan](./architecture-plan.planfile.md) was as follows:

```text
Please populate @docs/planfiles/architecture-plan.planfile.md with the initial plan for the application architecture. Please
review each file @docs/adrs to assess what we have already set up and document it here as already completed boilerplate work.

We are building an application to display a dashboard to show Olympic medals. We have been provided with a set of mock data to work with. We will need to set up a next API to utilise this.

This part of the plan should talk about how we are going to architect the application to use the following:

- Component-driven (or storybook-driven) development
- Atomic updates
- SOLID principles
- DRY principles

We will have a `/src/components` directory which will store all of our pure function components. I'll flesh this structure out further in the planfile.
```

### Phase 2: Human Refinement

Review and edit the AI-generated plan, correcting assumptions, adding project-specific details, and filling in constraints 
that only you as the developer would know (file paths, existing components, design system rules, etc.).

## Why Planfiles Make AI Collaboration Better

- **Shared Context**: Acts as external memory for AI models with limited context windows
- **Eliminates Vague Assumptions**: Prevents AI from inventing non-existent functions or database fields
- **Consistency Across Sessions**: Maintains implementation consistency even when starting fresh chats
- **Better Collaboration**: Provides human-readable documentation for team review
- **Historical Context**: Documents the reasoning behind architectural decisions
- **Iterative Improvement**: Can be updated with learnings after implementation

## Why These Planfiles Are Included in the Repository

Typically, planfiles are stored in a `.gitignore`d directory as they're considered working documents. However,
I'm explicitly including them in this repository for two important reasons:

### a) Transparency About AI Assistance

I want to be completely transparent that I used AI assistance to create this project as this is generally how I work these days.
These planfiles serve as evidence of the collaborative planning process between human expertise and AI capabilities,
showing how the two can work together effectively.

### b) Documentation of Planning Process

These planfiles document the actual planning and architectural thinking that went into building this application. They provide insight into:

- How features were conceptualised
- What constraints and requirements were considered
- Why certain technical decisions were made
- How the overall architecture evolved

## Structure

Each planfile typically includes:

- **Objective**: What we're trying to build
- **Requirements**: Functional and non-functional requirements
- **Constraints**: Technical limitations, existing patterns to follow
- **Architecture**: High-level design decisions
- **Implementation Phases**: Step-by-step breakdown of development
- **Success Criteria**: How to know when the feature is complete

## Reading These Planfiles

When reviewing these planfiles, you may notice they evolve from initial AI drafts to refined plans incorporating domain
knowledge and project-specific constraints. This evolution demonstrates the collaborative nature of modern AI-assisted
development and the importance of human oversight in the planning process.

These documents serve as both a historical record of the project's development and a practical example of how planfiles 
can be used to guide AI-assisted development effectively.
