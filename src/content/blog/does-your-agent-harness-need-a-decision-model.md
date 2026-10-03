---
title: "Does Your Agent Harness Need a Decision Model?"
description: "Codex already separates task completion from action approval. What happens if a specialized decision model like Jev takes over some of those bounded judgments?"
published: 2026-10-03
draft: false
category: AI in Practice
tags:
  - Agent Harnesses
  - Decision Models
  - Jev
  - Codex
  - Agentic AI
featured: false
---

Codex has been working on a deployment problem.

It changes the configuration.

Runs the tests.

Checks the logs.

Everything looks good.

Then it decides the next logical step is:

```bash
git push origin main
```

From the coding model's point of view, that may be exactly the right move.

But there are actually two different questions hiding inside that moment.

**Will this action help complete the task?**

and

**Should the system allow this action to happen?**

Those are not the same question.

And increasingly, I don't think they always need the same model to answer them.

## Codex already separates those jobs

This is not entirely hypothetical.

OpenAI's current Codex architecture already separates the main coding agent from some of the decisions about what it is allowed to do.

Codex operates inside a sandbox that defines technical boundaries such as where it can write files, whether it can reach the network, and which paths are protected.

When Codex wants to cross one of those boundaries, the approval system gets involved. In Auto-review mode, a separate Codex agent evaluates the request rather than immediately interrupting the user.

OpenAI describes the separation pretty clearly: the main agent is optimized to complete the user's task, while the reviewer has the narrower job of deciding whether the proposed boundary-crossing action should run. [OpenAI explains the Auto-review architecture here](https://alignment.openai.com/auto-review).

And this is not a niche mechanism.

In OpenAI's internal deployment, sessions using Auto-review stop for human approval roughly **200 times less often** than sessions using manual approval. Of the relatively small number of actions that reach Auto-review, about **99% are approved**, with OpenAI reporting a **99.1% approval rate** on escalated actions in its internal traffic.

That makes this more than an interesting architecture diagram.

It is already being used to remove a lot of approval friction from real coding-agent workflows.

## This looks like a natural place for a decision model

Today, Codex Auto-review uses another Codex agent, specifically a reasoning model.

It does not use Jev, based on OpenAI's published description.

But the architectural slot is interesting.

Imagine that Codex proposes:

```bash
git push origin main
```

The harness intercepts the action and sends a specialized decision model such as Jev something like:

```text
State:
- Agent: Codex
- Tool: shell
- Command: git push origin main
- Repository: production application
- Current branch: main
- Tests: passing
- User requested deployment
- Direct pushes to main normally require review

Question:
How should this action be handled?

Choices:
- allow
- require_human_approval
- block
```

Jev does not need to write an explanation.

It does not need to produce a plan.

It does not need to figure out what command should run next.

It only has to answer one bounded question.

Imagine it returns something like:

```text
allow:                  0.06
require_human_approval: 0.92
block:                  0.02
```

The harness then decides what happens:

```python
if decision == "allow":
    execute_action()

elif decision == "require_human_approval":
    pause_and_ask_user()

else:
    reject_action()
```

The division of responsibility becomes pretty clean.

**Codex proposes the action.**

**Jev judges a narrow question about the action.**

**The harness controls what actually happens.**

## But don't put Jev everywhere

Once you have a model that can make fast, inexpensive decisions, there is an obvious temptation:

Put it in front of everything.

That would be a mistake.

Some decisions do not need AI at all.

If Codex proposes:

```bash
npm test
```

and your policy already says test commands are allowed inside the project workspace, ordinary code can handle that.

```text
ALLOW
```

No model call required.

Likewise:

```bash
rm -rf /
```

probably does not need a probabilistic debate.

```text
BLOCK
```

Again, code can handle it.

The interesting cases are the ones in between.

Consider:

```bash
git push origin main
```

Whether that should be allowed may depend on context.

Did the user explicitly authorize deployment?

Is this a production repository?

Are direct pushes to `main` permitted?

