# Specification

## Summary
**Goal:** Increase frontend interactivity during fruit image analysis with guided progress feedback, richer inspectable results, and clickable history recall.

**Planned changes:**
- Add a visible, step-based progress UI during analysis (e.g., loading image, extracting colors, classifying fruit, assessing freshness), with clear disabled/loading states and an error state that allows retry.
- Enhance the results panel with a collapsed-by-default, expandable “Details / How we decided” section that presents existing confidence values and freshness explanation in a structured, keyboard-accessible format.
- Make History entries clickable and keyboard accessible so selecting one loads it into the main results view and fruit info card as the active result without re-uploading or re-running analysis.
- Improve uploader interactions by enabling click-anywhere-on-dropzone to open the file picker and supporting paste-from-clipboard to set the selected image (while preserving existing validation and errors).

**User-visible outcome:** Users see a multi-step progress indicator while analysis runs, can expand results to inspect how the app decided, can click past analyses to view them again instantly, and can upload via dropzone click or clipboard paste.
