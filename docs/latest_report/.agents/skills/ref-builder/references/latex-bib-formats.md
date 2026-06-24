# LaTeX Bibliography Formats Reference

This file covers BibTeX entry templates, natbib and biblatex usage patterns,
and how to handle the `thebibliography` environment. Read this in Phase 4
(assign keys) and Phase 6 (build bibliography) for LaTeX papers.

---

## Detecting which system the paper uses

| Clue in the .tex file | System |
|---|---|
| `\bibliography{refs}` + `\bibliographystyle{...}` | Classic BibTeX |
| `\usepackage{natbib}` | natbib (author-year or numbered) |
| `\usepackage[backend=biber]{biblatex}` | biblatex + biber |
| `\usepackage[backend=bibtex]{biblatex}` | biblatex + BibTeX backend |
| `\begin{thebibliography}{99}` | Inline bibliography (no .bib file) |

---

## BibTeX key format

Use the pattern `AuthorYEARkeyword`:
- `Vaswani2017attention`
- `LeCun1998gradient`
- `Goodfellow2016deep`
- `Devlin2019bert`

Rules:
- First author's last name, no spaces, capitalised
- 4-digit year
- One lowercase keyword from the title (the most distinctive word)
- No special characters, no spaces, no hyphens

---

## BibTeX entry templates

### @article — journal paper

```bibtex
@article{AuthorYEARkeyword,
  author    = {Lastname, Firstname and Lastname, Firstname and Lastname, Firstname},
  title     = {Title of the Article in Title Case},
  journal   = {Full Journal Name},
  year      = {2020},
  volume    = {10},
  number    = {3},
  pages     = {100--120},
  doi       = {10.1000/xyz123},
  url       = {https://doi.org/10.1000/xyz123}
}
```

### @inproceedings — conference paper

```bibtex
@inproceedings{AuthorYEARkeyword,
  author    = {Lastname, Firstname and Lastname, Firstname},
  title     = {Title of the Paper},
  booktitle = {Proceedings of the Conference Name (ABBREV)},
  year      = {2020},
  pages     = {100--110},
  publisher = {Publisher Name},
  address   = {City, Country},
  doi       = {10.1145/1234567.1234568},
  url       = {https://doi.org/10.1145/1234567.1234568}
}
```

### @book — book

```bibtex
@book{AuthorYEARkeyword,
  author    = {Lastname, Firstname and Lastname, Firstname},
  title     = {Title of the Book},
  publisher = {Publisher Name},
  year      = {2020},
  address   = {City, Country},
  edition   = {2nd},
  isbn      = {978-0-000-00000-0}
}
```

### @incollection — chapter in an edited book

```bibtex
@incollection{AuthorYEARkeyword,
  author    = {Lastname, Firstname},
  title     = {Title of the Chapter},
  booktitle = {Title of the Book},
  editor    = {Editor Lastname, Firstname},
  publisher = {Publisher Name},
  year      = {2020},
  pages     = {50--75}
}
```

### @misc — arXiv preprint

```bibtex
@misc{AuthorYEARkeyword,
  author        = {Lastname, Firstname and Lastname, Firstname},
  title         = {Title of the Preprint},
  year          = {2020},
  eprint        = {2001.12345},
  archivePrefix = {arXiv},
  primaryClass  = {cs.LG},
  url           = {https://arxiv.org/abs/2001.12345}
}
```

### @techreport — technical report

```bibtex
@techreport{AuthorYEARkeyword,
  author      = {Lastname, Firstname},
  title       = {Title of the Report},
  institution = {Institution Name},
  year        = {2020},
  number      = {TR-2020-01},
  url         = {https://example.com/report.pdf}
}
```

### @phdthesis / @mastersthesis — thesis

```bibtex
@phdthesis{AuthorYEARkeyword,
  author = {Lastname, Firstname},
  title  = {Title of the Thesis},
  school = {University Name},
  year   = {2020},
  url    = {https://example.com/thesis.pdf}
}
```

---

## Author name formatting in BibTeX

BibTeX parses author names in two formats:

**Format 1 (preferred):** `Lastname, Firstname`
```
author = {Vaswani, Ashish and Shazeer, Noam and Parmar, Niki}
```

**Format 2:** `Firstname Lastname`
```
author = {Ashish Vaswani and Noam Shazeer and Niki Parmar}
```

Use `and` (not commas) to separate authors. For "et al." in the output,
BibTeX handles this automatically based on the bibliography style — list all
authors in the `.bib` file.

**Special characters:** Use LaTeX encoding for accented characters:
- `{\'e}` for é, `{\`e}` for è, `{\"o}` for ö, `{\c{c}}` for ç
- Or use UTF-8 if the file has `\usepackage[utf8]{inputenc}`

---

## natbib usage

natbib is loaded with `\usepackage{natbib}`. It supports both author-year
and numbered citation styles depending on the bibliography style used.

### Citation commands

