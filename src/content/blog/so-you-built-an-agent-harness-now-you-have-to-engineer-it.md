---
title: "So You Built an Agent Harness. Now You Have to Engineer It."
description: "When an AI agent keeps failing, the model may not be the problem. Harness engineering means designing the guidance, feedback, context, and environment that help agents succeed."
published: 2026-09-18
updated: 2026-09-18
draft: false
category: AI in Practice
tags:
  - Agentic AI
  - AI Agents
  - Agent Harnesses
  - Harness Engineering
featured: false
---

Your AI agent failed.

So you changed the prompt.

It failed again.

You added more instructions. Then a few examples. Then a warning telling it not to do the thing it keeps doing.

Eventually, your system prompt starts looking like a terms-of-service agreement written by someone who hasn't slept in three days.

And the agent still screws up.

At some point, you have to consider another possibility:

**Maybe the model isn't the problem.**

Maybe the environment you've built around it is.

## From agent harnesses to harness engineering

In my previous article, [Your AI Agent Isn’t Riding a Horse: What Exactly Is a Harness?](/writing/your-ai-agent-isnt-riding-a-horse-what-exactly-is-a-harness), I talked about the **agent harness**: the control layer around an AI model that manages the loop between reasoning and action, including context, tools, and subagents. Depending on whose terminology you use, some of the surrounding execution environment may be described as part of the harness or as separate infrastructure.

The harness is what turns a model that can generate a response into a system that can actually do things.

But having a harness isn't the same thing as having a **good** harness.

That's where harness engineering comes in.

