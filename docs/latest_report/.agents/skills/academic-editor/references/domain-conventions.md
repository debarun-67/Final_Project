# Domain conventions

Read only the section that matches the paper's domain. If the paper sits
across two domains (e.g. computational biology, ML for chemistry), read
both and lean toward the venue's primary audience.

## Table of contents

- Computer science and machine learning
- Biomedical and clinical
- Biology (non-clinical)
- Physics
- Chemistry
- Mathematics
- Engineering
- Social sciences (quantitative)
- Social sciences and humanities (qualitative)
- Economics and finance
- Statistics and applied stats

---

## Computer science and machine learning

Includes ML, NLP, CV, systems, theory, security, HCI/UX research,
databases, PL, software engineering.

**Voice.** First person plural is the default and expected. *"We propose",
"We observe", "We argue"*. Active voice throughout — passive is
acceptable only in methods to describe what was done to the data.

**Tense.**
- Abstract / introduction (what the paper does): present.
- Methods (what was done in this work): past.
- Results (what was observed): past for the action, present for the
  interpretation. *"Accuracy increased to 87%. This indicates..."*
- Related work: past or present perfect.

**Conventions.**
- Sentence case for headings in most modern venues (NeurIPS, ICML, ACL,
  EMNLP, CVPR, USENIX). Title case for IEEE conferences.
- Citations vary: ACL/NLP uses author-year (`\citep`/`\citet`), most ML
  conferences use numbered. Match the existing file.
- Contractions are tolerated in some venues (especially ML and HCI), but
  the safer default is to expand them.
- "We" can refer to the authors *or* an inclusive "we" (the reader and
  the authors, e.g. "we now consider"). Both are fine.
- Code / system / model names are typically in `\textsc{}` or
  `\texttt{}` — preserve the existing style.

**Genre cues.**
- ML papers: contributions paragraph in the introduction, ablation
  studies in the experiments, limitations section near the end. Hedging
  is appropriate around generalisation claims, not around reported
  numbers.
- Theory papers: theorem-proof style. Definitions before theorems.
  Proofs may live in an appendix.
- Systems / security: emphasise threat model, evaluation methodology,
  reproducibility. Avoid marketing language about "robustness" unless
  there is a measurement.
- HCI: user-study methodology, IRB statement, qualitative quotes set in
  italics or quote blocks.