| Command | Output (author-year) | Output (numbered) |
|---|---|---|
| `\cite{key}` | (Author, Year) | [1] |
| `\citep{key}` | (Author, Year) | [1] |
| `\citet{key}` | Author (Year) | Author [1] |
| `\citep[p.~5]{key}` | (Author, Year, p. 5) | [1, p. 5] |
| `\citep{key1,key2}` | (Author1, Year1; Author2, Year2) | [1, 2] |
| `\citeauthor{key}` | Author | Author |
| `\citeyear{key}` | Year | Year |

**When to use `\citet` vs `\citep`:**
- `\citet` when the author is the grammatical subject: `\citet{Smith2020} showed that...`
- `\citep` for parenthetical citations: `...as shown in prior work \citep{Smith2020}.`

### Common natbib bibliography styles

| Style | Format |
|---|---|
| `plainnat` | Author-year, sorted alphabetically |
| `abbrvnat` | Author-year, abbreviated first names |
| `unsrtnat` | Author-year, unsorted (order of citation) |
| `apalike` | APA-like author-year |
| `IEEEtranN` | IEEE numbered with natbib |

---

## biblatex usage

biblatex is loaded with `\usepackage[style=...,backend=biber]{biblatex}`.

### Citation commands

| Command | Output |
|---|---|
| `\cite{key}` | Depends on style |
| `\parencite{key}` | (Author, Year) or [1] |
| `\textcite{key}` | Author (Year) |
| `\footcite{key}` | Footnote citation |
| `\autocite{key}` | Style-dependent (recommended default) |

Use `\autocite` when in doubt — it adapts to the loaded style.

### Common biblatex styles

| Style option | Format |
|---|---|
| `style=numeric` | Numbered [1] |
| `style=authoryear` | Author-year (APA-like) |
| `style=apa` | APA 7th edition |
| `style=ieee` | IEEE |
| `style=acm-reference-format` | ACM |
| `style=chicago-authordate` | Chicago author-date |
| `style=mla` | MLA |
| `style=vancouver` | Vancouver |

### Printing the bibliography

```latex
\printbibliography
% or with a title:
\printbibliography[title={References}]
```

---

## thebibliography environment (no .bib file)

Some papers embed the bibliography directly in the `.tex` file. The format is:

```latex
\begin{thebibliography}{99}

\bibitem{Vaswani2017attention}
A. Vaswani, N. Shazeer, N. Parmar, J. Uszkoreit, L. Jones, A.~N. Gomez,
  L. Kaiser, and I. Polosukhin,
\newblock ``Attention is all you need,''
\newblock in {\em Advances in Neural Information Processing Systems}, vol.~30,
  2017.

\bibitem{LeCun1998gradient}
Y. LeCun, L. Bottou, Y. Bengio, and P. Haffner,
\newblock ``Gradient-based learning applied to document recognition,''
\newblock {\em Proceedings of the IEEE}, vol.~86, no.~11, pp.~2278--2324,
  Nov. 1998.

\end{thebibliography}
```

**Rules for thebibliography:**
- The argument `{99}` sets the label width — use `{99}` for up to 99 references, `{9}` for up to 9.
- Each entry starts with `\bibitem{key}`.
- Use `\newblock` to separate the author block, title block, and venue block.
- Use `{\em ...}` for italics (journal/book names).
- Use `~` for non-breaking spaces before numbers: `vol.~30`, `pp.~100--120`.
- Use `--` for page ranges: `pp.~100--120`.

**Adding a new entry to thebibliography:**
Insert a new `\bibitem{key}` block before `\end{thebibliography}`. The order
of entries in `thebibliography` determines the numbering — insert in the order
you want them numbered (typically order of first appearance in the text).

---

## Placing citations in the text

```latex
% After a claim, before the period:
...as shown in prior work~\cite{Smith2020}.

% After a named method:
the BERT model~\cite{Devlin2019bert} achieves...

% Multiple citations:
Several methods~\cite{Smith2020,Jones2019,Lee2021} have addressed this.

% natbib author-year:
\citet{Smith2020} showed that...
...as demonstrated in prior work~\citep{Smith2020}.

% biblatex:
\textcite{Smith2020} showed that...
...as demonstrated~\autocite{Smith2020}.
```

**Use `~` (non-breaking space) before `\cite`** to prevent a line break
between the text and the citation number. This is standard LaTeX practice.

---

## Common mistakes to avoid

- **Do not add a `\cite{key}` for a key not in the `.bib` file or `thebibliography`.** This causes a compile warning and a `[?]` in the output.
- **Do not modify existing `\bibitem` keys** — other `\cite{key}` calls in the paper depend on them.
- **Do not use smart quotes** in `.bib` files — use `{Title}` or `"Title"` (BibTeX double quotes), not curly Unicode quotes.
- **Protect capital letters** in titles that must stay capitalised: `{BERT}`, `{ImageNet}`, `{GPU}`. BibTeX lowercases titles in some styles unless the letters are in braces.
- **Use `--` for page ranges**, not `-`: `pages = {100--120}`.
