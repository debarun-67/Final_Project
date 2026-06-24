# Register conversion: conference ↔ journal

Read this when the user asks to convert a paper from a conference
version to a journal version (or vice-versa). The conversion is more
than a stylistic rewrite — the two formats have different expectations
about depth, length, scope, and structure.

This file gives you the structural and stylistic rules for both
directions. After you apply them, run the normal Phase 4 anti-detection
pass on the result.

## Why these formats differ

A conference paper is a tightly time-budgeted artefact: limited pages
(often 8–12 in CS), limited reviewer attention, a focused contribution.
The reader is expected to follow up with the codebase or the
supplementary material for detail.

A journal paper is the version of record: more pages (often 25–40),
more thorough literature review, more careful exposition, more attention
to limitations and reproducibility. The reader expects to be able to
read the paper alone and understand the work fully.

The same science can — and often should — produce both versions, but
the prose and structure differ in predictable ways.

## Conference → journal

The conference paper is the seed. Extending to a journal version means
adding depth, not changing the science. A common rule of thumb is that
a journal version is roughly 2–3× the length of the conference version
when done well, with most of the new material in related work,
discussion, and methods detail.

### Structural additions to make

1. **Expand the related work.** Conference papers often cite tightly,
   focusing on the most direct competitors. Journal papers expect a
   thorough survey of the field. Add coverage of:
   - Adjacent approaches the conference version glossed over.
   - Historical context for the problem.
   - Comparison categories the conference version did not have room
     for.
   The expansion should still be selective — quality of engagement, not
   quantity of citations.

2. **Expand the discussion / limitations.** Conference papers often
   have a brief or absent limitations section. Journal versions are
   expected to include:
   - An explicit limitations section enumerating what the work does
     not show.
   - A more developed future-work paragraph naming specific extensions.
   - A discussion of generality and the conditions under which the
     results hold.

3. **Add detail to methods.** Move from "we used Adam with lr=1e-4" to
   "we used Adam with lr=1e-4, β1=0.9, β2=0.999, ε=1e-8, weight decay
   0.01, linear warmup of 1000 steps over 100,000 total steps with
   cosine decay". Where the conference version says "see appendix",
   the journal version often pulls the appendix back into the main
   text.

4. **Restore skipped derivations.** Theorems and proofs that the
   conference version sketched can be expanded to full derivation in
   the journal version. Discussion of intuition between formal steps
   helps the reader.

5. **Expand the experiments section.** Often the conference version
   has fewer ablations and fewer baselines than the authors actually
   ran. Add the additional results to the journal version.

6. **Add an explicit reproducibility paragraph** if the venue expects
   one, naming code/data availability, hardware, total compute.

### Prose-level changes

- **Tone:** journals tolerate slightly more discursive prose — paragraphs
  can develop a point at length rather than rushing to the next
  contribution. Don't make sentences longer or more decorated; make
  paragraphs more thorough.
- **Hedging:** journal reviewers are more sensitive to overclaiming.
  Add appropriate hedges where the conference version asserted things
  beyond the evidence.
- **Citations:** integrate more of them author-prominent rather than
  bracketed-pile. *"Smith et al. (2021) showed X"* reads more journal-
  paper than *"X has been shown [12]"* (though both are fine).
- **Self-reference between sections:** "see Section 4.2" works in
  both. Journals tolerate slightly more cross-referencing because the
  reader is expected to engage with the whole paper.

### What NOT to add

- **Padding.** Do not add words for the sake of length. A 25-page
  journal paper of substance is better than a 30-page paper with
  filler. If you find yourself adding "Furthermore," "Moreover,"
  "Additionally," or generic transition paragraphs to fill space,
  stop.
- **Repetition.** Don't restate findings four times. The journal
  format gives you room to develop, not to repeat.
- **Decoration.** Bigger word count doesn't mean more decorated word
  choice. Keep the same precision.

### Example: a contribution paragraph

**Conference:**
> We propose X, a method for Y. X improves accuracy on Z by 3 points
> over the strongest baseline. We release code and data.

**Journal expansion:**
> We propose X, a method for Y that combines two ideas: a [specific
> mechanism] and a [specific procedure]. We evaluate X on three
> benchmarks (Z1, Z2, Z3) covering [the relevant subdomains], and
> compare against four baselines spanning [the relevant approaches].
> X improves accuracy by 3.2 points on Z (Table 4) and by smaller but
> consistent margins on Z1 and Z2 (Tables 5 and 6). The improvement
> is statistically significant under a paired t-test (p < 0.01) for
> Z and Z1 but not for Z2 (Section 5.3). We release code, data, and
> trained models.

The journal version commits more, hedges where appropriate, and gives
the reader the numbers needed to evaluate the claim.

## Journal → conference

This direction is harder. You are not just trimming — you are deciding
what to keep. A bad conference version of a journal paper reads like
a hurried abstract; a good one reads like a focused contribution.

