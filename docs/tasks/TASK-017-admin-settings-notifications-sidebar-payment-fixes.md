# Task 017 - Admin Settings Reflection, Modern Notifications, Sidebar, Payment & UI Polish

**Skills to be used**: task-implementation, generative_ui

## Description

This task addresses comprehensive system configuration, notification modernization, and UI consistency fixes across both the administrative and student surfaces:

1. **Admin Settings Reflection**: Ensure all admin settings configurations (annual fee, monthly fee, trial subjects limit, free lessons limit, GCash/Maya details) reflect dynamically throughout the system (student views, paywall modals, and admin actions) instead of relying on hardcoded values.
2. **Modern Notification & Confirmation UI**: Replace native browser `alert()` and `confirm()` calls with modern Shadcn components (`NotificationBell` popover reading live platform announcements, and `ConfirmDialog` wrapping `AlertDialog`).
3. **Global Logo & Container Consistency**: Standardize the brand mark across all navigation surfaces (`AdminSidebar`, `DashboardSidebar`, `Navbar`, and `AuthPage`) using `/logo/highschool-tutor-logo-favicon-rounded.png` in a `size-9 rounded-xl bg-card border border-border/60` container.
4. **Header-Driven Sidebar Collapse & Parity**: Standardize desktop/mobile sidebar toggle behavior across both Admin and Student portals. Place a unified `Menu` toggle button in `AdminHeader` and `DashboardHeader`, persist the collapse state in `localStorage` via Zustand, and remove legacy floating/bottom collapse buttons.
5. **Scroll-Free Payment Modal & Protection**: Upgrade `UpgradeModal.tsx` to `sm:max-w-2xl` with a compact 2-column benefits grid and streamlined payment instructions (GCash & Maya merchant numbers) that prevent vertical scrolling while avoiding premature tier upgrades.
6. **Student Table Action Buttons Alignment**: Standardize action buttons in `AdminStudentsPage.tsx` and `AdminDashboard.tsx` (`Details`, `Expire`, `Activate`) to `variant="outline"` with uniform widths and centered text, removing the check icon.
7. **Sonner Toast Design System Alignment**: Align toast notifications with the educational design system from `teacher-app`: custom Lucide status icons (`CheckCircle2`, `Info`, `AlertTriangle`, `AlertCircle`, `Loader2`), semantic OKLCH status variables (`--success`, `--destructive`, `--warning`, `--info`), and a top-right close button that smoothly fades in on hover.
8. **Auth Page Dark Mode Toggle**: Add a theme switcher to the top-right corner of the authentication shell for both login and registration screens.

## Verification Checklist

- [x] Admin configuration endpoint (`GET /api/v1/config`) provides live public settings from `AdminConfig`.
- [x] Student views (`UpgradeModal`, `tier-guardrails`, `LessonList`) dynamically reflect admin settings (pricing and free lesson limits).
- [x] Notifications system features modern Shadcn Popover dropdown for student and admin bell buttons with unread state tracking.
- [x] Destructive confirmations in admin pages use modern Shadcn AlertDialog instead of native `confirm()`.
- [x] Official rounded logo image in `bg-card border-border/60 size-9 rounded-xl` container is applied consistently across Admin Sidebar, Student Sidebar, Navbar, and AuthPage.
- [x] Universal `Menu` sidebar collapse toggle is integrated into both `AdminHeader` and `DashboardHeader` with `localStorage` persistence.
- [x] Payment modal presents clear payment instructions in `sm:max-w-2xl` without vertical scrolling or misleading fake gateway processing.
- [x] Student table action buttons have consistent widths, aligned layout, and no check symbol on Activate.
- [x] Sonner toasts use custom Lucide icons, semantic OKLCH theme variables, and an aligned top-right hover-only close button.
- [x] Auth page includes a working ThemeToggle in the top right corner.
- [x] TypeScript check (`npx tsc --noEmit`), ESLint (`npm run lint`), unit tests (`npm test`), and production build (`npm run build`) pass cleanly with 0 errors.
