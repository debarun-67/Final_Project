# Academic style: how research papers actually read

This is the general-purpose reference for what "research-paper voice"
means. Domain-specific overrides live in `domain-conventions.md`. Read
this once per session; consult `domain-conventions.md` for the field of
the paper you are editing.

## The core idea

A research paper is a **claim plus its support**, written for someone who
will try to find a hole in it. Every stylistic convention in academic
writing exists to serve that goal: precision, restraint, traceability,
and a calm tone that does not get in the way of the argument.

Bad academic prose fails this in one of two directions:

1. **Inflated** — vague significance claims, hedge-everything language,
   slogans dressed as insight. This is what AI-generated academic prose
   defaults to, and it reads as suspicious to reviewers even before any
   detector flags it.
2. **Sloppy** — colloquial register, undefined terms, hand-waving. This
   reads as unprofessional and gets desk-rejected.

Aim between the two. Specific, restrained, and willing to commit to a
claim where the evidence supports it.

## Voice

### First person

Old advice was "no first person in scientific writing." That is no longer
true and was never universal.

- **Computer science, ML, HCI, statistics, applied math, economics
  (theory):** "We propose...", "We observe that...", "We argue..." is
  standard and expected. Singular "I" is used in single-author papers in
  some fields (philosophy, sometimes pure math, single-author CS theory)
  but plural is the safe default.
- **Biomedical, clinical, lab sciences (chemistry, biology, physics
  experiments):** Methods are usually written in the passive past tense
  ("Cells were cultured...", "The samples were analysed using..."). First
  person plural appears in introduction, discussion, and conclusion
  ("We hypothesised that...", "Our results suggest..."), but is rarer in
  methods and results.
- **Pure math:** First person plural is universal. "We now show...",
  "We may assume without loss of generality..." is the literal voice.
- **Humanities, social sciences (qualitative):** First person is fine and
  often expected for reflexive sections.

When in doubt, scan a few paragraphs of the paper for what the authors
already do, and match it.

### Tense

Tense in research papers is **functional**, not stylistic. Each function
has a default:

- **Established knowledge / general truths:** present.
  *"Transformers are sequence models that..."*
- **Prior work, what other papers did:** past or present perfect.
  *"Smith et al. (2021) showed that..."*, *"Several studies have argued
  that..."*
- **What this paper does (in introduction/abstract):** present.
  *"We propose...", "This paper presents..."*
- **What this paper did (in methods):** past.
  *"We trained the model on...", "Cells were incubated for 24 h."*
- **What the experiments showed (in results):** past for the action,
  present for the conclusion.
  *"Accuracy increased to 87% (Fig. 3). This indicates that..."*
- **Implications and future work:** present and modal.
  *"These findings suggest...", "Future work could..."*

Mixing tenses across these functions is normal and correct. Mixing tenses
within one function is usually a bug.

### Hedging

Hedging is how researchers signal what is established vs. what is
inferred. Used right, it makes a paper trustworthy. Used wrong, it makes
a paper sound like it is trying to dodge accountability.

**Use hedging when:**
- The conclusion is supported by the data but not proven.
  *"Our results suggest that X is sufficient for Y."*
- You are extrapolating beyond the experimental setting.
  *"This effect may generalise to larger models, although we did not
  test this."*
- You are reporting effect sizes with confidence intervals.
- You are comparing to other work whose conditions differ.

**Do not hedge when:**
- The data clearly supports the claim. *"Accuracy was 87%."* — not
  *"Accuracy was approximately around 87%."*
- The hedge is decorative. *"It could potentially possibly be argued
  that..."* is a sentence to delete, not edit.
- You are stating well-established background. *"Gradient descent
  minimises a differentiable loss function."* — not *"It is generally
  thought that gradient descent may minimise..."*

Common hedges that pull their weight: *suggest, indicate, consistent
with, may, appears to, is likely to, evidence for*. Hedges to use
sparingly: *seems to, perhaps, possibly, somewhat, in some sense,
arguably*. Stack two and you have AI prose.

