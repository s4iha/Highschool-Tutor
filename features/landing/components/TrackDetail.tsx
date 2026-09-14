"use client";

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BookOpenCheck,
  FlaskConical,
  Briefcase,
  Compass,
  Code,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  ChevronRight,
  BookMarked,
  BrainCircuit,
  Layers,
  Wrench,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";

export interface TrackData {
  id: string;
  name: string;
  badge: string;
  headline: string;
  overview: string;
  grades: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  accent: string;
  pill: string;
  subjectsCount: string;
  learningGoals: string[];
  featuredSubjects: {
    code: string;
    title: string;
    description: string;
    modules: number;
  }[];
  careerPathways: string[];
  aiTutorCapabilities: string[];
}

export const TRACKS_DATA: Record<string, TrackData> = {
  "junior-high-core": {
    id: "junior-high-core",
    name: "Junior High School Core",
    badge: "Grades 7 to 10 Curriculum",
    headline: "Foundational K-12 Mastery with DepEd MATATAG Competencies",
    overview:
      "The Junior High School Core curriculum strengthens critical thinking, literacy, scientific inquiry, and civic awareness across Grades 7 through 10. Every subject is aligned with the latest DepEd MATATAG standards, providing 12 sequential lesson modules and 24 practice tests with Socratic AI explanations.",
    grades: "Grades 7, 8, 9, and 10",
    icon: BookOpenCheck,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    accent: "text-blue-600 dark:text-blue-400",
    pill: "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300",
    subjectsCount: "32+ MATATAG Subjects",
    learningGoals: [
      "Master essential mathematical operations, linear equations, geometry, and introductory statistics.",
      "Develop scientific inquiry skills in living things, matter, earth and space, and forces and motion.",
      "Build deep English & Filipino language comprehension, composition, and communicative competence.",
      "Gain deep appreciation of Philippine history, world history, Asian studies, and economics in Araling Panlipunan.",
      "Cultivate holistic health, artistic expression, physical wellness, and ethical living through MAPEH & EsP.",
    ],
    featuredSubjects: [
      {
        code: "MATH-710",
        title: "Mathematics 7–10",
        description: "From rational numbers and algebraic expressions to quadratic equations, trigonometry, and probability.",
        modules: 12,
      },
      {
        code: "SCI-710",
        title: "Integrated Science 7–10",
        description: "Hands-on biological systems, chemical reactions, thermodynamics, earth cycles, and astronomy.",
        modules: 12,
      },
      {
        code: "ENG-710",
        title: "English Language & Literature",
        description: "Grammar conventions, critical reading, informative/persuasive writing, and world literature.",
        modules: 12,
      },
      {
        code: "FIL-710",
        title: "Filipino at Panitikang Pilipino",
        description: "Ibong Adarna, Florante at Laura, Noli Me Tangere, El Filibusterismo, at balarila.",
        modules: 12,
      },
      {
        code: "AP-710",
        title: "Araling Panlipunan",
        description: "Heograpiya ng Daigdig, Kasaysayan ng Asya, Kasaysayan ng Pilipinas, at Ekonomiks.",
        modules: 12,
      },
      {
        code: "TLE-710",
        title: "Technology & Livelihood Education",
        description: "Information & communications technology, home economics, agri-fishery arts, and industrial arts.",
        modules: 12,
      },
    ],
    careerPathways: [
      "Smooth transition into Senior High School specialized academic strands (STEM, ABM, HUMSS)",
      "Technical-Vocational-Livelihood (TVL) certification pathways",
      "National Career Assessment Examination (NCAE) readiness",
      "Competency in foundational digital literacy and STEM fundamentals",
    ],
    aiTutorCapabilities: [
      "Step-by-step math problem breakdowns without revealing answers directly",
      "Interactive Socratic probing for science hypotheses and natural phenomena",
      "Taglish and regional dialect explanations (Filipino, Cebuano, Ilocano) for complex concepts",
      "Instant grammar and sentence structure feedback for essays",
    ],
  },
  "stem-strand": {
    id: "stem-strand",
    name: "STEM Academic Strand",
    badge: "Grades 11 & 12 Academic Track",
    headline: "Rigorous Science, Technology, Engineering & Advanced Mathematics",
    overview:
      "The STEM strand prepares students for university programs in engineering, health sciences, computing, physics, chemistry, and biotechnology. HighSchool Tutor features deep problem-solving frameworks, mathematical proofs, laboratory theory, and real-time AI mathematical assistance.",
    grades: "Grades 11 and 12",
    icon: FlaskConical,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    accent: "text-emerald-600 dark:text-emerald-400",
    pill: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
    subjectsCount: "24+ Specialized Subjects",
    learningGoals: [
      "Master analytic geometry, conic sections, trigonometric functions, and mathematical induction in Pre-Calculus.",
      "Understand differential and integral calculus concepts, limit theorems, and optimization in Basic Calculus.",
      "Examine cellular mechanics, metabolic pathways, heredity, evolutionary biology, and ecological systems in Biology.",
      "Master chemical kinetics, equilibrium, stoichiometry, thermodynamics, and organic compounds in Chemistry.",
      "Apply Newtonian mechanics, electromagnetism, wave optics, and modern atomic physics in General Physics.",
    ],
    featuredSubjects: [
      {
        code: "STEM-PCALC",
        title: "Pre-Calculus",
        description: "Conic sections, systems of nonlinear equations, series & sequences, and circular functions.",
        modules: 12,
      },
      {
        code: "STEM-BCALC",
        title: "Basic Calculus",
        description: "Limits and continuity, derivatives, related rates, optimization, and Riemann sums integration.",
        modules: 12,
      },
      {
        code: "STEM-BIO12",
        title: "General Biology 1 & 2",
        description: "Cell biology, bioenergetics, genetics, organismal physiology, and systematics.",
        modules: 12,
      },
      {
        code: "STEM-CHEM12",
        title: "General Chemistry 1 & 2",
        description: "Atomic structure, intermolecular forces, chemical thermodynamics, and electrochemistry.",
        modules: 12,
      },
      {
        code: "STEM-PHYS12",
        title: "General Physics 1 & 2",
        description: "Vectors, rotational kinematics, fluid mechanics, thermodynamics, and electric circuits.",
        modules: 12,
      },
      {
        code: "STEM-RES",
        title: "Research Capstone & Inquiries",
        description: "Quantitative scientific methodology, data modeling, statistical hypothesis testing, and reporting.",
        modules: 12,
      },
    ],
    careerPathways: [
      "Civil, Mechanical, Electrical, Chemical, Computer, and Electronics Engineering",
      "Medicine, Nursing, Pharmacy, Medical Technology, and Allied Health Sciences",
      "Computer Science, Artificial Intelligence, Software Engineering, and Cyber Security",
      "Physics, Pure Mathematics, Biotechnology, and Materials Science",
    ],
    aiTutorCapabilities: [
      "KaTeX mathematical formula rendering and step-by-step calculus derivation hints",
      "Chemical equation balancing and reaction mechanism guidance",
      "Physics free-body diagrams and kinematic vector equation breakdowns",
      "Diagnostic practice drills for UPCAT, DOST-SEI, and collegiate entrance exams",
    ],
  },
  "abm-strand": {
    id: "abm-strand",
    name: "ABM Academic Strand",
    badge: "Grades 11 & 12 Academic Track",
    headline: "Accountancy, Business & Management for Future Executives and Entrepreneurs",
    overview:
      "The ABM strand focuses on the fundamental concepts of financial management, business enterprise operations, accounting cycles, and modern marketing. Students learn how to analyze financial statements, assess economic markets, and develop viable Philippine business models.",
    grades: "Grades 11 and 12",
    icon: Briefcase,
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    accent: "text-amber-600 dark:text-amber-400",
    pill: "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300",
    subjectsCount: "18+ Specialized Subjects",
    learningGoals: [
      "Master the accounting equation, journalizing, ledger posting, and preparation of trial balances.",
      "Calculate interest rates, annuities, loan amortization, depreciation, and payroll in Business Mathematics.",
      "Understand organizational theories, leadership styles, corporate planning, and human resource management.",
      "Conduct market research, target audience segmentation, pricing strategy, and promotional campaigns.",
      "Analyze Philippine macroeconomics, supply and demand dynamics, inflation, and fiscal policies.",
    ],
    featuredSubjects: [
      {
        code: "ABM-BMATH",
        title: "Business Mathematics",
        description: "Fractions, decimals, percentages, mark-up/mark-down, break-even analysis, and financial ratios.",
        modules: 12,
      },
      {
        code: "ABM-FABM1",
        title: "Fundamentals of ABM 1",
        description: "Introduction to accounting, rules of debit & credit, and the complete accounting cycle of a service business.",
        modules: 12,
      },
      {
        code: "ABM-FABM2",
        title: "Fundamentals of ABM 2",
        description: "Accounting for merchandising and manufacturing firms, financial statement analysis, and cash flows.",
        modules: 12,
      },
      {
        code: "ABM-ORGMGT",
        title: "Organization and Management",
        description: "Management theories, corporate structures, planning matrices, and strategic decision making.",
        modules: 12,
      },
      {
        code: "ABM-MKTG",
        title: "Principles of Marketing",
        description: "The 4 Ps of marketing, digital branding, consumer behavior, and sales strategies in the Philippines.",
        modules: 12,
      },
      {
        code: "ABM-ECON",
        title: "Applied Economics",
        description: "Economic indicators, market structures, labor challenges, and socioeconomic development strategies.",
        modules: 12,
      },
    ],
    careerPathways: [
      "Certified Public Accountant (CPA) and Corporate Auditing",
      "Banking, Investment Banking, Wealth Management, and Financial Analysis",
      "Business Administration, Entrepreneurship, and Start-up Leadership",
      "Corporate Marketing, Brand Management, and E-commerce Strategy",
    ],
    aiTutorCapabilities: [
      "Automated balance sheet verification and trial balance reconciliation explanations",
      "Break-even point and markup/margin formula walk-throughs",
      "Real-world business case study evaluations with Socratic questions",
      "Taglish explanations of complex Philippine taxation and financial terms",
    ],
  },
  "humss-strand": {
    id: "humss-strand",
    name: "HUMSS Academic Strand",
    badge: "Grades 11 & 12 Academic Track",
    headline: "Humanities and Social Sciences for Community Leaders and Communicators",
    overview:
      "The HUMSS strand is designed for learners interested in understanding human behavior, societal structures, governance, culture, and creative expression. It sharpens research rigor, rhetoric, public communication, and legal literacy.",
    grades: "Grades 11 and 12",
    icon: Compass,
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    accent: "text-purple-600 dark:text-purple-400",
    pill: "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300",
    subjectsCount: "20+ Specialized Subjects",
    learningGoals: [
      "Understand the Philippine Constitution, executive-legislative-judicial branches, and local governance.",
      "Analyze classical and contemporary social science theories (anthropology, sociology, political science).",
      "Develop high-caliber creative writing techniques in poetry, drama, fiction, and creative non-fiction.",
      "Examine major world religions, spiritual philosophies, and their cultural impact on human history.",
      "Assess emerging global trends, networking societies, climate justice, and democratic institutions.",
    ],
    featuredSubjects: [
      {
        code: "HUMSS-PPG",
        title: "Philippine Politics and Governance",
        description: "Historical foundations, constitutional rights, political parties, election laws, and decentralization.",
        modules: 12,
      },
      {
        code: "HUMSS-DISS",
        title: "Disciplines & Ideas in the Social Sciences",
        description: "Psychoanalysis, rational choice, structural-functionalism, Marxism, and feminist theory.",
        modules: 12,
      },
      {
        code: "HUMSS-CW",
        title: "Creative Writing",
        description: "Sensory imagery, poetic forms, narrative arcs, characterization, and dramatic dialogue.",
        modules: 12,
      },
      {
        code: "HUMSS-REL",
        title: "Introduction to World Religions",
        description: "Judaism, Christianity, Islam, Hinduism, Theravada & Mahayana Buddhism, Taoism, and Shinto.",
        modules: 12,
      },
      {
        code: "HUMSS-CESC",
        title: "Community Engagement & Citizenship",
        description: "Solidarity, participatory governance, civil society organizations, and community development.",
        modules: 12,
      },
      {
        code: "HUMSS-TRENDS",
        title: "Trends, Networks & Critical Thinking",
        description: "Neural networks, megatrends, planetary networks, digital democracy, and systemic analysis.",
        modules: 12,
      },
    ],
    careerPathways: [
      "Law, Pre-Law Programs, Public Policy, and Foreign Service",
      "Journalism, Mass Communication, Broadcasting, and Digital Media",
      "Psychology, Sociology, Social Work, and Counseling",
      "Education, Academia, Historical Research, and Linguistics",
    ],
    aiTutorCapabilities: [
      "Debate and argumentation critiques with counter-perspective probing",
      "Philippine Supreme Court landmark jurisprudence context summaries",
      "Creative writing feedback analyzing tone, imagery, and meter",
      "Critical discourse analysis guided by Socratic philosophical prompts",
    ],
  },
  "shs-core": {
    id: "shs-core",
    name: "Senior High Core Subjects",
    badge: "Grades 11 & 12 General Core",
    headline: "Mandatory DepEd Foundational Knowledge Across All Senior High Tracks",
    overview:
      "Regardless of strand (STEM, ABM, HUMSS, GAS, or TVL), all Filipino senior high students complete 15 compulsory Core Subjects mandated by the Department of Education. HighSchool Tutor ensures complete mastery of communication, mathematics, science, literature, and philosophy.",
    grades: "Grades 11 and 12 (All Strands)",
    icon: Code,
    color: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
    accent: "text-teal-600 dark:text-teal-400",
    pill: "bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-300",
    subjectsCount: "36+ Core Modules",
    learningGoals: [
      "Deliver persuasive oral presentations and understand speech communication contexts in Oral Communication.",
      "Write professional and academic texts, critiques, and literature reviews in Reading and Writing.",
      "Conduct rigorous Filipino linguistic research in Komunikasyon at Pananaliksik sa Wika at Kulturang Pilipino.",
      "Apply functions, rational equations, exponential models, and annuities in General Mathematics.",
      "Analyze normal distributions, sampling distributions, and hypothesis tests in Statistics and Probability.",
    ],
    featuredSubjects: [
      {
        code: "CORE-ORALCOM",
        title: "Oral Communication in Context",
        description: "Communication models, intercultural communication, speech acts, and public speaking techniques.",
        modules: 12,
      },
      {
        code: "CORE-READWRIT",
        title: "Reading and Writing Skills",
        description: "Text patterns, critical reading as reasoning, discourse evaluation, and purposeful writing.",
        modules: 12,
      },
      {
        code: "CORE-GENMATH",
        title: "General Mathematics",
        description: "Functions, inverse/rational/logarithmic equations, simple and compound interest, and business logic.",
        modules: 12,
      },
      {
        code: "CORE-STATPROB",
        title: "Statistics and Probability",
        description: "Random variables, normal curve, estimation of parameters, hypothesis testing, and correlation.",
        modules: 12,
      },
      {
        code: "CORE-EARTHSCI",
        title: "Earth and Life Science",
        description: "Origin of universe, plate tectonics, mineral resources, bioenergetics, and ecosystem dynamics.",
        modules: 12,
      },
      {
        code: "CORE-PHILOSOPHY",
        title: "Introduction to Philosophy",
        description: "Methods of philosophizing, human freedom, intersubjectivity, and the meaning of life.",
        modules: 12,
      },
    ],
    careerPathways: [
      "College Admission Test (CAT / UPCAT / USTET / DLSU-CET) comprehensive readiness",
      "Workplace communication and collaborative team leadership",
      "Empirical research, data literacy, and academic writing across all disciplines",
      "Civic responsibility, cultural pride, and ethical decision-making",
    ],
    aiTutorCapabilities: [
      "Socratic cross-examination for philosophy and ethics discussions",
      "Interactive formula walk-throughs for statistics and probability z-scores and t-tests",
      "Bilingual Filipino/English literary and rhetoric tutoring",
      "Custom practice tests with DepEd DO 015 s. 2026 grade transmutation",
    ],
  },
  "gas-strand": {
    id: "gas-strand",
    name: "General Academic Strand (GAS)",
    badge: "Grades 11 & 12 Academic Strand",
    headline: "Flexible, Multi-Disciplinary Excellence for Diverse College Pathways",
    overview:
      "The General Academic Strand (GAS) provides senior high students with an adaptable, well-rounded academic foundation. Designed for learners pursuing diverse college degrees, GAS integrates social sciences, management principles, applied economics, and advanced research to develop versatile, critical thinkers.",
    grades: "Grades 11 and 12",
    icon: Layers,
    color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    accent: "text-indigo-600 dark:text-indigo-400",
    pill: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300",
    subjectsCount: "22+ DepEd GAS Subjects",
    learningGoals: [
      "Master interdisciplinary competencies bridging humanities, basic sciences, and applied business.",
      "Conduct rigorous academic investigations through Practical Research 1 (Qualitative) and 2 (Quantitative).",
      "Understand foundational organizational management, workplace leadership, and business economics.",
      "Formulate community disaster preparedness and environmental risk reduction plans.",
      "Cultivate persuasive written and oral discourse in English and Filipino.",
    ],
    featuredSubjects: [
      {
        code: "GAS-APECON",
        title: "Applied Economics",
        description: "Market equilibrium, consumer behavior, industry competitiveness, and national socioeconomic issues.",
        modules: 12,
      },
      {
        code: "GAS-ORGMGT",
        title: "Organization and Management",
        description: "Management theories, strategic planning, staffing, leadership motivation, and organizational control.",
        modules: 12,
      },
      {
        code: "GAS-DRRR",
        title: "Disaster Readiness and Risk Reduction",
        description: "Geological hazards, hydro-meteorological risks, fire safety, and school/community disaster mitigation.",
        modules: 12,
      },
      {
        code: "GAS-HUM1",
        title: "Humanities & Social Sciences 1",
        description: "Introduction to sociology, human rights, civic participation, and social movements.",
        modules: 12,
      },
      {
        code: "GAS-TRENDS",
        title: "Trends, Networks & Critical Thinking",
        description: "Global trends, strategic decision making, neural connections, and technology impacts.",
        modules: 12,
      },
      {
        code: "GAS-3IS",
        title: "Inquiries, Investigations & Immersion",
        description: "Culminating research defense, data synthesis, and scholarly research presentation.",
        modules: 12,
      },
    ],
    careerPathways: [
      "College Admission Tests (UPCAT, USTET, DCAT, ACET) readiness across multiple tracks",
      "Degrees in Education, Communication Arts, Psychology, and Public Administration",
      "Careers in Media, Public Relations, Corporate Communications, and Human Resources",
      "Flexible transition to specialized college degrees in Social Sciences or Business",
    ],
    aiTutorCapabilities: [
      "Cross-disciplinary Socratic tutoring synthesizing science, social science, and economics",
      "Research methodology and thesis writing guidance for Practical Research 1 & 2",
      "DepEd DO 015 s. 2026 grade transmutation drills and feedback",
      "Bilingual instruction in Taglish and English with Socratic step-by-step reasoning",
    ],
  },
  "tvl-track": {
    id: "tvl-track",
    name: "Technical-Vocational-Livelihood (TVL) Track",
    badge: "Grades 11 & 12 Technical Track",
    headline: "Industry-Ready Technical Competencies & TESDA National Certification Alignment",
    overview:
      "The Technical-Vocational-Livelihood (TVL) Track equips senior high school students with practical, job-ready skills aligned with TESDA National Certificate (NC) standards. Spanning Information and Communications Technology (ICT), Home Economics, Agri-Fishery, and Industrial Arts, TVL blends hands-on skill training with DepEd core academic mastery.",
    grades: "Grades 11 and 12",
    icon: Wrench,
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    accent: "text-rose-600 dark:text-rose-400",
    pill: "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300",
    subjectsCount: "28+ TVL Competencies",
    learningGoals: [
      "Master core competencies aligned with TESDA National Certificate (NC II / NC III) requirements.",
      "Implement stringent workplace safety, hazard identification, and Occupational Health and Safety (OHS) standards.",
      "Learn fundamental computer hardware diagnostics, operating system installation, and network setup.",
      "Acquire entrepreneurial bookkeeping, cost estimation, and small business operational techniques.",
      "Execute culminating work immersion projects and industry portfolio assessments.",
    ],
    featuredSubjects: [
      {
        code: "TVL-CSS",
        title: "Computer Systems Servicing (CSS NC II)",
        description: "PC assembly, OS installation, network cabling, client configuration, and server maintenance.",
        modules: 12,
      },
      {
        code: "TVL-COOKERY",
        title: "Commercial Cookery & Food Preparation",
        description: "Culinary terminology, kitchen mise-en-place, knife skills, food safety, and nutritional plating.",
        modules: 12,
      },
      {
        code: "TVL-EIM",
        title: "Electrical Installation & Maintenance (EIM NC II)",
        description: "Circuit schematics, conduit bending, residential wiring, breaker panels, and safety protocols.",
        modules: 12,
      },
      {
        code: "TVL-BREADPASTRY",
        title: "Bread and Pastry Production",
        description: "Baking science, yeast doughs, pastry creams, cakes, and bakery merchandising.",
        modules: 12,
      },
      {
        code: "TVL-ENTREP",
        title: "Entrepreneurship for TVL",
        description: "Business plan formulation, unit economics, inventory management, and market pricing.",
        modules: 12,
      },
      {
        code: "TVL-WORKIMM",
        title: "Work Immersion & Culminating Portfolio",
        description: "Industry internship simulations, work ethics, resume building, and mock technical interviews.",
        modules: 12,
      },
    ],
    careerPathways: [
      "Immediate employment in IT technical support, hospitality, electrical contracting, and food service",
      "TESDA National Certificate assessments (NC II / NC III) for domestic and overseas opportunities",
      "Micro-enterprise startup ownership (cafés, computer repair shops, electrical services)",
      "Ladderized bachelor degree programs in Information Technology, Hotel Management, and Industrial Technology",
    ],
    aiTutorCapabilities: [
      "Step-by-step diagnostic and troubleshooting walk-throughs for technical hardware and wiring",
      "Interactive Socratic drills on safety standards, measurements, and unit conversions",
      "Recipe scaling, food cost percentages, and financial formula calculations",
      "DepEd DO 015 s. 2026 grade transmutation drills in 10 Philippine dialects",
    ],
  },
};

