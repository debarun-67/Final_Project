# Anti-detection: academic-specific AI tells

Use this in Phase 4 (the second-pass audit) along with `humanizer.md`.
The two files are complementary:

- `humanizer.md` covers the general-purpose anti-AI patterns adapted for
  academic LaTeX (em-dash overuse, rule of three, copula avoidance, AI
  vocabulary, hedge stacking, signposting, smart-quote contamination,
  etc.) and contains the self-audit loop.
- This file covers the additional tells that show up specifically in
  **AI-generated academic writing** — patterns that an experienced
  reviewer or a detection tool trained on post-2023 academic prose will
  catch even after the general humanizer pass.

These are the things that make a paper read "AI" even when every
individual sentence looks fine. Run this pass after `humanizer.md`, not
before.

## How to run this pass

For each paragraph you rewrote, walk through the checklist below.
Whenever you find a hit, fix it before moving on. Do this *after* the
academic-style pass and *after* the humanizer pass — the residual
patterns this catches are the ones the previous passes won't have
removed.

It is a check, not a creative rewrite. If you don't see any hits in a
paragraph, leave it alone.

## The checklist

### 1. Uniform paragraph shape

AI-generated paper paragraphs have a recognisable rhythm:

- 3–5 sentences
- Sentence 1: topic claim
- Sentence 2–3: supporting elaboration
- Sentence 4–5: synthesising restatement
- Often ends with an "underscoring", "highlighting", or "providing"
  participial clause

If every paragraph in a section has this exact shape, that is a strong
detector signal even if no individual sentence is bad. Real academic
paragraphs vary much more: some are two sentences, some are eight, some
end on a bare claim, some end on a citation, some on a number.

**Fix:** vary at least every third paragraph. Break up a long one with
a paragraph boundary mid-thought, or merge two short ones into one
denser paragraph.

### 2. Paper-introductory throat-clearing

Real research introductions do not warm up. They state a problem and
move. AI introductions warm up at length:

- "In recent years, the field of X has seen tremendous growth..."
- "With the advent of Y, researchers have increasingly turned to..."
- "X has long been a topic of interest in the community..."

**Fix:** if the first paragraph of the introduction does not contain a
specific fact, finding, or problem statement, rewrite it so it does.
The reader should know in two sentences what the paper is about.

### 3. Empty contribution claims

Look at the contributions paragraph. Each contribution should be a
specific, falsifiable claim. AI contributions tend to be vague:

- "We propose a novel framework for X" — what does it do?
- "We provide a comprehensive evaluation" — on what?
- "We demonstrate the effectiveness of our approach" — by which metric?
- "We open new avenues for research" — name one.

**Fix:** every bullet in a contributions list should answer "what,
specifically, did this paper add to the literature that someone could
verify or refute?"

### 4. The "novel framework" gauntlet

AI papers love the word "novel" and the word "framework". A real paper
uses each carefully:

- "novel" — once, attached to the actual new thing.
- "framework" — when there is genuinely a framework (a set of related
  abstractions). Often what AI calls a "framework" is just a method or
  a model.

**Fix:** count occurrences. If "novel" appears more than 2–3 times in a
short paper, cut. If "framework" appears for things that are not
frameworks, replace with "method", "model", "approach", or the actual
component name.

### 5. Decoration verbs in results

Results sections are about what was observed and measured. AI results
sections are about how impressive that is.

Decoration verbs to flag: *demonstrate, exhibit, showcase, validate,
underscore, highlight, emphasise, prove, establish (when used loosely),
confirm, verify*.

A normal sentence: "Our model reaches 87% accuracy on X (Table 2)."
An AI sentence: "Our model demonstrates remarkable performance,
achieving 87% accuracy and underscoring the effectiveness of our
proposed approach."

**Fix:** in results sections, lean on neutral verbs (*reach, achieve,
score, increase to, decrease to, improve over, match, fall short of*)
plus the number. Save *show* and *find* for places where you really are
making an inference from the data.

### 6. Citation theatre

AI tends to cite for vibes, not for content. Watch for:

- Sentences ending in citation piles `[3, 7, 12, 15, 18]` where the
  sentence does not actually need five sources to support it.
- Citations that don't seem to do work — the sentence reads the same
  with them removed.
- "Several recent works" or "many studies" followed by 3–4 citations,
  where naming one or two specifically would be more honest.
- Suspicious clusters: every third sentence in related work ends with
  exactly two citations.

**Fix:** for each citation cluster, ask whether each citation is the
*right* citation for the specific claim. If the cluster is decorative,
keep the strongest one or two and drop the rest.

(If you are editing and don't have access to verify the citations
themselves, leave the keys alone — your job is only to flag the
*pattern* and reshape the prose, not to guess which citation is real.)

### 7. Even hedging distribution

Real papers hedge where the literature is uncertain and assert where it
is settled. AI papers spread hedging evenly across all sentences.
Visible signs:

