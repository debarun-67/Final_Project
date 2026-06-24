# Humanizer pass: anti-AI pattern reference (academic adaptation)

This is the pattern catalogue you apply in Phase 4 of the workflow. It is
adapted from Wikipedia's "Signs of AI writing" (maintained by WikiProject
AI Cleanup) for the academic LaTeX context. The patterns here are the
*general* anti-AI patterns. The patterns specific to academic prose live
in `anti-detection.md`. Use this file together with that one — neither is
sufficient on its own.

## Important — what this file does NOT do

The general humanizer playbook tells you to "add soul": insert
first-person opinions, mixed feelings, tangents, half-formed thoughts.
**Do not do this in research papers.** Academic prose has voice, but the
voice is conveyed through *terminology preference, sentence rhythm,
structural choices, and hedging discipline* — not through opinions or
personality.

If your humanizer pass is making a paper sound like a blog post, you've
gone too far. The right outcome is academic prose that reads as written
by a careful human researcher — not by a writer with personality.

## How to run the pass

For each paragraph you rewrote in the academic-style pass, walk through
the patterns below. Whenever you hit one, fix it. Then do the
self-audit at the end.

## The patterns

### 1. Undue emphasis on significance and broader trends

LLMs puff up arbitrary claims by tying them to "broader" or "evolving"
contexts.

**Watch for:** *stands as / serves as a testament, plays a vital /
significant / crucial / pivotal / key role, marks a turning point, in
the rapidly evolving landscape, contributing to the broader, deeply
rooted, indelible mark, focal point, reflects broader trends.*

- **AI:** "The introduction of transformers marks a pivotal moment in
  the evolution of natural language processing, reflecting broader
  trends toward attention-based architectures."
- **Better:** "Transformers replaced recurrent architectures as the
  dominant model class for sequence tasks after 2017."

### 2. Promotional / advertisement language

Bad in any prose. Catastrophic in academic prose, where overclaiming is
a credibility-destroyer.

**Watch for:** *boasts a, vibrant, rich (figurative), groundbreaking,
profound, breathtaking, must-visit, stunning, nestled in, in the heart
of, exemplifies, commitment to.*

- **AI:** "Our framework boasts a comprehensive set of features that
  exemplify our commitment to robust evaluation."
- **Better:** "Our framework supports five evaluation modes (Section 4)."

### 3. Superficial "-ing" trailing clauses

LLMs tack present-participle clauses onto sentences to add the illusion
of analysis.

**Watch for:** clauses ending in *highlighting / underscoring /
emphasising / ensuring / reflecting / contributing to / fostering /
showcasing / cultivating / encompassing.*

- **AI:** "Our model achieves 87% accuracy, demonstrating its
  effectiveness and highlighting the importance of careful tuning."
- **Better:** "Our model reaches 87% accuracy. Hyperparameter tuning
  contributed about 2 points (Table 4)."

The fix is almost always to break the trailing clause into its own
sentence, with concrete content — or to drop it.

### 4. Vague attributions and weasel words

In academic context, this is a critical tell because real papers cite
specifically.

**Watch for:** *industry reports, observers have cited, experts argue,
some critics argue, several sources, recent studies have shown.*

- **AI:** "Recent studies have shown that this approach is effective
  [3, 7, 12]."
- **Better:** "Smith et al. (2021) and Chen et al. (2022) reported
  effectiveness on benchmarks A and B respectively."

If you cannot make the attribution specific (because you don't know the
content of the citations), keep the citation keys but rewrite to be
honest about the survey nature: "Several recent benchmarks have used
this approach [3, 7, 12]." Better yet, name what they did differently.

### 5. AI-vocabulary words (general)

Words that appear far more frequently in post-2023 text than before.
Each is a yellow flag in academic prose; clusters of them are a red flag.

**High-density AI words:**

*actually, additionally, align with, crucial, delve, emphasising,
enduring, enhance, fostering, garner, highlight (verb), interplay,
intricate / intricacies, key (adjective), landscape (abstract),
pivotal, showcase, tapestry, testament, underscore (verb), valuable,
vibrant, navigate (figurative), traverse (figurative), realm,
ecosystem (figurative), holistic, multifaceted, nuanced, comprehensive,
robust (as compliment), seamless, paradigm.*

**2023-2026 Emergent AI Words:**