### Confidence and contributions

The introduction's contributions paragraph is where authors are allowed
to commit. *"We make three contributions: ..."* is a research-paper
sentence; *"In this paper, we hope to perhaps shed some light on..."* is
not. If the contributions paragraph is hedge-soup, that is one of the
clearest AI tells in the document.

## Sentence and paragraph structure

### Sentence variety

Real papers vary sentence length more than you would expect. A typical
paragraph mixes:

- A short claim sentence (5–15 words)
- Two or three supporting sentences with citations or numbers
  (15–30 words)
- One slightly longer sentence that draws an inference (25–40 words)

Eight uniform 22-word sentences in a row is one of the loudest AI
signatures in the entire genre. Break it up.

### Paragraph shape

The default research-paper paragraph is **claim → evidence → implication**:

1. **Topic sentence** stating the paragraph's claim.
2. **Evidence**, usually with citation, number, or experimental detail.
3. **Implication or transition** that ties this paragraph to the
   surrounding argument.

Avoid the AI default of **topic sentence → restatement → list of three →
generic synthesis**. That shape is correct in shape and empty in
content.

### Transitions

Use the lightest transition that conveys the logical relationship. In
most cases, that is **none**. The reader can follow paragraph-to-paragraph
flow without "Furthermore," "Moreover," "Additionally," at the start of
every other paragraph.

When you do need a connector, prefer the specific over the generic:
- *"In contrast,"* — when introducing an opposing finding
- *"Building on this,"* — when extending prior work
- *"Despite this,"* — when introducing a counterexample
- *"To test this,"* — when transitioning to an experiment

Avoid: *"Furthermore," "Moreover," "Additionally," "It is also worth
noting that,"* and especially *"Importantly,"* (which usually precedes
something un-important — the reader can decide what is important).

## Citation integration

Citations should be integrated into the prose, not stapled to the end.
Three patterns work:

1. **Author-prominent.** *"Smith et al. (2021) showed that..."* — use
   when the cited work is the subject of the sentence, often in related
   work or when a specific paper's framing matters.
2. **Result-prominent.** *"Transformers outperform LSTMs on this benchmark
   [Vaswani et al., 2017]."* — use when the *finding* is what matters and
   the citation is the source.
3. **Bracketed pile.** *"Several recent studies have argued for this
   interpretation [12, 14, 19]."* — use sparingly, when surveying without
   focusing on any specific paper.

The AI failure mode is to put a bracketed pile at the end of every
sentence in the related work, with no integration. If three sentences in
a row end with `[N]`, rewrite at least one to be author-prominent.

Citation style depends on the venue:
- `\cite` — `\bibliographystyle{plain}` style numeric: [1, 2]
- `\citep` / `\citet` — natbib author-year
- `\autocite` / `\textcite` — biblatex
- `\cite[Sec.~3]{...}` — citing a specific section (perfectly fine)

Do not change the citation command; just rewrite around it.

## Word-level conventions

### Definition before use

Every non-trivial term, every abbreviation, every notation should be
defined the first time it appears. *"...convolutional neural network
(CNN) ..."* on first use, then *"CNN"* thereafter. AI-generated drafts
often introduce abbreviations they never define, or define the same
abbreviation twice — both are easy to spot and easy to fix.

### Numbers and units

- Numbers under 10 spelled out *unless* in a measurement, table, or
  technical context. *"three samples"* in a humanities paper; *"3 samples"*
  in a methods section. Match the paper's existing convention.
- Always pair numbers with units, with a non-breaking space: `3~mL`,
  `87.2\%`. Never `87.2 %` (loose space) or `87.2%` (no space).
- Significant figures should match the precision of the measurement. Do
  not promote `87%` to `87.00%` — it implies precision the data does not
  have.
- Use `\num{...}` and `\SI{...}` from `siunitx` if the paper already uses
  them; otherwise match local convention.

### Specific verbs