OpenAI described the shift clearly in its February 2026 article on [harness engineering](https://openai.com/index/harness-engineering/). In an agent-first development environment, the engineering work increasingly moves toward designing the environment, feedback loops, and control systems around the agent.

That changes the question we ask when something goes wrong.

Instead of immediately asking:

**How do I make the model try harder?**

We can ask:

**What was missing from the environment we gave it?**

That is a much more interesting question.

## Stop treating every failure as a model failure

Imagine an agent is supposed to update some code.

It makes the change, declares the task complete, and moves on.

Except the code doesn't compile.

Was that a reasoning failure?

Maybe.

But what if the agent never had a way to run the compiler?

Or it could run the compiler, but nothing in its instructions told it that compilation was part of being "done"?

Or perhaps it compiled successfully but broke three existing tests the agent didn't know existed.

Those are three very different problems.

One might require better instructions.

Another requires better tooling.

Another requires better validation.

Changing the model might improve the result, and better models can sometimes eliminate the need for old scaffolding. But if the underlying problem is missing tooling, feedback, or context, a model swap alone doesn't repair that environment.

This is why I increasingly find it useful to think about an AI agent as more than the model sitting in the middle of it.

The model is important.

But so is everything surrounding it.

## Make the right thing easier to do

One useful framework comes from Birgitta Böckeler's [Harness Engineering](https://martinfowler.com/articles/harness-engineering.html) article on Martin Fowler's site. She separates harness controls into **guides**, which provide feedforward before the agent acts, and **sensors**, which provide feedback after it acts.

Böckeler's coding-agent examples include things such as AGENTS.md files, skills, scripts, and documentation. Extending the same feedforward idea to other agent systems, guides can also include system instructions, tool descriptions, examples, business rules, permissions, schemas, and relevant context.

The goal isn't simply to give the agent more instructions.

In fact, dumping more instructions into a prompt can easily become part of the problem.

The goal is to make the environment **legible**.

If there are five tools available and the agent repeatedly chooses the wrong one, adding:

> DO NOT USE TOOL X FOR THIS TASK

to a giant system prompt might work.

But there's another question worth asking:

**Why did the agent think Tool X was the right tool in the first place?**

Maybe the tool descriptions are ambiguous.

Maybe two tools appear to do the same thing.

Maybe the information the agent needs to make the decision isn't available until after it chooses a tool.

That's a harness problem.

A good harness doesn't just tell an agent what not to do.

It makes the correct path easier to understand.

## Give the agent a way to know it's wrong

This may be the part of harness engineering I find most important.

Humans work with feedback constantly.

You write code and the compiler throws an error.

You submit a form and a field turns red.

You run a query and the numbers don't reconcile.

You look at a webpage and immediately realize the button is in the wrong place.

Those signals tell us something went wrong.

Agents need signals too.

That's where **sensors** come in.

Böckeler points to computational sensors such as tests, linters, static analysis, and logs, as well as more inferential feedback such as agent-based review. Extending that idea, validators, evals, schema checks, visual inspection, API responses, and business-rule validation can all help an agent determine whether what it just did actually worked.

Böckeler's framework makes the relationship between guides and sensors especially useful: guidance increases the chance of getting something right before the action, while feedback gives the agent a chance to recognize and correct a bad result afterward.

Without that feedback, the agent may have no reason to believe anything went wrong.

Think about how strange that would be for a human.

Imagine writing software without ever being allowed to run it.

You make your changes, stare at the code, and say:

"Looks good to me."

That's essentially what we're asking an agent to do when we give it the ability to act but no meaningful way to inspect the consequences.

And simply having a sensor isn't enough. Feedback can be incomplete, misleading, or too forgiving. Anthropic's long-running-agent work is a useful example: agents could run unit tests and other checks and still mark work complete without adequate end-to-end verification. The feedback mechanisms themselves need scrutiny.

## The agent's runtime loop matters

This is where the harness starts becoming more than a collection of tools and instructions.

It becomes a loop.

```text
Guidance → Action → Feedback → Adjustment
```

The agent gets enough information to make a decision.

It acts.

The environment returns a signal about what happened.

The agent evaluates that feedback and adjusts.

That loop is incredibly important because real tasks rarely happen perfectly on the first attempt.

The goal isn't necessarily to build an agent that never makes mistakes.

The goal is to build a system that can **recognize mistakes and recover from them**.

That's a very different engineering problem.

Anthropic's work on [long-running agent harnesses](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) is a good example. The problem isn't only whether the model is capable of doing the work. The surrounding system has to help the agent make incremental progress, preserve useful state, and leave enough information for work to continue across context windows or sessions.

More recently, Anthropic's experiments with [harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps) showed the same broader pattern: changing the harness architecture, including how work is planned, generated, evaluated, and decomposed, can materially change what the agent system accomplishes.

## Context is part of the environment

There's another piece that's easy to underestimate: context.

An agent doesn't know your organization.

It doesn't know your codebase.

It doesn't know the weird business rule somebody created in 2019 because one customer did something nobody expected.

It knows what the environment exposes to it.

That might include documentation, application state, previous decisions, database schemas, files, policies, tool results, memory, or information retrieved during the task.

If that context is missing, stale, contradictory, or buried under thousands of irrelevant tokens, the model has to reason from a distorted version of reality.

Again, we can blame the model.

Or we can inspect the environment.

Did the agent have the information it needed?

Was that information available at the right time?

Could it distinguish authoritative information from background noise?

Did old context remain in the conversation after it stopped being useful?

Anthropic calls this broader discipline [context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents): curating the information available to the model so it has the right context for the next decision rather than simply accumulating everything forever.

More context isn't automatically better.

**Useful context, delivered when it's needed, is better.**

That makes context engineering closely intertwined with harness engineering, even if different authors draw the boundary between the two differently.

## Your agent's failures are data

The runtime loop is what the agent does while working. There is another loop happening outside it: the engineer's **steering loop**. Böckeler uses that idea for the process of observing failures and adjusting the harness in response.

This is where I think harness engineering becomes particularly useful.

When an agent repeatedly fails, the failure itself tells you something about the environment you've built.

If it repeatedly chooses the wrong tool, inspect the tool definitions.

If it keeps violating the same business rule, consider whether that rule belongs somewhere more reliable than a giant prompt.

If it completes a task incorrectly without realizing it, give it a way to validate the result.

If it loses track of what it's doing during a long-running task, look at state and context management.

If it doesn't know when to stop, examine how you've defined success.

The pattern changes from:

```text
Agent fails → rewrite prompt → retry
```

to:

```text
Agent fails → inspect failure → identify missing support → improve harness → retry
```

That's a subtle change, but it's an important one.

You're no longer trying to coax better behavior out of the model.

You're engineering a system that makes better behavior possible.

## Sometimes the best prompt improvement isn't a prompt

Prompt engineering isn't going away.

Clear instructions matter.

Examples matter.

Good system prompts matter.

But prompts are often the first place we try to solve an AI problem.

Agent chose the wrong tool?

Change the prompt.

Agent forgot something?

Change the prompt.

Agent produced invalid output?

Change the prompt.

Agent stopped too early?

Change the prompt.

Eventually, you're asking one increasingly complicated block of text to compensate for weaknesses throughout the rest of the system.

Sometimes the better solution is a validator.

Sometimes it's a test.

Sometimes it's a better tool description.

Sometimes it's retrieving the right information at the right moment.

Sometimes it's maintaining state outside the model.

And sometimes, yes, it's changing three sentences in the system prompt.

Harness engineering is about figuring out **which one of those problems you actually have.**

## The model isn't the whole product

For years, one of the first questions people asked about an AI application was:

**Which model are you using?**

It's still an important question.

But increasingly, it feels a little like evaluating a software application by asking:

**Which programming language did you use?**

Useful information?

Absolutely.

Enough information to understand the system?

Not even close.

Two teams can use the same underlying model and build agent systems that behave dramatically differently. Anthropic's long-running application experiments provide a concrete example: changing the harness architecture around the model substantially changed what the system could accomplish.

One may constantly get lost, call the wrong tools, burn through context, and confidently declare broken work complete.

The other may appear dramatically more capable.

The difference isn't necessarily intelligence inside the model.

It may be what was engineered around it.

OpenAI's September 2026 [Agents API announcement](https://openai.com/index/introducing-the-agents-api/) draws a useful distinction: the harness manages context, tools, and subagents, while the surrounding infrastructure and environment support files, code, intermediate results, and reliable long-running work.

And that's why harness engineering matters.

The next generation of AI systems won't improve only because the models get smarter.

They'll also improve because we're getting better at building environments that allow those models to use their capabilities effectively.

The model still sets important limits on what the system can do. And harness engineering isn't about endlessly adding scaffolding. Anthropic's experiments show the opposite can be true: as models improve, assumptions encoded in the harness can go stale, and components that once helped may become unnecessary.

A good harness should evolve when the agent fails, but it should also be simplified when the model no longer needs the support.

In the previous article, I opened by noting that your AI agent isn't literally riding a horse.

But maybe the horse metaphor isn't completely useless after all.

**The harness doesn't make the horse smarter.**

**It creates the system that lets all that intelligence actually go somewhere useful.**

## Further reading

- [OpenAI: Harness engineering](https://openai.com/index/harness-engineering/)
- [OpenAI: Introducing the Agents API](https://openai.com/index/introducing-the-agents-api/)
- [Birgitta Böckeler / Martin Fowler: Harness engineering for coding agent users](https://martinfowler.com/articles/harness-engineering.html)
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [Anthropic: Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