### Structural cuts to make

1. **Cut the literature survey to the directly relevant comparisons.**
   Journal-style related work covers history; conference-style covers
   competitors. Keep the citations that establish what is new about
   this paper; cut the rest unless the venue explicitly expects more.

2. **Move proofs and derivations to an appendix or supplementary**, if
   the venue allows. Cite to the supplementary in the main text:
   *"The proof is in Appendix B."*

3. **Compress methods to the load-bearing details.** Hyperparameters
   and exact implementation can move to the supplementary; the main
   text should explain the method conceptually plus the few details
   needed to reproduce qualitatively.

4. **Cut the explicit limitations section** *only* if the venue does
   not require one. NeurIPS for example does require a limitations
   section. Read the call for papers.

5. **Tighten the experiments section** to the most informative
   results. If the journal version had three ablations and two of
   them showed similar things, keep one. Move the rest to
   supplementary.

6. **Drop the reproducibility paragraph** to the supplementary unless
   the venue requires it in the main text.

### Prose-level changes

- **Sentence economy.** Where the journal version had two sentences
  developing a point, the conference version has one. Your job is to
  keep the substance and drop the connective tissue.
- **Reduce hedging where the data still supports the claim.**
  Journal-paper hedges like *"is likely to suggest that"* can become
  *"suggests"* if the evidence is the same.
- **Bracketed citations** are common in conference style; integrated
  ones are common in journal style. Match the venue. Do not
  mechanically convert in either direction — but a conference version
  with too many narrative *"Smith et al. (2021) showed..."* sentences
  in related work can read padded.
- **Section-level signposting** that worked in the journal version
  ("In what follows, we first... then... finally...") usually goes,
  because the conference version has visible section headings doing
  the same job.

### What NOT to cut

- **Numbers, units, and effect sizes** in results. Compressing
  *"86.4 ± 0.3 vs. 83.2 ± 0.4"* to *"better"* is a bug.
- **Citation keys.** If you cut a paragraph that cited a paper, check
  whether the citation is still made elsewhere. If not, you've
  silently dropped credit. Decide whether to keep the citation in the
  related work or the experimental comparison.
- **The claim and the limit of the claim.** The conference version
  should say what the paper shows *and* what it does not show. Cutting
  the limits is what produces overclaiming.

### Example: a related-work paragraph

**Journal version:**
> Approaches to Y can be grouped into three families. The first,
> based on [technique A], originates with [Smith, 1995] and has been
> developed in [Jones, 2003], [Brown, 2010], and most recently in
> [Davis et al., 2019]. The second, based on [technique B], emerged
> from [Lee, 2008] and underlies the now-standard implementations of
> [Wang et al., 2015] and [Chen et al., 2018]. The third, based on
> [technique C], is more recent: [Nakamura et al., 2020] proposed the
> initial formulation, [Rossi et al., 2021] generalised it to [domain
> Z], and [Patel et al., 2022] showed strong results on [benchmark
> W]. Our work belongs to the third family but differs from prior
> work in three respects, which we develop below.

**Conference compression:**
> The closest prior work is in the [technique C] family.
> [Nakamura et al., 2020] proposed the initial formulation; recent
> extensions [Rossi et al., 2021; Patel et al., 2022] have shown
> strong results on related benchmarks. We differ from this line of
> work in three respects (developed in Section 3).

The compression keeps the load-bearing citations and the contrast,
drops the family-tree structure that doesn't fit on the page.

## After the conversion (both directions)

1. Run the **academic-style** pass to make sure the prose is consistent
   with the new venue's conventions.
2. Run **Phase 4** (humanizer.md + anti-detection.md). Conversion
   tends to introduce its own AI tells — when you expand, the
   model wants to add decorative connective tissue; when you compress,
   the model wants to add slogan-y "punchy" sentences. Audit for both.
3. **Verify** the file still compiles, no broken citations, no orphan
   references to figures/sections that were cut (after compression),
   no references to figures/sections that don't exist (after expansion).

## Common failure modes

- **Inflation without substance** (conf → journal). Padding sentences
  with adverbs, repeating findings, adding decorative transitions.
  Add depth, not words.
- **Loss of nuance** (journal → conference). Compressing a limitation
  paragraph into a single phrase that no longer says what the paper
  doesn't show.
- **Citation orphans** (either direction). Citations that no longer
  appear in the body but still appear in the bibliography, or worse,
  citations that disappear from the body after compression and leave
  a claim unsupported.
- **Inconsistent register** (either direction). The introduction was
  expanded in journal mode but the methods stayed conference-terse,
  producing a paper that reads like two different documents stitched
  together.
- **Wrong-venue conventions** (either direction). The user asked for
  conversion to a different venue (NeurIPS → JMLR, ACL → TACL,
  CVPR → IJCV). Each pair has its own conventions; check the venue's
  guide for authors.