- Methods section with hedges ("X may be considered a standard
  approach...") — methods should be assertive about what was done.
- Results section with hedges around the actual numbers ("our model
  appears to achieve approximately 87%...") — measured results are not
  hedged.
- Discussion section *without* hedges around interpretive claims — if
  every interpretation is asserted as fact, that is also suspicious.

**Fix:** strip hedges from methods and reported numbers. Restore
appropriate hedges to interpretive claims in discussion.

### 8. Symmetric "balanced view" reflexes

AI prose has a strong reflex to present "both sides" even when the
paper is making a one-sided argument. Signs:

- "While X has many advantages, it also has limitations..."
- "Although our approach performs well, we acknowledge that..."
- "X has been praised by some and criticised by others..."

These are fine where they're true. But AI tends to insert them at the
end of every paragraph as a tic.

**Fix:** keep balanced views where they reflect the literature.
Remove them where they're decorative concession-making.

### 9. The "implications" pile-on

AI conclusions and discussions love to gesture at "implications" without
naming them.

- "These findings have important implications for the field of X."
- "Our results have profound implications for both theory and practice."
- "The implications of our work extend beyond X to Y and Z."

**Fix:** for each "implications" sentence, either name the implication
specifically or delete the sentence. "Our finding that batch
normalisation degrades calibration suggests that uncertainty-sensitive
applications should consider alternatives" is real. "Our findings have
significant implications for safety-critical systems" is decoration.

### 10. Smooth transition addiction

Real academic prose lets the reader do some of the connective work. AI
prose explicitly bridges every paragraph and every section.

Transition phrases to flag: *Furthermore, Moreover, Additionally,
Building on this, As we have seen, Having established X, we now turn
to Y, In what follows*.

**Fix:** delete most of these. Read the paragraph after deleting the
transition. If it still flows, the transition was decoration. If it
doesn't flow, the relationship needs a more specific connector
("In contrast,", "By the same argument,", "To test this,") rather than
a generic one.

### 11. Section-end summary tics

AI writers like to end every subsection with a one-sentence summary
("In summary, X improves Y."). Real papers do this only where the
section was complex enough to warrant it.

**Fix:** in a paper where every subsection ends with a summary, delete
all but the truly necessary ones (usually only at the end of major
sections).

### 12. Generic future work

AI conclusions almost always end with a generic "future work" paragraph
that lists three plausible-but-unspecific directions.

- "In future work, we plan to explore X, extend Y, and investigate Z."

This is a tell because real future-work paragraphs are either short and
specific ("We plan to test whether the effect persists for transformer
sizes above 13B parameters") or absent entirely.

**Fix:** if the future-work paragraph is generic, either replace with a
specific one (ask the user if needed) or shorten to a single sentence.

### 13. The "comprehensive overview" trap

In related work and background sections, AI defaults to wanting to give
a "comprehensive overview" of the field. Real related-work sections are
**selective**: they cite the works that matter for *this* paper's
argument, not a tour of the literature.

Signs:
- Related work that mentions sub-areas not relevant to the paper.
- Citations to surveys instead of to specific findings.
- Paragraphs of the form "X has been studied in many forms: A [1], B
  [2], C [3], D [4]..."

**Fix:** prune. A focused related-work section that cites 12 papers
deeply beats a survey-style one that cites 60 superficially.

### 14. Polished but voiceless

Even after you remove the AI clichés, the prose can still feel "AI" if
it has no consistent author voice. Real papers have authorial tics:

- An author who uses "indeed" sparingly will use it once or twice in a
  paper.
- An author who likes long sentences with semicolons will use a few.
- An author who prefers "we show" over "we demonstrate" will be
  consistent.

After your edits, the paper's voice should feel coherent, not like a
patchwork of style.

**Fix:** read the paper end-to-end after editing. If two sections feel
like they were written by different people (and they aren't supposed
to be), tighten the prose-style choices to be consistent.

### 15. Suspicious n-gram patterns

Detection tools key on specific n-grams that appear far more often in
AI text than in pre-2023 text. These are organized by detection strength
and context sensitivity.

#### 15.1 HIGH-CONFIDENCE AI SIGNATURES (zero tolerance everywhere)

These phrases are nearly exclusive to post-2023 AI text. Remove or
rewrite every occurrence without exception:

**Realm/domain/sphere metaphors:**
- "in the realm of"
- "in the domain of" (acceptable only in formal math contexts: "in the domain [0,1]")
- "in the sphere of"
- "within the purview of"
- "in the landscape of"
- "in the rapidly evolving landscape of"
- "the landscape of X has shifted"
- "positioned at the nexus of"
- "situated at the intersection of"
- "at the forefront of"
- "at the cutting edge of"

**Delving and depth metaphors:**
- "delving into"
- "delve into"
- "delve deeper into"
- "delving into the intricacies of"
- "a deeper dive into"
- "unpacking the nuances of"
- "unraveling the complexities of"
- "peeling back the layers of"

**Light and illumination metaphors:**
- "shed light on"
- "sheds light on"
- "cast light on"
- "illuminate the complexities of"
- "bring to light"
- "elucidate the nature of"
- "explicate the relationship between"

**Role and importance declarations:**
- "play a pivotal role"
- "plays a crucial role in"
- "serves as a cornerstone"
- "stands as a testament to"
- "a testament to"
- "underscores the importance of"
- "underscoring the significance of"
- "highlighting the critical role of"
- "emphasizing the pivotal nature of"

**Navigation and journey metaphors:**
- "navigate the complexities of"
- "navigating the challenges of"
- "traverse the landscape of"
- "charting a course through"
- "embarking on a journey to"

**Leverage and power claims:**
- "leverage the power of"
- "harness the potential of"
- "capitalize on the strengths of"
- "unlock the potential of"
- "tap into the capabilities of"

**Multifaceted and intricate patterns:**
- "a multifaceted approach"
- "multifaceted nature of"
- "intricate interplay"
- "the interplay between"
- "the intricate relationship between"
- "the nuanced relationship between"
- "the complex interplay of"

**Comprehensive claims:**
- "comprehensive understanding"
- "a comprehensive understanding of"
- "holistic understanding of"
- "thorough understanding of"
- "in-depth understanding of"

**Temporal evolution claims:**
- "the field of X has witnessed"
- "has witnessed significant advances"
- "in recent years, X has seen"
- "with the advent of"
- "in light of recent advances"
- "the proliferation of"
- "the emergence of"
- "the rise of X has led to"
- "with the rise of"

**Imperative constructions:**
- "it is imperative to"
- "it is essential to note that"
- "it is worth noting that"
- "it is important to recognize that"
- "it is crucial to understand that"
- "one must consider"

**Data-driven era claims:**
- "in today's data-driven world"
- "in an era of big data"
- "in the age of artificial intelligence"
- "in the digital age"

#### 15.2 STRONG AI SIGNATURES (remove unless domain-specific)

These phrases are heavily overused by AI but may be acceptable in
specific technical contexts. Default to removal; keep only if the phrase
is standard terminology in the subfield:

**Building and construction metaphors:**
- "building upon these insights"
- "built upon the foundation of"
- "laying the groundwork for"
- "serves as a foundation for"
- "the cornerstone of our approach"

**Framework and approach clusters:**
- "novel framework" (acceptable once per paper for the actual contribution)
- "robust framework" (acceptable in statistics contexts: "robust estimation framework")
- "comprehensive framework"
- "unified framework"
- "principled approach"
- "principled framework"
- "employing a principled approach"
- "leveraging state-of-the-art techniques"

**Effectiveness and performance declarations:**
- "demonstrates the effectiveness of"
- "showcases the potential of"
- "validates the efficacy of"
- "underscores the robustness of"
- "highlights the superiority of"

**Integration and confluence patterns:**
- "seamless integration of"
- "synergistic combination of"
- "the confluence of X and Y"
- "the convergence of X and Y"
- "at the confluence of"
- "bridging the gap between"

**Paradigm and shift claims:**
- "paradigm shift in"
- "represents a paradigm shift"
- "transformative potential of"
- "revolutionary approach to"
- "groundbreaking approach to"

**Implications and ramifications:**
- "far-reaching implications"
- "profound implications for"
- "significant ramifications for"
- "wide-ranging implications"
- "implications extend beyond"

**State-of-the-art claims:**
- "state-of-the-art performance"
- "state-of-the-art results"
- "surpassing state-of-the-art"
- "achieving state-of-the-art" (acceptable in ML contexts with specific benchmarks)

#### 15.3 MODERATE AI SIGNATURES (context-dependent)

These patterns appear in both human and AI text but are statistically
overrepresented in AI. Flag them and evaluate context:

**As we/having established transitions:**
- "as we delve deeper"
- "as we shall see"
- "as we have seen"
- "having established X"
- "having demonstrated X"
- "with this in mind"

**Light of findings:**
- "in light of these findings"
- "in light of the above"
- "in view of these results"
- "given these observations"

**Warrant and merit claims:**
- "warrants further investigation"
- "merits closer examination"
- "deserves careful consideration"
- "necessitates a reevaluation of"

**Pave the way:**
- "pave the way for"
- "paves the way for"
- "opens the door to"
- "sets the stage for"
- "lays the foundation for"

**Not only/but also constructions:**
- "not only X but also Y"
- "serves not only to X but also to Y"
- "allows us to not only X but also Y"

**Burgeoning and growing fields:**
- "burgeoning field of"
- "rapidly growing field of"
- "ever-increasing demand for"
- "growing body of evidence"

#### 15.4 COMBINATION PATTERNS (flag when clustered)

These phrases are individually acceptable but collectively signal AI when
2+ appear in the same paragraph:

**Contribution cluster:**
- "novel" + "framework" + "comprehensive"
- "robust" + "approach" + "demonstrates"
- "state-of-the-art" + "performance" + "achieving"
- "proposed" + "methodology" + "effectiveness"

**Evaluation cluster:**
- "extensive experiments" + "demonstrate" + "superiority"
- "comprehensive evaluation" + "validates" + "effectiveness"
- "rigorous analysis" + "confirms" + "robustness"

**Impact cluster:**
- "significant" + "implications" + "profound"
- "far-reaching" + "potential" + "transformative"
- "critical" + "insights" + "understanding"

**Transition cluster:**
- paragraph starts with "Furthermore" or "Moreover"
- next paragraph starts with "Additionally" or "In addition"
- third paragraph starts with "Building upon this"

**Fix for combinations:** if you find 2+ phrases from the same cluster
in one paragraph, rewrite to eliminate all but one, or break the
paragraph to separate them.

#### 15.5 EMERGENT 2023-2026 PATTERNS

Newly identified patterns from recent AI models (GPT-4o, Claude 3.5, Gemini 1.5, and 2025/2026 models):

**Operationalize and instantiate:**
- "operationalize the concept of"
- "instantiate our framework"
- "concretize the notion of"
- "formalize the intuition that"
- "maximize the potential of"

**Offers/provides passive constructions:**
- "offers a promising avenue for"
- "provides a pathway to"
- "affords an opportunity to"
- "presents a unique opportunity"

**Underpin and inform:**
- "underpins our approach"
- "informs our design choices"
- "motivates our investigation"
- "guides our methodology"

**Dual-nature constructions:**
- "both X and Y" appearing 3+ times in one section
- "serves dual purposes"
- "two-fold objective"
- "addresses both theoretical and practical concerns"

**Increasingly/growing adverbs:**
- "increasingly important"
- "increasingly recognized"
- "growing recognition of"
- "mounting evidence for"

**Imperative to understand/recognize:**
- "critical to understand"
- "essential to recognize"
- "important to acknowledge"
- "necessary to consider"

**Substantive and salient:**
- "substantive contribution"
- "salient features of"
- "noteworthy aspect of"
- "distinguishing characteristic of"

**Rich and fertile metaphors:**
- "rich set of"
- "rich body of work"
- "fertile ground for"
- "fruitful direction for"

**2025-2026 Consultant-Speak & AI Slop:**
- "in today's fast-paced world"
- "game-changing approach"
- "future-ready framework"
- "unlock the potential of"
- "unpacking the nuances of"
- "embark on a journey to"

#### 15.6 ACADEMIC-SPECIFIC AI VOCABULARY OVERUSE

These words are legitimate academic terms but are used at 3-5× the rate
in AI text versus human-written papers from the same field. Flag when
density is high (more than 2-3 occurrences per page):

- "elucidate" (use "clarify", "explain", or "show" instead)
- "explicate" (use "explain" or describe the mechanism directly)
- "instantiate" (acceptable in CS theory; avoid elsewhere)
- "operationalize" (acceptable in social sciences; avoid in hard sciences)
- "leverage" as a verb (use "use", "apply", "exploit")
- "utilize" (use "use")
- "facilitate" (use "enable", "allow", "make possible")
- "ameliorate" (use "improve", "reduce")
- "augment" (use "increase", "enhance", "extend")
- "corroborate" (use "confirm", "support")
- "substantiate" (use "support", "confirm", "verify")
- "underscore" (use "emphasize", "show", or state directly)
- "underscore" (use "highlight", "show", or state the finding)
- "paramount" (use "essential", "critical", or "important")
- "quintessential" (usually decorative; delete or use "typical", "characteristic")

**Fix:** Count these words across the paper. If any single word appears
more than 3 times in an 8-page paper, replace 50%+ of occurrences with
simpler alternatives.

#### 15.7 SECTION-SPECIFIC DANGER PATTERNS

Certain n-grams are particularly damaging in specific sections:

**In introductions:**
- "In recent years, the field of X has witnessed"
- "The advent of X has led to"
- "X has emerged as"
- "There is a growing recognition that"
- "It is widely acknowledged that"

**In related work:**
- "A growing body of literature"
- "Numerous studies have shown"
- "A wealth of research has"
- "Extensive work has been done"
- "While much work has focused on"

**In methods (where they imply uncertainty about your own work):**
- "We employ a strategy that may be considered"
- "Our approach can be viewed as"
- "This could potentially allow"
- "We leverage what might be described as"

**In results (decoration verbs already covered in §5, but these are the n-gram versions):**
- "clearly demonstrates that"
- "strongly suggests that"
- "provides compelling evidence that"
- "offers strong support for"

**In conclusions:**
- "In conclusion, we have presented"
- "To summarize, our work has"
- "In summary, we have demonstrated"
- "This work represents a step toward"
- "Future work will explore"
- "We leave for future work"

**Fix:** zero tolerance in section-specific contexts. A phrase acceptable
in discussion may be a tell in methods. Check every occurrence against
the section it appears in.

---

**DETECTION STRENGTH SUMMARY:**

- **§15.1 (High-confidence):** Remove every occurrence. These phrases
  are nearly unique to AI text post-2023.
- **§15.2 (Strong):** Remove unless the phrase is standard terminology
  in your specific subfield (e.g., "robust regression" in statistics).
- **§15.3 (Moderate):** Evaluate each occurrence. Keep if it serves a
  specific purpose; remove if it's decorative.
- **§15.4 (Combinations):** Watch for clustering. Two high-AI phrases
  in one paragraph is a detector signal even if each is individually
  borderline acceptable.
- **§15.5 (Emergent):** Newly identified 2023-2024 patterns. Treat as
  high-confidence signatures.
- **§15.6 (Vocabulary):** Check density across the paper, not just
  individual occurrences.
- **§15.7 (Section-specific):** Context matters. A phrase acceptable
  in discussion may trigger detection in methods.

**WORKING METHOD:**

1. Search the document for each high-confidence phrase (§15.1, §15.5).
   Remove or rewrite every hit.
2. Search for strong signature phrases (§15.2). Remove unless domain-
   specific.
3. Count density of academic vocabulary (§15.6). If any word appears >3
   times per 8 pages, replace 50%+ occurrences.
4. Read each paragraph and flag combination patterns (§15.4). If 2+
   high-AI phrases cluster, rewrite.
5. Check section-specific patterns (§15.7) in their respective sections.

If a phrase doesn't appear in this catalog but *sounds* like it could,
apply the same judgment: is this phrasing more common in AI text than
in human academic writing from before 2023? If yes, rewrite it.

### 16. AI-typical punctuation rhythm

In LaTeX, the practical version of em-dash overuse is `---` overuse.
LLMs sprinkle these where humans would use commas or periods. In a
typical 8-page paper, expect zero to four `---`s in real human writing;
ten or more is suspicious.

**Fix:** count `---` in the file. If there are more than five or six in
a normal-length paper, audit each one. Replace with a comma, a period, or
a parenthetical pair where appropriate.

Same applies to colons used to introduce a punchy follow-up clause
("X is the goal: Y is the means.") and to semicolons used as a
"sophisticated" linker rather than for genuine list-of-clauses use.

### 17. Heading-case inconsistency

If the paper mixes sentence case and title case across headings, that's
a tell that an AI generated different sections separately. Pick one
based on the venue (see `domain-conventions.md`) and apply consistently.

### 18. The honest test

After all the above, do this final pass for each paragraph you rewrote:

1. Read the paragraph aloud (or at least sub-vocalise it).
2. Ask: "Does this sound like the same person wrote it as the rest of
   the paper?"
3. Ask: "If a reviewer paused on this paragraph, would they pause
   because of *what it says* or because of *how it's written*?"

If the answer to #3 is "how it's written", the paragraph is not done
yet, even if every checklist item passed.

### 19. Rhythm and flow analysis

Detection algorithms increasingly identify AI text through statistical
analysis of rhythmic patterns that humans naturally vary but AI models
tend to regularize. Even after removing suspicious n-grams and
decoration verbs, uniform rhythm patterns remain a strong detection
signal.

This section targets the **statistical signatures** that checklist-based
approaches miss: patterns that become visible only when you analyze
distributions across paragraphs and sections.

#### 19.1 Sentence length variance

AI text exhibits suspiciously uniform sentence length within paragraphs.
Real academic writing varies more dramatically.

**Detection metric:**
- Calculate the standard deviation of sentence lengths (in words) within
  each paragraph
- Flag if standard deviation is less than 15% of the mean sentence length
- Example: paragraph with sentences of [18, 21, 19, 20, 22] words has
  mean=20, std=1.58, std/mean=7.9% → **flag as uniform**

**What AI does:**
- Generates paragraphs where every sentence is 18-24 words
- Avoids very short sentences (<10 words) and very long sentences (>35
  words)
- Creates a "smooth" rhythm that sounds polished but reads as artificial

**Fix strategies:**
1. **Insert one very short sentence per 3 paragraphs:** Break a claim
   into two sentences where the second is <8 words: "Our model achieves
   87% accuracy. Table 2 shows the breakdown."
2. **Expand one sentence per section into a longer, complex sentence:**
   Combine related claims with semicolons or subordinate clauses to
   create at least one sentence >35 words per major section
3. **Vary deliberately:** If you've written four sentences of ~20 words
   each, make the fifth either <12 or >30 words

**Examples:**

Before (uniform rhythm):
> Our model achieves state-of-the-art performance on three benchmarks. The
> results demonstrate significant improvements over prior methods. We
> observe consistent gains across all evaluation metrics. These findings
> validate the effectiveness of our approach.

Sentence lengths: [19, 17, 18, 19] → std/mean=4.7% → **AI-like**

After (varied rhythm):
> Our model achieves state-of-the-art performance on three benchmarks:
> ImageNet (87.3%), CIFAR-100 (76.2%), and Places365 (61.4%), exceeding
> prior methods by 2-4 percentage points in each case. Table 2 shows the
> breakdown. The improvements hold across different model sizes,
> architectural variants, and training regimes, suggesting the gains
> derive from the core algorithmic innovation rather than
> hyperparameter tuning. This validates our approach.

Sentence lengths: [38, 4, 32, 3] → std/mean=94% → **human-like variance**

#### 19.2 Transition word placement

AI models tend to place transition words at predictable positions,
particularly at the start of paragraphs. Real academic writing varies
transition placement more.

**Detection patterns:**
- Every paragraph in a section starts with a transition word
  (Furthermore, Moreover, Additionally, However, In contrast)
- Transitions appear at identical sentence positions across paragraphs
  (always sentence 1, or always sentence 3)
- No mid-paragraph transitions where the argument shifts

**What AI does:**
- Uses paragraph-initial transitions as a bridge even when the logical
  flow doesn't require explicit signaling
- Avoids mid-sentence transitions ("; however,", "— though") in favor
  of sentence-initial ones
- Creates a rhythmic expectation: reader anticipates a transition at
  the start of each paragraph

**Fix strategies:**
1. **Delete 50% of paragraph-initial transitions:** If the paragraph
   flows naturally without "Furthermore" or "Moreover", remove it
2. **Move transitions mid-paragraph:** Change "Additionally, we evaluate
   on X." to "We also evaluate on X." or "We evaluate on X as well."
3. **Vary transition types:** Don't use the same transition pattern
   (e.g., "Furthermore") more than twice in one section
4. **Use implicit transitions:** Let the content create the transition
   through parallel structure or contrast, rather than explicit signals

**Examples:**

Before (predictable transitions):
> Furthermore, we evaluate our model on held-out test data. Moreover,
> the results confirm the generalization of our approach. Additionally,
> we conduct ablation studies to isolate the contribution of each
> component.

After (varied transitions):
> We evaluate our model on held-out test data. The results confirm
> generalization to unseen examples. Ablation studies (Table 3) isolate
> the contribution of each component.

#### 19.3 Clause structure patterns

AI text follows predictable clause structure templates. Detection tools
can identify if >70% of sentences follow the same subject-verb-object-
clause pattern.

**Detection patterns:**
- Most sentences follow: [Subject] [verb] [object/complement], [subordinate
  clause]
  - "Our model achieves 87% accuracy, outperforming all baselines."
  - "The results demonstrate effectiveness, confirming our hypothesis."
  - "We evaluate on three benchmarks, showing consistent gains."
- Consistent use of participial clauses at sentence end (see §1)
- Few sentences that start with subordinate clauses, prepositional
  phrases, or inverted constructions

**What AI does:**
- Generates the "safe" S-V-O-clause template because it's grammatically
  correct and informationally clear
- Avoids complex fronted constructions that might confuse the reader
- Creates a predictable rhythm: reader can anticipate sentence structure

**Fix strategies:**
1. **Front subordinate clauses:** Change "We evaluate on X to test Y"
   to "To test Y, we evaluate on X"
2. **Use passive voice selectively:** Change "Our model achieves X" to
   "X is achieved by the model" in 1-2 sentences per section (not
   everywhere — passive overuse is its own tell)
3. **Invert for emphasis:** Change "Performance drops significantly
   at..." to "At X, performance drops significantly"
4. **Vary clause types:** Use relative clauses ("The model, which was
   trained on X,..."), noun clauses ("That the model generalizes..."),
   and conditional clauses ("If we ablate X, performance...") to break
   the S-V-O-clause pattern

**Examples:**

Before (uniform S-V-O-clause):
> Our model achieves 87% accuracy, outperforming the baseline. The
> results demonstrate robustness, confirming our design choices. We
> evaluate on three benchmarks, showing consistent gains.

After (varied clause structures):
> Our model achieves 87% accuracy, outperforming the baseline. That
> this holds across three benchmarks — ImageNet, CIFAR, Places365 —
> confirms the design's robustness. When we ablate the attention
> mechanism, performance drops to 81%.

#### 19.4 Paragraph length uniformity

Detection tools flag when all paragraphs in a section are within 20%
of the same length (measured in sentences or words). Real academic
sections have more variance.

**Detection metric:**
- Count sentences per paragraph in each section
- Flag if 80%+ of paragraphs have the same sentence count ±1
- Example: section with paragraphs of [4, 5, 4, 5, 4, 5] sentences →
  **flag as uniform**

**What AI does:**
- Generates paragraphs that are consistently 3-5 sentences
- Avoids very short paragraphs (1-2 sentences) and very long paragraphs
  (8+ sentences)
- Creates visual uniformity on the page that human readers subconsciously
  register as "too even"

**Fix strategies:**
1. **Create at least one 2-sentence paragraph per section:** Merge a
   transitional sentence with the previous paragraph, leaving the
   follow-up claim as a short paragraph
2. **Create at least one 7+ sentence paragraph per major section:**
   Combine two related paragraphs or expand one paragraph with
   additional supporting detail
3. **Break mid-thought:** If you have two 5-sentence paragraphs back-to-
   back, break one of them after sentence 3 to create 3-sentence and
   2-sentence paragraphs
4. **Respect logical boundaries:** Don't force artificial variation —
   break paragraphs where the argument naturally shifts, but do break
   when you have a choice between "5 sentences" and "3 + 2 sentences"

**Examples:**

Before (uniform 4-5 sentence paragraphs throughout section):
> Para 1: [4 sentences about problem]
> Para 2: [5 sentences about prior work]
> Para 3: [4 sentences about our approach]
> Para 4: [5 sentences about results]

After (varied paragraph lengths):
> Para 1: [2 sentences stating problem sharply]
> Para 2: [5 sentences about prior work]
> Para 3: [4 sentences about our approach]
> Para 4: [7 sentences about results with expanded detail]

#### 19.5 Punctuation rhythm

AI text uses semicolons, colons, and em-dashes at regular intervals,
creating a detectable rhythm. Real academic writing clusters these or
uses them sparingly and irregularly.

**Detection patterns:**
- Semicolons appear at predictable intervals (every 4th paragraph, or
  exactly once per page)
- Colons used for "punchy" follow-up clauses appear with uniform
  frequency
- Em-dashes (`---` in LaTeX) appear evenly distributed rather than
  clustered where the author needs parenthetical asides

**What AI does:**
- Uses semicolons to "elevate" the prose at regular intervals
- Inserts colons for rhetorical effect every few paragraphs
- Distributes em-dashes evenly as a sophisticated alternative to commas

**Fix strategies:**
1. **Cluster or eliminate:** If you have 6 semicolons spread evenly
   across a section, either consolidate to 2-3 in one or two
   paragraphs (where you're genuinely listing related clauses) or
   replace the others with periods
2. **Check colon purpose:** Keep colons where they introduce lists or
   genuinely set up a payoff ("The model has one requirement: X").
   Remove where they're decorative ("The conclusion is clear: our
   approach works.")
3. **Audit em-dash usage:** Count `---` in your LaTeX file. If there are
   >6 in a normal-length paper, remove decorative ones. Keep only where
   you need a genuine parenthetical aside or interruption
4. **Accept irregular distribution:** It's fine to have three em-dashes
   in one paragraph and zero in the next five. That's human.

**Examples:**

Before (regular punctuation rhythm):
> Para 1: [uses semicolon]
> Para 2: [no special punctuation]
> Para 3: [uses semicolon]
> Para 4: [no special punctuation]
> Para 5: [uses semicolon]

After (clustered or eliminated):
> Para 1: [uses two semicolons in a list of clauses]
> Para 2-5: [no semicolons; uses periods instead]

#### 19.6 Working method for rhythm analysis

**Step 1: Measure variance**
- For each paragraph, calculate sentence length standard deviation
- Flag paragraphs where std/mean < 15%
- Target: increase variance in flagged paragraphs to >20%

**Step 2: Map transitions**
- Mark every paragraph-initial transition word in the section
- If >50% of paragraphs start with transitions, delete half of them
- Move at least 2 transitions per section to mid-paragraph positions

**Step 3: Audit clause structures**
- Read 10 consecutive sentences
- Count how many follow S-V-O-clause pattern
- If >7 out of 10, rewrite 3-4 to use fronted clauses, inverted order,
  or different clause types

**Step 4: Vary paragraph lengths**
- Count sentences per paragraph in each section
- If all paragraphs are 3-5 sentences, create at least one 2-sentence
  paragraph and one 7+ sentence paragraph per section

**Step 5: Check punctuation distribution**
- Search for `;` and `---` in the LaTeX file
- If they appear at regular intervals (every N paragraphs), either
  cluster them or eliminate decorative uses
- Target: irregular distribution that serves logical structure, not
  rhythmic decoration

#### 19.7 Statistical validation

After applying rhythm fixes, validate by comparing to human-written
papers from the same venue:

1. **Sentence length variance:** Human papers typically show std/mean
   ratios of 30-50% within paragraphs. AI text (before fixes) shows
   10-20%. Your fixes should bring paragraphs to >25%.

2. **Transition density:** Human papers use paragraph-initial transitions
   in 20-40% of paragraphs. AI text uses them in 60-80%. Your fixes
   should reduce to <50%.

3. **Clause structure diversity:** Human papers show <60% of sentences
   following the same template. AI text shows >75%. Your fixes should
   bring it below 65%.

4. **Paragraph length variance:** Human papers show coefficient of
   variation (std/mean) of paragraph lengths around 35-50%. AI text
   shows 15-25%. Your fixes should increase to >30%.

These are heuristic thresholds, not hard rules. The goal is to make
statistical distributions **indistinguishable from human-written academic
prose in the same field and venue**.

#### 19.8 When rhythm analysis matters most

Rhythm analysis is particularly important for:

- **Long papers (>6 pages):** Detection tools have more text to analyze
  statistically, making rhythmic patterns more visible
- **Papers that passed lexical checks:** If you've eliminated all
  suspicious n-grams and decoration verbs but detection scores remain
  high, rhythm is likely the cause
- **Sections with technical content:** Methods and results sections often
  have uniform structure because AI generates "safe" sentence patterns
  for technical content
- **Papers with multiple authors:** If different sections were generated
  separately, they may have identical internal rhythm despite different
  topics, which is a strong tell

#### 19.9 The rhythm test

After fixing rhythm patterns, apply this test:

1. Print or display three consecutive paragraphs from your edited section
2. Cover the text and look only at the visual shape: paragraph lengths,
   sentence breaks, punctuation marks
3. Ask: "Does this look like the same visual pattern repeated, or does
   it look organic and varied?"

If the visual rhythm looks regular (same paragraph size, same sentence
lengths, same punctuation positions), the statistical signatures are
still present. If it looks organic and slightly messy, you've likely
succeeded.

**Remember:** Real academic writing has rhythm that varies with content.
Dense technical explanations may have longer sentences; key findings
may have short punchy sentences; literature summaries may cluster
citations. The rhythm should follow the **logic** of the argument, not
a template.

### 20. Vocabulary Distribution Analysis

AI models have characteristic vocabulary distribution patterns that detection tools analyze statistically. Even if you remove specific AI-signature words, the *distribution* of word classes can flag a text.

#### 20.1 Adjective density

AI text is overly descriptive, using adjectives where human writers rely on precise nouns or verbs.
**Detection metric:** Flag if the adjective-to-noun ratio exceeds 0.4.
**Fix strategy:** Delete decorative adjectives ("comprehensive," "robust," "significant"). Let the nouns carry the weight. If a noun needs modification, ensure the adjective adds essential, specific information.

#### 20.2 Adverb clusters

AI often uses adverbs to create a sense of importance or to smooth transitions.
**Detection metric:** Flag clusters of -ly adverbs (particularly, notably, importantly, significantly, interestingly) occurring within 3 sentences.
**Fix strategy:** Remove them. Most academic sentences are stronger without these adverbs. "Notably, the results show..." becomes "The results show...".

#### 20.3 Synonym rotation

When discussing a core concept, human writers typically pick one clear term and stick to it. AI models, trained to avoid repetition, will artificially rotate through synonyms.
**Detection metric:** Flag if 3+ synonyms for the same concept appear in successive sentences without semantic distinction (e.g., "the approach," "the method," "the technique," "this framework").
**Fix strategy:** Consolidate synonym usage to one consistent term throughout the paragraph and section.

#### 20.4 Abstract noun overload

AI favors abstract subjects for its sentences, creating a disembodied, generic tone.
**Detection metric:** Flag if >30% of sentences have abstract nouns as subjects (e.g., "The approach," "This methodology," "The framework," "The analysis").
**Fix strategy:** Convert abstract noun subjects to concrete actors (e.g., "We," the specific dataset, the specific algorithm) or rewrite the sentence to emphasize the action rather than the abstract concept.

### 21. Combination Pattern Detection

Some patterns are individually acceptable but collectively signal AI generation when they cluster. Detection tools identify these multi-layered signatures.

#### 21.1 Intra-paragraph clusters

**Detection metric:** Flag when individually acceptable positive/evaluative terms cluster in the same paragraph (e.g., "novel framework" + "comprehensive evaluation" + "robust performance" in the contributions paragraph).
**Fix strategy:** Break the cluster. Keep the most important claim and neutralize the others. A paper can have a "novel" method, but it shouldn't simultaneously claim a "comprehensive" evaluation and "robust" performance in the same breath.

#### 21.2 Multi-paragraph tells

**Detection metric:** Flag if every paragraph in a sequence follows the exact same logical structure: [claim] - [elaboration] - [synthesis/conclusion].
**Fix strategy:** Break at least one pattern in each cluster. Start a paragraph with a direct observation instead of a high-level claim. End a paragraph on a specific data point rather than a synthesising summary.

#### 21.3 Section-level resonance

**Detection metric:** Flag if the introduction, methods, results, and discussion sections each exhibit the same internal rhythm and sentence length distribution. Human writers naturally shift their rhythm depending on the section's purpose (e.g., methods are typically denser and more direct).
**Fix strategy:** Vary structural templates across sections. Ensure the methods section reads distinctly differently from the discussion section in its rhythmic profile.

## Working with humanizer.md

After this pass, return to `humanizer.md` and run its iterative self-audit loop on the rewritten paragraphs.

**Detection-simulation guidance:** Read the text as if you were a detection algorithm looking for statistical anomalies. Do not just look at the meaning; look at the shape, the rhythm, and the word distribution.

Instead of the old single-pass "What makes the below so obviously AI generated?", use this strengthened, multi-pass approach:

> "List at least 3 remaining AI signatures in the below text (consider n-grams, rhythm, vocabulary distribution, and combinations)."
> [List the tells honestly]
> "Apply zero-tolerance fixes - if you suspect a pattern, revise it completely. Rewrite the sentences containing these signatures from scratch."

**Mandatory iteration:** Perform a minimum of 2 passes per paragraph. Continue the self-audit loop iteratively until **no signatures** can be identified. If you identify even one residual tell, you must revise and re-audit.

`humanizer.md` already includes the explicit guidance that the general humanizer's "add soul" advice (first-person opinions, mixed feelings, tangents) does **not** apply to academic writing. The equivalent in a paper is *consistent terminology, sentence rhythm, and structural choices*, not personality. If your pass is making the paper sound like a blog post, you have over-applied. Pull it back.

## What good looks like

A paragraph that has passed all of the above:

- Has a specific claim, supported by specific evidence (numbers,
  citations, references to figures or sections).
- Uses a tense and voice consistent with the rest of the paper and the
  field's conventions.
- Has at least one sentence noticeably shorter or longer than the others.
- Does not begin with "Furthermore" or "Moreover".
- Does not end with a participial clause that adds nothing.
- Uses each technical term consistently throughout.
- Hedges where the literature is uncertain, not where the data is firm.

If most of the paragraphs in the rewritten paper meet these criteria,
the paper will not read as AI-generated to a knowledgeable reviewer or
a detector.