*elucidate, explicate, instantiate, operationalize, leverage, utilize,
facilitate, ameliorate, augment, corroborate, substantiate, paramount,
quintessential, salient, substantive, transformative, groundbreaking,
profound, far-reaching, synergistic, seamless, imperative, essential,
noteworthy, meticulously, meticulously crafted, tailored, bespoke,
unpack, embark, maximize, game-changing, future-ready, cutting-edge,
innovative, seamless, robust, impactful.*

**Intensity Markers (often used as AI hedges):**

*significant, substantial, considerable, remarkable, dramatic, striking,
profound, compelling, robust (when used as a general compliment, though acceptable in statistics contexts).*

The detailed substitutions for each of these live in `phrase-bank.md`.
The default move is **delete and replace with a concrete description**.

### 6. Copula avoidance (is/are → serves as / stands as / functions as)

LLMs substitute decorative verbs for plain copulas. Real academic prose
uses *is / are* freely.

- **AI:** "Our framework serves as a foundation for future research."
- **Better:** "Our framework is a starting point for further work."
- **Often even better:** delete the sentence; if the framework matters,
  the rest of the paper will show it.

### 7. Negative parallelisms

The "not only X but also Y" / "it is not just A, it is B" pattern is
overused. So is the tailing-negation fragment ("..., no guessing").

- **AI:** "Our approach not only improves accuracy but also reduces
  inference time."
- **Better:** "Our approach improves accuracy and reduces inference
  time."

If the contrast is genuine and load-bearing, keep one instance.
Otherwise, flatten to a plain conjunction.

### 8. Rule-of-three lists

LLMs default to listing three items even when the world has two or
four. Real papers list however many there are.

- **AI:** "We evaluate on accuracy, robustness, and efficiency."
- **Check:** are all three real? If "efficiency" was padded in to make
  the list satisfying, drop it.

### 9. Elegant variation (synonym cycling)

LLMs cycle synonyms within a paragraph because their repetition penalty
is too aggressive. In academic prose, **consistent terminology is a
virtue.** A "model" stays a "model" throughout; do not promote it to
"system", "architecture", or "framework" in successive sentences.

- **AI:** "Our model achieves 87% on A. The system generalises to B.
  The architecture also performs on C."
- **Better:** "Our model achieves 87% on A, generalises to B, and
  performs comparably on C."

The exception is when the entities really are different (e.g., "model"
vs. "training pipeline" vs. "evaluation suite"). Then keep them
distinct.

### 10. False ranges ("from X to Y")

The construction works when X and Y are on a real scale (size, time,
temperature). It fails when they are not.

- **AI:** "Our method works from small datasets to large-scale corpora,
  from simple tasks to complex ones."
- **Better:** "We evaluated on three dataset sizes (1K, 100K, 10M
  examples)."

### 11. Passive voice and subjectless fragments

In academic prose this is **field-dependent** — see
`domain-conventions.md`. Lab-science methods sections are usually
passive past; CS/ML methods are usually active first-person plural.
Apply the field's convention; do not blanket-convert.

The genuinely AI-flavoured failure here is **subjectless fragments**
that drop the actor entirely:

- **AI:** "No additional configuration needed. Results are preserved
  automatically."
- **Better in CS register:** "We do not configure additional
  parameters. The system writes results to disk after each step."
- **Better in lab-science register:** "No additional configuration was
  applied. Results were saved to disk after each step."

### 12. Em-dash overuse (LaTeX form: `---`)

In LaTeX, em dashes appear as `---`. LLMs produce these where humans
would use a comma or a period.

- **AI:** "The term is promoted by institutions---not by the people
  themselves."
- **Better:** "The term is promoted by institutions, not by the people
  themselves."

**Hard rule: do not introduce any `---` during your rewrites.** If the
original file had em dashes, you may leave them. But every `---` you
write yourself is a red flag. When you feel the urge to write `---`,
use a comma, a period, or a parenthetical instead. No exceptions.

After editing, count the `---` occurrences in the file. If the count
is higher than in the original, you introduced em dashes. Remove them.

### 13. Smart quotes / curly quotes / Unicode artifacts

If you copy text out of LaTeX, edit it in your head, and paste it back,
the model can introduce:
- `“ ”` (curly double quotes) — should be `` `` `` and `''` in LaTeX
- `‘ ’` (curly single quotes) — should be `` ` `` and `'`
- `—` (literal em dash character) — should be `---`
- `–` (literal en dash character) — should be `--`
- `…` (literal ellipsis) — should be `\ldots` or `\dots`
- Non-breaking space (U+00A0) — should be `~`

These are common in raw model output. Always audit before saving. Even
a single curly quote in a LaTeX file is suspicious because real LaTeX
authors don't produce them — they type the LaTeX-correct form.

