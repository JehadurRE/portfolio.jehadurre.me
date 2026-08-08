---
title: "Deep Dive: Building bengali_pdf for HarfBuzz-Shaped Bangla Text in Flutter"
slug: "building-bengali-pdf-harfbuzz-flutter"
excerpt: "Learn how I built bengali_pdf to render complex HarfBuzz-shaped, searchable Bangla text in Flutter applications."
category: "Project"
tags: ["flutter", "dart", "harfbuzz", "typography", "pdf"]
cover_image: "/blog/building-bengali-pdf-harfbuzz-flutter-cover.jpg"
published_at: "2026-08-08"
updated_at: "2026-08-08"
reading_time: 4
seo_title: "Building bengali_pdf for HarfBuzz-Shaped Bangla Text in Flutter"
seo_description: "A comprehensive guide on building bengali_pdf, a Flutter package that integrates HarfBuzz to correctly shape and render complex Bangla text in PDFs."
is_published: true
---

# Deep Dive: Building bengali_pdf for HarfBuzz-Shaped Bangla Text in Flutter

If you've ever tried to generate PDF documents containing complex scripts like Bangla (Bengali) using Flutter, you've likely encountered a major roadblock: the text doesn't render correctly. Consonant conjuncts (juktakkhor) break apart, vowel markers (kar) appear in the wrong positions, and the result is completely illegible. This happens because standard PDF libraries lack a complex text shaping engine. In this deep dive, I'll explain how I solved this problem by building `bengali_pdf`, a Flutter package that leverages HarfBuzz to properly shape and render searchable Bangla text.

## What You'll Learn
- Why standard text rendering fails for complex scripts like Bangla.
- The role of HarfBuzz in text shaping and glyph placement.
- How to integrate native C/C++ libraries (HarfBuzz) into a Dart/Flutter project using FFI.
- Techniques for making shaped text searchable within a generated PDF.

## The Problem: Complex Text Shaping

Languages like English have a simple, linear relationship between characters in a string and the visual symbols (glyphs) rendered on screen. One character typically corresponds to one glyph, positioned consecutively from left to right.

Bangla, however, is a complex script based on the Brahmic family. It requires **text shaping**:
1. **Contextual Substitution:** Characters change form depending on their neighbors (e.g., conjuncts).
2. **Reordering:** Some vowel markers (like the 'i' kar) are typed after the consonant but must be rendered *before* it visually.
3. **Positioning:** Diacritics must be precisely positioned above or below base characters.

Most standard PDF generation libraries (like Flutter's popular `pdf` package) only handle simple layouts. When you feed them Bangla strings, they just map characters to fonts 1:1, completely ignoring these complex rules.

## Enter HarfBuzz

To fix this, we need a text shaping engine. [HarfBuzz](https://harfbuzz.github.io/) is the gold standard—it's the same engine used by Android, Chrome, and Firefox. It takes a string of text, a font file, and spits out a list of specific glyph IDs and their exact X/Y coordinates.

The challenge? HarfBuzz is a C/C++ library, and we are working in Dart.

```dart
// The naive approach that fails for Bangla
pdf.addPage(
  pw.Page(
    build: (pw.Context context) {
      // This will render broken text!
      return pw.Text('বাংলা টেকস্ট', style: pw.TextStyle(font: banglaFont));
    },
  ),
);
```

## Bridging the Gap with Dart FFI

To bring HarfBuzz to Flutter, I used Dart's Foreign Function Interface (FFI). FFI allows Dart code to directly call C functions.

Building `bengali_pdf` required several steps:
1. **Compiling HarfBuzz:** I had to compile HarfBuzz as a dynamic library (`.so`, `.dylib`, `.dll`) for all target platforms (Android, iOS, Windows, macOS, Linux).
2. **Generating Bindings:** Using the `ffigen` tool, I generated Dart bindings for the HarfBuzz C headers.
3. **Creating the Dart Wrapper:** I wrote a clean Dart API to initialize the HarfBuzz buffer, set the text and script direction, and extract the shaped glyphs.

Here's a simplified look at how the shaping wrapper works:

```dart
// Simplified example of calling HarfBuzz via FFI in Dart
List<ShapedGlyph> shapeText(String text, Font font) {
  // 1. Create a HarfBuzz buffer
  final buffer = hb_buffer_create();

  // 2. Add text and configure script
  hb_buffer_add_utf8(buffer, text.toNativeUtf8(), -1, 0, -1);
  hb_buffer_set_direction(buffer, HB_DIRECTION_LTR);
  hb_buffer_set_script(buffer, HB_SCRIPT_BENGALI);

  // 3. Shape the text using the font
  final hbFont = createHbFontFrom(font);
  hb_shape(hbFont, buffer, nullptr, 0);

  // 4. Extract glyph info and positions
  final info = hb_buffer_get_glyph_infos(buffer, lengthPtr);
  final positions = hb_buffer_get_glyph_positions(buffer, lengthPtr);

  // ... process and return mapped glyphs ...

  hb_buffer_destroy(buffer);
  return shapedGlyphs;
}
```

## Making It Searchable in PDFs

Once I had the shaped glyphs (IDs and coordinates), I could draw them onto the PDF canvas. But drawing raw glyphs creates a new problem: the text is no longer searchable! A PDF viewer only sees vectors, not the original text string.

To make the PDF searchable, I had to embed an invisible text layer behind the drawn glyphs, or properly map the glyph IDs back to Unicode values using a `/ToUnicode` CMap in the PDF dictionary.

I chose the latter approach, ensuring that when a user highlights "বাংলা", they are actually selecting the correct Unicode string, even though the PDF is rendering highly customized HarfBuzz glyphs.

## Common Mistakes and How to Avoid Them

1. **Ignoring Font Fallbacks:** HarfBuzz only shapes text if the font actually supports those characters. If your chosen font lacks Bengali glyphs, HarfBuzz will return the "Not Def" (missing) glyph (usually an empty box). Always ensure your font file fully covers the Unicode ranges you need.
2. **Memory Leaks in FFI:** When working with C libraries via Dart FFI, you are responsible for manual memory management. Forgetting to call `malloc.free()` or `hb_buffer_destroy()` will lead to severe memory leaks. Always use `try/finally` blocks to ensure resources are freed.
3. **Assuming 1:1 Glyph-to-Character Ratios:** Never assume the output array of glyphs will match the length of the input string. A 3-character Bangla conjunct might shape into a single complex glyph, or one character might split into multiple glyphs.

## Conclusion

Building `bengali_pdf` was a deep dive into the fascinating world of digital typography. By combining HarfBuzz's powerful shaping engine with Dart FFI and PDF specifications, we can finally generate high-quality, professional Bengali documents directly from Flutter.

Have you struggled with complex text rendering in your projects? Drop me a message on LinkedIn or check out the `bengali_pdf` repository on my GitHub to see the full implementation!

---
*Did this help? Share it on [Twitter/X](https://twitter.com/intent/tweet?text=Deep%20Dive%3A%20Building%20bengali_pdf%20for%20HarfBuzz-Shaped%20Bangla%20Text%20in%20Flutter&url=https://jehadurre.me/blog/building-bengali-pdf-harfbuzz-flutter) or [connect with Jehad on LinkedIn](https://linkedin.com/in/jehadurre).*
