INSERT INTO public.blog_posts (
  title,
  slug,
  excerpt,
  content,
  cover_image,
  category,
  tags,
  published_at,
  read_time,
  seo_title,
  seo_description,
  is_published
) VALUES (
  'Building an Automatic Progressive Context-Sensitive Spell Checker for Bangla using BERT',
  'building-contextual-spell-checker-bangla-bert',
  'A deep dive into how I built a progressive context-sensitive spelling correction tool for Bangla text using BERT masked language modeling, NER, and Levenshtein distance.',
  '---
title: "Building an Automatic Progressive Context-Sensitive Spell Checker for Bangla using BERT"
slug: "building-contextual-spell-checker-bangla-bert"
excerpt: "A deep dive into how I built a progressive context-sensitive spelling correction tool for Bangla text using BERT masked language modeling, NER, and Levenshtein distance."
category: "Project"
tags: ["machine-learning", "nlp", "bangla", "bert", "python"]
cover_image: "/blog/building-contextual-spell-checker-bangla-bert-cover.jpg"
published_at: "2026-08-07"
updated_at: "2026-08-07"
reading_time: 5
seo_title: "Building an Automatic Progressive Context-Sensitive Spell Checker for Bangla using BERT"
seo_description: "A deep dive into how I built a progressive context-sensitive spelling correction tool for Bangla text using BERT masked language modeling, NER, and Levenshtein distance."
is_published: true
---

# Building an Automatic Progressive Context-Sensitive Spell Checker for Bangla using BERT

Natural Language Processing (NLP) in Bengali presents unique challenges due to its complex morphology, rich vocabulary, and the sheer variance in how words are spelled and used in context. A simple dictionary lookup isn''t enough to correct sentences where a misspelled word might actually be a valid word in a different context.

In this deep dive, we will explore the architecture, challenges, and implementation details behind the **Automatic Progressive Context-Sensitive Spelling Correction for Bangla Text**, a project that leverages BERT and Levenshtein Distance to intelligently correct Bengali sentences.

## What You''ll Learn
- The challenges of Bangla spell checking and why traditional methods fall short.
- How BERT Masked Language Modeling (MLM) can predict contextually appropriate words.
- Integrating Named Entity Recognition (NER) to protect proper nouns from being "corrected."
- Combining Levenshtein Distance with dictionary lookups for robust candidate generation.

## The Problem with Traditional Spell Checkers

Traditional spell checkers often rely on a predefined dictionary and algorithms like Levenshtein Distance (edit distance) to find the closest matching word when a misspelling is detected.

For instance, if a user types "আপেলল", the system might suggest "আপেল" (apple) because it''s only one edit away. However, consider the sentence: "সে কাল ঢাকা জাবে". The word "জাবে" is misspelled; it should be "যাবে" (will go). A simple spell checker might not know if it should be "যাবে" or another phonetically similar word without understanding the surrounding words.

Context is king. We need a model that understands the sentence to make intelligent corrections.

## Enter BERT: Masked Language Modeling

BERT (Bidirectional Encoder Representations from Transformers) is designed to understand the context of a word based on all of its surroundings (left and right). For our spell checker, we use a specific capability of BERT: **Masked Language Modeling (MLM)**.

The idea is simple:
1. Identify a potentially misspelled word.
2. Replace it with a special `[MASK]` token.
3. Ask BERT to predict the most likely words that could fill in that blank based on the rest of the sentence.

```python
from transformers import pipeline

# Load a pre-trained Bangla BERT model for Masked Language Modeling
# For example: ''sagorsarker/bangla-bert-base''
unmasker = pipeline(''fill-mask'', model=''sagorsarker/bangla-bert-base'')

sentence = "সে কাল ঢাকা [MASK]"
predictions = unmasker(sentence)

for pred in predictions:
    print(f"Predicted: {pred[''token_str'']}, Score: {pred[''score'']}")
```

This snippet demonstrates how BERT can suggest words that grammatically and semantically fit the context. By comparing these suggestions against the misspelled word, we can find the most likely intended word.

## Protecting Proper Nouns with NER

One major issue with aggressive spell correction is that it often alters proper nouns—names of people, places, or unique entities—because they might not exist in a standard dictionary.

To prevent this, we integrate a **Named Entity Recognition (NER)** model. Before we attempt any spelling correction, we pass the sentence through the NER model to identify and tag these entities.

```python
# Pseudo-code for NER integration
from transformers import pipeline

ner_model = pipeline(''ner'', model=''sagorsarker/mbert-bengali-ner'', aggregation_strategy="simple")

def extract_entities(sentence):
    entities = ner_model(sentence)
    protected_words = [entity[''word''] for entity in entities]
    return protected_words

sentence = "রহিম গতকাল ঢাকা গিয়েছিল"
protected_words = extract_entities(sentence)
print(f"Protected Words: {protected_words}")
# Output: [''রহিম'', ''ঢাকা'']
```

By maintaining a list of protected words, the progressive spell checker knows to skip them, ensuring that "রহিম" doesn''t accidentally get corrected to something else.

## Generating Candidates: Levenshtein Distance and Dictionary Lookup

When BERT predicts words for a masked position, it often provides a probability distribution over the entire vocabulary. To narrow this down and ensure the correction actually resembles the original misspelled word, we use **Levenshtein Distance**.

The Levenshtein Distance calculates the minimum number of single-character edits (insertions, deletions, or substitutions) required to change one word into another.

We combine this with a massive dictionary lookup (in our project, we used 451,742 unique words from the Oscar 2019 dataset).

Here is the general workflow for a single word:
1. Check if the word is in the dictionary. If it is, and it fits the context, it might be correct.
2. If it''s not, generate candidates from the dictionary that are within a small Levenshtein distance (e.g., distance 1 or 2).
3. Compare these candidates against the high-probability words predicted by BERT''s MLM for that specific position.
4. Select the candidate that has the highest combined score (close edit distance + high contextual probability).

## Putting It All Together: The Progressive Approach

The "Progressive" aspect of the spell checker means it doesn''t just evaluate each word in isolation. It evaluates the sentence progressively, updating its contextual understanding as corrections are made.

If a sentence has multiple misspellings, correcting the first one changes the context for the second one.

```python
# Example of the final output from our SpellChecker class
from source.spell_checker import SpellChecker

sentence = "পুলিশ আসা আগে ডাকাত পালিয়ে গোছে".split(" ")
# ''গোছে'' is misspelled, should be ''গেছে''

corrected_sentence = SpellChecker().prediction(sentence=sentence, k=100)
print(corrected_sentence)
# Expected Output: [''পুলিশ'', ''আসার'', ''আগে'', ''ডাকাত'', ''পালিয়ে'', ''গেছে'']
```

Notice how "আসা" might be corrected to "আসার" to fix grammatical context, and "গোছে" is successfully corrected to "গেছে".

## Common Mistakes and How to Avoid Them

When building NLP pipelines for Bengali, developers often fall into a few traps:
- **Ignoring the Vocabulary Size:** Bangla has a massive vocabulary due to agglutination (words combining). Ensure your dictionary is comprehensive (like the Oscar dataset) otherwise valid words will constantly be flagged as misspelled.
- **Over-Relying on Edit Distance:** phonetic misspellings in Bangla (like confusing ''শ'', ''ষ'', and ''স'') might have a small edit distance, but without context, you''ll pick the wrong word. Always combine edit distance with a language model like BERT.
- **Skipping NER:** If you don''t protect entities, your model will butcher names and locations, leading to a frustrating user experience.

## Conclusion

Building a robust contextual spell checker for Bangla requires more than just a list of words. By combining the contextual power of BERT''s Masked Language Modeling, the safety of Named Entity Recognition, and the structural comparison of Levenshtein Distance, we can create a system that intelligently understands and corrects Bengali text.

This project is open-source and continuously evolving. I''m currently looking into adding support for LSTM/GRU based masked prediction models as well.

---
*Did this help? Share it on [Twitter/X](https://twitter.com/intent/tweet?text=Building%20an%20Automatic%20Progressive%20Context-Sensitive%20Spell%20Checker%20for%20Bangla%20using%20BERT&url=https://jehadurre.me/blog/building-contextual-spell-checker-bangla-bert) or [connect with Jehad on LinkedIn](https://linkedin.com/in/jehadurre).*',
  '/blog/building-contextual-spell-checker-bangla-bert-cover.jpg',
  'Project',
  ARRAY['machine-learning', 'nlp', 'bangla', 'bert', 'python'],
  '2026-08-07 00:00:00+00',
  5,
  'Building an Automatic Progressive Context-Sensitive Spell Checker for Bangla using BERT',
  'A deep dive into how I built a progressive context-sensitive spelling correction tool for Bangla text using BERT masked language modeling, NER, and Levenshtein distance.',
  true
);