### 14. Bold-face emphasis as a tic

LLMs bold key phrases in lists or in prose. Academic prose almost never
uses `\textbf{}` for emphasis in body paragraphs. Reserve `\textbf` for
field-conventional uses (e.g., **Theorem 1.** in math papers, drug
class names in some clinical conventions).

- **AI:** "We propose **a novel framework** that **leverages** the
  power of **transformers**."
- **Better:** "We propose a framework based on transformers."

### 15. Inline-header vertical lists

The pattern: bullet items that start with a bold word followed by a
colon, then a generic sentence.

- **AI:**
  ```
  - **Performance:** The model is fast.
  - **Accuracy:** The model is accurate.
  - **Robustness:** The model is robust.
  ```
- **Better:** integrate into prose, with specifics: "The model achieves
  87% accuracy on A and 92% on B at 230 ms per example, including a
  10% drop under input perturbation (Table 5)."

If a bulleted list really is the right form (e.g., a contributions
list), keep the items concrete and stop calling them out with bolded
heads unless the venue does so.

### 16. Title case vs. sentence case in headings

AI drafts often randomly mix the two within a single paper. Pick one
based on the venue (`domain-conventions.md`) and apply consistently
throughout.

### 17. Knowledge-cutoff disclaimers

Stray AI-disclaimer sentences sometimes survive into a draft.

**Watch for:** *as of [date], up to my last training update, while
specific details are limited / scarce, based on available information,
recent developments may have affected.*

- **AI:** "While specific details about this dataset are not extensively
  documented in available sources, it appears to have been released
  in 2022."
- **Better:** "The dataset was released in 2022 [Jones et al., 2022]."

In an academic manuscript, *delete these on sight*. They have no
legitimate role in a paper and are immediately recognisable to any
reviewer.

### 18. Residual chatbot artifacts

Sometimes a draft includes the chatbot's own meta-commentary that the
author forgot to remove.

**Watch for:** *Here is a / I hope this helps / Let me know if / Of
course / Certainly / You're absolutely right / Would you like me to /
Sure thing.*

Delete on sight. Apologise to the user if you find this — it means a
draft was passed through without an editing pass.

### 19. Filler phrases

Verbose constructions that add words without meaning.

| Cut | Use |
|---|---|
| In order to achieve this goal | To achieve this |
| Due to the fact that | Because |
| At this point in time | Now / At this stage |
| In the event that | If |
| The system has the ability to process | The system processes |
| It is important to note that the data shows | The data show |
| It is worth mentioning that | (delete) |
| It should be emphasised that | (delete) |

The full table is in `phrase-bank.md`. The general move is to delete
the throat-clearing and start with the content.

### 20. Excessive hedging

Hedge stacking is two or more hedges in one clause. Real academic prose
uses one hedge or none.

- **AI:** "It could potentially possibly be argued that the policy
  might have some effect on outcomes."
- **Better:** "The policy may affect outcomes."

The art is keeping hedges where they belong (interpretive claims,
extrapolation, comparisons across non-identical conditions) and
removing them where they don't (reported numbers, methods, settled
background). See `academic-style.md` for where hedges earn their keep.

### 21. Generic positive conclusions

Vague upbeat closing sentences in any section.

- **AI:** "The future looks bright. Exciting possibilities lie ahead.
  This represents a major step in the right direction."
- **Better:** delete, or replace with a specific next step.

### 22. Hyphenated word-pair overuse

LLMs hyphenate common modifier pairs uniformly. Humans hyphenate them
inconsistently.

**Watch for over-hyphenation of:** *third-party, cross-functional,
client-facing, data-driven, decision-making, well-known, high-quality,
real-time, long-term, end-to-end, large-scale, fine-tuned, low-resource.*

In an academic context, **most of these compound modifiers are
correct** when used as adjectives before a noun. The tell isn't that
they're hyphenated — it's that they're hyphenated *uniformly and
constantly*. If a single paper has 30 instances of "data-driven" and
"high-quality" and "state-of-the-art" all spelled identically, that's
the tell.

The fix: don't introduce extra hyphenated pairs. If the paper
already has a heavy hyphen habit, leave the existing ones alone but
don't add more during your edits. (Note: in LaTeX, the hyphen `-` is
just a character — there's no special form for compound modifiers.)

### 23. Persuasive authority tropes

LLMs use these to pretend they are cutting through noise to a deeper
truth. The sentence after usually just restates an ordinary point.

**Watch for:** *the real question is, at its core, in reality, what
really matters, fundamentally, the deeper issue, the heart of the
matter.*

