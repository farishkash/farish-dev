---
title: "Your AI Agent Isn’t Riding a Horse: What Exactly Is a Harness?"
description: "The model is only part of an AI agent. The harness is the system around it that manages tools, context, permissions, memory, subagents, and the loop that turns reasoning into action."
published: 2026-09-15
updated: 2026-09-15
draft: false
category: AI in Practice
tags:
  - Agentic AI
  - AI Agents
  - Agent Harnesses
  - Developer Tools
featured: false
---

“Harness” has become one of those words that shows up everywhere in conversations about AI agents.

Agent harness. Coding harness. Agentic harness. Model harness.

Everyone seems to know what it means right up until someone asks them to define it.

And no, your AI agent isn’t riding a horse.

The short version is this:

**The model provides the reasoning. The harness is the system around the model that lets that reasoning become action.**

That distinction matters because we have a tendency to talk about the model as though it is the entire agent.

We say Claude edited the file. GPT ran the command. The coding agent tested the application. The model delegated work to a subagent.

But the model itself is not opening files, launching a shell, keeping a task alive for three hours, deciding which permissions it has, or physically executing a tool call.

Something around the model has to make all of that possible.

That something is the harness.

## Start with a model by itself

The easiest way to understand a harness is to start without one.

At the simplest level, interacting with a language model looks something like this:

```text
Prompt → Model → Response
```

You give the model some input. The model reasons over that input and generates an output.

That can be incredibly useful, but it is still basically a turn.

Now imagine asking the model to fix a bug in an application.

To do that well, it may need to inspect the repository, search for related code, open several files, run the application, reproduce the error, inspect logs, edit a file, run tests, discover that the first fix didn’t work, try something else, and then verify that the final result actually solved the problem.

That is no longer one model response.

It is a sequence of decisions and actions.

A useful simplified view looks more like this:

```text
Goal
  ↓
Harness
  ↓
Model decides what to do
  ↓
Tool call
  ↓
Harness executes the tool
  ↓
Result returns to the model
  ↓
Model decides what to do next
  ↓
...repeat until finished
```

Anthropic has increasingly described agents in similarly simple terms: **LLMs autonomously using tools in a loop.** Their earlier work on building effective agents also describes agents as models using environmental feedback and tools across multiple turns rather than following a single fixed response path.

The loop sounds simple.

Making that loop useful, safe, and reliable is where the harness comes in.

## The model can ask for a tool. The harness actually makes it happen.

This is one of the easiest parts to misunderstand.

A model can produce something that means, in effect:

> Read this file.

Or:

> Run the test suite.

Or:

> Search the web for the current API documentation.

But the model is not reaching into your filesystem or opening a terminal by itself.

The harness receives that requested action, determines whether the model is allowed to perform it, invokes the appropriate tool, captures the result, and puts the relevant information back into the model’s context.

Then the model gets another turn.

OpenAI’s current Agents SDK documentation makes this separation fairly visible. Tools can execute on OpenAI infrastructure, in a local runtime, through functions, through MCP, or even by invoking another agent. The runtime manages the boundary between the model deciding to use a capability and the actual execution of that capability.

That is a big part of what the harness is doing.

The model says **what it wants to do**.

The harness determines **how that action actually happens**.

## So what lives inside a harness?

There is no single standards body defining exactly what must be included before something is allowed to call itself an “agent harness.” Different products expose different pieces, and vendors use the term somewhat differently.

I’m using OpenAI and Anthropic throughout this article because they publish unusually clear descriptions of these systems. The same kinds of responsibilities also show up in frameworks and platforms such as LangGraph, CrewAI, and Google’s Agent Development Kit, even when the terminology or architecture is different.

The easiest way to think about the harness is by grouping its responsibilities.

### Execution

This is the machinery that lets the agent do something outside the model call itself:

- Selecting or invoking the model
- Deciding which tools the model can see
- Executing tool calls
- Providing filesystem, shell, or computer access
- Connecting MCP servers and external APIs
- Running code in a sandboxed environment

### Context and state

This is what keeps the agent oriented while the task grows:

- Supplying system, project, and task instructions
- Tracking conversation and task state
- Constructing and compacting context
- Preserving memory across turns or sessions

### Control

This is where the harness decides what the agent is allowed to do and how it recovers when things go wrong:

- Permissions and approval gates
- Retries and error handling
- Stopping conditions

### Coordination and visibility

This is what makes larger agent systems manageable:

- Subagents and handoffs
- Model routing
- Logging, traces, and observability

That is still a lot, but it is easier to see the pattern once the responsibilities are separated.

OpenAI made that pattern unusually explicit in September 2026 when it introduced the Agents API. The announcement described the harness as the layer that manages context, uses tools efficiently, coordinates subagents, and supports long-running work with files, code, and intermediate results.

Anthropic has been writing about the same problem from another direction. Its work on long-running agents focuses heavily on what the harness needs to do when a task outlives a single context window: preserve progress, manage context, leave useful artifacts, and let a future turn or session continue without effectively starting from zero.

This is why I think “harness” is a useful term.

It reminds us that an agent is a system, not just a model name.

## Context management is part of the harness too

Tools get most of the attention because they are easy to see.

The agent runs a command. It edits a file. It searches the web. Something happened.

Context management is less visible, but it may be even more important.

An agent can generate an enormous amount of information while it works: user instructions, system instructions, tool definitions, file contents, command output, logs, previous decisions, failed attempts, test results, messages from subagents, and everything else it has encountered along the way.

You cannot necessarily keep dumping all of that back into every future model call forever.

Eventually the context becomes too large, too noisy, or both.

A good harness therefore has to decide what the model should see **now**.

That may involve removing stale tool results, summarizing previous work, storing notes outside the active context window, retrieving information only when it becomes relevant, or compacting a long-running session so the agent can continue.

