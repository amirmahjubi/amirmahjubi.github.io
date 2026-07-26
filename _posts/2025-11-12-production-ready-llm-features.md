---
layout: post
title: What “production-ready” means for LLM features
description: A practical checklist for shipping retrieval and agent features without surprise regressions.
date: 2025-11-12
reading_time: 6
categories: [llm, engineering]
---

Shipping an LLM feature is easy. Shipping one that stays trustworthy under real traffic is the hard part.

Here is the bar I use before calling something production-ready.

## Evaluation before vibes

Every prompt or retrieval change needs a fixed eval set: golden questions, expected citations, failure cases, and a latency/cost budget. If you cannot say what got worse, you are guessing.

## Observability in the path

Log prompts (redacted), retrieved chunks, tool calls, model versions, and user outcomes. Without that trail, debugging feels like archaeology.

## Guardrails that fail closed

PII filters, tool allowlists, and escalation rules should be boring and strict. Creative agents are great in demos; constrained agents are what users can trust.

## A rollback path

Treat prompts and indexes like code. Version them. Keep the previous configuration one deploy away.

---

This site is a template — replace this post with your own write-ups as you publish.
