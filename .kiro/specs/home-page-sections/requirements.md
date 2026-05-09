# Requirements Document

## Introduction

This feature adds 5 new sections to the LearnHub home page to improve user engagement, build social proof, and drive course enrollment. The new sections are: Stats Counter, Testimonials, Top Instructors, Pricing/Plans, and a Newsletter CTA. Each section follows the existing design language — Tailwind CSS, shadcn/ui components, and full dark/light theme support.

## Glossary

- **Home_Page**: The root route (`/`) rendered by `src/app/page.tsx`
- **Section**: A distinct visual block rendered as a React component inside `src/components/Home/`
- **Testimonial**: A quote, rating, and attribution from a real or representative learner
- **Instructor**: A course creator displayed with name, avatar, subject, and follower count
- **Stats_Counter**: Animated numeric counters showing platform-level metrics
- **Plan**: A pricing tier with a name, price, and list of included features
- **Newsletter_CTA**: A call-to-action block prompting visitors to subscribe via email
- **Theme**: The active color scheme — either light or dark — controlled by the existing `NextThemeProvider`

---

## Requirements

### Requirement 1: Stats Counter Section

**User Story:** As a visitor, I want to see platform statistics at a glance, so that I can quickly understand the scale and credibility of the platform.

#### Acceptance Criteria

1. THE Stats_Counter section SHALL display at least four metrics: total enrolled students, total courses available, total instructors, and average learner satisfaction rating.
2. WHEN the Stats_Counter section enters the viewport, THE Stats_Counter SHALL animate each numeric value from zero to its final value over a duration between 1500ms and 2500ms.
3. THE Stats_Counter section SHALL display a label and a unit suffix (e.g., "+" or "%") alongside each numeric value.
4. WHILE the dark theme is active, THE Stats_Counter section SHALL render all text and background colors using dark-mode-compatible Tailwind classes.
5. THE Stats_Counter section SHALL be fully responsive, displaying metrics in a single column on mobile and in a multi-column grid on tablet and desktop viewports.

---

### Requirement 2: Testimonials Section

**User Story:** As a prospective learner, I want to read authentic reviews from other students, so that I can feel confident enrolling in a course.

#### Acceptance Criteria

1. THE Testimonials section SHALL display a minimum of six testimonial cards, each containing: a learner name, avatar (image or initials fallback), star rating (1–5), review text, and the course name the review relates to.
2. WHEN a testimonial card is rendered, THE Testimonials section SHALL display the star rating visually using filled and unfilled star icons.
3. THE Testimonials section SHALL arrange testimonial cards in a responsive masonry or grid layout with at least two columns on tablet and three columns on desktop.
4. WHEN the viewport width is below 768px, THE Testimonials section SHALL display testimonial cards in a horizontally scrollable carousel.
5. WHILE the dark theme is active, THE Testimonials section SHALL apply dark-mode card backgrounds and text colors consistent with the existing `--card` and `--card-foreground` CSS variables.
6. THE Testimonials section SHALL include a section heading and a short subheading above the card grid.

---

### Requirement 3: Top Instructors Section

**User Story:** As a prospective learner, I want to discover the platform's top instructors, so that I can choose courses taught by credible experts.

#### Acceptance Criteria

1. THE Top_Instructors section SHALL display at least four instructor cards, each containing: instructor name, subject/specialty, avatar image, star rating, and total student count.
2. WHEN an instructor card is hovered, THE Top_Instructors section SHALL apply a visible elevation or scale transition to the card.
3. THE Top_Instructors section SHALL display instructor cards in a responsive grid: one column on mobile, two on tablet, and four on desktop.
4. WHILE the dark theme is active, THE Top_Instructors section SHALL render card backgrounds using the `dark:bg-card` or equivalent dark-mode Tailwind class.
5. THE Top_Instructors section SHALL include a "View All Instructors" link that navigates to `/instructors`.

---

### Requirement 4: Pricing Plans Section

**User Story:** As a prospective learner, I want to compare subscription plans, so that I can choose the option that best fits my budget and learning goals.

#### Acceptance Criteria

1. THE Pricing_Plans section SHALL display exactly three plans: Free, Pro, and Enterprise.
2. THE Pricing_Plans section SHALL highlight the Pro plan visually as the recommended option using a distinct border, badge, or background color.
3. EACH plan card SHALL list the plan name, monthly price (or "Custom" for Enterprise), and a minimum of four feature line items with checkmark icons.
4. WHEN a user clicks the CTA button on a plan card, THE Pricing_Plans section SHALL navigate to the `/register` route.
5. WHILE the dark theme is active, THE Pricing_Plans section SHALL render plan cards with dark-mode-compatible backgrounds and borders.
6. THE Pricing_Plans section SHALL be fully responsive, stacking plan cards vertically on mobile and displaying them in a three-column row on desktop.

---

### Requirement 5: Newsletter CTA Section

**User Story:** As a visitor, I want to subscribe to the platform newsletter, so that I can receive updates about new courses and promotions.

#### Acceptance Criteria

1. THE Newsletter_CTA section SHALL display a heading, a short description, an email input field, and a submit button.
2. WHEN a user submits the form with a valid email address, THE Newsletter_CTA section SHALL display a success confirmation message and clear the input field.
3. WHEN a user submits the form with an empty or invalid email address, THE Newsletter_CTA section SHALL display an inline validation error message without submitting the form.
4. THE Newsletter_CTA section SHALL validate the email format on the client side before submission.
5. WHILE the dark theme is active, THE Newsletter_CTA section SHALL render the input field and button with dark-mode-compatible styles.
6. THE Newsletter_CTA section SHALL be fully responsive, stacking the input and button vertically on mobile and displaying them inline on tablet and desktop.

---

### Requirement 6: Home Page Integration

**User Story:** As a developer, I want all five new sections integrated into the home page in a logical order, so that the page tells a coherent story from discovery to conversion.

#### Acceptance Criteria

1. THE Home_Page SHALL render the five new sections in the following order after the existing sections: Stats_Counter, Testimonials, Top_Instructors, Pricing_Plans, Newsletter_CTA.
2. THE Home_Page SHALL import each new section component from its corresponding file under `src/components/Home/`.
3. WHEN the Home_Page is rendered, THE Home_Page SHALL display all existing sections (HeroBanner, TrustedCompanies, StartLearning, HomeCategories, FeatureCourse) before the new sections.
4. IF a new section component throws a render error, THEN THE Home_Page SHALL not crash the entire page — each section SHOULD be independently renderable.
