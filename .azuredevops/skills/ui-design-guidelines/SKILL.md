---
name: UI Design Guidelines
description: Design principles, accessibility requirements (WCAG 2.1 AA), responsive grid standards, and UI component specifications.
---

# UI Design Guidelines Skill

This skill governs user interface implementation during Phase 3 code generation (`spec-to-code.agent.md`) and Phase 5 UI validation (`ui-validator.agent.md`).

---

## 1. Accessibility Standards (WCAG 2.1 AA)
- Every interactive element MUST have a visible label or `aria-label`.
- All forms MUST support full keyboard navigation (`Tab`, `Shift+Tab`, `Enter`, `Space`).
- Interactive buttons and inputs MUST maintain a minimum color contrast ratio of 4.5:1 against the background.

---

## 2. Component State Requirements
Every UI component MUST support 4 visual states:
1. **Default State:** Clean layout with clear placeholders.
2. **Loading State:** Disabled submit buttons with inline spinner overlays.
3. **Success State:** Green alert toasts or inline success checkmarks.
4. **Error State:** Red input borders with accessible error text beneath the field.

---

## 3. Responsive Breakpoints
- Mobile: `< 640px` (Single column stacked layout)
- Tablet: `640px - 1024px` (Two column layout)
- Desktop: `> 1024px` (Full multi-column layout with fixed sidebar)