Anthropic calls this broader problem **context engineering** and argues that agent systems need to continuously curate the information available to the model as the agent works. The quality of the reasoning depends heavily on what the surrounding system puts in front of it.

This is one reason two products using the same underlying model can behave very differently.

They may not be giving that model the same context at all.

## A harness is not the same thing as a workflow

This distinction is important because the two terms can sound interchangeable.

The **workflow** describes how you want the work to happen.

The **harness** provides the machinery that allows the work to happen.

For example, in [my previous post about model routing](/writing/stop-using-your-best-coding-model-for-everything), I described a pattern where I might use:

```text
Sol → planning and architecture
Luna → bounded implementation
Terra → a fresh debugging perspective
Sol → architectural escalation and final review
```

That is a workflow and routing strategy.

But something still has to execute it.

The harness may need to start the appropriate subagent, give that agent the relevant instructions and files, expose the right tools, isolate its context, collect its result, return that result to the orchestrator, and let the orchestrator decide what happens next.

So I think about it this way:

```text
Workflow = who should do what, and in what order?
Harness  = how can the system actually make that happen?
```

You can have a very simple workflow inside a sophisticated harness.

You can also build a complicated workflow on top of a poor harness and spend a lot of time wondering why the agents keep losing context, calling the wrong tools, or stepping on each other’s work.

## The harness is also where subagents become real

“Use a subagent” sounds simple when we say it conversationally.

Operationally, quite a bit has to happen.

The parent agent needs some way to invoke another agent. The second agent may need its own instructions, model, context, tool permissions, filesystem boundary, and stopping conditions. Its work may need to happen in parallel with another agent. Its result has to come back in a form the parent can use.

OpenAI’s Agents SDK, for example, supports both handoffs and treating other agents as callable tools. Those are not exactly the same architecture: a handoff changes which agent owns the next part of the run, while an agent-as-tool can start a nested run and return its result to the orchestrator.

That implementation detail is harness behavior.

The model may decide delegation is useful.

The harness is what makes delegation executable.

And this is where the idea from my last post gets more interesting. Model routing does not have to mean I manually stop one chat, open another, paste in the context, and tell a different model to continue.

Routing can become part of the harness itself.

The orchestrator can decide that a task has crossed from architecture into straightforward implementation and delegate it. A debugger can be invoked when another model becomes stuck. A stronger model can regain control when the problem becomes ambiguous or architectural again.

At that point, the model strategy becomes part of the system design.

## Why the same model can feel better in one product than another

This is probably the part I find most useful when evaluating AI tools.

People will sometimes compare two coding products and say:

**They both use the same model, so why does one seem so much better?**

Because you are not really comparing only the model.

You are comparing something closer to:

```text
Model
+ system instructions
+ available tools
+ tool descriptions
+ context strategy
+ search behavior
+ filesystem access
+ execution environment
+ memory
+ permissions
+ retry behavior
+ compaction
+ subagent strategy
+ workflow design
= the experience you actually get
```

Change enough of those pieces and the same underlying model can feel like a completely different product.

One harness may give the model excellent repository search and a clean representation of the codebase. Another may flood the context with irrelevant files.

One may preserve a useful plan across a long task. Another may gradually lose the original goal.

One may expose five clearly differentiated tools. Another may expose fifty overlapping tools and force the model to spend reasoning effort deciding which one it is supposed to use.

One may let an agent test its own work in an isolated environment. Another may only let it suggest code changes.

The model did not change.

The system around it did.

## Better models change what the harness should do

As models improve, some harness logic may become unnecessary.

Anthropic has written about this directly: harnesses often encode assumptions about what a model cannot do, and those assumptions can become stale as models improve. A workaround that was necessary for one generation of models may become actively unhelpful for the next.

So a good harness is not necessarily the one with the most elaborate orchestration.

Sometimes the best thing you can do is remove machinery the model no longer needs.

The interesting design question becomes: **what still needs to be managed outside the model?**

That boundary will keep moving.

A newer model may need less prompting scaffolding, fewer explicit planning stages, or less defensive routing. But real work still has external constraints: tools have permissions, files live somewhere, code needs an execution environment, long tasks need state, and multi-agent work needs coordination.

The harness has to evolve with the model instead of freezing assumptions about what the model can and cannot handle.

## When the harness fails, the agent can look stupid

This is the part that makes the distinction practical rather than academic.

Imagine an agent that keeps trying to call the wrong tool because the tool descriptions overlap. Or one that forgets the acceptance criteria after context compaction. Or one that correctly identifies a fix but cannot apply it because the permission boundary is wrong. Or a long-running task that loses its intermediate state and starts solving the same problem again from scratch.

Those failures can look like model failures from the outside.

Sometimes they are.

But sometimes the model made a perfectly reasonable decision with a bad set of tools, incomplete context, or an execution environment that could not carry the decision through.

That changes how I evaluate agentic systems.

Instead of asking only, **Which model is this using?** I also want to know:

- What tools does the harness expose?
- What context does it preserve?
- What does it forget?
- What can it actually execute?
- Where are the approval boundaries?
- How does it recover from failure?
- How does it coordinate another agent when the task needs one?

Those questions tell you much more about the agent you are actually using.

The model still matters enormously.

But if you want to understand why an agent succeeds, stalls, or goes completely off the rails, you also have to look at the harness around it.

## Further reading

- [OpenAI: Introducing the Agents API](https://openai.com/index/introducing-the-agents-api/)
- [OpenAI Agents SDK: Tools](https://openai.github.io/openai-agents-python/tools/)
- [OpenAI Agents SDK: Sandbox agents](https://openai.github.io/openai-agents-python/sandbox_agents/)
- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [Anthropic: Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Writing effective tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents)
