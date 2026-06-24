# Search Strategy Reference

This file describes how to find and verify real academic papers for each claim
in a manuscript. Read this at the start of Phase 3 (search for supporting papers).

---

## Core principle

Every citation you add must correspond to a paper you actually found and
verified on the web. Never construct a citation from memory. Always search,
fetch, and confirm.

---

## Search sources by domain

| Domain | Primary sources | Secondary |
|---|---|---|
| CS / ML / AI | arXiv, Semantic Scholar, Google Scholar | ACM DL, IEEE Xplore |
| Computer vision | arXiv, Semantic Scholar | IEEE Xplore |
| NLP / speech | arXiv, ACL Anthology | Semantic Scholar |
| Systems / networking | ACM DL, IEEE Xplore | Google Scholar |
| Biomedical / clinical | PubMed, Google Scholar | Semantic Scholar |
| Physics / chemistry | arXiv, Google Scholar | — |
| Engineering | IEEE Xplore, Google Scholar | ACM DL |
| Social science / HCI | ACM DL, Google Scholar | Semantic Scholar |
| Economics | Google Scholar, SSRN | — |

### Source URLs

```
Google Scholar:    https://scholar.google.com/scholar?q=QUERY
Semantic Scholar:  https://www.semanticscholar.org/search?q=QUERY&sort=Relevance
arXiv:             https://arxiv.org/search/?query=QUERY&searchtype=all
PubMed:            https://pubmed.ncbi.nlm.nih.gov/?term=QUERY
IEEE Xplore:       https://ieeexplore.ieee.org/search/searchresult.jsp?queryText=QUERY
ACM DL:            https://dl.acm.org/action/doSearch?query=QUERY
ACL Anthology:     https://aclanthology.org/search/?q=QUERY
SSRN:              https://papers.ssrn.com/sol3/results.cfm?txtkey=QUERY
```

Replace `QUERY` with URL-encoded search terms (spaces as `+`).

---

## Query construction

For each claim, construct 2-3 targeted queries. Do not paste the claim text verbatim.

### Query types

**Named entity query** — when the claim names a specific method, dataset, or model:
```
Claim: "...using the BERT language model..."
Query: "BERT pre-training deep bidirectional transformers Devlin"
```

**Concept query** — when the claim is about a general technique or finding:
```
Claim: "...attention mechanisms have improved machine translation..."
Query: "attention mechanism neural machine translation"
```

**Author + year query** — when you have a partial citation:
```
Claim: "...as shown by Smith et al. [?]..."
Query: "Smith 2020 [topic of the paper]"
```

**Survey query** — when the claim is about a broad trend:
```
Claim: "...deep learning has achieved state-of-the-art results in image classification..."
Query: "survey deep learning image classification 2022"
```

**Rules:**
- Use the most specific terms first (method name, author name, year if known)
- Include the year if you have it
- For named models/datasets, use the canonical name (BERT, GPT, ResNet, ImageNet)
- Keep queries to 4-8 words

---

## Verification protocol

A paper is only verified if you fetched its page and confirmed the key fields.

### Step 1: Search and identify candidates

Run the query. From the results, identify 1-3 candidates whose title and
authors look right.

### Step 2: Fetch the paper's detail page

- **arXiv:** Fetch `https://arxiv.org/abs/ARXIV_ID`
- **PubMed:** Fetch `https://pubmed.ncbi.nlm.nih.gov/PMID/`
- **Semantic Scholar / Google Scholar:** Fetch the linked detail page
- **IEEE Xplore / ACM DL:** Fetch the detail page URL from search results

### Step 3: Confirm these fields

A paper is verified when you can confirm all of:
- **Title** — matches what you searched for
- **Authors** — at least the first author's last name matches
- **Year** — within a reasonable range for the claim
- **Venue** — a recognisable journal, conference, or preprint server

### Step 4: Record the citation data

```
title:   exact title from the page
authors: full author list as shown
year:    publication year
venue:   journal name / conference name / "arXiv preprint"
volume/issue/pages: if available
doi:     if available
url:     the detail page URL you fetched
```

---

## Handling failed searches

**No results found:**
1. Simplify the query (remove the year, remove one keyword)
2. Try a different source
3. Try a terminology variant (e.g., "self-attention" instead of "attention mechanism")
4. After 3 attempts with no result: mark the claim as "no source found" and report to the user. Do not invent a citation.

**URL does not resolve:**
- Try fetching the DOI directly: `https://doi.org/DOI`
- Try searching on a different source
- If still unresolvable: list in "could not verify" section. Do not include in bibliography.

**Paper found but does not support the claim:**
- Do not use it. Search for a different paper.
- If no better paper is found, note the claim as "no verified source found".

---

## Source quality tiers

When multiple candidates exist for a claim, prefer in this order:

**Tier 1 — Strongest:**
- Published in a top peer-reviewed venue (NeurIPS, ICML, CVPR, Nature, Science, NEJM, IEEE Transactions, ACM SIGCHI)
- Highly cited
- The original paper that introduced the method/concept

**Tier 2 — Good:**
- Solid peer-reviewed venue (ICLR, AAAI, EMNLP, MICCAI, VLDB)
- Survey or review paper from a credible venue

**Tier 3 — Acceptable:**
- Widely-cited arXiv preprint from a known research group
- Workshop paper at a major conference
- Technical report from a major institution

**Avoid:**
- Blog posts, Wikipedia, news articles
- Papers from predatory journals
- Papers with no venue and no citation count

---

## Common named models and datasets

For claims naming a specific model or dataset, search for the original paper:

| Name | Search for |
|---|---|
| Transformer / attention | "Attention is all you need" Vaswani 2017 |
| BERT | "BERT pre-training deep bidirectional transformers" Devlin 2019 |
| ResNet | "Deep residual learning for image recognition" He 2016 |
| ImageNet | "ImageNet large scale visual recognition challenge" Russakovsky 2015 |
| Word2Vec | "Distributed representations of words and phrases" Mikolov 2013 |
| GAN | "Generative adversarial nets" Goodfellow 2014 |
| LSTM | "Long short-term memory" Hochreiter 1997 |
| Adam optimizer | "Adam: A method for stochastic optimization" Kingma 2015 |
| Dropout | "Dropout: A simple way to prevent neural networks from overfitting" Srivastava 2014 |
| GPT / GPT-2 / GPT-3 | OpenAI technical reports (search by name + year) |

---

## Special cases

**Claim is too vague to search** (e.g., "machine learning has been widely applied in healthcare"):
- Find a survey paper covering the general claim
- Or find 2-3 representative papers that together support it
- Note to the user that the claim may need to be made more specific

**Claim about the paper's own prior work** ("in our previous work [?]"):
- Search for the authors' names + the topic of the prior work
- If not found, flag to the user — they know their own prior work

**Statistics and facts** ("X% of patients...", "the dataset contains N examples..."):
- Search for the statistic itself plus the domain and year
- The citation should be the paper or report that published that statistic