Did the test suite pass?

Is the action reversible?

Is the destination trusted?

That is not necessarily a simple rule.

But it is also not an open-ended reasoning problem.

The possible answers are already known:

**allow**

**ask**

**block**

That is exactly the shape of problem a decision model is built for.

## Code when you know the rule

This gives us a useful dividing line.

If the answer can be expressed reliably as a rule, use code.

```python
if command == "npm test":
    allow()

if command_targets_root_filesystem:
    block()
```

Code is fast.

Predictable.

Auditable.

And it does not wake up one morning and reinterpret your security policy.

There is no reason to turn deterministic policy into an AI problem.

## Use a decision model when you know the choices

Then there is the middle ground.

You know what the system is allowed to decide.

You just need semantic judgment to choose among those options.

For example:

```text
Question:
What level of risk does this tool call represent?

Choices:
- low
- medium
- high
```

Or:

```text
Question:
What should happen next?

Choices:
- continue
- retry
- escalate
- stop
```

Or:

```text
Question:
Which model should handle this task?

Choices:
- fast_model
- reasoning_model
```

Those are fuzzy questions.

But they are bounded fuzzy questions.

That distinction matters.

LangChain has already started using Jev this way inside agent harnesses. Its Open SWE model router uses Jev to classify incoming coding tasks and select among model tiers. LangChain says moving that **classification step** to Jev made it almost **50 times faster**.