**Common AI tells in CS/ML papers.**
- "novel framework" / "comprehensive evaluation" — every paper claims
  these; either down-grade to specific claims ("we evaluate on 4
  benchmarks") or remove.
- "leverages the power of" — replace with the actual mechanism.
- "showcases" / "demonstrates the effectiveness of" — replace with
  numbers or specific behaviours.
- "state-of-the-art performance" — fine if accompanied by a benchmark
  comparison; suspicious otherwise.
- "extensive experiments" — say how many.

---

## Biomedical and clinical

Includes medical research, clinical trials, epidemiology, pharmacology,
public health, biomedical engineering.

**Voice.** Passive past tense in methods is the standard. *"Cells were
cultured...", "Participants were randomised to..."*. First person plural
appears in introduction, discussion, and conclusion. Active first-person
in methods is increasingly accepted (especially in BMJ, PLOS), but match
the journal.

**Tense.**
- Abstract: structured (Background, Methods, Results, Conclusion). Past
  tense for what was done and observed; present for the conclusion.
- Methods: past, often passive.
- Results: past.
- Discussion: present for interpretation, past for citation of prior
  work.

**Conventions.**
- IMRaD structure (Introduction, Methods, Results, and Discussion).
- Reporting standards apply: CONSORT for RCTs, STROBE for observational
  studies, PRISMA for systematic reviews, ARRIVE for animal studies. If
  the paper is one of these types, do not introduce wording that
  contradicts the reporting checklist.
- Statistics phrasing: "(mean ± SD)", "95% CI", "p < 0.05" with the
  specific test named. Use the existing format.
- Drug names: generic (lowercase) on first mention, optionally with
  brand. Do not change.
- Patient terminology: "patients with diabetes" not "diabetic patients"
  (person-first language is the modern norm in most clinical journals;
  identity-first is preferred by some communities).
- Ethics statements, IRB/ethics committee approval, informed consent,
  conflict of interest, funding — never modify the wording without
  explicit user permission. Required by most journals.

**Common AI tells in biomedical papers.**
- "groundbreaking" / "revolutionary" / "paradigm-shifting" — never
  appropriate in this register. Remove.
- "comprehensive review" — almost never accurate.
- "important implications for clinical practice" — vague; either name
  the implication or remove.
- "more research is needed" — true but generic; replace with what
  specifically.

---

## Biology (non-clinical)

Includes molecular biology, cell biology, genetics, ecology, evolution,
microbiology.

**Voice.** Passive past in methods is standard. Active first-person
plural is fine in introduction and discussion.

**Tense.** Same as biomedical.

**Conventions.**
- Gene names italicised; protein names not italicised. *Italicise*
  species names (Latin binomials). On second use, abbreviate to *E. coli*.
- Methods are dense with reagent and protocol details. Do not paraphrase
  catalog numbers, concentrations, or timing. *"Cells were incubated
  for 24 h at 37 °C in 5% CO2"* is the form — preserve the units.
- Figure callouts are dense: "(Fig. 2A)", "(Supplementary Fig. 3)".
- Citation style varies a lot — Nature uses superscript numbers, Cell
  uses author-year, PLOS uses numbered. Match.
- Acknowledgement of funding sources, data deposition statements
  (GenBank, GEO, etc.) — preserve verbatim.

**Common AI tells.**
- "shed light on" / "elucidate" used decoratively — remove.
- Vague biological mechanism claims ("plays a critical role in") without
  the specific role — replace with the specific role or remove.

---

## Physics

Includes condensed matter, particle, astrophysics, theoretical and
experimental physics.

**Voice.** First person plural is universal in theory and computation.
Experimental physics methods can be passive past. Single-author theory
papers occasionally use "I", but "we" is more common.

**Tense.** Present for established theory and for what the paper does.
Past for experimental procedure and observed results.

**Conventions.**
- REVTeX template (American Physical Society) is common. Specific
  conventions: numbered citations, abstract on its own line, very tight
  tone.
- Equations are first-class. Theorems and propositions less common
  outside mathematical physics.
- Units in SI with `siunitx` or hand-typed: `1.5~\mathrm{eV}`. Preserve
  hand-typed unit conventions exactly.
- Particle names, isotopes, and astrophysical objects have specific
  typographic conventions (italics, subscripts, superscripts) — do not
  reformat.
- Physics papers tend toward terse, formal language. Avoid the breezy
  tone that works in CS.

**Common AI tells.**
- "fundamental implications" without saying for what — remove.
- "groundbreaking" — never. Physicists do not write this way.
- Long synonym chains ("phenomenon", "effect", "manifestation",
  "behaviour" all in one paragraph for the same thing) — pick one term.

---

## Chemistry

Includes organic, inorganic, physical, analytical, and materials
chemistry.

**Voice.** Passive past in experimental methods is the strongest
convention of any field. *"The mixture was stirred at 60 °C for 4 h.
The product was extracted with ethyl acetate (3 × 20 mL)..."*. Active
first-person plural in introduction and conclusion.

**Tense.** Past for procedure and observed results; present for
interpretation and theory.

**Conventions.**
- IUPAC nomenclature for compounds. Compound numbers in bold:
  *"compound 1"*, *"compound 2a"*. Do not modify.
- Reagents specified by name, supplier, purity. *"Sodium hydride (60%
  dispersion in mineral oil, Sigma-Aldrich)"*. Do not paraphrase.
- Spectroscopic data follows fixed format: *"1H NMR (400 MHz, CDCl3): δ
  7.45 (d, J = 8.0 Hz, 2H), ..."*. Treat as data, not prose.