Research papers use a small set of verbs that carry specific meaning.
Use them in their proper sense:

- **show, demonstrate, prove** — strong claim, requires actual evidence
- **suggest, indicate** — softer claim, supported but not proven
- **observe, find, report** — descriptive, no theoretical claim attached
- **propose, introduce, present** — author's own contribution
- **argue, claim, posit** — interpretive, contested
- **assume, posit** — taken as a starting point, not derived
- **establish** — strong claim, often used for foundational results

The AI failure mode is to use *demonstrate* and *establish* everywhere
because they sound impressive. Down-grade where the evidence does not
warrant.

### Words to be cautious with

Not banned, but each is over-used in AI-academic prose. Use only when the
specific meaning fits.

- **novel** — every paper claims novelty. Reserve for the actual
  contribution; do not call methods, datasets, and architectures all
  novel in one paper.
- **comprehensive** — almost never accurate. A paper has a finite scope.
- **robust** — has a technical meaning in statistics and ML. Do not use
  it as a synonym for "good".
- **significant** — in a paper that reports p-values, "significant" means
  statistically significant. Don't use it as a generic positive adjective.
- **state-of-the-art** — fine when accurate and benchmarked, suspicious
  otherwise.
- **leverage** — corporate-speak. Prefer "use" or "exploit" or be
  specific.
- **utilise / utilisation** — always replace with "use".
- **delve** — never use.
- **shed light on** — never use.
- **paradigm** — almost always means "approach", say that.
- **nuanced, multifaceted, intricate** — vague positives, replace with
  the specific thing.
- **a wide variety of, a plethora of, a myriad of** — replace with a
  number or specific examples.

### Contractions

Generally avoided in formal academic prose. *"do not"* not *"don't"*,
*"it is"* not *"it's"*. Some venues (NeurIPS-style ML, blog-style HCI)
tolerate contractions in introductions. Match the surrounding paper.

### Capitalisation in headings

Two conventions exist:

- **Sentence case**: *"Methods and materials"*. CS, biomedical, most
  modern science journals.
- **Title case**: *"Methods and Materials"*. IEEE-style, some humanities,
  older conventions.

Match the document. Do not mix. AI drafts often randomly mix the two.

## Section-level conventions

### Abstract

A four-to-six-sentence shape that maps to: motivation → gap → method →
result → implication. Cap at the venue's word limit (often 150–250).
Never cite in the abstract unless the venue allows it. No "in this paper".
Use present tense for what the paper does, past tense for what was done.

Common AI tells in abstracts:
- *"In this paper, we propose a novel framework..."* — replace with what
  the framework does.
- *"...providing a comprehensive analysis of..."* — almost certainly false.
- *"Our findings have important implications for..."* — say which.

### Introduction

Standard shape: broad context → specific gap → this paper's approach →
contributions list → roadmap. The contributions list should be concrete
and verifiable, not aspirational.

### Related work

Avoid the bullet-list-of-citations failure mode. A good related work
section groups prior work by approach or by claim, not chronologically,
and **explains how this paper differs**, not just what others did.

### Methods

Past tense, often passive in lab sciences. Specific enough that someone
could replicate. Numbers, units, model names, hyperparameters.
Anti-pattern: marketing language ("we leverage state-of-the-art
techniques") instead of specifics ("we used Adam with lr=1e-4 and a
linear warmup of 1000 steps").

### Results

Describe what was observed in past tense. Reference figures and tables
with their numbers, not "the figure below". Effect sizes and uncertainty,
not just direction. Avoid interpretation here if there is a separate
discussion section.

### Discussion

Interpret. Place the result in context of prior work. State limitations
honestly — a paper without a limitations paragraph reads suspect.

### Conclusion

Short. Restate the main finding and its scope. One or two future-work
sentences if the venue expects them. Do not repeat the abstract.

## Working principle

Edit the prose so a reviewer in this field would not pause on any sentence
because of how it was written. They should pause only because of what it
says.
