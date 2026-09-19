# Responsive Recovery Tasks

This file is a recovery checkpoint for the responsive work interrupted by compaction.

## Current checkpoint

The working tree already contains responsive changes in:

- `src/app/globals.css`
- `src/app/loading.tsx`
- `src/components/placement-hub-client.tsx`
- `src/components/sidebar.tsx`
- `src/components/topbar.tsx`
- `src/components/views/login-screen-view.tsx`
- `src/components/views/spc-dashboard-view.tsx`
- `src/components/views/student-dashboard-view.tsx`

`DESIGN.md` is untracked and must be preserved.

Current build blocker: `SidebarProps` does not declare or destructure `mobileOpen` and `onMobileOpenChange`, although `PlacementHubClient` passes them and `Sidebar` uses them.

Current lint state: `npm run lint` reports 32 errors and 43 warnings. Most errors are existing `any` typings and React hook-style issues. `git diff --check` is clean.

---

## Task 1 — Finish the mobile application shell

Files:

- `src/components/sidebar.tsx`
- `src/components/placement-hub-client.tsx`

Work:

1. Add `mobileOpen?: boolean` and `onMobileOpenChange?: (open: boolean) => void` to `SidebarProps`.
2. Destructure both values in `Sidebar`.
3. Keep the existing drawer, backdrop, close button, and desktop sidebar behavior.
4. Confirm the sidebar is off-canvas below `md`, persistent at `md` and above, and closes after navigation selection.

Done when:

- `npm run build` gets past the sidebar type errors.
- Mobile menu opens and closes.
- Desktop layout still reserves the 240px sidebar.

---

## Task 2 — Validate and finish the Student Dashboard

File:

- `src/components/views/student-dashboard-view.tsx`

The main responsive changes are already present: responsive page padding, stacked header, 1/2/4-column stat grid, stacked booking/checklist layout, and responsive notice header.

Work:

1. Test at 320px, 375px, 430px, 768px, 1024px, and 1280px+.
2. Check long student names, SPC names, locations, and checklist text.
3. Ensure the primary booking action remains reachable without horizontal scrolling.
4. Confirm stat cards do not become too cramped on small phones.
5. Check loading, empty, and confirmed booking states.

Done when:

- No page-level horizontal overflow.
- All dashboard sections remain readable at 320px.
- Booking CTA and checklist remain usable on mobile.

---

## Task 3 — Validate the SPC Dashboard

File:

- `src/components/views/spc-dashboard-view.tsx`

Most responsive work is already present: responsive page padding, stacked command buttons, 1/2/4-column KPI grid, and single-column main layout until `xl`.

Work:

1. Test command buttons at mobile widths.
2. Check KPI cards at 320px and 375px.
3. Confirm the mentoring queue and pipeline stack cleanly.
4. Check long student names, questions, locations, and status labels.
5. Verify right-side panels do not force horizontal scrolling.

Done when:

- SPC dashboard is usable from 320px upward.
- Two-column analytical layout appears only at the intended desktop breakpoint.

---

## Task 4 — Make the student booking flow responsive

File:

- `src/components/views/book-mentoring-slot-view.tsx`

Current issues:

- `p-8` page padding on mobile.
- Fixed `320px` calendar column.
- Fixed slot-row columns: `180px`, `220px`, and `140px`.
- Booking dialog needs mobile-safe sizing.

Work:

1. Use `px-4 py-6` on mobile with larger tablet/desktop padding.
2. Stack calendar and slot list on mobile.
3. Keep the calendar full-width below the chosen breakpoint.
4. Convert slot rows into stacked mobile cards or use a contained horizontal layout.
5. Replace fixed slot-row widths with flexible/min-width-safe classes.
6. Add mobile dialog sizing and scrolling.
7. Check empty, loading, available, booked, and booking-success states.

Done when:

- Booking works at 320px without page overflow.
- Calendar days remain tappable.
- Slot details and CTA do not overlap.
- Dialog fits within the viewport.

---

## Task 5 — Make the SPC slot manager responsive

File:

- `src/components/views/spc-slots-manager-view.tsx`

Current issues:

- `p-8` page padding.
- Fixed `320px` calendar column.
- Fixed row columns: `200px` and `260px`.
- Delete/action area can become cramped.

Work:

1. Apply responsive page padding.
2. Stack calendar and slot list on mobile.
3. Make slot rows mobile-friendly.
4. Ensure booked-student names and identifiers truncate inside their containers.
5. Ensure the delete action remains reachable.
6. Check the add-slot dialog at small widths.
7. Verify empty, loading, open-slot, and booked-slot states.

Done when:

- SPC can manage slots on a phone.
- No slot row forces the page wider than the viewport.

---

## Task 6 — Make the Students Directory responsive

File:

- `src/components/views/students-directory-view.tsx`

Current issue: fixed five-column grid (`1fr 160px 100px 120px 100px`).

Work:

1. Use responsive page padding.
2. Make search full-width on mobile.
3. Allow status filters to wrap cleanly.
4. Convert table rows into card-style rows below an appropriate breakpoint.
5. Keep the desktop table layout at larger widths.
6. Ensure names, emails, roles, and status labels truncate correctly.
7. Make the detail dialog mobile-safe.

Done when:

- Directory is readable at 320px.
- Desktop retains the table-style layout.
- View action and detail modal remain usable.

---

## Task 7 — Make the Live Mentoring Console responsive

Files:

- `src/components/views/live-mentoring-session-view.tsx`
- `src/components/mentoring/session-timer.tsx`

Current issues:

- `p-8` page padding.
- Fixed two-column console at `lg`.
- Fixed `295px` draggable timer.
- Timer anchored at `right-6 bottom-6`.
- Dense form controls and action buttons.

Work:

1. Use responsive page padding.
2. Stack console columns on mobile.
3. Make session tabs horizontally scrollable inside their own container.
4. Make form controls full-width where needed.
5. Ensure Save/Complete actions fit without wrapping badly.
6. Change timer to a viewport-safe width, for example `w-[min(295px,calc(100vw-1.5rem))]`.
7. Use smaller mobile offsets such as `right-3 bottom-3`.
8. Ensure the minimized timer remains visible and tappable.

Done when:

- Console works at 320px.
- Timer never extends beyond the viewport.
- All editing controls remain reachable.

---

## Task 8 — Finish shared shell, loading, and placeholder views

Files:

- `src/components/placement-hub-client.tsx`
- `src/app/loading.tsx`
- `src/components/topbar.tsx`
- `src/components/sidebar.tsx`

Work:

1. Replace remaining `p-8` placeholders in Companies, Applications, and Offers.
2. Confirm loading skeleton matches the responsive shell.
3. Check topbar behavior with menu, breadcrumbs, role toggle, and notifications.
4. Add Escape-key handling for the mobile drawer if not already present.
5. Ensure focus returns sensibly after closing the drawer.
6. Confirm role toggle does not leave an invalid tab active.

Done when:

- Every top-level tab is responsive.
- Shell behaves consistently across all views.

---

## Task 9 — Apply global responsive hardening

Files:

- `src/app/globals.css`
- Shared UI components where needed.

Work:

1. Keep the existing `overflow-x: clip` safeguard.
2. Ensure major content containers use `min-w-0`.
3. Prevent long text from expanding fixed grids.
4. Ensure dialogs use viewport-safe maximum height.
5. Check focus states and touch targets.
6. Preserve semantic status colors and the single-accent design rule.

Done when:

- No page-level horizontal scrolling at target widths.
- Any intentional horizontal scrolling is confined to tables or tab strips.

---

## Task 10 — Type, lint, build, and final QA

Work:

1. Fix the current sidebar TypeScript errors first.
2. Run `npm run build` and `npm run lint`.
3. Clear lint errors in files touched by this work.
4. Review warnings separately so unrelated cleanup does not derail the responsive pass.
5. Perform final checks at:
   - 320 x 568
   - 375 x 667
   - 430 x 932
   - 768 x 1024
   - 1024 x 768
   - 1440 x 900
6. Verify student dashboard, SPC dashboard, booking flow, slot manager, directory, live console, mobile drawer, dialogs, and loading state.

Final acceptance criteria:

- `npm run build` passes.
- No responsive view introduces page-level horizontal overflow.
- Mobile navigation works reliably.
- All primary actions remain reachable.
- Dialogs and dense data views fit small screens.
- Existing design language remains unchanged.

---

## Execution order

1. Mobile shell
2. Student dashboard
3. SPC dashboard
4. Booking flow
5. Slot manager
6. Students directory
7. Live console and timer
8. Shared shell and placeholder tabs
9. Global hardening
10. Type/lint/build/QA
