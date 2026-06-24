# LaTeX safety: what you must not touch

This is the most important reference in the skill. Every other improvement
is undone if your edit breaks the build or silently corrupts the math.
Read this before your first edit and revisit it whenever you are about to
touch an unfamiliar construct.

## The mental model

A `.tex` file is *prose interleaved with code*. Your job is to edit the
prose. Treat everything else as a black box: you can move it around, you
can leave it alone, you can quote around it, but you do not touch its
internals.

When you see something that looks like LaTeX syntax, the default answer is
**leave it as-is**. The bar for editing inside a command or environment is
"I am 100% sure this is plain prose." If it is anything else, skip.

## Hard "do not touch" list

### Math

Anything inside any math context. The math is the paper's truth claim.
Even rewording a definition can change a result.

- Inline math: `$ ... $`, `\( ... \)`
- Display math: `$$ ... $$`, `\[ ... \]`
- Math environments:
  - `equation`, `equation*`
  - `align`, `align*`, `aligned`
  - `gather`, `gather*`, `gathered`
  - `multline`, `multline*`
  - `eqnarray`, `eqnarray*`
  - `cases`, `dcases`
  - `array`, `pmatrix`, `bmatrix`, `Bmatrix`, `vmatrix`, `Vmatrix`,
    `smallmatrix`
  - `split`
- Math commands wherever they appear: `\frac`, `\sum`, `\int`, `\sqrt`,
  `\binom`, `\mathbf`, `\mathrm`, `\mathcal`, `\mathbb`, `\boldsymbol`,
  `\operatorname`, etc.
- Macros that expand to math, including user-defined ones with `\newcommand`.
  If you cannot tell, leave it alone.

The only exception: if the user explicitly tells you to fix a math typo,
fix exactly that.

### Citations, references, labels

These are the wiring of the paper. Breaking a single key silently breaks
the bibliography or the cross-refs.

- `\cite{...}`, `\citep{...}`, `\citet{...}`, `\citeauthor{...}`,
  `\citeyear{...}`, `\nocite{...}`, `\citeA{...}` (apa), `\citeNP`, `\fullcite`
- `\ref{...}`, `\eqref{...}`, `\autoref{...}`, `\Cref{...}`, `\cref{...}`,
  `\pageref{...}`, `\nameref{...}`
- `\label{...}` — never rename a label; you will silently break every
  reference to it
- `\hyperref[...]{...}`, `\url{...}`, `\href{...}{...}`

You may rewrite the prose **around** these commands. You may not rewrite
their arguments. If you want to move the citation, you can move the whole
intact `\cite{...}` token.

**Never add a `\cite{...}` that was not in the original file.** You do
not know what is in the `.bib` file. A citation key you invent will
cause a compile error and a missing reference in the output. If a
sentence needs a citation and none exists, leave the sentence without
one and note it in your summary to the user.

### Document structure

- `\documentclass[...]{...}` — never modify
- `\usepackage[...]{...}` — never modify
- `\begin{document}` / `\end{document}` — never modify
- `\input{...}`, `\include{...}`, `\subfile{...}` — never modify (these
  point to other files; if you want to edit those files, open them)
- `\bibliography{...}`, `\bibliographystyle{...}`, `\printbibliography`
- The entire preamble (everything between the first line and
  `\begin{document}`) is off-limits unless the user says otherwise. It
  contains macro definitions, package configuration, theorem environment
  declarations, and other things that affect the whole paper.

### Theorem-like environments

- `theorem`, `lemma`, `proposition`, `corollary`, `claim`, `fact`,
  `definition`, `axiom`, `conjecture`, `remark`, `example`, `proof`
- The *statement* of a theorem is part of the paper's content. Do not
  paraphrase. You can fix a clear typo only if asked.
