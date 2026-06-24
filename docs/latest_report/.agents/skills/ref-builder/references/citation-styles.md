# Citation Styles Reference

This file covers the six citation styles most common in academic publishing.
For each style: how to detect it, how to format inline citations, and how to
format bibliography entries for the most common source types.

---

## Style Detection

| Clue | Style |
|---|---|
| `\bibliographystyle{IEEEtran}` or `\documentclass{IEEEtran}` | IEEE |
| `\bibliographystyle{apalike}` or `\usepackage[style=apa]{biblatex}` | APA |
| `\documentclass{acmart}` or `\bibliographystyle{ACM-Reference-Format}` | ACM |
| `\bibliographystyle{vancouver}` or biomedical journal | Vancouver |
| `\bibliographystyle{chicago}` or humanities journal | Chicago |
| Numbered brackets `[1]` in text, numbered list at end | IEEE or Vancouver |
| Author-year `(Smith, 2020)` in text | APA or Chicago author-date |
| Superscript numbers in text | Vancouver |
| Footnote citations | Chicago notes-bibliography |

If you cannot determine the style, default to **IEEE** for CS/engineering and **APA** for social science/biomedical.

---

## 1. IEEE Style

Used by: IEEE Transactions, IEEE conferences, most CS/EE venues.

### Inline citation
Numbered in square brackets, in order of first appearance:
```
...as proposed in [1]. Several methods [2], [3] have addressed this.
...the transformer architecture [4] has become standard.
```

### Bibliography entries

**Journal article:**
```
[1] A. Vaswani, N. Shazeer, N. Parmar, J. Uszkoreit, L. Jones, A. N. Gomez,
    L. Kaiser, and I. Polosukhin, "Attention is all you need," in Advances in
    Neural Information Processing Systems, vol. 30, 2017.
```

**Conference paper:**
```
[2] Y. LeCun, L. Bottou, Y. Bengio, and P. Haffner, "Gradient-based learning
    applied to document recognition," Proc. IEEE, vol. 86, no. 11,
    pp. 2278-2324, Nov. 1998.
```

**Book:**
```
[3] I. Goodfellow, Y. Bengio, and A. Courville, Deep Learning. Cambridge, MA:
    MIT Press, 2016.
```

**arXiv preprint:**
```
[4] J. Devlin, M.-W. Chang, K. Lee, and K. Toutanova, "BERT: Pre-training of
    deep bidirectional transformers for language understanding," arXiv preprint
    arXiv:1810.04805, 2018.
```

**Key rules:**
- Author names: first-name initials, then last name. List all authors (up to 6; use "et al." after 6).
- Title in double quotes, sentence case.
- Volume, number, pages, month, year at the end.

---

## 2. APA Style (7th edition)

Used by: psychology, social science, education, some biomedical journals.

### Inline citation
Author-year in parentheses:
```
...as proposed by Vaswani et al. (2017). Several methods (Smith, 2020;
Jones & Lee, 2019) have addressed this.
```
- One author: `(Smith, 2020)`
- Two authors: `(Smith & Jones, 2020)`
- Three or more: `(Smith et al., 2020)`

### Bibliography entries

**Journal article:**
```
Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N.,
    Kaiser, L., & Polosukhin, I. (2017). Attention is all you need. Advances
    in Neural Information Processing Systems, 30, 5998-6008.
```

**Conference paper:**
```
LeCun, Y., Bottou, L., Bengio, Y., & Haffner, P. (1998). Gradient-based
    learning applied to document recognition. Proceedings of the IEEE, 86(11),
    2278-2324. https://doi.org/10.1109/5.726791
```

**Book:**
```
Goodfellow, I., Bengio, Y., & Courville, A. (2016). Deep learning. MIT Press.
```

**Key rules:**
- Author names: Lastname, Initials. List all authors up to 20.
- Year in parentheses after authors.
- Title in sentence case, no quotes.
- Journal name in italics, title case.
- DOI as `https://doi.org/...` at the end.

---

## 3. ACM Style

