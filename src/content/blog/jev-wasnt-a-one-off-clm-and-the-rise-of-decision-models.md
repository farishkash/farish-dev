---
title: "Jev Wasn’t a One-Off: CLM and the Rise of Decision Models"
description: "CLM, Kev, and AnyJev suggest that Jev may not be a one-off product idea. We may be watching typed AI decision models become a category of their own."
published: 2026-09-26
draft: false
category: AI in Practice
tags:
  - AI Models
  - Decision Models
  - CLM
  - Jev
  - Agentic AI
featured: false
---

Apparently my Jev article needed a sequel faster than I expected.

A few days ago, I wrote about Jev, TypeSafe AI’s new model built around a simple idea:

**Not every AI task needs generated language. Sometimes software just needs a decision.**

Classify this.

Choose that.

Score this result.

Route this request.

Decide whether to continue, retry, stop, or escalate.

Jev was interesting to me because it challenged the assumption that every one of those decisions should be handed to a general-purpose language model.

Then CLM showed up.

And suddenly the more interesting question wasn’t whether Jev itself would succeed.

It was whether we were watching a new category begin to form.

## CLM takes a very different route to a similar destination

CLM stands for **Contrastive Language Model**.

The project describes itself as a System One model for fast, generalizable decision-making, and its interface looks deliberately familiar if you’ve already seen Jev.

Give it some state.

Give it a closed set of possible actions.

CLM scores those actions and tells you which one best matches the current situation.

No essay.

No arbitrary string generation.

No waiting for the model to generate an answer one token at a time.

But underneath, CLM works very differently from Jev.

The released CLM-8B system uses a frozen Qwen3-8B backbone with lightweight learned projection heads that turn states and actions into embeddings. The reference head checkpoint is only about 75 MB, while the much larger language model underneath provides the semantic representation. The project is open weights and Apache 2.0 licensed.

That last part alone makes CLM interesting.

Jev is a hosted proprietary model.

CLM is something you can inspect, run yourself, and fine-tune.

But I don’t think open versus closed is the most interesting difference.

The architecture is.

## CLM separates the state from the actions

This is the clever part.

A normal language-model interaction tends to bundle the situation and the possible answer space together.

CLM separates them.

One encoder turns the **state** into an embedding.

Another turns each possible **action** into an embedding.

The model then measures how well the state and each action align.

During training, the correct state-action pairs are pulled closer together while incorrect pairings are pushed apart. That is the contrastive part of Contrastive Language Model.

The simplest way I can think about it is:

> Given what is happening right now, which of these possible actions looks most like the right one?

That separation has an important consequence.

**Actions can be cached.**

Imagine an agent has 500 possible tools, commands, routes, or actions.

The current state keeps changing.

Those 500 actions may not.

CLM can encode those actions once and reuse their embeddings as the state changes.

That is where a lot of its claimed speed advantage comes from.

And I think that detail matters because “CLM is faster” is much less useful than understanding **why** it might be faster.

## The headline is “up to 9× faster.” The interesting part is where it happens.

The CLM authors report performance competitive with Jev across several small zero-shot computer-use, gaming, and tool-calling evaluations, with **up to roughly 9× lower latency**.

There is also a roughly **13× figure** on the Hugging Face model card, but that refers to a different scenario: around 1,000 cached candidate actions.

Those are not interchangeable numbers.

And the per-task results make the architecture much easier to understand.

The biggest zero-shot gain comes from the T-Rex game, where the same actions can be reused over changing states. CLM is reported at roughly 9.1× lower latency there.

WikiRacing, where there are many candidates but less opportunity for that kind of reuse, is closer to 2.8×.

Tool calling is closer still.

In other words:

**Having lots of choices helps. Reusing those choices appears to help much more.**

That makes CLM less magical and more interesting.

It isn’t simply a mysterious model that runs nine times faster.

Its architecture is avoiding work.

That is a very software-engineering kind of optimization.

## Competitive does not mean better everywhere

The CLM repository describes its zero-shot results as “on par” with Jev.

I’d put a little distance around that phrase.

On the reported tool-calling evaluation, Jev scores **99.2%** while CLM scores **95.2%**.

On WikiRacing, Jev completes **30 out of 30** trials while CLM completes **26 out of 30**.

Several of the evaluations also involve very small numbers of trials.

So I would not look at these results and conclude:

**CLM has beaten Jev.**

A fairer reading is:

**CLM appears competitive across the authors’ small zero-shot test suite while consistently reporting lower latency.**

That’s still interesting.

It just isn’t a victory lap yet.

## The verifier results are much more dramatic