- **AI:** "The real question is whether teams can adopt this approach.
  At its core, what matters is technical readiness."
- **Better:** "Whether teams can adopt this approach depends on
  technical readiness."

### 24. Signposting / announcement sentences

LLMs announce what they will do instead of doing it.

**Watch for:** *Let's dive in, let's explore, let's break this down,
here's what you need to know, now let's look at, in this section we
will discuss, in what follows, having established X we now turn to Y.*

- **AI:** "In this section, we will explore the experimental setup."
- **Better:** describe the experimental setup. The section heading
  signals the topic.

In math papers especially, this kind of meta-commentary is a strong
tell. Get to the statement.

### 25. Fragmented headers (warm-up sentences after a heading)

LLMs follow a heading with a one-line generic sentence before the real
content.

- **AI:**
  ```
  ## Methods
  
  Methods are an important part of any paper.
  
  We collected data using ...
  ```
- **Better:**
  ```
  ## Methods
  
  We collected data using ...
  ```

### 26. The sycophantic / servile register

In manuscripts this rarely appears, but it can show up in cover
letters, response-to-reviewer documents, and acknowledgements that were
drafted by an AI assistant. If you see *"Great point!", "Thank you for
this excellent question", "We appreciate your insightful comments"* —
the latter two are conventional in response-to-reviewers and may be
appropriate; the first is a chatbot artifact and should be removed.

## 27. Detection-Aware Editing

Before running the final self-audit loop, apply detection-aware editing strategies. Detection tools analyze text through n-gram frequency, statistical distributions, and pattern combinations.

**Zero-tolerance mandate:** A single high-confidence AI signature can flag an entire section. If you suspect a pattern is an AI tell, rewrite it completely rather than minimally editing it.

- **Lexical:** Aggressively eliminate known AI n-grams. Normalize vocabulary distribution (avoid abstract noun overload, reduce adjective density).
- **Structural:** Vary paragraph shapes. Ensure no two adjacent paragraphs have the exact same length and structure. Break uniform transition patterns.
- **Rhythmic:** Break uniform sentence patterns. Introduce irregularity in punctuation and clause structure. Use a mix of short and long sentences.

## 28. The multi-pass self-audit (this is the heart of the pass)

After applying the patterns above, run this **iterative** loop. A single pass is insufficient for complex statistical signatures.

1. **Pass 1:** Apply all checklist patterns to the paragraph.
2. **Pass 2 (Self-Audit):** Ask yourself, **"List at least 3 remaining AI signatures in this paragraph."** Look for n-grams, rhythm issues, and vocabulary distribution. Revise identified tells aggressively.
3. **Pass 3 (Statistical Analysis):** Analyze sentence length variance, transition patterns, and vocabulary distribution explicitly. Even if a paragraph "looks good," check these statistics.
4. **Pass 4 (Second Self-Audit):** Ask yourself again, "What remaining signatures exist?" Revise any remaining tells.
5. **Iteration Criteria:** Continue this loop until you can identify **zero** tells. If you identify even one residual tell, you must revise and re-audit.

This multi-pass loop catches things single-pass checklist-walking misses, ensuring statistical signatures are fully addressed.

## What good looks like after the humanizer pass

A paragraph that has passed the academic-style pass and the humanizer
pass should be:

- Concrete (numbers, names, specific results, specific citations).
- Consistent in terminology (one term per concept).
- Varied in sentence length within the paragraph (at least one
  noticeably shorter or longer than the others).
- Hedged where the literature is uncertain, asserted where the data is
  firm.
- Free of decorative connectives (Furthermore, Moreover, Additionally
  as paragraph openers).
- Free of trailing -ing clauses that add only decoration.
- Free of em-dash tics, smart quotes, and Unicode artifacts.
- Not sycophantic, not chatbot-flavoured, not promotional.
- **Not** chatty, not personal, not opinionated, not blog-styled.

If most paragraphs in the rewritten paper meet these criteria, the
paper will read as human-written to a knowledgeable reviewer or
detector — and as professional to the venue's audience.

## Reference

The patterns in this file are adapted from
[Wikipedia:Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing),
maintained by WikiProject AI Cleanup. Two key adaptations were applied
for the academic-LaTeX context:

1. The general humanizer's "add soul / inject personality / first-person
   opinions / mixed feelings" guidance is **removed**, because it is
   inappropriate for research-paper prose.
2. LaTeX-specific notes were added (em dash as `---`, smart quotes,
   Unicode artifacts, environment-respecting edits).