- Inside `proof` you can light-edit prose, but be cautious: proofs often
  use very specific phrasing ("by induction on n", "without loss of
  generality") that math readers expect. Do not "improve" it.

### Code, listings, verbatim

The text inside these environments is rendered verbatim. Editing it
changes the paper's claims about software, syntax, or output.

- `verbatim`, `verbatim*`, `Verbatim`, `BVerbatim`, `LVerbatim`
- `lstlisting`
- `minted`, `mintedinline`
- `alltt`
- `\verb|...|`, `\verb!...!` (any delimiter)
- `\lstinline|...|`

### Tables

Tables are positional. Edits to alignment, column counts, or `&` separators
break them silently.

- `tabular`, `tabular*`, `tabularx`, `longtable`, `array`
- `table`, `table*`
- `booktabs` rules: `\toprule`, `\midrule`, `\bottomrule`, `\cmidrule`
- Cell separators `&` and row terminators `\\`
- `\multicolumn`, `\multirow`

You can lightly edit prose **inside** a table cell if it is clearly a long
text caption-style cell, but be very careful with column counts.

### Figures and captions

- `figure`, `figure*`, `subfigure`, `wrapfigure`
- `\includegraphics[...]{...}` — never modify
- `\caption{...}` — light edits only, and only if the user has not
  asked you to leave captions alone. Captions should remain
  self-contained and short.
- `\subcaption{...}` — same rules as `\caption`

### Algorithms

- `algorithm`, `algorithmic`, `algorithm2e`
- Pseudocode is content. Treat it like math. Comments inside pseudocode
  can be lightly edited if they are clearly prose.

### Bibliography source

- The contents of `\begin{thebibliography}{...} ... \end{thebibliography}`
- Any external `.bib` file
- BibTeX entry fields, including titles (titles in `.bib` are part of the
  cited work — do not "improve" them)

### Other commands

- `\cite*`, `\nocite`, `\bibitem`
- `\footnote{...}` — you can edit the prose inside `\footnote` like any
  other prose, but watch the braces
- `\section{...}`, `\subsection{...}`, `\subsubsection{...}`,
  `\paragraph{...}`, `\subparagraph{...}` — only edit the heading text
  if the user asked or if it contains a clear AI-ism. Match the case
  convention of the rest of the paper (see academic-style.md).
- `\title{...}`, `\author{...}`, `\affiliation{...}`, `\date{...}` —
  do not modify unless asked
- `\maketitle`, `\tableofcontents`, `\listoffigures`, `\listoftables`
- `\appendix`
- `\newcommand`, `\renewcommand`, `\newenvironment`, `\renewenvironment`,
  `\def`, `\let`, `\DeclareMathOperator` — never modify

### Comments

- `% ... ` — lines starting with `%` (and the part of any line after an
  unescaped `%`) are LaTeX comments. They are invisible in the output but
  often contain author notes, TODOs, or coauthor messages.
- Default: preserve them.
- Exception: if a comment is clearly a leftover AI artifact (e.g.
  "% Below is a paragraph about X" placed between sections by a previous
  drafting tool), you may delete it, but mention this to the user once.
- `\iffalse ... \fi` blocks are comment blocks at the LaTeX level.
  Preserve.

## Characters that bite

These are characters that look fine in prose but break LaTeX or render
badly. When you write replacement prose, make sure you do not introduce
them. When you find them in the source, decide whether to fix or leave.

| Character | LaTeX-correct form | Notes |
|---|---|---|
| `“ ”` (curly double quotes) | `` `` ... '' `` | LaTeX renders these as opening/closing pairs |
| `‘ ’` (curly single quotes) | `` ` ... ' `` | |
| `—` (em dash) | `---` | |
| `–` (en dash) | `--` | Used for ranges: pp. 12--15 |
| `…` (ellipsis) | `\ldots` or `\dots` | |
| `'` straight apostrophe | usually fine | But "don't" prefer to be removed in formal academic prose anyway |
| Non-breaking space | `~` | Use between citations and the preceding word: `Smith~\cite{...}` |
| `&`, `%`, `$`, `#`, `_`, `{`, `}`, `\`, `^` | escape with `\` | LaTeX special characters |
| Smart `'s` (ʼ, ʻ) | `'` | |

If you copy text out of the file, edit it in your head, and paste it back,
you risk introducing curly quotes and em dashes from your own model
output. Audit before saving.

## The "I am about to edit a tricky thing" checklist

Before changing a line that contains any LaTeX command, ask:

1. Is this command in the "do not touch" list above? If yes, do not edit
   the command. You may edit prose around it.
2. Does my edit change a brace count? Count `{` and `}` in the original
   line and in the replacement. They should match unless I am intentionally
   adding or removing a balanced pair of braces.
3. Does my edit change an environment boundary? `\begin{X}` must always
   pair with `\end{X}`.
4. Does my edit introduce any of the "characters that bite"? If yes,
   replace with the LaTeX-correct form.
5. If this is inside a math environment, am I sure it is prose and not
   math? If unsure, skip.

If any answer is uncomfortable, leave the line alone and either move on or
ask the user.

## When in doubt

Leave it. The user can ask you to be bolder. They cannot un-corrupt their
paper.