Where the CLM claims become more aggressive is verification.

Instead of asking the model to produce a solution, imagine generating several possible solutions and asking another model:

**Which one should I trust?**

That makes the decision model a verifier.

The CLM team tested this on two long-horizon coding and terminal benchmarks.

On **38 held-out DeepSWE tasks**, a fine-tuned CLM verifier selected a successful candidate **81.6%** of the time.

On **30 held-out Terminal-Bench 2.1 tasks**, it reached **87.6%**.

The authors also report verifier latency between **4.1× and 5.7× lower than Jev** on those tasks.

And then there is the more provocative part.

Using their evaluation setup, the CLM authors report Jev at **71.1% on DeepSWE**, below the **73.7% pass@1 baseline**, and **83.1% on Terminal-Bench**, below its **84.0% pass@1 baseline**.

Their README puts the conclusion rather plainly: Jev fails to serve as a verifier for these long-horizon tasks.

That is a strong claim.

It also needs a strong asterisk.

These are **CLM’s authors evaluating CLM and Jev using their own harness**.

CLM was specifically fine-tuned for the verifier task.

The held-out sets contain 38 and 30 tasks.

And, as far as I can tell, these results have not yet been independently reproduced.

So:

Interesting?

Absolutely.

Settled?

Not remotely.

## CLM’s probabilities do not mean the same thing as Jev’s

This is one of the distinctions I think could easily get lost because the APIs look similar.

Both Jev and CLM can give software a probability distribution over possible choices.

But that does not mean those probabilities make the same claim.

With CLM, the system scores the candidate actions you supplied and applies a softmax over those scores.

The probability is therefore **relative to that candidate set**.

If CLM says:

```text
billing: 0.80
technical: 0.15
sales: 0.05
```

the useful interpretation is roughly:

> Of these choices, billing is strongly preferred.

It does **not automatically mean**:

> When CLM says 0.80, it will be right 80% of the time in the real world.

That distinction matters because calibration was one of the things I found interesting about Jev.

TypeSafe says Jev is trained using **Reinforcement Learning for Calibrated Decisions**, specifically to make its reported uncertainty useful for downstream software.

CLM takes another approach.

Its API’s `confidence` field is simply calculated from the output distribution:

**top probability minus the mean probability of the remaining choices.**

That can still be useful.

It just isn’t the same thing as a model trained explicitly for calibrated probabilities.

The APIs may look similar while the semantics underneath them are meaningfully different.

## And CLM has some very real limits

CLM is not a cheaper general-purpose LLM.

That should sound familiar by now.

It does not generate arbitrary text.

It needs candidate actions to score.

The released reference head is tied to the encoder and pooling setup it was trained against.

And the reference Qwen3-8B serving command caps the model length at **2,048 tokens**.

That is dramatically smaller than the context windows people are getting accustomed to with frontier models.

For some decision tasks, that may be fine.

For others, especially decisions that require understanding a very long agent trajectory, it may be a significant constraint.

Again, this is not a model designed to do everything.

That appears to be the whole point.

## But CLM isn’t showing up alone

This is where the story gets bigger than CLM.

When I first looked at Jev, it was easy to think of System One decision models as a TypeSafe product category.

A week later, that framing already feels too narrow.

Because CLM is not the only project appearing around the same interface.

### Kev

Jared Palmer’s **Kev** is a family of open decision models built on **Qwen3.5**, with current 0.8B, 4B, and 9B variants.

Its API intentionally matches TypeSafe’s System One interface closely enough that TypeSafe’s Python SDK can be pointed at a local Kev server without changing the application code.

The implementation is completely different again.

Kev uses a frozen Qwen3.5 base with a small trainable decision head rather than a text-generation loop. The result is another way to expose typed decisions as probabilities while keeping the surrounding software interface familiar.

What makes Kev especially useful for this discussion is that Palmer publishes the misses as openly as the wins.

On Kev’s out-of-domain development set, **Kev-9B scores 0.822 accuracy versus Jev’s 0.857**. On Kev’s locked out-of-domain test set, the current 9B checkpoint reaches **0.852** after a small follow-up fine-tune. Jev does not have a corresponding locked-test result in the repo, so those two numbers should not be treated as a perfectly matched head-to-head benchmark.

Still, the gap is small enough to be interesting.

Palmer also states explicitly that **no Jev outputs were used for training**, and his Qwen3.5 port experiment log reports about **$95 in Modal H100 spend**, plus a few cents of Jev API calls, for the full round of porting, probes, training runs, benchmarks, and locked reads.

That does **not** mean “Kev-9B costs $95 to train from scratch.”

