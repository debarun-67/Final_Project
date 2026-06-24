# Phrase bank: AI-academic clichés and what to use instead

This is a lookup table, not a read-through. When you encounter one of the
phrases on the left in an academic manuscript, the right column tells
you the typical ways a real paper expresses the same idea — or, in many
cases, that the phrase should simply be cut.

The categories below are organised by where the cliché tends to live
(introduction, related work, methods, results, discussion, abstract,
generic). Some phrases live in more than one place; they're listed
where they're most common.

A note on use: do not mechanically substitute. The point is to pick
something that fits the surrounding sentence. If the right column says
"cut", that means the sentence reads better with the phrase removed
entirely. If it says "be specific", that means the AI phrasing is
covering for missing content, and the fix is to add the content, not to
swap synonyms.

## Abstract / introduction openers

| AI cliché | Replace with |
|---|---|
| "In recent years, X has gained significant attention" | Cut, or replace with a specific reason: "X has driven the move from CPUs to GPUs in deep-learning training, ..." |
| "X has become an increasingly important area of research" | Cut. State the specific finding or motivation. |
| "With the rapid advancement of X" | Cut. If the advancement matters, name what advanced. |
| "In the era of X" | Cut. |
| "Against the backdrop of X" | Cut. |
| "X plays a crucial role in Y" | Name the role: "X regulates Y by binding to Z." |
| "X plays a pivotal role" | Same. Pick a precise verb. |
| "X is fundamental to Y" | Often unnecessary. If it is, name the dependency. |
| "Despite significant progress, X remains a challenge" | Be specific: which progress, which remaining challenge. |
| "There is a growing body of literature suggesting that..." | Replace with 2–3 specific citations. |
| "It is widely recognised / accepted that..." | If true, cite. If not provably true, drop. |
| "Recent advances in X have revolutionised Y" | Replace with the specific advance and the specific change. |
| "This raises important questions about Y" | Name the question(s). |
| "We are at a critical juncture / inflection point" | Cut. |
| "In this paper, we present a novel framework that..." | "We present X, which..." (drop "novel"; describe what X does, not its novelty) |
| "In this work, we propose a comprehensive approach to..." | "We propose X for ..." (drop "comprehensive") |

## Contributions paragraphs

| AI cliché | Replace with |
|---|---|
| "We make the following contributions:" | Fine — but make sure the contributions are concrete. |
| "We propose a novel ..." | "We introduce ...". Reserve "novel" for the truly new thing, not every component. |
| "We provide a comprehensive analysis / evaluation" | Say what was analysed or evaluated and how (datasets, metrics, baselines). |
| "We demonstrate the effectiveness of..." | "X improves accuracy on Y by Z percentage points." |
| "Our extensive experiments show..." | Say how many: "Across 5 datasets and 3 model sizes, X..." |
| "Our results have important implications for..." | Name the implication. |
| "To the best of our knowledge, this is the first work to..." | Tolerable, but only if true and if specific. |
| "We hope this work paves the way for..." | Cut. Or be specific: "X may be useful for Y." |
| "This opens new avenues for future research" | Cut, or list the avenues. |

## Related work / discussion

| AI cliché | Replace with |
|---|---|
| "A plethora of studies have explored..." | A number: "Twelve recent studies have examined..." |
| "A myriad of approaches have been proposed" | Same. Or list the categories. |
| "Several / numerous studies have shown..." | If "several", say how many. If many, organise by approach. |
| "It has been shown in the literature that... [3, 7, 12]" | Author-prominent: "Smith et al. (2021) showed that..." |
| "Building on this rich body of work" | Cut. |
| "Drawing inspiration from..." | "We follow Smith et al. (2021) in..." (specific) |
| "Our work differs from prior work in three key ways" | Fine, but make the three ways concrete. |
| "Unlike previous approaches that..." | Be specific about which previous approach. |
| "These findings are consistent with prior work" | Specify which prior work. |
| "These findings stand in contrast to..." | Specify what they contrast with. |
| "This sheds light on..." | Cut. State what the result shows. |
| "Our results delve into..." | Cut. |
| "This nuanced understanding of..." | Cut "nuanced". State the understanding. |
| "A multifaceted view of..." | Cut "multifaceted". |
| "A holistic / comprehensive understanding of..." | Cut the modifier; state the specific aspect. |
| "These findings underscore the importance of..." | "These findings show that X matters for Y." |
| "These findings highlight..." | Same — or "show". |
| "These findings emphasise..." | Same. |
| "It is worth noting that..." | Cut. The reader will decide what is worth noting. |
| "Importantly, ..." | Cut. |
| "Notably, ..." | Cut, unless genuinely contrasting. |
| "Interestingly, ..." | Cut. |

## Methods

