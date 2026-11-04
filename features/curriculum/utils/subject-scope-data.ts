import type { SubjectScopeDefinition } from "../types/subjectScope.types";
import { SUBJECTS, getSubjectBySlug } from "./curriculum-data";

/**
 * Static metadata catalog mapping canonical slugs or base codes to official
 * DepEd DO 015 s. 2026 MATATAG competencies, descriptions, time allotments, and prerequisites.
 * Sourced directly from docs/resources/shs-subjects.md.
 */
interface BaseScopeRecord {
  description: string;
  timeAllotment: string;
  prerequisites: string[];
  corequisites?: string[];
  competencies: string[];
  tesdaNcLevel?: string | null;
  careerPathways?: string[];
}

export const BASE_SCOPE_REGISTRY: Record<string, BaseScopeRecord> = {
  // ---------------------------------------------------------------------------
  // JHS CORE SUBJECTS
  // ---------------------------------------------------------------------------
  MATH: {
    description:
      "Develops critical problem-solving, mathematical reasoning, and analytical skills covering number sense, algebraic expressions, linear equations, geometry, trigonometry, and statistics under DepEd MATATAG.",
    timeAllotment: "4 hours per week (160 hours per academic year)",
    prerequisites: ["Elementary Mathematics"],
    competencies: [
      "Operate fluently with rational, real, and algebraic expressions",
      "Model and solve linear equations, inequalities, and quadratic functions",
      "Apply geometric theorems, coordinate geometry, and trigonometry to real-life situations",
      "Formulate statistical questions, compute measures of central tendency, and interpret probability",
    ],
    careerPathways: ["Engineering", "Finance", "Computer Science", "Data Analytics", "Architecture"],
  },
  SCI: {
    description:
      "An integrated science curriculum covering living things and their environment, matter and its interactions, forces, motion, and energy, and Earth and space systems.",
    timeAllotment: "4 hours per week (160 hours per academic year)",
    prerequisites: ["Elementary Science"],
    competencies: [
      "Apply scientific investigation methodologies to solve real-world community problems",
      "Explain cellular organization, genetics, ecosystems, and biological biodiversity",
      "Differentiate chemical substances, atomic structure, and chemical reactions",
      "Analyze atmospheric phenomena, plate tectonics, and space exploration",
    ],
    careerPathways: ["Medicine", "Biological Sciences", "Environmental Engineering", "Pharmacy"],
  },
  ENG: {
    description:
      "Enhances communicative competence, critical literacy, informative/persuasive writing, and appreciation of world literature in varied interpersonal and digital media contexts.",
    timeAllotment: "4 hours per week (160 hours per academic year)",
    prerequisites: ["Elementary English"],
    competencies: [
      "Employ appropriate communicative styles across various social contexts",
      "Evaluate informative, persuasive, and argumentative multimodal texts",
      "Produce well-organized academic essays, critiques, and research outputs",
      "Analyze diverse literary pieces from Afro-Asian, Anglo-American, and world traditions",
    ],
    careerPathways: ["Journalism", "Law", "Corporate Communications", "Education", "Diplomacy"],
  },
  FIL: {
    description:
      "Pagpapalalim ng kasanayan sa pakikipagtalastasan, mapanuring pagbasa, at pagpapahalaga sa panitikang Pilipino kabilang ang Ibong Adarna, Florante at Laura, Noli Me Tangere, at El Filibusterismo.",
    timeAllotment: "4 hours per week (160 hours per academic year)",
    prerequisites: ["Elementayang Filipino"],
    competencies: [
      "Mabisang makapagpahayag gamit ang wastong balarila at estruktura ng Wikang Filipino",
      "Masusing makapagsuri sa mga obrang pampanitikan ng Pilipinas at ang kontekstong sosyo-historikal nito",
      "Makabuo ng mapanuring pananaliksik ukol sa kulturang popular at lipunang Pilipino",
      "Magpahayag ng sariling paninindigan hinggil sa mga napapanahong isyung panlipunan",
    ],
    careerPathways: ["Mass Media", "Filipino Language Education", "Public Administration", "Creative Writing"],
  },
  AP: {
    description:
      "Pagsusuri sa heograpiya, kasaysayan, kultura, at ekonomiya ng Pilipinas, Asya, at Daigdig upang makahubog ng mapanuri at responsableng mamamayang Pilipino.",
    timeAllotment: "3 hours per week (120 hours per academic year)",
    prerequisites: ["Araling Panlipunan (Elementary)"],
    competencies: [
      "Masuri ang ugnayan ng heograpiya sa pagbuo at pag-unlad ng kabihasnan",
      "Maipaliwanag ang mga mahahalagang pangyayari sa kasaysayan ng Asya at Daigdig",
      "Mailapat ang mga pangunahing konsepto ng ekonomiks sa pang-araw-araw na pamumuhay",
      "Makilahok nang aktibo sa mga gawaing pansibiko at pangkaunlaran sa komunidad",
    ],
    careerPathways: ["Political Science", "Economics", "Foreign Service", "Public Policy", "History"],
  },
  ESP: {
    description:
      "Paglinang ng mga pagpapahalaga, pananagutang pansarili at panlipunan, at etikal na pagpapasiya tungo sa pagiging makatao at makadiyos na indibidwal.",
    timeAllotment: "2 hours per week (80 hours per academic year)",
    prerequisites: ["Edukasyon sa Pagpapakatao (Elementary)"],
    competencies: [
      "Mapanagutang makagawa ng moral na pagpapasiya batay sa Likas na Batas Moral",
      "Matukoy ang mga gawi at katangiang nagpapakita ng pagmamahal sa kapuwa at lipunan",
      "Makabuo ng konkretong plano sa pagpapaunlad ng sariling hilig, talento, at kakayahan",
    ],
    careerPathways: ["Counseling", "Human Resources", "Social Work", "Philosophy"],
  },
  MAPEH: {
    description:
      "Comprehensive program integrating Music, Arts, Physical Education, and Health to foster artistic appreciation, physical fitness, active lifestyles, and community wellness.",
    timeAllotment: "4 hours per week (160 hours per academic year)",
    prerequisites: ["Elementary MAPEH"],
    competencies: [
      "Analyze elements and principles of Philippine, Asian, and Western musical traditions",
      "Create artworks showing cultural heritage, modern art movements, and digital media",
      "Assess personal physical fitness, monitor nutritional intake, and engage in sports and dances",
      "Demonstrate emergency first aid, injury management, and adolescent health advocacy",
    ],
    careerPathways: ["Sports Science", "Visual Arts", "Music Production", "Public Health", "Physical Therapy"],
  },
  TLE: {
    description:
      "Exploratory and specialized vocational courses covering Agri-Fishery Arts, Home Economics, Industrial Arts, and Information & Communications Technology.",
    timeAllotment: "4 hours per week (160 hours per academic year)",
    prerequisites: ["Elementary EPP"],
    competencies: [
      "Utilize hand tools, equipment, and safety gear conforming to occupational standards",
      "Perform basic mensuration, calculation, and technical interpretation of drawings",
      "Demonstrate foundational occupational competencies in chosen technical-vocational areas",
    ],
    careerPathways: ["Technical Vocations", "Culinary Arts", "IT Support", "Entrepreneurship"],
  },

  // ---------------------------------------------------------------------------
  // SHS CORE CURRICULUM SUBJECTS (All Strands)
  // ---------------------------------------------------------------------------
  ORALCOMM: {
    description:
      "Covers the development of listening and speaking skills and strategies for effective communication in various situations, speech acts, and communicative strategies.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["None"],
    competencies: [
      "Explain the functions, nature, and process of communication",
      "Distinguish various types of speech contexts, styles, and communicative strategies",
      "Deliver proficient extemporaneous and prepared speeches with confidence and ethical clarity",
    ],
    careerPathways: ["Public Relations", "Broadcasting", "Corporate Management", "Law"],
  },
  READWRITE: {
    description:
      "Covers the development of reading and writing skills as applied to a wide range of materials other than poetry, fiction, and drama, focusing on critical thinking and text evaluation.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["None"],
    competencies: [
      "Evaluate patterns of paragraph development and organizational structure across non-fiction texts",
      "Identify explicit and implicit claims, context, and hypertext/intertext properties",
      "Compose professional correspondence including resumes, cover letters, and project proposals",
    ],
    careerPathways: ["Professional Writing", "Publishing", "Corporate Law", "Academic Research"],
  },
  KOMFIL: {
    description:
      "Pag-aaral tungo sa pananaliksik ukol sa kalikasan, katangian, pag-unlad, gamit at paggamit ng Wikang Filipino sa mga sitwasyong komunikatibo at kultural sa lipunang Pilipino.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["None"],
    competencies: [
      "Matalakay ang mga konseptong pangwika at kasaysayan ng Wikang Pambansa",
      "Masuri ang mga lingguwistiko at kultural na pagkakaiba-iba sa lipunang Pilipino",
      "Makasulat ng sanaysay o papel-pananaliksik ukol sa kalagayang sosyo-kultural ng wika",
    ],
    careerPathways: ["Linguistics", "Filipino Pedagogy", "Cultural Journalism", "Translation Studies"],
  },
  PAGBASA: {
    description:
      "Pag-aaral sa proseso ng pagbasa at pagsuri ng iba’t ibang anyo at uri ng teksto na nakatutulong sa pagbuo at pagsulat ng sistematikong pananaliksik.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["Komunikasyon at Pananaliksik sa Wika at Kulturang Pilipino"],
    competencies: [
      "Matukoy ang kahulugan, katangian, at kahalagahan ng iba’t ibang uri ng teksto",
      "Mapanuring makapagsuri ng mga tekstong impormatibo, deskriptibo, persuwaysib, at naratibo",
      "Makabuo ng isang komprehensibong konseptong papel o panukalang pananaliksik",
    ],
    careerPathways: ["Academic Research", "Creative Non-Fiction", "Social Science Investigation"],
  },
  LIT21: {
    description:
      "Covers the appreciation and critical study of 21st Century Literature from the Philippines and the World encompassing their dimensions, genres, elements, structures, contexts, and traditions.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["None"],
    competencies: [
      "Identify representative texts and authors from each region of the Philippines",
      "Compare 21st-century literary genres (graphic novels, flash fiction, digital literature) with traditional forms",
      "Produce an artistic adaptation of a chosen contemporary literary text using multimedia",
    ],
    careerPathways: ["Creative Writing", "Film & Screenplay Studies", "Literature Education", "Curatorial Work"],
  },
  CONTEMPARTS: {
    description:
      "Integrative study of various contemporary art practices across Philippine regions with consideration for their elements, principles, materials, techniques, and modern artistic expressions.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["None"],
    competencies: [
      "Identify modern and contemporary art forms, techniques, and performance practices across regions",
      "Critique available local materials and appropriate techniques used in contemporary artwork",
      "Design and execute a collaborative contemporary art production showcasing local cultural identity",
    ],
    careerPathways: ["Fine Arts", "Museum Curation", "Graphic Design", "Interior Architecture"],
  },
  MIL: {
    description:
      "Introduces learners to basic understanding of media and information as channels of communication and tools for individual and social development, promoting creative and critical thinking.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["None"],
    competencies: [
      "Evaluate the credibility, reliability, and ethical usage of diverse media sources",
      "Analyze intellectual property rights, netiquette, and digital footprint management",
      "Produce impactful multimedia content adhering to legal, ethical, and creative standards",
    ],
    careerPathways: ["Digital Media Production", "Information Technology", "Investigative Journalism"],
  },
  GENMATH: {
    description:
      "Covers rational, exponential, and logarithmic functions, business-related mathematical concepts (simple and compound interest, annuities, stocks, and bonds), and logic.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["Junior High School Mathematics"],
    competencies: [
      "Represent and evaluate real-life situations using rational, exponential, and logarithmic functions",
      "Solve financial problems involving simple and compound interest, amortizations, and annuities",
      "Formulate truth tables, analyze logical equivalence, and construct valid conditional arguments",
    ],
    careerPathways: ["Actuarial Science", "Finance", "Software Engineering", "Economics"],
  },
  STATPROB: {
    description:
      "Covers finding the mean and variance of random variables, sampling techniques, distributions, hypothesis testing on population parameters, and correlation and regression analyses.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["General Mathematics"],
    competencies: [
      "Compute probabilities, mean, and variance of discrete and continuous random variables",
      "Apply the Central Limit Theorem and sampling distributions to estimate population parameters",
      "Formulate null/alternative hypotheses and execute test statistics for decision making",
      "Perform linear regression modeling and evaluate Pearson correlation coefficients",
    ],
    careerPathways: ["Data Science", "Biostatistics", "Econometrics", "Market Research"],
  },
  EARTHLIFE: {
    description:
      "Provides background on Earth Science and Biology, presenting geologic time, Earth processes and hazards, and cellular, organismal, population, and ecosystem interactions.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["Junior High School Science"],
    competencies: [
      "Explain the origin and planetary structure of Earth and internal/external geological cycles",
      "Assess natural hazards and disaster mitigation strategies for earthquakes, landslides, and storms",
      "Describe cellular metabolic processes, organ systems, and evolutionary biodiversity mechanisms",
    ],
    careerPathways: ["Geology", "Biological Research", "Disaster Management", "Medicine"],
  },
  PHYSSCI: {
    description:
      "Evolution of our understanding of matter, motion, electricity, magnetism, light, and the cosmos, applying physical concepts to everyday phenomena, technology, energy, and medicine.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["Junior High School Science"],
    competencies: [
      "Trace the synthesis of elements in stars and historical development of atomic models",
      "Explain how molecular polarity determines intermolecular forces and material properties",
      "Apply Newtonian mechanics, electromagnetism, and optical theories to technological devices",
    ],
    careerPathways: ["Applied Physics", "Chemical Engineering", "Renewable Energy", "Aerospace"],
  },
  PERDEV: {
    description:
      "Facilitates students’ awareness of their developmental stage to better understand themselves, manage stress, build empathetic relationships, and make career decisions.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["None"],
    competencies: [
      "Explain personal identity, emotional intelligence, and cognitive strengths during adolescence",
      "Formulate actionable coping strategies for managing academic stress and mental health",
      "Map out personal career and life development goals aligned with vocational aptitudes",
    ],
    careerPathways: ["Psychology", "Guidance Counseling", "Human Resource Development"],
  },
  UCSP: {
    description:
      "Uses insights from Anthropology, Political Science, and Sociology to develop students’ awareness of social and political dynamics, cultural diversity, and human development.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["None"],
    competencies: [
      "Analyze cultural, social, and political change from sociological and anthropological frameworks",
      "Examine forms of social stratification, human inequalities, and institutional governance",
      "Advocate human rights, cultural preservation, and civic engagement within communities",
    ],
    careerPathways: ["Sociology", "Anthropology", "Public Administration", "International Relations"],
  },
  PHILOSOPHY: {
    description:
      "An initiation to philosophical reflection as a search for a synoptic vision of life, discussing embodiment, freedom, intersubjectivity, society, and mortality.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["None"],
    competencies: [
      "Distinguish holistic perspective from partial point of view through Socratic questioning",
      "Examine the human condition as an embodied spirit interacting within the natural environment",
      "Evaluate human freedom, authentic intersubjectivity, and responsibility in community living",
    ],
    careerPathways: ["Philosophy", "Law", "Ethics Board Advisory", "Theology"],
  },
  PEH1: {
    description:
      "Physical Education and Health Quarter 1 & 2: Exercise for fitness, goal setting, aerobic and strengthening activities, and individual/dual sports.",
    timeAllotment: "20 hours per semester",
    prerequisites: ["None"],
    competencies: [
      "Self-assess health-related fitness status, barriers to physical activity, and diet",
      "Design personalized aerobic and muscle-strengthening exercise programs",
      "Demonstrate sportsmanship, tactical skills, and safety in individual and dual sports",
    ],
    careerPathways: ["Kinesiology", "Fitness Coaching", "Athletic Training"],
  },
  PEH2: {
    description:
      "Physical Education and Health Quarter 3 & 4: Team sports, collaborative athletic tactics, recreational tournament participation, and community sports officiating.",
    timeAllotment: "20 hours per semester",
    prerequisites: ["Physical Education and Health 1"],
    competencies: [
      "Apply offensive and defensive strategies in competitive team sports settings",
      "Assess physiological indicators (heart rate, RPE) during high-intensity physical activity",
      "Exhibit leadership and ethical activity management in sports tournaments",
    ],
    careerPathways: ["Sports Officiating", "Recreation Management", "Athletic Coaching"],
  },
  PEH3: {
    description:
      "Physical Education and Health Quarter 1 & 2: Appreciation of Philippine folk, indigenous, and traditional dances, rhythmical movement patterns, and modern dance forms.",
    timeAllotment: "20 hours per semester",
    prerequisites: ["Physical Education and Health 2"],
    competencies: [
      "Perform fundamental rhythmical movement patterns and steps of Philippine folk dances",
      "Analyze cultural significance and artistic expression across traditional ethnic dances",
      "Choreograph and execute a contemporary or street dance routine demonstrating cardiovascular fitness",
    ],
    careerPathways: ["Dance Performance", "Physical Education", "Choreography"],
  },
  PEH4: {
    description:
      "Physical Education and Health Quarter 3 & 4: Outdoor and recreational activities in natural settings (mountaineering, orienteering, aquatic safety, and environmental stewardship).",
    timeAllotment: "20 hours per semester",
    prerequisites: ["Physical Education and Health 3"],
    competencies: [
      "Demonstrate safety protocols, Leave No Trace principles, and knot-tying in outdoor settings",
      "Participate actively in organized aquatic, hiking, or recreational wellness pursuits",
      "Evaluate the positive relationship between natural settings and long-term psychological wellbeing",
    ],
    careerPathways: ["Outdoor Education", "Ecotourism Guiding", "Recreation Leadership"],
  },

  // ---------------------------------------------------------------------------
  // APPLIED TRACK SUBJECTS
  // ---------------------------------------------------------------------------
  EAPP: {
    description:
      "Development of communication skills in English for academic and professional purposes, synthesizing concepts, writing summaries, critiques, and research proposals.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["None"],
    competencies: [
      "Determine the structure of academic texts and extract key arguments accurately",
      "Write objective, comprehensive reviews, critiques, and concept papers",
      "Design and execute survey instruments and draft formal technical research reports",
    ],
    careerPathways: ["Academic Writing", "Technical Documentation", "Policy Research"],
  },
  ETECH: {
    description:
      "Covers information and communication technologies as tools for curating, contextualizing, collaborating, and creating content and experiences for professional tracks.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["None"],
    competencies: [
      "Apply advanced productivity tools (mail merge, complex spreadsheet formulas, vector graphics)",
      "Create interactive web pages and rich multimedia content using web standards and CMS platforms",
      "Launch a social change ICT advocacy campaign adhering to accessibility and ethical standards",
    ],
    careerPathways: ["Web Design", "Digital Marketing", "Multimedia Specialist", "Systems Support"],
  },
  PRACRES1: {
    description:
      "Development of critical thinking and problem-solving skills through qualitative research design, qualitative data gathering, thematic analysis, and reporting.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["None"],
    competencies: [
      "Formulate clearly defined qualitative research questions and conceptual frameworks",
      "Synthesize literature using appropriate qualitative citation and synthesis techniques",
      "Collect and analyze qualitative data via semi-structured interviews and thematic coding",
    ],
    careerPathways: ["Qualitative Research", "Social Science Investigation", "Policy Advisory"],
  },
  PRACRES2: {
    description:
      "Development of critical thinking and problem-solving skills through quantitative research design, sampling methods, survey validation, and inferential statistics.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["Statistics and Probability"],
    competencies: [
      "Identify research problems, variables, hypotheses, and quantitative research designs",
      "Construct and validate survey questionnaires ensuring internal consistency and reliability",
      "Execute statistical analysis (t-test, ANOVA, chi-square) and defend quantitative research papers",
    ],
    careerPathways: ["Quantitative Analytics", "Market Analytics", "Academic Publishing"],
  },
  FILPIL: {
    description:
      "Pagsulat ng iba’t ibang anyo ng sulating lilinang sa kakayahang magpahayag tungo sa mabisa, mapanuri, at masinop na pagsusulat sa piniling larangang propesyonal.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["Pagbasa at Pagsusuri ng Iba't ibang Teksto Tungo sa Pananaliksik"],
    competencies: [
      "Makilala ang iba’t ibang anyo ng sulating pang-akademiko, teknikal, o sining sa Filipino",
      "Mabisang makasulat ng abstrak, sintesis, bionote, panukalang proyekto, at katitikan ng pulong",
      "Makapagsagawa ng peer-editing at masusing pagwawasto alinsunod sa pamantayang ortograpiya",
    ],
    careerPathways: ["Filipino Technical Writing", "Legal Secretarial Services", "Broadcast Journalism"],
  },
  ENTREP: {
    description:
      "Deals with the concepts, underlying principles, processes, and implementation of a business plan, product development, market testing, and enterprise launching.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["None"],
    competencies: [
      "Scan the market environment and identify viable business opportunities and customer personas",
      "Develop a comprehensive business plan covering marketing, operations, human resources, and finance",
      "Operate and showcase a simulated or live enterprise and report financial income statements",
    ],
    careerPathways: ["Small Business Management", "Startup Founder", "Commercial Operations"],
  },
  "3IS": {
    description:
      "Inquiries, Investigations, and Immersion: Requires the learner to demonstrate competencies acquired in an integrative, scientific, or creative manner in their chosen specialization.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["Practical Research 1", "Practical Research 2"],
    competencies: [
      "Synthesize interdisciplinary concepts to address real-world community or industry challenges",
      "Implement investigation protocols adhering to ethical and scientific research guidelines",
      "Defend culminating research findings or capstone innovations in a formal public colloquium",
    ],
    careerPathways: ["Applied R&D", "Innovation Engineering", "Capstone Research"],
  },

  // ---------------------------------------------------------------------------
  // STEM SPECIALIZED SUBJECTS
  // ---------------------------------------------------------------------------
  PRECALC: {
    description:
      "Equips students with competencies in solving real-life problems using analytic geometry, conic sections, systems of nonlinear equations, series and mathematical induction, and trigonometry.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["Junior High School Mathematics"],
    competencies: [
      "Graph and derive standard equations of circles, parabolas, ellipses, and hyperbolas",
      "Solve systems of nonlinear equations and model engineering applications of conic sections",
      "Apply trigonometric identities, inverse trigonometric functions, and polar coordinates",
    ],
    careerPathways: ["Civil Engineering", "Mechanical Engineering", "Theoretical Physics", "Mathematics"],
  },
  BASCALC: {
    description:
      "Computes limits of functions, continuity, differentiation, and integration of algebraic, exponential, logarithmic, and trigonometric functions in one variable with optimization applications.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["Pre-Calculus"],
    competencies: [
      "Evaluate limits of functions and prove continuity using limit theorems and epsilon-delta concepts",
      "Compute derivatives using product, quotient, and chain rules; solve optimization and related rates problems",
      "Compute definite and indefinite integrals and determine the area of plane regions bounded by curves",
    ],
    careerPathways: ["Aerospace Engineering", "Electrical Engineering", "Applied Mathematics", "Robotics"],
  },
  BIO1: {
    description:
      "Enhances understanding of life processes at cellular and molecular levels, biochemistry, membrane transport, cellular respiration, and photosynthesis.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["Earth and Life Science"],
    competencies: [
      "Characterize biological macromolecules, enzymatic kinetics, and cell organelle functions",
      "Trace the biochemical stages of aerobic cellular respiration (glycolysis, Krebs, ETC) and photosynthesis",
      "Analyze cell division (mitosis and meiosis) and describe cell cycle checkpoints and abnormalities",
    ],
    careerPathways: ["Biomedical Science", "Molecular Biology", "Pre-Medicine", "Genetics"],
  },
  BIO2: {
    description:
      "Covers heredity, Mendelian and non-Mendelian genetics, genetic engineering, evolutionary biology, and comparative plant and animal organ systems.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["General Biology 1"],
    competencies: [
      "Predict genetic phenotypic ratios using Punnett squares, pedigree analysis, and gene mapping",
      "Explain the molecular central dogma of biology: DNA replication, transcription, and translation",
      "Examine evidence of biological evolution and evolutionary mechanisms (natural selection, genetic drift)",
      "Compare feedback and homeostasis in animal and plant physiological systems",
    ],
    careerPathways: ["Medicine", "Veterinary Medicine", "Biotechnology", "Ecology"],
  },
  PHYS1: {
    description:
      "Study of mechanics of particles, rigid bodies, and fluids, harmonic waves, heat, and thermodynamics using algebraic, geometric, trigonometric, and basic calculus concepts.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["Basic Calculus"],
    competencies: [
      "Apply vectors, kinematics in one and two dimensions, and Newton's laws of motion",
      "Solve mechanical problems involving work, energy, linear momentum, and rotational dynamics",
      "Analyze fluid statics and dynamics (Bernoulli’s equation) and the laws of thermodynamics",
    ],
    careerPathways: ["Mechanical Engineering", "Automotive Engineering", "Structural Engineering"],
  },
  PHYS2: {
    description:
      "Study of electricity, Coulomb’s law, electric fields, DC/AC circuits, magnetism, electromagnetic induction, geometric and wave optics, and special relativity.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["General Physics 1"],
    competencies: [
      "Compute electric potentials, capacitance, and resistance in DC network circuits using Kirchhoff's rules",
      "Analyze magnetic forces, Biot-Savart law, Faraday’s law of induction, and Maxwell’s equations",
      "Apply Snell’s law, diffraction, interference, and Lorentz transformations in special relativity",
    ],
    careerPathways: ["Electrical Engineering", "Telecommunications", "Optoelectronics", "Quantum Physics"],
  },
  CHEM1: {
    description:
      "Composition, structure, and properties of matter, stoichiometry, gas laws, thermochemistry, and electron configuration.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["Junior High School Science"],
    competencies: [
      "Calculate stoichiometric mass relationships and percent yields in balanced chemical reactions",
      "Apply ideal gas laws, kinetic molecular theory, and real gas van der Waals equations",
      "Determine enthalpy changes of chemical reactions using calorimetry and Hess’s Law",
    ],
    careerPathways: ["Chemical Engineering", "Forensic Chemistry", "Industrial Chemistry", "Pharmacy"],
  },
  CHEM2: {
    description:
      "Quantitative principles, chemical kinetics, chemical equilibrium, acid-base equilibria, electrochemistry, and introduction to organic functional groups.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["General Chemistry 1"],
    competencies: [
      "Determine reaction rates, rate laws, and activation energies using Arrhenius equations",
      "Calculate equilibrium constants (Kc, Kp, pH, pKa, buffers) and apply Le Chatelier’s principle",
      "Balance oxidation-reduction reactions and compute galvanic cell potentials (E°cell)",
    ],
    careerPathways: ["Petrochemicals", "Pharmaceutical Engineering", "Materials Science", "Biochemistry"],
  },
  EARTHSCI: {
    description:
      "Understanding Earth on a planetary scale: geologic time, mantle dynamics, plate tectonics, mineral and energy resources, and environmental sustainability.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["None"],
    competencies: [
      "Analyze plate tectonic theory and mechanisms driving continental drift and volcanism",
      "Explain the rock cycle, geochemical dating, and the stratification of the geologic time scale",
      "Evaluate sustainable utilization of mineral, soil, and renewable water resources in the Philippines",
    ],
    careerPathways: ["Geological Engineering", "Mining Engineering", "Hydrology", "Volcanology"],
  },
  DRRR: {
    description:
      "Application of scientific knowledge in assessing, mitigating, and managing risks associated with natural and man-made disasters.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["Earth Science", "Junior High School Science"],
    competencies: [
      "Distinguish hazards from disaster risks and analyze vulnerabilities of communities",
      "Formulate emergency evacuation protocols and community contingency plans",
      "Apply early warning systems and incident command procedures during emergency response",
    ],
    careerPathways: ["Disaster Risk Reduction", "Emergency Services", "Urban Planning", "Public Safety"],
  },
  WORKIMM: {
    description:
      "Students identify a problem, design methodology, formulate hypotheses, gather data, and defend a scientific report or undergo industry immersion.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["Inquiries, Investigations, and Immersion"],
    competencies: [
      "Execute specialized workplace or laboratory tasks under professional mentorship",
      "Demonstrate professional work ethics, safety standards, and intellectual integrity",
      "Deliver and defend a culminating capstone paper in a formal scientific colloquium",
    ],
    careerPathways: ["All STEM Professional Fields"],
  },

  // ---------------------------------------------------------------------------
  // ABM SPECIALIZED SUBJECTS
  // ---------------------------------------------------------------------------
  ORGMAN: {
    description:
      "Familiarizes students with basic concepts and processes of business organization and functional management: planning, organizing, leading, and controlling.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["None"],
    competencies: [
      "Evaluate organizational theories, management functions, and external business environments",
      "Design organizational charts, job descriptions, and delegation frameworks",
      "Formulate managerial leadership strategies and performance appraisal systems",
    ],
    careerPathways: ["Business Administration", "Operations Management", "Human Resources"],
  },
  BUSMATH: {
    description:
      "Application of mathematics to business: decimals, fractions, percentages, mark-up, mark-down, gross and net earnings, overtime, and business data analysis.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["General Mathematics"],
    competencies: [
      "Compute trade discounts, profit margins, mark-on, and break-even points",
      "Calculate employee gross earnings, statutory deductions, benefits, and net take-home pay",
      "Prepare and interpret business spreadsheets, charts, and presentation graphics",
    ],
    careerPathways: ["Payroll Accounting", "Retail Management", "Financial Services"],
  },
  FABM1: {
    description:
      "Introduction to accounting as the language of business and complete accounting cycle for service and merchandising sole proprietorships.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["Business Math"],
    competencies: [
      "Journalize business transactions using double-entry bookkeeping and general ledger posting",
      "Prepare unadjusted trial balances, 10-column worksheets, and adjusting journal entries",
      "Draft financial statements: Statement of Comprehensive Income and Statement of Financial Position",
    ],
    careerPathways: ["Certified Public Accountant", "Bookkeeping", "Internal Audit"],
  },
  FABM2: {
    description:
      "Preparation and horizontal/vertical financial statement analysis, ratios, bank reconciliations, basic business forms, and accounting practice sets.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["Fundamentals of Accountancy, Business, and Management 1"],
    competencies: [
      "Compute profitability, liquidity, and solvency ratios and interpret financial trends",
      "Prepare a two-column and adjusted bank reconciliation statement using actual bank records",
      "Complete an end-to-end accounting practice set integrating information technology",
    ],
    careerPathways: ["Financial Analysis", "Corporate Finance", "Investment Banking"],
  },
  BUSFIN: {
    description:
      "Fundamental principles, tools, and techniques in financial management: money, financial markets, working capital, capital budgeting, and personal finance.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["Fundamentals of Accountancy, Business, and Management 1"],
    competencies: [
      "Evaluate financial market instruments, risk-return trade-offs, and time value of money",
      "Perform capital budgeting evaluations using Net Present Value (NPV) and Internal Rate of Return (IRR)",
      "Design a sustainable personal investment and retirement portfolio plan",
    ],
    careerPathways: ["Financial Planning", "Wealth Management", "Treasury Operations"],
  },
  PRINMKT: {
    description:
      "Principles and practices in marketing goods and services, buyer behavior, market segmentation, marketing mix (4Ps/7Ps), and integrated marketing campaigns.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["Organization and Management"],
    competencies: [
      "Conduct customer segmentation, target market profiling, and competitive positioning",
      "Formulate integrated marketing strategies covering product, price, place, and promotion",
      "Develop a comprehensive digital and traditional marketing plan for a targeted venture",
    ],
    careerPathways: ["Brand Marketing", "Advertising", "Market Research", "Sales Management"],
  },
  ABMETHICS: {
    description:
      "Fundamental concepts of ethical standards, corporate governance, consumer rights, and corporate social responsibility in the Philippine business environment.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["Organization and Management"],
    competencies: [
      "Identify ethical dilemmas in business operations and apply moral decision frameworks",
      "Analyze consumer protection laws, labor standards, and anti-corruption regulations",
      "Formulate a sustainable Corporate Social Responsibility (CSR) project proposal",
    ],
    careerPathways: ["Corporate Governance", "Compliance Management", "Labor Relations"],
  },
  ABMECO: {
    description:
      "Application of economic principles to business management, Philippine industrial analysis, socio-economic impact studies, and market structures.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["None"],
    competencies: [
      "Analyze supply and demand elasticity, consumer utility, and market equilibrium",
      "Examine key Philippine industry sectors (agriculture, services, BPO, manufacturing)",
      "Conduct a rigorous socio-economic impact study of a proposed local business venture",
    ],
    careerPathways: ["Economics Advisory", "Trade Policy", "Industry Analysis"],
  },
  ABMSIM: {
    description:
      "Integrates ABM key concepts in a real-life business cycle: business opportunity research, legal registration, operations, financial reporting, and enterprise simulation.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["Fundamentals of Accountancy, Business, and Management 2", "Business Finance"],
    competencies: [
      "Incorporate and operate an actual or simulated business enterprise following compliance rules",
      "Manage daily inventory, customer service, cash flow reconciliations, and bookkeeping",
      "Prepare final enterprise financial statements and socio-economic liquidation audits",
    ],
    careerPathways: ["Enterprise Management", "Franchise Operations", "Commercial Entrepreneurship"],
  },

  // ---------------------------------------------------------------------------
  // HUMSS SPECIALIZED SUBJECTS
  // ---------------------------------------------------------------------------
  CREATWRITE: {
    description:
      "Practical and creative skills in reading and writing fiction, poetry, and drama; craft techniques, workshops of student manuscripts, and revision.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["Reading and Writing Skills"],
    competencies: [
      "Utilize figurative language, sensory imagery, and diction in composing original poetry",
      "Develop realistic fictional characters, dramatic conflict, and convincing dialogue",
      "Produce a polished creative writing portfolio or one-act stage play manuscript",
    ],
    careerPathways: ["Creative Writing", "Playwriting", "Editorial Publishing", "Copywriting"],
  },
  CREATNONFIC: {
    description:
      "Reading and writing of Creative Nonfiction as a literary form, incorporating personal essays, memoirs, travelogues, reportage, and literary journalism.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["Creative Writing"],
    competencies: [
      "Employ literary elements (scene, dialogue, voice) to factual reportage and personal essays",
      "Write a compelling autobiographical memoir or travel narrative highlighting cultural insights",
      "Execute ethical fact-checking and interview techniques for publication-ready manuscripts",
    ],
    careerPathways: ["Literary Journalism", "Features Editorial", "Memoir Ghostwriting"],
  },
  WORLDREL: {
    description:
      "Explores tenets, rituals, and practices of major world religions: Judaism, Christianity, Islam, Hinduism, Buddhism, Confucianism, Taoism, and Shintoism.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["None"],
    competencies: [
      "Trace the historical development, foundational scriptures, and core doctrines of world faiths",
      "Evaluate religious responses to contemporary moral and global issues",
      "Promote mutual respect and inter-religious dialogue in a pluralistic society",
    ],
    careerPathways: ["Interfaith Relations", "Theological Studies", "Humanitarian Services"],
  },
  COMMENG: {
    description:
      "Application of social science ideas to community challenges: community engagement, solidarity, citizenship, human rights, and participatory development.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["Understanding Culture, Society, and Politics"],
    competencies: [
      "Conduct community participatory needs assessments and stakeholder mapping",
      "Formulate collaborative community action plans addressing local socio-economic issues",
      "Implement and evaluate civic service initiatives adhering to social justice standards",
    ],
    careerPathways: ["Community Organizing", "NGO Management", "Social Work", "Public Advocacy"],
  },
  POLGOV: {
    description:
      "Basic concepts of politics and governance from historical-institutional perspective: structures, elections, political parties, and civil society.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["Understanding Culture, Society, and Politics"],
    competencies: [
      "Differentiate the roles, powers, and checks and balances of executive, legislative, and judicial branches",
      "Evaluate electoral mechanisms, decentralization under the Local Government Code, and citizen participation",
      "Critique public policy formulation and youth involvement in nation building",
    ],
    careerPathways: ["Public Law", "Legislative Staffing", "Political Consultancy", "Diplomacy"],
  },
  TRENDS21: {
    description:
      "Opportunities to discover patterns and extract meanings from emerging 21st-century global trends, neural connections, technology, and strategic thinking.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["None"],
    competencies: [
      "Distinguish fads from long-term trends and identify driver patterns shaping global futures",
      "Analyze the social impact of planetary networks, globalization, and climate change",
      "Formulate forward-thinking interventions using creative and critical decision-making models",
    ],
    careerPathways: ["Futurism & Trend Analysis", "Strategic Consulting", "Innovation Advisory"],
  },
  DISS: {
    description:
      "Disciplines and Ideas in the Social Sciences: Basic concepts, methods of inquiry, influential thinkers, and application of social science theories to Philippine contexts.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["Understanding Culture, Society, and Politics"],
    competencies: [
      "Compare core social science disciplines: anthropology, economics, geography, history, linguistics, political science, psychology, sociology, demography",
      "Apply dominant social science approaches (structural-functionalism, Marxism, psychoanalysis, institutionalism)",
      "Relate indigenous concepts (Pantayong Pananaw, Sikolohiyang Pilipino) to national issues",
    ],
    careerPathways: ["Social Science Academia", "Policy Research", "Cultural Anthropology"],
  },
  DIASS: {
    description:
      "Disciplines and Ideas in the Applied Social Sciences: Counseling, Social Work, and Communication, highlighting principles and applications in critical development areas.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["Disciplines and Ideas in the Social Sciences"],
    competencies: [
      "Demonstrate fundamental counseling skills, ethics, and therapeutic intervention principles",
      "Examine social casework processes and social welfare advocacy models",
      "Evaluate communication channels used in empowering marginalized sectors and social mobilization",
    ],
    careerPathways: ["Clinical Counseling", "Social Case Management", "Development Communication"],
  },
  HUMSSCULM: {
    description:
      "Culminating activity integrating learning across humanities and social sciences through authentic exhibitions, community research, and public performance.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["Disciplines and Ideas in the Applied Social Sciences"],
    competencies: [
      "Synthesize humanities and social science insights in producing an authentic community project",
      "Present and defend public service campaigns, policy papers, or creative exhibitions",
    ],
    careerPathways: ["All Humanities & Social Science Fields"],
  },

  // ---------------------------------------------------------------------------
  // ARTS AND DESIGN TRACK SUBJECTS
  // ---------------------------------------------------------------------------
  "AD-CI1": {
    description:
      "Creative Industries I: Arts and Design Appreciation and Production. Surveys various arts and design forms, materials, media, and production across significant historical artists.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["None"],
    competencies: [
      "Analyze historical art movements, significant international and Philippine masterworks, and materials",
      "Identify creative production workflows across fine arts, digital media, and industrial craft",
      "Produce a curated visual portfolio demonstrating mastery of foundational design elements",
    ],
    careerPathways: ["Art Direction", "Visual Arts Production", "Curatorial Practice"],
  },
  "AD-CI2": {
    description:
      "Creative Industries II: Performing Arts. Principles of theater, music, and dance, examining the practical application of performing arts skills in local and global creative markets.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["Creative Industries I: Arts and Design Appreciation and Production"],
    competencies: [
      "Apply vocal, physical, and kinesthetic techniques in theatrical, musical, or dance performance",
      "Analyze market trends, production budgets, and audience engagement strategies in the performing arts",
      "Collaborate in staging a multidisciplinary performing arts preview",
    ],
    careerPathways: ["Theatrical Performance", "Choreography", "Stage Management", "Music Performance"],
  },
  "AD-PPD": {
    description:
      "Physical and Personal Development in the Arts. Comprehensive study and practice on the proper care of the artist's body as instrument through exercise, hygiene, and industry safety.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["None"],
    competencies: [
      "Apply biomechanics, injury prevention, and ergonomic posture principles suited for artistic craft",
      "Maintain physical conditioning, stamina, and voice/body preservation routines",
      "Demonstrate studio safety protocols and emotional wellness management for artists",
    ],
    careerPathways: ["Somatic Coaching", "Performing Arts Health", "Professional Artistry"],
  },
  "AD-DFI": {
    description:
      "Developing Filipino Identity in the Arts. Deepens awareness of local and regional arts traditions, exploring ways artists contribute to national identity using indigenous and local forms.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["None"],
    competencies: [
      "Examine indigenous Philippine art forms, traditional textiles, folklore, and regional aesthetics",
      "Synthesize cultural motifs and heritage narratives into contemporary artistic creations",
      "Advocate cultural preservation and ethical intellectual rights of indigenous creative expressions",
    ],
    careerPathways: ["Cultural Advocacy", "Ethno-artistic Production", "Heritage Preservation"],
  },
  "AD-IEP": {
    description:
      "Integrating the Elements and Principles of Organization in the Arts. Deepens understanding of balance, contrast, unity, rhythm, and proportion in diverse creative expressions.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["Creative Industries I: Arts and Design Appreciation and Production"],
    competencies: [
      "Apply composition, contrast, proportion, and balance to multidimensional art outputs",
      "Critique peer artworks using standard aesthetic and technical evaluation rubrics",
      "Produce an integrated thematic collection demonstrating conceptual cohesion and execution",
    ],
    careerPathways: ["Industrial Design", "Exhibition Design", "Visual Arts"],
  },
  "AD-LM": {
    description:
      "Leadership and Management in Different Arts Fields. Basic concepts, elements, and processes in arts management, fundraising, copyright, and leadership potential in creative enterprises.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["None"],
    competencies: [
      "Formulate arts production schedules, budget forecasts, grant proposals, and marketing campaigns",
      "Navigate intellectual property, copyright compliance, and artist-client contractual agreements",
      "Lead a creative production team to execute an arts showcase within allocated resources",
    ],
    careerPathways: ["Arts Management", "Creative Agency Leadership", "Production Coordination"],
  },

  // ---------------------------------------------------------------------------
  // SPORTS TRACK SUBJECTS
  // ---------------------------------------------------------------------------
  "SP-SFA": {
    description:
      "Safety and First Aid. Life skills in injury prevention, immediate sports injury response, CPR/AED protocols, leading to Philippine Red Cross emergency certifications.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["None"],
    competencies: [
      "Demonstrate emergency first aid, CPR/AED procedures, and fracture immobilization protocols",
      "Implement athletic injury prevention regimens and sport-specific taping techniques",
      "Assess sports venue hazards and establish emergency action plans conforming to Red Cross standards",
    ],
    careerPathways: ["Emergency Medical Services", "Athletic Training", "Sports Venue Safety"],
  },
  "SP-HM": {
    description:
      "Human Movement. Origin, neurological control, and motor learning of movement patterns appropriate for varied athlete developmental stages and skill levels.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["None"],
    competencies: [
      "Analyze biomechanical principles, lever systems, and joint mechanics in athletic performance",
      "Evaluate motor skill acquisition, kinesthetic feedback, and movement errors",
      "Prescribe corrective movement exercises to optimize athletic efficiency and posture",
    ],
    careerPathways: ["Kinesiology", "Physical Therapy", "Biomechanics Analysis"],
  },
  "SP-FC": {
    description:
      "Fundamentals of Coaching. Concepts, ethics, training methodology, team dynamics, communication, and tactical strategies in sports coaching.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["Human Movement"],
    competencies: [
      "Develop seasonal athletic training periodization plans for target competitive tournaments",
      "Apply coaching psychology, motivational communication, and constructive athlete feedback",
      "Formulate tactical playbooks and game-day operational strategies",
    ],
    careerPathways: ["Sports Coaching", "Athletic Program Directing", "Fitness Mentorship"],
  },
  "SP-SOAM": {
    description:
      "Sports Officiating and Activity Management. Rules, mechanics, and tournament structures in specific sports leading to NSA and TESDA officiating certifications.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["Safety and First Aid"],
    competencies: [
      "Master and enforce official international rules and hand signals for major sports",
      "Organize single-elimination, double-elimination, and round-robin tournament brackets",
      "Demonstrate calm decision-making, neutrality, and dispute resolution under competitive pressure",
    ],
    careerPathways: ["Certified Sports Referee", "Tournament Director", "Athletic Association Official"],
  },
  "SP-FSRL": {
    description:
      "Fitness, Sports, and Recreation Leadership. Competencies for managing safe, engaging, and effective programs in fitness gyms, corporate wellness, and recreational sports.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["Human Movement"],
    competencies: [
      "Design inclusive community sports programs and group fitness routines for diverse demographics",
      "Manage recreational facility equipment, customer safety, and member engagement",
      "Evaluate participant outcomes and program efficacy using standardized health metrics",
    ],
    careerPathways: ["Fitness Club Management", "Corporate Wellness Coaching", "Recreational Sports Director"],
  },
  "SP-PASE": {
    description:
      "Psychosocial Aspects of Sports and Exercise. Psychological factors influencing athletic participation, performance anxiety, team cohesion, and mental toughness.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["None"],
    competencies: [
      "Apply sports psychology techniques (visualization, self-talk, goal setting, arousal regulation)",
      "Analyze social factors influencing athlete burnout, adherence, and team chemistry",
      "Design psychological interventions to build mental resilience and confidence under pressure",
    ],
    careerPathways: ["Sports Psychology", "Mental Performance Coaching", "Athlete Advisory"],
  },
  "SP-FTEP": {
    description:
      "Fitness Testing and Exercise Programming. Administration of physical fitness test batteries, functional movement screens, and individualized athletic programming.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["Human Movement"],
    competencies: [
      "Administer standardized fitness assessment batteries (VO2 max, 1RM, flexibility, agility)",
      "Prescribe progressive overload exercise programming tailored to specific athlete goals",
      "Track physiological adaptations and performance progress using digital metrics",
    ],
    careerPathways: ["Strength and Conditioning", "Personal Training", "Performance Testing"],
  },
  "SP-PRAC": {
    description:
      "Practicum (in-campus). Hands-on experience within the school setting in athlete enhancement, practice coaching, tournament management, and recreation leadership.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["Fundamentals of Coaching", "Sports Officiating and Activity Management"],
    competencies: [
      "Lead in-campus athletic teams during practice drills, scrimmages, and conditioning sessions",
      "Officiate school intramurals and manage athletic equipment and court facilities",
      "Produce a reflective practicum portfolio documenting coaching hours and athlete outcomes",
    ],
    careerPathways: ["School Athletic Assistant", "Youth Sports Coordinator"],
  },
  "SP-APPR": {
    description:
      "Apprenticeship (off-campus). Hands-on off-campus experience with sports clubs, fitness centers, or local government athletic councils for advanced certification.",
    timeAllotment: "80 hours per semester",
    prerequisites: ["Practicum (in-campus)"],
    competencies: [
      "Execute professional duties in licensed fitness centers, sports federations, or clinics",
      "Collaborate with certified athletic trainers and tournament directors in live competitions",
      "Complete qualification requirements for National Sports Association and TESDA certifications",
    ],
    careerPathways: ["Professional Sports Apprenticeship", "Elite Athlete Development"],
  },

  // ---------------------------------------------------------------------------
  // CORE TVL SPECIALIZATIONS (AFA, IA, HE, ICT)
  // ---------------------------------------------------------------------------
  "TVL-AGRI1": {
    description:
      "Agricultural Crops Production (NC I / NC II). Competencies in nursery operations, planting, crop care, harvesting, and post-harvest handling conforming to GAP standards.",
    timeAllotment: "160 to 320 hours",
    prerequisites: ["None"],
    competencies: [
      "Prepare land, select certified seeds, and maintain seedbed nursery environments",
      "Execute organic and safe fertilizer and pesticide application following Good Agricultural Practices",
      "Perform harvesting, grading, sorting, and post-harvest storage of farm produce",
    ],
    tesdaNcLevel: "NC II",
    careerPathways: ["Farm Supervisor", "Agribusiness Technician", "Crop Production Specialist"],
  },
  "TVL-ANIMAL": {
    description:
      "Animal Production (Poultry, Swine, or Ruminants) (NC II). Housing, feeding, breeding management, and biosecurity protocols for domestic livestock.",
    timeAllotment: "320 hours",
    prerequisites: ["None"],
    competencies: [
      "Maintain livestock housing, feeding rations, and biosecurity sanitation",
      "Assist in animal breeding, gestation, and newborn care protocols",
      "Administer routine vaccinations and disease monitoring under veterinary guidance",
    ],
    tesdaNcLevel: "NC II",
    careerPathways: ["Livestock Farm Operator", "Poultry Management Technician", "Animal Health Aide"],
  },
  "TVL-AQUA": {
    description:
      "Aquaculture (NC II). Operation of fishponds, hatcheries, cages, fish nutrition, water quality management, and harvesting of aquatic resources.",
    timeAllotment: "320 hours",
    prerequisites: ["None"],
    competencies: [
      "Prepare fishponds, nursery tanks, and marine floating cages for stocking",
      "Monitor water quality parameters (pH, salinity, dissolved oxygen) and feeding schedules",
      "Harvest, ice, and package freshwater and marine fish for commercial market distribution",
    ],
    tesdaNcLevel: "NC II",
    careerPathways: ["Fish Hatchery Operator", "Aquaculture Specialist", "Fish Farm Supervisor"],
  },
  "TVL-FOODPROC": {
    description:
      "Food Processing (NC II). Processing food by salting, curing, smoking, fermentation, pickling, thermal canning, packaging, and food safety sanitation.",
    timeAllotment: "320 hours",
    prerequisites: ["None"],
    competencies: [
      "Process meat, fish, fruits, and vegetables using curing, smoking, and thermal processing",
      "Maintain GMP, HACCP, and BFAD food safety sanitation in processing facilities",
      "Operate commercial packaging machinery and apply regulatory nutritional labeling",
    ],
    tesdaNcLevel: "NC II",
    careerPathways: ["Food Quality Inspector", "Food Processing Operator", "Commercial Kitchen Cannery"],
  },
  "TVL-AUTO": {
    description:
      "Automotive Servicing (NC I / NC II). Servicing automotive electrical, cooling, brake, suspension, steering, and engine mechanical systems.",
    timeAllotment: "320 to 640 hours",
    prerequisites: ["None"],
    competencies: [
      "Perform engine tune-ups, oil changes, and radiator cooling system maintenance",
      "Service and bleed hydraulic brake pads, drums, calipers, and master cylinders",
      "Diagnose automotive electrical charging and starting circuit malfunctions using multimeters",
    ],
    tesdaNcLevel: "NC II",
    careerPathways: ["Automotive Service Technician", "Brake and Suspension Mechanic", "Fleet Maintenance"],
  },
  "TVL-SMAW": {
    description:
      "Shielded Metal Arc Welding (SMAW NC I / NC II). Performing fillet and groove welds in flat, horizontal, vertical, and overhead positions on carbon steel plates and pipes.",
    timeAllotment: "320 hours",
    prerequisites: ["None"],
    competencies: [
      "Select appropriate electrode types, welding current, and polarity for carbon steel joints",
      "Weld carbon steel plates in 1F, 2F, 3F, 4F and groove positions (1G, 2G, 3G, 4G)",
      "Inspect weld defects and maintain welding shop PPE and equipment safety",
    ],
    tesdaNcLevel: "NC II",
    careerPathways: ["Certified Welder", "Structural Steel Fabricator", "Shipyard Welding Technician"],
  },
  "TVL-EIM": {
    description:
      "Electrical Installation and Maintenance (NC II). Installing electrical conduit, wiring devices, circuit breakers, and lighting for residential and commercial buildings.",
    timeAllotment: "320 to 640 hours",
    prerequisites: ["None"],
    competencies: [
      "Install rigid and flexible metallic/non-metallic conduit and raceways conforming to the Philippine Electrical Code",
      "Wire lighting fixtures, three-way switches, convenience outlets, and distribution panels",
      "Perform continuity, insulation resistance, and circuit troubleshooting using megohmmeters",
    ],
    tesdaNcLevel: "NC II",
    careerPathways: ["Licensed Electrician", "Residential Wiring Contractor", "Building Maintenance Electrician"],
  },
  "TVL-EPAS": {
    description:
      "Electronic Products Assembly and Servicing (NC II). Assembling and servicing consumer electronic products, PCB soldering, audio/video systems, and digital microcontrollers.",
    timeAllotment: "320 to 640 hours",
    prerequisites: ["None"],
    competencies: [
      "Read electronic schematic diagrams and solder surface-mount and through-hole PCB components",
      "Diagnose and replace defective transistors, diodes, capacitors, and ICs in audio-video systems",
      "Assemble, configure, and maintain consumer electronics and automated microcontroller units",
    ],
    tesdaNcLevel: "NC II",
    careerPathways: ["Electronics Technician", "PCB Assembly Specialist", "Audio/Video Service Engineer"],
  },
  "TVL-CARPENTRY": {
    description:
      "Carpentry (NC II). Installing formwork components, wall framing, roof trusses, ceiling panels, and architectural finishing woodwork.",
    timeAllotment: "320 to 640 hours",
    prerequisites: ["None"],
    competencies: [
      "Fabricate and install concrete formworks, scaffoldings, and shores safely",
      "Construct timber wall framing, ceiling joists, and roof truss systems",
      "Install architectural doors, window jambs, moldings, and cabinet finishing woodwork",
    ],
    tesdaNcLevel: "NC II",
    careerPathways: ["Construction Carpenter", "Formwork Fabricator", "Architectural Woodworker"],
  },
  "TVL-COOK1": {
    description:
      "Cookery (NC II). Preparing, cooking, and plating hot and cold dishes: stocks, sauces, soups, appetizers, salads, sandwiches, meat, poultry, seafood, and desserts.",
    timeAllotment: "320 hours",
    prerequisites: ["None"],
    competencies: [
      "Maintain kitchen hygiene, knife sanitation, and HACCP standards in a commercial kitchen",
      "Prepare classical mother sauces, stocks, hot soups, and culinary meat cuts",
      "Execute commercial kitchen order cooking, portion control, and aesthetic plate presentation",
    ],
    tesdaNcLevel: "NC II",
    careerPathways: ["Line Cook", "Commis Chef", "Catering Specialist", "Restaurant Kitchen Lead"],
  },
  "TVL-BREAD": {
    description:
      "Bread and Pastry Production (NC II). Preparing and presenting yeast breads, cookies, pies, pastries, cakes, tortes, and petit fours.",
    timeAllotment: "160 to 320 hours",
    prerequisites: ["None"],
    competencies: [
      "Scale ingredients, mix doughs, proof, bake, and store artisanal and commercial breads",
      "Prepare puff pastries, tarts, sweet fillings, and delicate choux pastries",
      "Frost, decorate, and assemble specialty occasion cakes and decorative petit fours",
    ],
    tesdaNcLevel: "NC II",
    careerPathways: ["Commercial Baker", "Pastry Chef", "Bakehouse Operator"],
  },
  "TVL-FBS": {
    description:
      "Food and Beverage Services (NC II). Providing dining room, banquet, and bar service: table appointments, food taking, wine service, and guest bill settlement.",
    timeAllotment: "160 to 320 hours",
    prerequisites: ["None"],
    competencies: [
      "Set up formal and casual dining table covers with appropriate silverware, china, and glassware",
      "Execute American, Russian, and French food service techniques and wine presentation",
      "Handle guest special requests, food allergies, room service orders, and POS bill settlement",
    ],
    tesdaNcLevel: "NC II",
    careerPathways: ["Food & Beverage Captain", "Banquet Server", "Restaurant Host / Supervisor"],
  },
  "TVL-CSS1": {
    description:
      "Computer Systems Servicing 1 (NC II). Installing, configuring, assembling, and maintaining computer systems, operating systems, and network peripherals.",
    timeAllotment: "320 hours",
    prerequisites: ["None"],
    competencies: [
      "Assemble computer hardware components (motherboards, CPUs, RAM, power supplies, storage)",
      "Install and configure desktop operating systems (Windows and Linux), device drivers, and utility tools",
      "Terminate Cat6 Ethernet network cabling and configure LAN router switch parameters",
    ],
    tesdaNcLevel: "NC II",
    careerPathways: ["IT Support Technician", "Computer Repair Specialist", "Desktop Support"],
  },
  "TVL-CSS2": {
    description:
      "Computer Systems Servicing 2 (NC II). Configuring network servers, Active Directory, DNS, DHCP, file/print sharing, and preventive system maintenance.",
    timeAllotment: "320 hours",
    prerequisites: ["Computer Systems Servicing 1"],
    competencies: [
      "Install and configure network operating systems (Windows Server / Linux Server)",
      "Deploy domain controller Active Directory, DNS, DHCP, and group security policies",
      "Execute automated backup strategies, disk imaging, and network security audits",
    ],
    tesdaNcLevel: "NC II",
    careerPathways: ["Junior Network Administrator", "Systems Maintenance Specialist", "Server Technician"],
  },
  "TVL-PROG": {
    description:
      "Computer Programming (Java / .NET / Python) (NC III). Object-oriented programming, algorithm design, relational database integration, and software deployment.",
    timeAllotment: "320 hours",
    prerequisites: ["None"],
    competencies: [
      "Design algorithms using structured object-oriented programming principles (OOP)",
      "Connect application backends with relational database systems using SQL and ORMs",
      "Debug, unit-test, and deploy secure enterprise software applications",
    ],
    tesdaNcLevel: "NC III",
    careerPathways: ["Junior Software Developer", "Backend Engineer", "Application Support"],
  },
  "TVL-ANIM": {
    description:
      "Animation (NC II). Producing 2D hand-drawn and digital animations: storyboarding, character design, keyframing, in-betweens, and clean-up drawing.",
    timeAllotment: "320 hours",
    prerequisites: ["None"],
    competencies: [
      "Construct storyboards and design expressive 2D characters with model sheets",
      "Apply the 12 principles of animation in generating fluid keyframes and breakdowns",
      "Digital ink, paint, render, and composite animated scenes using industry animation suites",
    ],
    tesdaNcLevel: "NC II",
    careerPathways: ["2D Animator", "Storyboarding Artist", "Clean-up and In-between Artist"],
  },
  "TVL-TOUR": {
    description:
      "Tourism Promotion Services (NC II). Promoting local and national tourism products, booking tour itineraries, and delivering visitor orientation services.",
    timeAllotment: "160 hours",
    prerequisites: ["None"],
    competencies: [
      "Compile comprehensive information on Philippine cultural, historical, and eco-tourism sites",
      "Prepare customized travel itineraries, flight quotations, and accommodation bookings",
      "Deliver professional customer service and handle tourist inquiries and cultural briefings",
    ],
    tesdaNcLevel: "NC II",
    careerPathways: ["Travel Consultant", "Tour Coordinator", "Local Tourism Officer"],
  },
};

