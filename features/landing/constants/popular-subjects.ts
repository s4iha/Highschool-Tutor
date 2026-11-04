import type { FeaturedPopularSubject } from "../types/landing.types";

/**
 * Featured Popular High School Subjects adhering to DepEd MATATAG curriculum:
 * - 8 structured lessons per subject
 * - 24 verified practice drills with Socratic AI support
 * - Standardized DepEd Quarter 1 / Semester 1 metadata (legacy non-DepEd "Trimesters" purged)
 * - DepEd DO 015 s. 2026 grade transmutation
 */
export const FEATURED_POPULAR_SUBJECTS: FeaturedPopularSubject[] = [
  {
    id: 1,
    category: "SHS CORE",
    title: "General Mathematics",
    image: "/images/course-programming.jpg",
    lessons: "8 Lessons • 24 Practice Drills",
    level: "Grade 11 • Semester 1",
    price: "FREE TRIAL",
    slug: "g11-s1-genmath",
    quarter: "Semester 1",
    do015Compliant: true,
  },
  {
    id: 2,
    category: "STEM STRAND",
    title: "Pre-Calculus & Analytical Geometry",
    image: "/images/course-accounting.jpg",
    lessons: "8 Lessons • 24 Practice Drills",
    level: "Grade 11 STEM • Semester 1",
    price: "FREE TRIAL",
    slug: "g11-s1-precalc",
    quarter: "Semester 1",
    do015Compliant: true,
  },
  {
    id: 3,
    category: "SHS CORE",
    title: "Earth and Life Science",
    image: "/images/course-anatomy.jpg",
    lessons: "8 Lessons • 24 Practice Drills",
    level: "Grade 11 • Semester 1",
    price: "FREE TRIAL",
    slug: "g11-s1-earthsci",
    quarter: "Semester 1",
    do015Compliant: true,
  },
  {
    id: 4,
    category: "JUNIOR HIGH CORE",
    title: "Grade 10 Science: Physics & Biology",
    image: "/images/course-agriculture.jpg",
    lessons: "8 Lessons • 24 Practice Drills",
    level: "Grade 10 • Quarter 1",
    price: "FREE TRIAL",
    slug: "g10-q1-sci",
    quarter: "Quarter 1",
    do015Compliant: true,
  },
  {
    id: 5,
    category: "APPLIED ACADEMIC",
    title: "English for Academic Purposes (EAPP)",
    image: "/images/course-composition.jpg",
    lessons: "8 Lessons • 24 Practice Drills",
    level: "Grade 11 • Semester 1",
    price: "FREE TRIAL",
    slug: "g11-s1-eapp",
    quarter: "Semester 1",
    do015Compliant: true,
  },
];