| AI cliché | Replace with |
|---|---|
| "We leverage the power of X" | "We use X." |
| "We utilise X" | "We use X." |
| "We employ a state-of-the-art X" | Name the X. |
| "We adopt a principled approach to..." | Name the approach. |
| "Our methodology consists of three main components: ..." | List them. |
| "We carefully designed X to..." | Cut "carefully". Either describe the design choices or just state the design. |
| "Without loss of generality, we focus on..." | Fine in math. Elsewhere, replace with "We focus on X because Y." |
| "Following standard practice, we..." | Cite the practice. |
| "X is an established method [Y, 2018]" | Fine if cited. |
| "We perform extensive ablations" | "We ablate X (Table 2)." |
| "We rigorously evaluate" | "We evaluate". The reader will judge rigour. |

## Results

| AI cliché | Replace with |
|---|---|
| "Our model achieves remarkable performance" | "Our model achieves X% accuracy on Y, surpassing Z by W points." |
| "We observe a significant improvement" | If statistically significant, name the test. Otherwise, give the magnitude. |
| "X outperforms all baselines by a wide margin" | "X outperforms the strongest baseline (Y) by Z points (Table 3)." |
| "These results demonstrate the superiority of X" | "X achieves higher accuracy than Y across all five benchmarks." |
| "Our approach yields substantial gains" | Give the number. |
| "The improvements are particularly pronounced in..." | "Improvements are largest on the rare-class subset (Table 4, last row)." |
| "X exhibits robust performance across various settings" | List the settings. |
| "These findings strongly support our hypothesis" | "The data are consistent with H1: ..." |
| "As expected, X performs better than Y" | "X outperforms Y, as expected from prior work [N]." (only if there is prior work) |

## Discussion / conclusion

| AI cliché | Replace with |
|---|---|
| "In conclusion, we have presented..." | "We presented X. Our experiments show..." |
| "This paper has presented a novel framework that..." | Cut "novel". Say what the framework does and what was shown. |
| "Our work opens up exciting new directions" | List one. |
| "The implications of our findings are far-reaching" | Cut, or name them. |
| "Future work will explore..." | Be specific: "We plan to test whether X holds for Y." |
| "More research is needed to fully understand..." | True but generic — replace with the specific question. |
| "We believe our work represents a significant step toward..." | Cut "we believe" and "significant step toward". State the contribution. |
| "We are excited to see how this is applied in practice" | Cut. |

## Generic AI vocabulary in any section

These are individual words that mark academic AI prose. The replacement depends on context. **Zero-Tolerance (ZT)** words should always be removed. **Context-Dependent (CD)** words are acceptable in specific technical senses but should be removed when used decoratively.

| Word / Phrase | Context Guidance | Default action |
|---|---|---|
| delve / delve deeper into / delving into the intricacies of | **ZT** | delete; replace with "examine", "study", or just describe what you did |
| shed light on / cast light on | **ZT** | delete; describe what was shown |
| elucidate / explicate | **ZT** | delete or replace with "explain" or "show" |
| navigate the complexities of | **ZT** | replace with "address" or specify |
| traverse (figurative) | **ZT** | replace with "cover" or specify |
| paradigm / paradigm shift | **ZT** | replace with "approach" or describe the change |
| landscape (as in "evolving landscape of X") | **ZT** | delete or replace with "field" |
| ecosystem (figurative, non-biology) | **ZT** | delete or replace with "set of tools" |
| tapestry | **ZT** | delete |
| intricate / intricacies | **ZT** | delete or describe specifically |
| nuanced | **ZT** | delete or describe specifically |
| multifaceted | **ZT** | delete |
| holistic | **ZT** | delete or replace with specific aspects |
| comprehensive | **CD**: Acceptable when quantified (e.g., "15 benchmarks") | delete or quantify |
| robust | **CD**: Acceptable in statistics (e.g., "robust regression") | replace with specific behavior when used as compliment |
| novel (overused) | **CD**: Acceptable once per paper for main contribution | reserve for the actual new thing |
| seminal | **CD**: Genuine seminal work only | cite or delete |
| pivotal | **ZT** | replace with concrete role |
| crucial | **ZT** | replace with concrete reason |
| leveraging state-of-the-art techniques | **ZT** | specify the techniques used |
| employing a principled approach | **ZT** | name the approach directly |
| in light of recent advances in the field of | **ZT** | be specific about the advance |
| instantiate | **CD**: Acceptable in CS theory | avoid elsewhere |
| operationalize | **CD**: Acceptable in social sciences | avoid in hard sciences |
| seamlessly | **ZT** | delete |
| unpack / unpacking the nuances of | **ZT** | replace with "explain" or specify |
| embark on a journey to | **ZT** | delete |
| maximize the potential of | **ZT** | delete or describe specific benefit |
| game-changing / future-ready / cutting-edge | **ZT** | delete; describe the specific technical capability |
| impactful | **ZT** | replace with specific effect |
| innovative | **ZT** | delete; let the reader judge novelty |
| in today's fast-paced world | **ZT** | delete |
| furthermore / moreover / additionally | **CD**: Acceptable in moderation | usually delete; use implicit transitions |
| it is important to note that | **ZT** | delete |
| it should be noted that / it is worth mentioning that | **ZT** | delete |
| it is widely accepted that | **ZT** | cite or delete |

