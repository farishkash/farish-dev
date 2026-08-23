---
title: Stop Using Your Best Coding Model for Everything
description: Using a less capable model for the right phase doesn’t necessarily mean worse results. It can keep usage limits from disrupting your workflow and preserve your strongest models for the problems that actually need them.
published: 2026-08-23
draft: false
tags:
  - AI
  - Coding Agents
  - Developer Tools
featured: true
archive: false
---

There’s an assumption I think a lot of us make when we start working with coding agents:

**If I have access to the best model, why wouldn’t I use it for everything?**

I made that assumption too.

If Sol gives me the strongest reasoning, why would I intentionally switch to Luna? Why would I hand work to a model that, at least on paper, isn’t as capable?

The answer turned out not to be cost.

It was continuity.

When you’re working within usage limits, your most capable model is also a limited resource. Burning through that resource doing work another model could handle just as well can leave you without it at exactly the point where you actually need it.

That changed the way I started thinking about coding agents.

Instead of asking:

**Which model is best?**

I started asking:

**Which model is best for this phase of the work?**

Those are very different questions.

## Planning is where I want the stronger model

I’ve found that one of the places where Sol makes the biggest difference is at the beginning.

Architecture. Planning. Breaking a complex feature into smaller pieces and understanding how a change will affect the rest of the application.

These are places where a mistake can propagate through everything that comes afterward.

If the architecture is wrong, having an agent implement it faster doesn’t help very much. You just get the wrong thing faster.

So this is where I’m comfortable using more of my Sol allocation.

I want the stronger reasoning model to look at the entire problem and ask questions like: What are we actually trying to build? What existing code should we reuse? What systems does this touch? What are the likely failure points? How should the work be divided? What decisions need to be made now so we don’t have to undo them later?

Once those decisions have been made, however, the nature of the problem changes.

And that’s where I think people can unnecessarily burn through their strongest model’s usage.

## Once the thinking is done, the implementation may not need the same model

Imagine Sol has already analyzed the application and produced a clear implementation plan.

It knows which files need to be changed. The interfaces have been decided. The acceptance criteria are clear. The testing requirements are known.

At that point, the problem isn’t:

**Figure out how this system should work.**

It’s:

**Implement this well-defined piece of the plan.**

Those aren’t equivalent reasoning problems.

In my experience, Luna can handle a lot of that second category perfectly well.

That doesn’t mean I’m accepting a worse result just to conserve usage. That’s an important distinction.

If Luna can implement the already-defined task correctly, pass the same tests, and produce the same functional outcome, then using Sol for that work doesn’t necessarily make the result better.

It just uses more of the model I have the most limited access to.

The stronger model has already created value by reducing a difficult problem into a series of easier ones. There isn’t much benefit in making it solve every one of those easier problems itself.

## My workflow started looking more like model routing

Eventually, my workflow started looking something like this:

Sol handles the planning and architecture.

Luna handles much of the implementation once the work has been clearly defined.

Then, inevitably, something breaks.

That introduced another place where I started becoming more intentional about model choice: debugging.

For ordinary bugs, I’ll let Luna try to resolve them.

But sometimes Luna gets stuck.

Anyone who spends enough time with coding agents has probably seen the pattern. The agent develops a hypothesis about the bug, makes a change, runs the test, encounters another error, revises the hypothesis, and keeps digging deeper into the same line of reasoning.

At some point, another attempt from the same model and the same context isn’t necessarily helping.

But I also don’t automatically jump back to Sol.

Sometimes I switch to Terra.

## Sometimes you need a different model, not a stronger model

I started using Terra as a debugger in situations where Luna couldn’t resolve something.

The value wasn’t necessarily that Terra was categorically better than Luna.

It was that I was giving the problem to a different model with a different reasoning path.

After several attempts, Luna may already be anchored to one explanation for the failure. A different model can look at the symptoms, logs, and code without carrying all those assumptions.

Sometimes that’s enough.

So my debugging process started becoming more of an escalation path.

Luna encounters a bug and attempts the reasonable fixes. If it gets stuck, Terra gets a fresh look at the problem.

And if that still doesn’t resolve it, I ask a more important question:

**Is this actually a bug anymore?**

Because sometimes what initially looks like a bug exposes a deeper architectural problem.

That’s when I want Sol back.

If resolving the issue means reconsidering how multiple systems interact, changing an architectural assumption, or making a decision with consequences across the application, I’ve moved back into the category of problems where stronger reasoning provides significant value.

The important part is that Sol is still available when I get there.

## Usage limits are a workflow problem

This is the part I don’t think gets discussed enough.

Usage limits aren’t simply an account constraint.

They can become a workflow limitation.

If I’m halfway through building something and suddenly hit the limit for the model that has been carrying the entire process, my workflow changes immediately.

Now I have to switch models because I have no choice.

That’s very different from intentionally switching models.

One is orchestration.

The other is interruption.

If I know from the beginning that Sol is responsible for architecture and difficult reasoning while Luna handles bounded implementation work, switching between them becomes part of the process.

I’m not scrambling because one model disappeared halfway through the project.

More importantly, I haven’t used a large portion of my limited Sol availability to rename variables, write repetitive tests, update documentation, or implement components whose behavior was already completely specified.

I’m preserving the scarce resource for the moments when its capabilities actually change the outcome.

## This is where subagents get interesting

This approach becomes even more useful when you stop thinking about model switching as something you have to do manually.

With subagents, the routing strategy can become part of the development workflow itself.

The stronger model can act as the orchestrator. It can analyze the problem, establish the architecture, create the plan, and decide which pieces of work can safely be delegated.

A faster model can then handle clearly scoped implementation tasks.

A different model can be brought in when a debugging problem benefits from a fresh perspective.

And the orchestrator can regain control when a problem crosses the line from implementation back into architecture or complex reasoning.

That’s a much more interesting use of agents to me than simply creating several agents and letting them all loose on the same repository.

The important part isn’t how many agents you have.

It’s whether there’s a reason each one is being used.

## The strongest model should be the orchestrator, not necessarily the worker

This has changed how I think about the phrase “best model.”

The best model for designing the architecture may not be necessary for implementing every part of that architecture.

The best model for solving an ambiguous problem may not be necessary once that ambiguity has been removed.

And the model that has been debugging the same problem for twenty minutes may not be the best model to make attempt number eleven.

The goal isn’t to use weaker models.

The goal is to use models deliberately.

For me, that currently means using Sol heavily where I value its reasoning most, using Luna for a lot of the implementation that follows, and sometimes bringing Terra in when I want a fresh debugging perspective.

Then I bring Sol back when the problem becomes difficult enough to justify it.

There will always be usage limits.

But hitting one shouldn’t have to bring the entire coding session to a halt.

The better I get at routing work between models, the less often those limits dictate how I work.

And ultimately, I think that’s where coding agents are heading anyway.

**Not one model doing everything, but an orchestrator deciding who should do what, when, and why.**