export function TrackDetail({ trackId }: { trackId: string }) {
  const track = TRACKS_DATA[trackId];

  if (!track) {
    return notFound();
  }

  const IconComponent = track.icon;

  return (
    <div className="min-h-screen pb-20 pt-8 sm:pt-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Navigation Breadcrumb & Back */}
        <div className="flex items-center justify-between">
          <Link
            href="/#categories"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Academic Strands</span>
          </Link>

          <Badge variant="outline" className={`${track.pill} border-0 text-xs font-bold px-3 py-1`}>
            {track.badge}
          </Badge>
        </div>

        {/* Hero Header Card */}
        <div className="relative overflow-hidden rounded-3xl bg-card border border-border p-6 sm:p-10 shadow-lg">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-4 max-w-3xl">
              <div className="flex items-center gap-3">
                <div
                  className={`size-14 rounded-2xl ${track.color} border flex items-center justify-center shadow-xs shrink-0`}
                >
                  <IconComponent className="size-7" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-black text-foreground font-heading tracking-tight">
                    {track.name}
                  </h1>
                  <p className="text-xs sm:text-sm font-bold text-muted-foreground">
                    DepEd MATATAG Curriculum • {track.grades}
                  </p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {track.overview}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
              <Link href="/dashboard" className="w-full">
                <Button className="w-full rounded-2xl h-12 font-bold text-sm shadow-md gap-2">
                  <Sparkles className="size-4" />
                  <span>Study This Track Now</span>
                </Button>
              </Link>
              <Link href="/#categories" className="w-full">
                <Button variant="outline" className="w-full rounded-2xl h-12 font-semibold text-sm">
                  View Other Tracks
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 2-Column Grid: Featured Subjects & Key Competencies */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2 Cols): Featured Subjects */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-foreground">
                  Curriculum Subjects & Modules
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Each subject contains 12 sequential lesson modules and 24 practice tests.
                </p>
              </div>
              <span className="text-xs font-bold text-primary px-3 py-1 rounded-full bg-primary/10">
                {track.subjectsCount}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {track.featuredSubjects.map((subject) => (
                <div
                  key={subject.code}
                  className="bg-card rounded-2xl p-5 border border-border shadow-xs hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        {subject.code}
                      </span>
                      <span className="text-[11px] font-semibold text-primary">
                        {subject.modules} Lessons
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-foreground">
                      {subject.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {subject.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1">
                      <BookMarked className="size-3 text-primary" />
                      DepEd Aligned
                    </span>
                    <Link
                      href="/dashboard"
                      className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Start Lesson <ChevronRight className="size-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Socratic Tutoring Capabilities */}
            <div className="rounded-3xl bg-gradient-to-br from-primary/5 via-card to-card border border-primary/20 p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <BrainCircuit className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-heading text-foreground">
                    Socratic AI Tutor for {track.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Powered by Google Gemini 3.5 with multi-dialect support (Taglish, English, Cebuano, Ilocano)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {track.aiTutorCapabilities.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-background/60 border border-border/40 text-xs text-muted-foreground leading-relaxed"
                  >
                    <Sparkles className="size-4 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Learning Goals & Career Pathways */}
          <div className="space-y-6">
            {/* Learning Goals */}
            <div className="bg-card rounded-3xl p-6 border border-border shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-success" />
                <h3 className="text-base font-bold font-heading text-foreground">
                  Core Learning Goals
                </h3>
              </div>
              <ul className="space-y-3">
                {track.learningGoals.map((goal, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                    <span className="size-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* University & Career Readiness */}
            <div className="bg-card rounded-3xl p-6 border border-border shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="size-5 text-primary" />
                <h3 className="text-base font-bold font-heading text-foreground">
                  College & Career Readiness
                </h3>
              </div>
              <ul className="space-y-3">
                {track.careerPathways.map((pathway, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                    <ChevronRight className="size-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{pathway}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Box */}
            <div className="bg-primary/10 rounded-3xl p-6 border border-primary/20 text-center space-y-3">
              <h4 className="text-sm font-bold text-foreground">
                Ready to excel in {track.name}?
              </h4>
              <p className="text-xs text-muted-foreground">
                Access interactive lesson modules, AI hints, and DepEd DO 015 s. 2026 grade simulations.
              </p>
              <Link href="/dashboard" className="block pt-1">
                <Button className="w-full rounded-xl text-xs font-bold h-10 shadow-sm">
                  Enroll in Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