## Statistical Patterns (Paragraph and Section Level)

Some patterns are individually acceptable but **statistically overrepresented in AI text**. Check paragraph-level and section-level statistics, not just individual phrases. If you notice these clusters, they are strong detection signals.

### 1. Abstract Noun Subjects
- **Pattern:** Starting 3+ sentences in a paragraph with "The" + [abstract noun] (e.g., "The approach", "The methodology", "The framework").
- **Fix:** Rewrite sentences to use concrete actors (e.g., "We", "The dataset") or active verbs.

### 2. Participial Clause Endings
- **Pattern:** Ending 2+ paragraphs in a section with a participial clause (e.g., "...highlighting the importance of X", "...demonstrating the effectiveness of Y").
- **Fix:** Convert to a separate sentence, or delete the decorative clause entirely.

### 3. Transition Overuse
- **Pattern:** Every paragraph in a section starts with a transition word (Furthermore, Moreover, Additionally).
- **Fix:** Delete at least 50% of them. Let the logical flow of the argument act as the transition.

### 4. Evaluative Clusters
- **Pattern:** Using 3+ positive/evaluative terms in a single paragraph (e.g., "novel", "robust", "comprehensive", "effective").
- **Fix:** Pick the most important claim and neutralize the rest. Let the data speak for itself.

## Specific construction patterns

These are sentence-level patterns that mark AI-generated academic prose.

### "Not only X but also Y"

This negative-parallelism structure is overused by LLMs. Almost always,
the simpler form is better.

- AI: "This approach not only improves accuracy but also reduces
  inference time."
- Better: "This approach improves accuracy and reduces inference time."
- Often even better: "This approach improves accuracy by 3 points
  (Table 2) and reduces inference time by 40% (Figure 5)."

### Rule-of-three lists

LLMs default to listing three of everything. Real papers list however
many there are.

- AI: "We evaluate on accuracy, robustness, and efficiency."
- If it really is three things: keep it.
- If it is "we evaluate on accuracy and inference time" but the model
  padded to three: cut the padding.

### "X serves as a Y" (copula avoidance)

- AI: "Our framework serves as a foundation for future work."
- Better: "Our framework is a foundation for future work."
- Often even better: cut.

### "from X to Y" false ranges

- AI: "Our method works from small datasets to large-scale corpora,
  from single-domain tasks to multi-domain transfer."
- Better: "We evaluated on three dataset sizes (1K, 100K, 10M
  examples) and on both single-domain and multi-domain settings."

### Trailing -ing clauses

- AI: "Our model achieves 87% accuracy, demonstrating the effectiveness
  of our approach and highlighting the importance of careful
  hyperparameter tuning."
- Better: "Our model achieves 87% accuracy. Hyperparameter tuning
  contributed roughly 2 points (Section 5.3)."

### Em-dash "punchy" insertions

LaTeX-rendered em dashes (`---`) are fine in academic prose — but only
where a real one is warranted. AI tends to use them as a stylistic tic.

- AI: "Our approach---which combines two techniques---outperforms..."
- Better: "Our approach, which combines two techniques, outperforms..."

### Mid-paragraph signposting

- AI: "Now let us turn to the experimental results."
- Better: just describe the experimental results. Section heading does
  the signposting.

## Anti-pattern: synonym cycling

LLMs cycle synonyms within a paragraph to avoid "repetition", which in
academic prose looks suspicious because consistent terminology is a
virtue.

- AI: "Our **model** achieves 87% on benchmark A. The **system**
  generalises to benchmark B. The **architecture** also performs well on
  benchmark C."
- Better: "Our model achieves 87% on benchmark A. The same model
  generalises to benchmark B and performs well on benchmark C."

Pick one term for each entity and use it consistently.

## Anti-pattern: hedge stacking

Two hedges in one clause is the threshold.

- AI: "Our results may possibly suggest that X could potentially..."
- Better: "Our results suggest that X..."
- Or: "Our results are consistent with X."

## When the cliché is doing real work

A few of these phrases occasionally do legitimate work in a paper. Use
your judgement:

- "Importantly," — fine if the next sentence really is the load-bearing
  one in the paragraph.
- "Notably," — fine if the next sentence is genuinely the contrasting
  case.
- "We hypothesise that..." — fine as a real hypothesis, not as a vague
  framing.
- "To the best of our knowledge" — fine for a genuine novelty claim,
  used once.

The test is: if you delete the phrase, does the sentence lose specific
meaning, or does it just lose decoration? If only decoration, delete.