Used by: ACM conferences (SIGCHI, SIGMOD, PLDI) and ACM journals.

### Inline citation
Numbered in square brackets, order of first appearance:
```
...as proposed in [1]. Several methods [2, 3] have addressed this.
```

### Bibliography entries

**Conference paper:**
```
[1] Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones,
    Aidan N. Gomez, Lukasz Kaiser, and Illia Polosukhin. 2017. Attention is
    all you need. In Proceedings of NIPS'17. Curran Associates, 6000-6010.
```

**Journal article:**
```
[2] Yann LeCun, Leon Bottou, Yoshua Bengio, and Patrick Haffner. 1998.
    Gradient-based learning applied to document recognition. Proceedings of
    the IEEE 86, 11 (1998), 2278-2324. https://doi.org/10.1109/5.726791
```

**Key rules:**
- Full author names (not initials).
- Year after authors, followed by period.
- Title in sentence case.
- DOI as URL at the end.

---

## 4. Vancouver Style

Used by: biomedical journals (NEJM, Lancet, BMJ, JAMA, PLOS ONE).

### Inline citation
Superscript numbers in order of first appearance:
```
...as proposed in prior work.1 Several methods2,3 have addressed this.
```
Or square brackets: `[1]`, `[2,3]`

### Bibliography entries

**Journal article:**
```
1. Vaswani A, Shazeer N, Parmar N, Uszkoreit J, Jones L, Gomez AN, et al.
   Attention is all you need. Adv Neural Inf Process Syst. 2017;30:5998-6008.
```

**Book:**
```
2. Goodfellow I, Bengio Y, Courville A. Deep Learning. Cambridge (MA): MIT
   Press; 2016. 800 p.
```

**Key rules:**
- Author names: Lastname Initials (no periods after initials).
- List up to 6 authors; use "et al." after 6.
- Journal names abbreviated (NLM abbreviations).
- Semicolon between year and volume: `Year;Volume(Issue):Pages`.

---

## 5. Chicago Style

Two variants: **Author-Date** (sciences, social sciences) and **Notes-Bibliography** (humanities).

### Chicago Author-Date inline:
```
...as proposed (Vaswani et al. 2017). Several methods (Smith 2020; Jones and
Lee 2019) have addressed this.
```
Note: no comma between author and year (unlike APA).

### Chicago Author-Date bibliography entry:
```
Vaswani, Ashish, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones,
    Aidan N. Gomez, Lukasz Kaiser, and Illia Polosukhin. 2017. "Attention Is
    All You Need." Advances in Neural Information Processing Systems 30: 5998-6008.
```

### Chicago Notes-Bibliography footnote:
```
1. Ashish Vaswani et al., "Attention Is All You Need," Advances in Neural
   Information Processing Systems 30 (2017): 5998-6008.
```

**Key rules:**
- Title case for all titles.
- No "et al." in bibliography (list all authors).
- Year in parentheses after journal name for author-date.

---

## 6. MLA Style (9th edition)

Used by: literature, humanities, language studies.

### Inline citation
Parenthetical author-page:
```
...as proposed in prior work (Vaswani et al. 5998).
```

### Works Cited entries

**Journal article:**
```
Vaswani, Ashish, et al. "Attention Is All You Need." Advances in Neural
    Information Processing Systems, vol. 30, 2017, pp. 5998-6008.
```

**Book:**
```
Goodfellow, Ian, et al. Deep Learning. MIT Press, 2016.
```

**Key rules:**
- Title case for all titles.
- "et al." after first author when 3 or more authors.
- Year goes at the end of the entry.
- Section heading is "Works Cited".

---

## Quick-reference: style by domain

| Domain | Default style |
|---|---|
| CS / ML / AI | IEEE or ACM |
| Electrical / mechanical engineering | IEEE |
| Biomedical / clinical | Vancouver or APA |
| Psychology / social science | APA |
| Physics / chemistry | APA or journal-specific |
| Humanities / literature | MLA or Chicago notes |
| Economics / political science | Chicago author-date |
| Interdisciplinary | Match the venue |