/**
 * Resolves full DepEd MATATAG curriculum scope metadata for any canonical subject slug.
 */
export function getSubjectScopeDefinition(slug: string): SubjectScopeDefinition | undefined {
  const subject = getSubjectBySlug(slug);
  if (!subject) return undefined;

  // Extract base abbreviation from subject code (e.g. "G11-S1-GENMATH" -> "GENMATH", "G7-Q1-MATH" -> "MATH")
  const parts = subject.code.split("-");
  const baseCode = parts[parts.length - 1];

  const scopeRecord = BASE_SCOPE_REGISTRY[baseCode] || {
    description: `${subject.name} is aligned with DepEd Order No. 015, s. 2026 MATATAG standards, providing 8 structured lesson modules and 24 practice tests with Socratic AI explanations.`,
    timeAllotment: subject.level === "Junior High School" ? "4 hours per week (160 hours per academic year)" : "80 hours per semester",
    prerequisites: ["None"],
    competencies: [
      `Demonstrate foundational knowledge and competencies in ${subject.name}`,
      `Apply problem-solving and critical thinking methodologies in real-world contexts`,
      `Pass standardized quarterly assessments aligned with the DepEd 75% transmutation scale`,
    ],
    careerPathways: ["Higher Education", "Vocational Careers", "Civic Leadership"],
  };

  return {
    slug: subject.slug,
    code: subject.code,
    name: subject.name,
    level: subject.level,
    grade: subject.grade,
    term: subject.term,
    track: subject.track || (subject.level === "Junior High School" ? "Junior High School Core" : "Academic Track"),
    strand: subject.strand || (subject.level === "Junior High School" ? "Core" : "General"),
    timeAllotment: scopeRecord.timeAllotment,
    prerequisites: scopeRecord.prerequisites,
    corequisites: scopeRecord.corequisites,
    description: scopeRecord.description,
    competencies: scopeRecord.competencies,
    tesdaNcLevel: scopeRecord.tesdaNcLevel,
    careerPathways: scopeRecord.careerPathways,
    featuredModulesCount: 8,
  };
}

/**
 * Returns all canonical slugs available for pre-rendering.
 */
export function getAllSubjectScopeSlugs(): string[] {
  return SUBJECTS.map((s) => s.slug);
}

/**
 * Returns all resolved subject scope definitions.
 */
export function getAllSubjectScopeDefinitions(): SubjectScopeDefinition[] {
  return SUBJECTS.map((s) => getSubjectScopeDefinition(s.slug)!).filter(Boolean);
}