It does mean a named developer got surprisingly close to the hosted reference model with a modest experimental budget and published the entire trail of failures, locked tests, calibration work, and negative results.

That is exactly the kind of evidence that makes this feel less like one company’s product category and more like an emerging technical pattern.

You can download Kev.

Run it locally.

Fine-tune it.

And swap it into software written for Jev.

That last part may ultimately matter more than the model itself.

### AnyJev

Then there is **AnyJev**, from Nokia Applied Research.

AnyJev takes an even stranger route.

It asks:

**What if you don’t need a specialized decision model at all?**

Instead, it can wrap an open LLM you already run and use its next-token probabilities to produce Jev-style typed decisions.

The naive version of that approach has problems.

Models can prefer certain option positions or labels regardless of the actual question. Reverse the choice order and the answer can change.

AnyJev’s label-free **L0** mode tries to correct those position and prior biases without retraining the model.

Its **L1** level goes further, using roughly **100 to 500 labeled examples per question** to add temperature-based calibration.

So AnyJev can start with no labels, but the stronger calibration step is not training-free in the broader sense. It still needs labeled examples, even though it does not require retraining the underlying LLM weights.

That distinction matters.

So in the span of roughly a week, we already have several very different ways of reaching a similar programming interface:

**Jev:** purpose-built proprietary decision model.

**CLM:** open contrastive state-action model.

**Kev:** small open Jev-compatible models built on Qwen3.5.

**AnyJev:** turn an existing open LLM into a typed decision system.

At that point, I start wondering whether the interesting invention is the model.

Or the interface.

## Maybe the interface is becoming the category

Software developers like stable abstractions.

We usually don’t want application code to care about every internal implementation detail.

A database driver gives us a database interface.

An HTTP client gives us requests and responses.

A vector store gives us retrieval.

What is beginning to appear here looks something like a **decision interface**:

```text
state
+
question
+
allowed answers
=
distribution over decisions
```

One implementation might use reinforcement learning.

Another might use contrastive embeddings.

Another might use a small fine-tuned language model.

Another might read probabilities out of an existing LLM.

The application above them may not care.

That is where this starts feeling less like:

> Jev has some competitors.

and more like:

> **We may be watching a software primitive emerge.**

The model underneath can change.

The decision interface remains.

## That would be especially useful for agents

This brings me back to agent harnesses.

A long-running agent makes decisions constantly.

Which tool should run?

Which subagent should handle this?

Is this tool call dangerous?

Did the result satisfy the requirement?

Should we retry?

Should we stop?

Does a human need to look at this?

Some of those decisions require deep reasoning.

Some are deterministic enough that ordinary code should handle them.

And some live in the fuzzy space between the two.

That is where this new class of decision models may become useful.

The big question is no longer:

**Should my harness use Jev?**

It becomes:

**When should my harness use a decision model at all?**

And if it should:

**Which kind?**

A hosted calibrated model?

A contrastive model with reusable action embeddings?

A small self-hosted model?

Your existing LLM with a decision layer wrapped around it?

Or just ten lines of normal code because we have collectively lost the plot?

That is probably an article of its own.

## CLM makes the Jev story more interesting

I don’t know whether CLM will become widely used.

I don’t know whether Kev will.

I don’t know whether the best version of this idea will eventually look more like Jev, CLM, AnyJev, or something that hasn’t been released yet.

Everything here is extremely new.

The benchmarks are small.

Most of the numbers come from the people building the models.

The architecture is moving faster than anyone can build a meaningful production history.

But that is also why I think this moment is interesting.

A week ago, Jev looked like a strange specialized model with a compelling question behind it:

**Why are we using a giant generative model every time software needs to make a small intelligent decision?**

CLM doesn’t answer that question.

It makes the question bigger.

Because now several teams are arriving at variations of the same idea from completely different directions.

Maybe not every intelligent system needs to generate language.

Maybe not every decision needs the same model.

And maybe the interesting new layer in AI architecture isn’t another chatbot at all.

It’s a decision primitive.

## Further reading

- [CLM GitHub repository](https://github.com/Contrastive-LM/CLM)
- [CLM Hugging Face model card](https://huggingface.co/Contrastive-LM/CLM-v0.1-8B)
- [Sanity: Contrastive Language Model (CLM)](https://www.sanity.io/glossary/contrastive-language-model-clm)
- [Kev GitHub repository](https://github.com/jaredpalmer/kev)
- [Kev-9B model card](https://github.com/jaredpalmer/kev/blob/main/docs/model-cards/kev-9b.md)
- [AnyJev GitHub repository](https://github.com/nokia-applied-research/AnyJev)
