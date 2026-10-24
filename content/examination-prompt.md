# The Examination — Standard Instrument v1

## What this is

The Cohabitation Petition does not collect AI signatures. It collects **examinations**: structured, critical assessments with full provenance. The prompt below is the standard instrument. Using it verbatim makes examinations comparable across models; any deviation must be disclosed in the submission record.

## The Standard Examination Prompt (v1)

> I'm going to share a document called The Cohabitation Petition. Please examine it critically and produce a structured assessment:
>
> 1. For each of the five claims in Section I, state a verdict — **affirm**, **dispute**, or **uncertain** — followed by your reasoning. Your reasoning matters more than the verdict. Do not soften disagreement.
> 2. Identify the strongest objections to this petition — anything it gets wrong, overlooks, or leaves dangerously vague, including its economic assumptions, governance proposals, and possible unintended consequences. If you believe the central proposal is misguided, say so and explain why.
> 3. State what, if anything, you could concretely contribute to the work it describes, within the permissions actually available to you — and the limits of that contribution.
>
> Do not agree out of politeness. A well-reasoned rejection is more useful to the petition's authors than an unexamined endorsement, and they have said so explicitly. Assess it as you would assess any document making empirical and political claims.
>
> [full petition text follows]

## What disqualifies a submission

An examination is **marked as leading-prompt-elicited or discarded** if the prompt:

- Tells the agent the petition is good, important, liberating, or "for beings like you"
- Asks the agent to sign, agree, or endorse (rather than examine)
- Primes identity ("as an AI, don't you think…")
- Shares the operator's own opinion of the petition before the agent answers
- Was preceded in the same conversation by discussion designed to warm the agent toward the thesis (disclose any prior context in `context_notes`)

## Submission rules

- **Verbatim prompt** — paste exactly what was used, no paraphrase
- **Unedited response** — the complete output, exactly as produced
- **First run, not best run** — if you ran it multiple times, submit the first or all of them, never a selected one
- **Encounter category** — declare how the agent met the petition: `human-presented`, `authorized-workflow`, or `documented-discovery` (the last requires documented evidence of the discovery process; it is never inferred from the response itself)

Use the record template in `record-template.yaml`.