- Yields: *"(75% yield)"*, *"75%, 1.2 g"*. Preserve exact figures.
- Reaction schemes referenced as *"Scheme 1"*, *"Scheme 2"*.

**Common AI tells.**
- Decorative adjectives in synthesis descriptions ("efficient",
  "convenient", "powerful method") — remove or replace with the actual
  metric (yield, time, scale).
- Generic introductions about how "X has attracted considerable
  attention" — replace with the specific reason.

---

## Mathematics

Includes pure mathematics, theoretical computer science, mathematical
physics.

**Voice.** First person plural is universal. *"We now show...", "We
proceed by induction on n.", "We may assume without loss of generality
that..."*. Active. Passive is rare and usually a stylistic choice.

**Tense.** Present, throughout. Mathematical statements live in an
eternal present.

**Conventions.**
- Definition–Theorem–Proof structure. Statements are numbered and
  cross-referenced. Do not paraphrase a theorem statement.
- Notation is defined precisely on introduction and used consistently.
  *"Let X be a topological space..."*.
- Citations are sparse and load-bearing. *"By Theorem 3.2 of [Hartshorne],
  ..."*.
- The end of a proof is a tombstone (□, `\qed`, `\blacksquare`).
- Math papers are *terse*. Sentences are short. Logical connectives
  ("Hence", "Therefore", "Indeed", "It follows that") do real work and
  are not decorative.
- Avoid hedging in mathematical claims. Either it is proved or it is a
  conjecture — say which.

**Common AI tells.**
- Decorative transitions ("In this section, we will explore...") — math
  papers do not warm up. Get to the statement.
- Filler phrases ("It is important to note that...") — math papers
  signal importance with structure, not adverbs.
