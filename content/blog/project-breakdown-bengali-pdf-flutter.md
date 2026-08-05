---
title: "Project Breakdown: Searchable Bengali PDFs in Flutter Native Platforms"
slug: "project-breakdown-bengali-pdf-flutter"
excerpt: "A deep dive into how I built bengali_pdf to render HarfBuzz-shaped, fully searchable Bengali text in Flutter apps natively without losing accessibility or search capabilities."
category: "Project"
tags: ["flutter", "dart", "pdf", "harfbuzz", "bengali"]
cover_image: "/blog/project-breakdown-bengali-pdf-flutter-cover.jpg"
published_at: "2026-08-05"
updated_at: "2026-08-05"
reading_time: 5
seo_title: "Project Breakdown: Searchable Bengali PDFs in Flutter"
seo_description: "A deep dive into how I built bengali_pdf to render HarfBuzz-shaped, fully searchable Bengali text in Flutter apps natively."
is_published: true
---

# Project Breakdown: Searchable Bengali PDFs in Flutter Native Platforms

Generating PDFs in Flutter is a common requirement for many enterprise and consumer applications. Whether it's generating invoices, reports, or tickets, developers frequently need a robust way to create standard, printable documents. However, doing so with complex scripts like Bengali often presents significant hurdles. Text shaping, kerning, conjunct formations, and ensuring the final PDF is actually searchable are complex problems that standard libraries often fail to address. This is exactly why I built `bengali_pdf`, a specialized library to bridge this gap.

In this project breakdown, I will walk you through the architectural decisions, the core challenges of complex text layout (CTL), and how integrating HarfBuzz with native Flutter capabilities provided a comprehensive solution.

## What You'll Learn
- The challenge of complex text layout (CTL) in Flutter PDFs.
- Why HarfBuzz shaping is essential for Bengali text.
- The intricacies of integrating native font rendering with PDF structures.
- How `bengali_pdf` ensures text remains selectable, accessible, and searchable.

## The Challenge of Complex Text Layout

Standard PDF generation libraries in Flutter (and across many other ecosystems) often assume simple, left-to-right, non-ligature scripts like English or Spanish. When you throw Bengali text at them, the rendering pipeline breaks down completely. The characters often render individually without the necessary conjugations, ligatures, or correct positional placement, resulting in unreadable gibberish.

Bengali script is inherently complex. It is a cursive script where characters often change shape depending on their context. Consonants can combine to form complex conjuncts (যুক্তাক্ষর), and vowel markers (কার) can appear before, after, above, or below the consonant they modify.

To solve this, a text shaping engine is required. A shaping engine takes a sequence of Unicode characters and translates them into properly positioned visual glyphs, respecting the complex typographic rules defined within the font itself. Without a shaping engine, you are just painting individual letters, not writing words.

## Implementing HarfBuzz Shaping

HarfBuzz is an open-source text shaping engine widely used across the industry. It powers the text rendering in Android, Chrome, Firefox, LibreOffice, and many other major software projects. Integrating it into the PDF generation pipeline ensures that the complex rules of Bengali typography are accurately respected.

The challenge was bridging HarfBuzz's output with the low-level PDF rendering commands required by Flutter. We had to ensure that the memory overhead of invoking the shaping engine via FFI (Foreign Function Interface) did not negatively impact the application's overall performance during large document generation.

```dart
// Example conceptual usage of rendering shaped text in flutter
// This demonstrates the core idea behind the rendering pipeline used in bengali_pdf
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;

Future<pw.Document> generateBengaliPdf(String text) async {
  final pdf = pw.Document();

  // Load a font that supports Bengali glyphs and contains the necessary OpenType tables
  // The font choice is critical for HarfBuzz to function correctly
  final fontData = await rootBundle.load('assets/fonts/Kalpurush.ttf');
  final font = pw.Font.ttf(fontData);

  pdf.addPage(
    pw.Page(
      build: (pw.Context context) {
        // The underlying bengali_pdf library handles the HarfBuzz shaping internally
        // It intercepts this text, shapes it, and then instructs the PDF renderer
        // on the exact coordinates for each resulting glyph.
        return pw.Center(
          child: pw.Text(
            text,
            style: pw.TextStyle(font: font, fontSize: 24),
          ),
        );
      },
    ),
  );

  return pdf;
}
```

By leveraging native platform capabilities alongside HarfBuzz, the library translates the raw string into a properly laid-out visual representation before embedding it into the PDF structure. The shaping engine calculates the exact X and Y offsets for every single glyph, ensuring they seamlessly connect.

## Ensuring Text Searchability

A common, yet fundamentally flawed, workaround for rendering complex scripts in PDFs is to render the shaped text to an image or vector paths on a canvas, and then embed that image into the PDF. While this makes it visually correct on the screen or when printed, it completely destroys accessibility and searchability. You can't select, copy, or search for text that is just a picture. Screen readers are completely blind to it.

The key breakthrough in `bengali_pdf` is maintaining the mapping between the visual glyphs (how it looks) and the underlying Unicode characters (what it means) within the PDF structure itself. This requires constructing a complex reverse-mapping table during the document generation process.

PDFs support a mechanism called `ToUnicode` CMAP (Character Map). This internal table tells the PDF viewer exactly which Unicode characters correspond to the visual glyphs drawn on the page. By carefully constructing this CMAP during the generation process, `bengali_pdf` ensures that when a user selects a complex Bengali conjunct, the PDF viewer knows exactly which underlying Unicode characters to place into the clipboard.

This was the hardest part of the project, requiring deep dives into the official Adobe PDF specification and careful manipulation of byte streams to construct valid CMAP structures.

## Common Mistakes and How to Avoid Them

1.  **Ignoring Font Subsetting:** Embedding an entire Bengali font (which can easily be several megabytes) can massively inflate the final PDF file size. Always ensure your library or pipeline supports subsetting. Subsetting analyzes the actual text being rendered and only includes the specific glyphs and shaping tables required for that exact document, dramatically reducing file size.
2.  **Assuming Default Fonts Work:** Standard fonts bundled with operating systems or basic libraries rarely have the comprehensive ligature tables needed for proper Bengali rendering. Always provide a dedicated, high-quality OpenType font (like Kalpurush or Noto Sans Bengali) that explicitly contains the required GSUB (Glyph Substitution) and GPOS (Glyph Positioning) tables.
3.  **Rasterizing Text:** Never fallback to rasterizing text into images just because shaping is hard. The loss of searchability and accessibility is never worth the shortcut. Always strive to embed actual fonts and text streams.

## Conclusion

Building `bengali_pdf` taught me a lot about the intricacies of typography, text shaping, and the low-level details of PDF specifications. It bridges a crucial gap for developers building robust, localized applications in Flutter for millions of Bengali speakers. Ensuring that generated documents are not just visually correct, but also accessible and machine-readable, is paramount in modern software development. Have you faced similar challenges with RTL scripts like Arabic or other complex scripts in your native apps?

If you are interested in diving deeper into how modern tools are shifting development paradigms, check out my recent post on [The State of Web Performance: Vite, React, and the Death of Create React App](/blog/the-state-of-web-performance-vite-react). Learning about these lower-level optimizations, whether in web bundling or PDF generation, is crucial for building high-quality software.

---
*Did this help? Share it on [Twitter/X](https://twitter.com/intent/tweet?text=Project%20Breakdown%3A%20Searchable%20Bengali%20PDFs%20in%20Flutter&url=https://jehadurre.me/blog/project-breakdown-bengali-pdf-flutter) or [connect with Jehad on LinkedIn](https://linkedin.com/in/jehadurre).*
