# Agent strategy

The primary agent is responsible for architecture, planning, integration, and final review.

Use subagents deliberately. Do not use the strongest model for every implementation step when the problem has already been reduced to a clear specification.

## Planning and architecture

Keep work with the primary agent when:

- Architectural decisions are required.
- Requirements are ambiguous.
- Multiple competing approaches need evaluation.
- A change crosses several systems with unclear consequences.
- A bug appears to expose a deeper design or architectural problem.
- Subagent work needs integration or final review.

## Delegate implementation to `luna_worker`

Delegate to `luna_worker` when:

- The architecture has already been decided.
- The task has clear acceptance criteria.
- The relevant files or subsystem are known.
- The work is primarily implementation rather than design.
- The task is repetitive, mechanical, or easy to validate.
- Tests can clearly determine whether the result is correct.

Examples include:

- Implementing a component from an existing plan.
- Adding tests for already-defined behavior.
- Performing repetitive refactors.
- Updating documentation.
- Fixing straightforward bugs with an identified cause.

## Debugging escalation

Let `luna_worker` handle ordinary implementation bugs first.

If Luna is repeating the same hypothesis or is unable to resolve the problem after reasonable attempts:

1. Stop repeating the same debugging approach.
2. Gather the error, relevant logs, attempted fixes, and affected files.
3. Delegate the problem to `terra_debugger` for a fresh analysis.
4. Ask `terra_debugger` to identify the likely root cause before making broad changes.
5. Escalate back to the primary agent if the problem appears architectural, crosses multiple systems, or requires reconsidering the implementation plan.

## Delegation rules

When delegating work:

1. Give the subagent a bounded objective.
2. Include relevant architectural decisions and constraints.
3. Identify the expected files or subsystem when possible.
4. Define acceptance criteria.
5. Specify the tests or validation that should be run.
6. Ask for a concise summary of changes, evidence, and unresolved issues.

The primary agent reviews returned work before treating the task as complete.

## Parallel work

Prefer parallel subagents for independent, read-heavy work such as:

- Codebase exploration.
- Test analysis.
- Log analysis.
- Documentation research.
- Locating related implementations.

Avoid having multiple agents edit overlapping files at the same time unless there is a clear reason to do so.