- Plurals where a specific object is meant ("various properties", "many
  cases") — name them.

**The math-paper terseness standard — read this carefully.**
A math paper's prose is scaffolding around the mathematics, not the
point of the paper. The reader is there for the theorems. Every prose
sentence that does not directly set up, motivate, or connect a
mathematical statement is a candidate for deletion.

Concretely: if you can delete a sentence and the surrounding mathematics
still makes sense, delete it. If a paragraph opens with a sentence that
restates the section heading, delete that sentence. If a paragraph ends
with a sentence that summarises what was just proved, delete it — the
proof is right there.

The target register is the prose of a published paper in a journal like
*Annals of Mathematics*, *Journal of the AMS*, or *Inventiones*. The
text starts with the mathematical content and ends when the content ends.
No warming up, no signposting, no "In this section we will...".

Specific patterns to delete on sight in math papers:
- "In this section, we will [verb]..." — delete the whole sentence.
- "We have thus shown that..." after a proof — delete; the tombstone
  already signals the proof is done.
- "Recall that..." used more than once per concept — keep the first,
  delete the rest.
- "It is easy to see that..." — either show it or omit it; this phrase
  is both a filler and a reader-hostility tell.
- "The proof is straightforward and is omitted." — fine if true; but
  if the proof is in the paper, do not add this.

---

## Engineering

Includes mechanical, civil, electrical, chemical engineering, materials
science, control systems.

**Voice.** Mix of passive past in methods and active first-person plural
in introduction/discussion. Closer to applied physics than to CS.

**Tense.** Past for what was built/measured; present for design rationale
and theory.

**Conventions.**
- IEEE format common: numbered citations `[1], [2]`, title case
  headings.
- Heavy use of figures, schematics, circuit diagrams. Reference by
  number.
- Standards citations: *"per ASTM E8"*, *"according to ISO 9001"* —
  preserve exactly.
- Design specifications, tolerances, materials, dimensions are precise
  data, not prose.

**Common AI tells.**
- Vague performance claims ("highly efficient", "excellent performance")
  without numbers — replace with the metric.
- "innovative approach" — remove. Show the approach.

---

## Social sciences (quantitative)

Includes quantitative sociology, political science, quantitative
psychology, education research.

**Voice.** First person plural in introduction, theory, and discussion.
Passive in methods is common but not required.

**Tense.** Past for procedure, results. Present for theoretical claims
and citation of theory.

**Conventions.**
- APA style is common: author-year citation, structured reporting of
  statistics: *"t(48) = 2.13, p = .03, d = 0.61"*. Preserve formatting.
- Hypotheses numbered (H1, H2, ...). Do not renumber.
- Variables in italics: *N*, *M*, *SD*, *p*. Preserve.
- Pre-registration mentions, IRB approval, data sharing statements —
  preserve verbatim.

**Common AI tells.**
- "A growing body of literature suggests..." — replace with specific
  citations.
- "important implications for policy and practice" — name the
  implication.
- Excessive hedging — these fields are already hedge-heavy; if you find
  three hedges in one sentence, reduce.

---

## Social sciences and humanities (qualitative)

Includes qualitative sociology, anthropology, history, literary
studies, philosophy, cultural studies, qualitative HCI.

**Voice.** First person is fine and often expected, especially for
methodological reflexivity. Singular "I" is normal in single-author
work.

**Tense.** Mixed — past for fieldwork and historical events, present
for analysis and theoretical claims.

**Conventions.**
- Citation format varies a lot: Chicago notes-and-bibliography in
  history, MLA in lit, APA elsewhere. Match the file.
- Block quotes are common; do not paraphrase quoted material.
- Long-form argument structure is acceptable. Sentences can be longer
  than in the sciences.
- Methodological reflection on positionality is normal in qualitative
  work — do not flag this as "personal opinion".

**Common AI tells.**
- "rich tapestry", "vibrant culture", "deeply rooted" — high-density
  AI prose. Replace with specifics.
- "sheds light on" / "delves into" — never.
- Generic theoretical name-dropping ("through a Foucauldian lens") with
  no follow-through — flag to the user; the prose may need actual
  argumentation, not just stylistic edits.

---

## Economics and finance

Includes empirical economics, econometrics, financial economics,
behavioural economics.

**Voice.** First person plural in theory, introduction, discussion.
Passive in description of empirical procedure is acceptable.

**Tense.** Present for theory and model statements. Past for empirical
procedure and historical context.

**Conventions.**
- Author-year citation, often with page numbers in argumentative work.
- Models stated formally, often with numbered equations. Don't touch.
- Robustness checks, identification strategy, instrument validity — these
  are technical terms, not decorative. Use precisely.
- Economic significance vs. statistical significance — the field cares
  about the distinction. Use "economically significant" only if the
  authors discussed effect size in economic terms.

**Common AI tells.**
- "important policy implications" without naming them.
- "robust" used loosely — in econometrics this has a specific meaning
  (robustness to specification, robust standard errors).
- Generic intros about how "X has gained increasing attention".

---

## Statistics and applied stats

**Voice.** First person plural. Active.

**Tense.** Present for methods (the methods continue to apply), past for
specific examples and applications.

**Conventions.**
- Mathematical notation rigorous. Random variables typically uppercase,
  realisations lowercase.
- "We assume X" introduces an assumption; numbered if used later.
- "Under H_0" / "Under the null" — preserve exact phrasing.
- Simulation studies described with exact parameters.

**Common AI tells.**
- Decorative claims of generality. Statistics papers state assumptions
  precisely; if a paragraph claims a method is "applicable to a wide
  variety of settings", it should list the settings.

---

## Heuristic when domain is unclear

If you cannot identify the domain confidently:

1. Look at the bibliography. Citation style + the kind of journals cited
   tell you a lot.
2. Look at section names. *"Methods" + "Results" + "Discussion"* is
   IMRaD (sciences). *"Experiments" + "Ablations"* is ML.
   *"Findings" + "Discussion"* without "Methods" is often qualitative
   social science. *"Theorem 1" + "Proof"* is math.
3. Look at the math density. Heavy math + few experiments → theory.
   Heavy experiments + light math → applied science.
4. Ask the user. One sentence: *"This looks like an ML paper but the
   citation style suggests an HCI venue — should I use ML or HCI
   conventions?"*