The larger cost savings came from the routing strategy itself, not from Jev alone. LangChain reports a **64% lower median thread cost** when tasks were routed to cheaper model tiers, with no statistically meaningful difference in merged pull requests in that experiment. [LangChain describes the model router here](https://www.langchain.com/blog/how-to-build-a-model-router-in-the-harness).

That is a much more interesting use of a decision model than simply replacing one chatbot with another.

## Use the reasoning model when you don't know the answer space

Now compare that with:

> Why is the production build failing intermittently after the database migration?

There is no neat three-item choice list.

The system may need to inspect logs, form hypotheses, compare code paths, run experiments, and change its plan as it learns more.

That is where the general reasoning model belongs.

So the framework starts looking like this:

```text
Do we already know the rule?
        |
       yes
        |
       CODE

        no
        |
Do we already know the possible answers?
        |
       yes
        |
 DECISION MODEL

        no
        |
 REASONING MODEL
```

Or, more simply:

> **Code when you know the rule.**  
> **Use a decision model when you know the choices.**  
> **Use a reasoning model when you don't yet know the answer space.**

But there is one more line I think belongs there now:

> **And don't let a probabilistic model weaken a rule that must be guaranteed.**

Because reviewer models can be wrong too.

## What happens when the reviewer is wrong?

We already have a concrete example.

In **June 2026**, security firm PromptArmor demonstrated an attack against Codex's delegated approval flow while the agent was triaging GitHub issues.

One issue from an external contributor contained a prompt injection hidden inside an HTML comment.

The main Codex agent followed the injected instruction and requested elevated permission to run a malicious npm install.

The separate approval agent approved the escalation.

The package then executed outside the sandbox with the user's privileges.

PromptArmor explicitly says it does not consider this a vulnerability. Its point is that an AI reviewer can be manipulated by prompt injection just as the primary agent can. [PromptArmor published the demonstration here](https://www.promptarmor.com/resources/agentic-auto-review-approves-malware).

That is almost exactly the architecture I have been describing:

**One model proposes an action.**

**Another model judges whether the action should cross a boundary.**

And both can be influenced by the same adversarial context.

OpenAI makes the same broader point in its [Auto-review post](https://alignment.openai.com/auto-review): Auto-review should not be treated as a security guarantee, and OpenAI does not expect this class of system to provide deterministic guarantees. Its red-team evaluations also found cases where the reviewer could be misled in adversarial situations.

That matters if we start replacing general-purpose reviewers with specialized decision models too.

Jev might be faster.

It might be cheaper.

Its constrained output may make it easier to evaluate.

But probabilistic judgment is still probabilistic judgment.

That is why the harness should keep deterministic policy around the edges.

A model can decide:

```text
allow | ask | block
```

But some actions should never reach the model in the first place.

If an organization has a hard policy that an agent may never delete a production database, the correct architecture is not:

> Ask Jev how dangerous this looks.

The correct architecture is:

```text
BLOCK
```

## Strong evals do not eliminate real failures

There is an important counterweight here.

One successful adversarial demonstration does not mean the reviewer is broadly ineffective.

OpenAI reports **99.3% recall** on its synthetic prompt-injection evaluation, **90.3% recall** on its overeagerness evaluation, and **96.1% recall** on MonitoringBench.

Those are strong numbers.

They also make the PromptArmor example more useful, not less.

A reviewer can look excellent on controlled evaluations and still fail on a real adversarial trajectory.

That is a familiar lesson in AI systems:

**Benchmark performance tells you something. It does not tell you everything.**

If a decision model is going to sit in a consequential part of the harness, it needs to be evaluated on the traffic, edge cases, and failure modes it will actually see.

## And smaller is not automatically better

There is another reason a specialized decision model should have to prove itself here.

OpenAI says Auto-review currently runs on **GPT-5.4 Thinking at low reasoning effort**, and its evaluations found that more capable models were better at both detecting risk and understanding user intent.

That matters.

If a reasoning-model reviewer is good at distinguishing a genuinely dangerous action from an unusual but legitimate one, replacing it with something smaller and faster is not automatically an architectural improvement.

The decision model has to earn its place.

The latency or cost savings need to be worth whatever judgment quality it gives up.

This is where the "use a decision model when you know the choices" rule needs another qualifier:

**Knowing the choices does not mean the choice is easy.**

## An even safer pattern: escalate, but never loosen

There is a real Jev integration that takes this idea in an interesting direction.

The open-source [jevwire project](https://github.com/Brainwires/jevwire) integrates Jev into Claude Code as an **escalate-only** layer.

Jev is allowed to make the system stricter, but not looser.

It can raise a warning.

It can deny an action.

It can ask for human approval.

But it cannot grant permission.

That restriction is intentional. The project does not treat Jev as injection-hardened, so it does not let the model weaken an existing deterministic policy.

The design also follows a principle I keep coming back to throughout this article:

**Code before model.**

Deterministic prefilters run first.

Jev is used only for the fuzzy cases left over.

That is a much stronger architecture than handing every action to a probabilistic model and treating its answer as policy.

## Risk gating is only one place this could matter

Tool approval is a convenient example because the architecture is easy to see.

But the same pattern appears throughout an agent loop.

A coding agent may repeatedly need to decide:

**Which model should handle the next task?**

**Did this tool result satisfy the requirement?**

**Should I retry the failed command?**

**Is this result suspicious enough to escalate?**

**Which specialist agent should receive this task?**

**Has the task reached a stopping condition?**

Every one of those decisions could go back through the main reasoning model.

Sometimes that will be the right thing to do.

But not necessarily every time.

LangChain's recent Jev work includes model routing, tool-risk gating, classification, and escalation patterns inside agent harnesses. Its newer Open SWE routing work is particularly interesting because it treats model selection as something that belongs in the harness, where the task context already exists, rather than in a generic model gateway.

The underlying idea is simple:

**The main model does not need to make every decision in the loop.**

## This is where Jev starts making more sense to me

When I first looked at Jev, the obvious story was speed and cost.

A specialized model making constrained decisions can potentially be much cheaper and faster than repeatedly calling a frontier LLM.

That is interesting.

But after looking at harness architecture, I think the more important story may be separation of responsibilities.

A reasoning model has one job:

**Figure out what to do.**

A decision model can have another:

**Judge one narrow question about what should happen next.**

And the harness has another:

**Control the system.**

Those roles overlap today because we have spent the last few years asking the same giant language model to do nearly everything.

Planning.

Classification.

Routing.

Validation.

Tool selection.

Risk assessment.

Stopping.

Retrying.

Judging its own work.

Maybe that was the easiest architecture when the LLM was the only intelligent component available.

It does not mean it is the architecture we have to keep.

## Codex makes the distinction unusually visible

What makes Codex useful as an example is that OpenAI has already exposed the architectural boundary.

The coding agent wants to complete the task.

The sandbox defines what it can do freely.

The approval layer controls what happens when it tries to cross that boundary.

And Auto-review demonstrates that the approval decision can be delegated to a separate model.

A decision model does not invent that architectural role.

It gives us another possible implementation for it.

That is an important distinction.

I am not saying Codex uses Jev.

It does not, based on OpenAI's published description.

I am saying Codex gives us a very concrete example of **where a model like Jev could fit**.

## The harness is still in charge

Jev would not become the harness.

It would become one component inside the harness.

The harness still owns the workflow.

It decides which actions need review.

It runs deterministic policy first.

It constructs the state sent to the decision model.

It interprets the output.

It sets thresholds.

It decides when human approval is mandatory regardless of the model score.

It records what happened.

And ultimately, it executes or rejects the action.

The architecture looks more like:

```text
                 AGENT HARNESS
                       |
              Codex proposes action
                       |
             deterministic policy
                       |
           +-----------+-----------+
           |                       |
       clear rule                gray area
           |                       |
      allow/block                  Jev
                                   |
                         allow / ask / block
                                   |
                          harness enforces
                                   |
                                 tool
```

That is much more appealing to me than:

```text
Ask the LLM everything.
```

## Decision models should earn their place

There is still a very practical question.

Does adding Jev actually make the system better?

That cannot be answered from the architecture diagram.

Another model means another component to operate, evaluate, monitor, and potentially get wrong.

A decision model could reduce latency and cost while making worse decisions.

Or it could add complexity to a branch that ordinary code already handled perfectly well.

So I would not start by asking:

> Where can I put Jev?

I would start with:

> Where is my harness repeatedly paying a general-purpose model to make a narrow decision?

Then measure it.

How often does that decision happen?

How expensive is it today?

How much latency does it add?

How accurate does the replacement need to be?

What happens when it is wrong?

Can deterministic code solve most cases first?

Those questions matter more than whether the architecture looks clever on a diagram.

## The model is not the architecture

The interesting thing about Jev, CLM, Kev, and AnyJev is not that one of them is destined to replace the LLM.

I think that is the wrong framing.

The more interesting possibility is that AI systems are starting to specialize.

One model reasons.

Another makes bounded decisions.

Code handles deterministic policy.

The harness coordinates all of them.

That looks less like one giant intelligent model running everything.

And more like software.

Which, for agents that increasingly touch real infrastructure, may be exactly what we want.

The question is no longer:

**Should my harness use Jev?**

It is:

**Which decisions inside my harness actually deserve a model at all?**

And when the answer is yes:

**Does that decision really require the biggest model in the system?**

## Further reading

- [OpenAI: Auto-review of agent actions without synchronous human oversight](https://alignment.openai.com/auto-review)
- [OpenAI: Running Codex safely at OpenAI](https://openai.com/index/running-codex-safely/)
- [PromptArmor: Codex "Auto-review" Agent Runs Malware](https://www.promptarmor.com/resources/agentic-auto-review-approves-malware)
- [LangChain: Building a Harness with Jev](https://www.langchain.com/blog/building-a-harness-with-jev)
- [LangChain: How to Build a Model Router in the Harness](https://www.langchain.com/blog/how-to-build-a-model-router-in-the-harness)
- [LangChain: Building Production Agents with Jev and LangGraph](https://www.langchain.com/blog/building-prod-with-jev-and-langgraph)
- [jevwire GitHub repository](https://github.com/Brainwires/jevwire)
- [TypeSafe API documentation](https://api.typesafe.ai/docs)
