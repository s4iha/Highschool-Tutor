import type { SubjectScopeLesson, JhsGradeQuarterScope } from "../types/subjectScope.types";

/**
 * Generates an 8-lesson MATATAG syllabus from 8 topic specifications.
 */
function createSyllabus(
  specs: Array<{ title: string; summary: string; keyConcepts: string[] }>
): SubjectScopeLesson[] {
  return specs.map((spec, index) => ({
    lessonNumber: index + 1,
    title: spec.title,
    summary: spec.summary,
    keyConcepts: spec.keyConcepts,
    practiceDrillsCount: 3,
  }));
}

// =============================================================================
// JHS GRADE & QUARTER SPECIFIC SYLLABI & SCOPES (GRADES 7–10, QUARTERS 1–4)
// =============================================================================

export const JHS_QUARTER_SCOPE_DATA: Record<
  string, // ABBR: MATH, SCI, ENG, FIL, AP, ESP, MAPEH, TLE
  Record<
    string, // Grade: "Grade 7", "Grade 8", "Grade 9", "Grade 10"
    Record<
      string, // Quarter: "Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"
      {
        description: string;
        competencies: string[];
        lessons: SubjectScopeLesson[];
      }
    >
  >
> = {
  MATH: {
    "Grade 7": {
      "Quarter 1": {
        description:
          "Grade 7 Mathematics Quarter 1 focuses on Sets, Subsets, Real Number Systems, operations on integers, and scientific notation under DepEd MATATAG standards.",
        competencies: [
          "Illustrate well-defined sets, subsets, universal sets, and the null set",
          "Solve problems involving sets using Venn diagrams and set operations",
          "Perform fundamental operations on integers, fractions, and decimals",
          "Express rational numbers in scientific notation and solve real-life applications",
        ],
        lessons: createSyllabus([
          {
            title: "Sets, Subsets, and Set Operations",
            summary: "Understand well-defined sets, universal sets, empty sets, union, intersection, and set difference. Model set relations with multi-circle Venn diagrams.",
            keyConcepts: ["Universal Set", "Venn Diagrams", "Union & Intersection", "Subsets"],
          },
          {
            title: "Venn Diagrams and Real-World Set Problems",
            summary: "Apply Venn diagrams to analyze survey data, classifications, and community statistics. Practice multi-set logic and cardinality deductions.",
            keyConcepts: ["Cardinality", "Three-Set Problems", "Survey Analysis", "Complements"],
          },
          {
            title: "The Real Number System & Number Line",
            summary: "Classify real numbers into rational, irrational, integers, and whole numbers. Locate positive and negative values accurately on the real number line.",
            keyConcepts: ["Real Numbers", "Rational vs Irrational", "Number Line", "Absolute Value"],
          },
          {
            title: "Operations on Integers and Absolute Values",
            summary: "Master addition, subtraction, multiplication, and division of signed integers. Solve multi-step numerical problems obeying order of operations.",
            keyConcepts: ["Signed Numbers", "PEMDAS / GEMDAS", "Zero Pairs", "Absolute Value"],
          },
          {
            title: "Rational Numbers in Fraction and Decimal Form",
            summary: "Convert between fractions, terminating decimals, and repeating decimals. Perform arithmetic operations on mixed fractions and decimal values.",
            keyConcepts: ["Fraction Arithmetic", "Repeating Decimals", "Conversions", "LCM / GCF"],
          },
          {
            title: "Square Roots, Cube Roots, and Principal Roots",
            summary: "Determine principal square roots and cube roots of rational numbers. Estimate non-perfect square roots to the nearest tenth and hundredth.",
            keyConcepts: ["Principal Roots", "Radicals", "Irrational Approximations", "Number Line Placement"],
          },
          {
            title: "Scientific Notation and Significant Figures",
            summary: "Express very large and very small quantities in standard scientific notation. Apply scientific notation to Philippine scientific and environmental measurements.",
            keyConcepts: ["Powers of Ten", "Standard Form", "Significant Figures", "Unit Scaling"],
          },
          {
            title: "Quarter 1 Comprehensive Word Problems & Review",
            summary: "Integrate set theory, real number operations, and scientific notation to solve real-world DepEd MATATAG scenario challenges.",
            keyConcepts: ["Scenario Modeling", "Multi-Step Applications", "Transmutation Review", "Diagnostic Check"],
          },
        ]),
      },
      "Quarter 2": {
        description:
          "Grade 7 Mathematics Quarter 2 covers Measurement, Metric Conversions, English-Metric systems, and Algebraic Expressions.",
        competencies: [
          "Convert measurements from one unit to another in both Metric and English systems",
          "Translate verbal phrases to algebraic expressions and vice versa",
          "Differentiate terms, coefficients, degree, and polynomial classifications",
          "Evaluate algebraic expressions for given values of variables",
        ],
        lessons: createSyllabus([
          {
            title: "Historical and Modern Measurement Systems",
            summary: "Explore traditional Filipino units of measure (dangkal, dipa) and trace transitions to SI Metric and Imperial systems.",
            keyConcepts: ["SI Metric", "Traditional Units", "Unit Equivalencies", "Dimensional Analysis"],
          },
          {
            title: "Metric and English System Conversions",
            summary: "Perform precise multi-step unit conversions for length, mass, volume, and temperature using conversion factors.",
            keyConcepts: ["Conversion Factors", "Unit Cancellation", "Temperature Scales", "Capacity Units"],
          },
          {
            title: "Translating Verbal Phrases into Algebraic Expressions",
            summary: "Identify mathematical keywords for operations to convert complex English and Filipino phrases into symbolic algebraic expressions.",
            keyConcepts: ["Variables & Constants", "Operation Keywords", "Symbolic Translation", "Word Modeling"],
          },
          {
            title: "Polynomials: Terms, Coefficients, and Degree",
            summary: "Classify polynomials as monomials, binomials, trinomials, or multinomials. Identify numerical and literal coefficients and polynomial degree.",
            keyConcepts: ["Monomials", "Polynomial Degree", "Leading Coefficients", "Standard Form"],
          },
          {
            title: "Evaluating Algebraic Expressions",
            summary: "Substitute numerical values into algebraic expressions and evaluate according to proper hierarchy of operations.",
            keyConcepts: ["Substitution", "Order of Operations", "Variable Replacement", "Formula Application"],
          },
          {
            title: "Addition and Subtraction of Polynomials",
            summary: "Combine like terms horizontally and vertically to add and subtract polynomial expressions accurately.",
            keyConcepts: ["Like Terms", "Horizontal Method", "Vertical Alignment", "Sign Changes"],
          },
          {
            title: "Laws of Exponents for Multiplication and Division",
            summary: "Apply product, quotient, and power rules of integral exponents to simplify polynomial terms and monomial operations.",
            keyConcepts: ["Product Rule", "Quotient Rule", "Power of a Power", "Zero Exponents"],
          },
          {
            title: "Quarter 2 Algebraic Problem Solving & Mastery",
            summary: "Solve perimeter, area, and consumer word problems using polynomial addition, subtraction, and evaluation.",
            keyConcepts: ["Geometric Applications", "Word Problem Modeling", "Quarter Mastery", "Diagnostic Drill"],
          },
        ]),
      },
      "Quarter 3": {
        description:
          "Grade 7 Mathematics Quarter 3 covers Linear Equations and Inequalities in One Variable, and Geometric Concepts of Angles and Polygons.",
        competencies: [
          "Differentiate algebraic expressions from linear equations and inequalities",
          "Solve linear equations and inequalities in one variable algebraically and graphically",
          "Identify and classify angles, angle pairs, and transversals",
          "Derive relationships among angles and sides of regular polygons",
        ],
        lessons: createSyllabus([
          {
            title: "Linear Equations vs. Inequalities in One Variable",
            summary: "Distinguish between statements of equality and inequality. Understand solution sets on the number line.",
            keyConcepts: ["Equality Properties", "Inequality Symbols", "Solution Sets", "Number Line Graphs"],
          },
          {
            title: "Solving Linear Equations in One Variable",
            summary: "Use Addition and Multiplication Properties of Equality to isolate variables in multi-step equations.",
            keyConcepts: ["APE & MPE", "Distributive Property", "Combining Like Terms", "Checking Solutions"],
          },
          {
            title: "Solving Linear Inequalities and Graphing",
            summary: "Solve inequalities involving sign reversals when multiplying or dividing by negative numbers and graph interval solutions.",
            keyConcepts: ["Inequality Properties", "Sign Reversal", "Interval Notation", "Boundary Points"],
          },
          {
            title: "Real-World Applications of Linear Equations",
            summary: "Translate age, coin, distance, and business scenarios into linear equations and verify realistic solutions.",
            keyConcepts: ["Age Problems", "Rate-Time-Distance", "Financial Equations", "Validation"],
          },
          {
            title: "Undefined Terms and Angle Pair Relationships",
            summary: "Review points, lines, planes, and investigate complementary, supplementary, vertical, and adjacent angle pairs.",
            keyConcepts: ["Angle Pairs", "Complementary", "Supplementary", "Vertical Angles"],
          },
          {
            title: "Parallel Lines Cut by a Transversal",
            summary: "Examine interior, exterior, corresponding, and alternate angles formed when parallel lines are intersected by a transversal.",
            keyConcepts: ["Transversals", "Corresponding Angles", "Alternate Interior", "Consecutive Interior"],
          },
          {
            title: "Polygons: Convexity, Angles, and Diagonals",
            summary: "Classify convex and non-convex polygons. Derive the formula for interior and exterior angle sums of regular n-gons.",
            keyConcepts: ["Regular Polygons", "Interior Angle Sum", "Exterior Angle Sum", "Diagonals"],
          },
          {
            title: "Quarter 3 Geometry and Equations Synthesis",
            summary: "Combine algebraic equation solving with geometric angle relationships to find unknown measurements.",
            keyConcepts: ["Geometric Algebra", "Angle Calculations", "Synthetic Problem Solving", "Quarter Review"],
          },
        ]),
      },
      "Quarter 4": {
        description:
          "Grade 7 Mathematics Quarter 4 focuses on Statistics, Data Collection, Frequency Distributions, Graphs, Measures of Central Tendency, and Variability.",
        competencies: [
          "Pose statistical questions and gather data using sampling methods",
          "Organize raw data into frequency distribution tables with intervals",
          "Construct and interpret histograms, frequency polygons, and ogives",
          "Calculate and interpret mean, median, mode, range, and standard deviation",
        ],
        lessons: createSyllabus([
          {
            title: "Posing Statistical Questions and Sampling",
            summary: "Distinguish between statistical and non-statistical inquiries. Formulate survey plans and explore random sampling techniques.",
            keyConcepts: ["Statistical Questions", "Population vs Sample", "Random Sampling", "Bias Identification"],
          },
          {
            title: "Organizing Raw Data: Frequency Distribution Tables",
            summary: "Determine range, class intervals, class boundaries, and cumulative frequencies to build structured grouped tables.",
            keyConcepts: ["Class Intervals", "Tallying", "Class Mark", "Cumulative Frequency"],
          },
          {
            title: "Graphical Representation: Histograms and Polygons",
            summary: "Construct and analyze histograms, frequency polygons, pie charts, and ogives for grouped educational and socio-economic data.",
            keyConcepts: ["Histograms", "Frequency Polygon", "Ogive", "Pie Charts"],
          },
          {
            title: "Measures of Central Tendency: Ungrouped Data",
            summary: "Calculate mean, median, and mode for discrete ungrouped datasets and identify the most appropriate measure for skewed data.",
            keyConcepts: ["Mean", "Median", "Mode", "Outliers"],
          },
          {
            title: "Measures of Central Tendency: Grouped Data",
            summary: "Estimate grouped mean, median, and mode using midpoint and modal class formulas in tabular frameworks.",
            keyConcepts: ["Grouped Mean", "Median Class", "Modal Class", "Interpolation"],
          },
          {
            title: "Measures of Variability: Range and Mean Absolute Deviation",
            summary: "Assess data dispersion using range, variance, and mean absolute deviation to evaluate student score consistency.",
            keyConcepts: ["Dispersion", "Range", "MAD", "Score Spread"],
          },
          {
            title: "Statistical Inferences and DepEd Data Analysis",
            summary: "Interpret real-world Philippine educational performance datasets to make evidence-based recommendations.",
            keyConcepts: ["Data Interpretation", "Comparative Analysis", "Policy Insights", "Critical Reading"],
          },
          {
            title: "Quarter 4 Capstone: Statistical Project & Year-End Review",
            summary: "Synthesize statistics, algebra, and geometry in a comprehensive MATATAG capstone drill review.",
            keyConcepts: ["Mini-Survey Project", "Capstone Analysis", "DO 015 Mastery", "Comprehensive Review"],
          },
        ]),
      },
    },
    "Grade 8": {
      "Quarter 1": {
        description:
          "Grade 8 Mathematics Quarter 1 focuses on Special Products, Factoring Polynomials, Rational Algebraic Expressions, and Linear Equations in Two Variables.",
        competencies: [
          "Factor polynomials with common monomial factors, difference of two squares, and sum/difference of two cubes",
          "Factor perfect square trinomials and general quadratic trinomials",
          "Simplify and perform operations on rational algebraic expressions",
          "Illustrate the rectangular coordinate system and graph linear equations in two variables",
        ],
        lessons: createSyllabus([
          {
            title: "Special Products: Binomial Expansion & Conjugates",
            summary: "Master patterns for square of a binomial, product of sum and difference of two terms, and cube of a binomial.",
            keyConcepts: ["Square of Binomial", "Difference of Squares", "Cube of Binomial", "FOIL Method"],
          },
          {
            title: "Factoring: Common Monomial Factor and Grouping",
            summary: "Identify greatest common monomial factors (GCMF) and apply grouping techniques to four-term polynomials.",
            keyConcepts: ["GCMF", "Grouping Method", "Polynomial Decomposition", "Factor Verification"],
          },
          {
            title: "Factoring: Difference of Squares and Sum/Difference of Cubes",
            summary: "Apply specialized factoring formulas for differences of squares and cubic binomials in higher-degree polynomials.",
            keyConcepts: ["Difference of Two Squares", "Sum of Cubes", "Difference of Cubes", "Composite Factoring"],
          },
          {
            title: "Factoring: Perfect Square and Quadratic Trinomials",
            summary: "Factor trinomials of the form x² + bx + c and ax² + bx + c using trial-and-error and the AC grouping method.",
            keyConcepts: ["Trinomial Factoring", "AC Method", "Perfect Square Trinomials", "Roots Connection"],
          },
          {
            title: "Simplifying Rational Algebraic Expressions",
            summary: "State restrictions on domain where denominators vanish and simplify rational expressions by canceling common factors.",
            keyConcepts: ["Domain Restrictions", "Zero Denominator", "Rational Simplification", "Factor Reduction"],
          },
          {
            title: "Multiplication and Division of Rational Expressions",
            summary: "Perform multiplication and reciprocal division of rational algebraic expressions with polynomial numerators and denominators.",
            keyConcepts: ["Reciprocals", "Cross-Cancellation", "Rational Operations", "Simplest Form"],
          },
          {
            title: "Addition and Subtraction of Rational Expressions",
            summary: "Determine least common denominators (LCD) to add and subtract similar and dissimilar rational algebraic expressions.",
            keyConcepts: ["Least Common Denominator", "Dissimilar Rationals", "Complex Fractions", "Algebraic Fractions"],
          },
          {
            title: "Rectangular Coordinate System and Graphing Lines",
            summary: "Plot points on Cartesian quadrants, calculate slope (m = Δy/Δx), and graph linear equations in two variables.",
            keyConcepts: ["Cartesian Plane", "Slope Formula", "x- and y-intercepts", "Slope-Intercept Form"],
          },
        ]),
      },
      "Quarter 2": {
        description:
          "Grade 8 Mathematics Quarter 2 covers Linear Inequalities in Two Variables, Systems of Linear Equations, and Deductive Reasoning.",
        competencies: [
          "Graph linear inequalities in two variables and identify half-planes",
          "Solve systems of linear equations by graphing, substitution, and elimination",
          "Categorize systems as consistent-independent, consistent-dependent, or inconsistent",
          "Formulate conditional statements and prove geometric properties using deductive logic",
        ],
        lessons: createSyllabus([
          {
            title: "Linear Inequalities in Two Variables",
            summary: "Differentiate linear equations from inequalities in two variables. Graph boundary lines and shade solution half-planes.",
            keyConcepts: ["Boundary Line", "Half-Planes", "Test Points", "Dashed vs Solid Lines"],
          },
          {
            title: "Systems of Linear Equations: Graphing Method",
            summary: "Determine intersections of pairs of linear equations on the coordinate plane to discover graphical solution points.",
            keyConcepts: ["System of Equations", "Point of Intersection", "Consistent Systems", "Inconsistent Lines"],
          },
          {
            title: "Solving Systems by Substitution",
            summary: "Express one variable in terms of the other and substitute into the second equation to solve algebraically.",
            keyConcepts: ["Substitution Technique", "Variable Isolation", "Exact Solutions", "System Validation"],
          },
          {
            title: "Solving Systems by Elimination",
            summary: "Multiply equations by constants to eliminate variables through addition or subtraction for rapid solutions.",
            keyConcepts: ["Elimination Method", "Opposite Coefficients", "Algebraic Reduction", "Consistency Checks"],
          },
          {
            title: "Real-Life Applications of Systems of Equations",
            summary: "Model break-even business points, mixture problems, and uniform motion systems in Philippine commerce.",
            keyConcepts: ["Mixture Scenarios", "Break-Even Analysis", "Speed & Current", "Economic Modeling"],
          },
          {
            title: "Conditional, Converse, Inverse, and Contrapositive Statements",
            summary: "Break down If-Then statements into hypothesis and conclusion. Construct valid converse, inverse, and contrapositive statements.",
            keyConcepts: ["Conditional Logic", "Hypothesis & Conclusion", "Converse & Inverse", "Contrapositive"],
          },
          {
            title: "Inductive and Deductive Reasoning",
            summary: "Distinguish between pattern-based inductive conjecture and proof-based deductive derivation in mathematics.",
            keyConcepts: ["Conjectures", "Deductive Proof", "Counterexamples", "Logical Syllogisms"],
          },
          {
            title: "Quarter 2 Proofs and Systems Synthesis",
            summary: "Combine deductive proof frameworks with systems of linear equations to solve multi-step mathematical problems.",
            keyConcepts: ["Two-Column Proofs", "Algebraic Proofs", "Quarter Synthesis", "Diagnostic Mastery"],
          },
        ]),
      },
      "Quarter 3": {
        description:
          "Grade 8 Mathematics Quarter 3 focuses on Triangle Congruence, Congruence Postulates, and Properties of Parallelograms.",
        competencies: [
          "Illustrate triangle congruence and corresponding parts of congruent triangles (CPCTC)",
          "Prove triangle congruence using SAS, ASA, SSS, and AAS postulates",
          "Apply congruence theorems to right triangles (Hy-Leg, Hy-Ang)",
          "Prove and apply properties of parallelograms, rectangles, rhombi, and squares",
        ],
        lessons: createSyllabus([
          {
            title: "Triangle Congruence and CPCTC",
            summary: "Identify corresponding sides and angles in congruent triangles and establish the CPCTC principle in proofs.",
            keyConcepts: ["Triangle Congruence", "CPCTC", "Corresponding Parts", "Rigid Transformations"],
          },
          {
            title: "The SAS and ASA Congruence Postulates",
            summary: "Formulate geometric proofs using Side-Angle-Side and Angle-Side-Angle postulates in structured two-column formats.",
            keyConcepts: ["SAS Postulate", "ASA Postulate", "Included Angle", "Included Side"],
          },
          {
            title: "The SSS and AAS Congruence Theorems",
            summary: "Prove congruence when all three sides or two angles and a non-included side are known.",
            keyConcepts: ["SSS Postulate", "AAS Theorem", "Geometric Rigor", "Auxiliary Lines"],
          },
          {
            title: "Right Triangle Congruence Theorems",
            summary: "Utilize Hypotenuse-Leg (HL), Leg-Leg (LL), and Hypotenuse-Angle (HA) theorems to streamline right triangle proofs.",
            keyConcepts: ["Hypotenuse-Leg", "Right Triangles", "Pythagorean Grounding", "Special Congruence"],
          },
          {
            title: "Isosceles and Equilateral Triangle Theorems",
            summary: "Prove that base angles of isosceles triangles are congruent and explore angle properties of equilateral triangles.",
            keyConcepts: ["Isosceles Triangles", "Base Angles Theorem", "Equilateral Triangles", "Perpendicular Bisectors"],
          },
          {
            title: "Properties of Parallelograms",
            summary: "Prove opposite sides and angles are congruent and diagonals bisect each other in generic parallelograms.",
            keyConcepts: ["Parallelogram Theorems", "Opposite Sides", "Consecutive Angles", "Diagonal Bisection"],
          },
          {
            title: "Special Parallelograms: Rectangles, Rhombi, Squares",
            summary: "Investigate perpendicular diagonals in rhombi, congruent diagonals in rectangles, and combined properties in squares.",
            keyConcepts: ["Rhombus", "Rectangle Diagonals", "Square Properties", "Classification Hierarchy"],
          },
          {
            title: "Quarter 3 Congruence and Quadrilateral Mastery",
            summary: "Synthesize congruence postulates and quadrilateral theorems in complex geometric deduction drills.",
            keyConcepts: ["Comprehensive Proofs", "Geometric Problem Solving", "Quarter Review", "Mastery Check"],
          },
        ]),
      },
      "Quarter 4": {
        description:
          "Grade 8 Mathematics Quarter 4 focuses on Inequalities in Triangles, Parallel and Perpendicular Lines, and Basic Probability.",
        competencies: [
          "Illustrate and prove theorems on triangle inequalities (Exterior Angle Inequality, Triangle Inequality Theorem)",
          "Apply the Hinge Theorem (SAS Inequality) and its converse to compare triangles",
          "Determine conditions that ensure two lines are parallel or perpendicular",
          "Calculate theoretical and experimental probability of simple and compound events",
        ],
        lessons: createSyllabus([
          {
            title: "Exterior Angle Inequality Theorem",
            summary: "Prove that the measure of an exterior angle of a triangle is greater than the measure of either remote interior angle.",
            keyConcepts: ["Exterior Angles", "Remote Interior Angles", "Inequality Theorems", "Angle Ordering"],
          },
          {
            title: "Triangle Inequality Theorem (Side-Side Relationships)",
            summary: "Establish that the sum of the lengths of any two sides of a triangle must be strictly greater than the third side.",
            keyConcepts: ["Triangle Inequality", "Valid Triangle Sides", "Range of Third Side", "Side Ordering"],
          },
          {
            title: "The Hinge Theorem and Its Converse",
            summary: "Compare third sides of two triangles with two congruent sides based on their included angles.",
            keyConcepts: ["Hinge Theorem", "SAS Inequality", "Converse of Hinge", "Dynamic Geometry"],
          },
          {
            title: "Proving Lines Parallel Using Angle Relationships",
            summary: "Demonstrate that lines are parallel if corresponding angles or alternate interior angles are congruent.",
            keyConcepts: ["Parallel Criteria", "Alternate Interior Converse", "Consecutive Angles", "Perpendicular Transversals"],
          },
          {
            title: "Basic Probability of Simple Events",
            summary: "Define sample spaces, outcomes, and compute theoretical probability P(E) = n(E) / n(S) for games of chance and rolling dice.",
            keyConcepts: ["Sample Space", "Favorable Outcomes", "Theoretical Probability", "Probability Scale 0 to 1"],
          },
          {
            title: "Experimental Probability vs. Theoretical Probability",
            summary: "Conduct empirical trials and observe the Law of Large Numbers as experimental results converge on theoretical values.",
            keyConcepts: ["Empirical Trials", "Relative Frequency", "Law of Large Numbers", "Simulation"],
          },
          {
            title: "Compound Events and Counting Principle",
            summary: "Use tree diagrams and the Fundamental Counting Principle to determine outcomes for combined events.",
            keyConcepts: ["Fundamental Counting Principle", "Tree Diagrams", "Independent Events", "Dependent Events"],
          },
          {
            title: "Quarter 4 Synthesis & Year-End Competency Review",
            summary: "Synthesize triangle inequalities, geometric properties, and probability theory in a comprehensive Grade 8 review.",
            keyConcepts: ["Geometry Synthesis", "Probability Analysis", "DepEd DO 015 Final Prep", "Diagnostic Exam"],
          },
        ]),
      },
    },
    "Grade 9": {
      "Quarter 1": {
        description:
          "Grade 9 Mathematics Quarter 1 focuses on Quadratic Equations, Quadratic Inequalities, and Quadratic Functions.",
        competencies: [
          "Solve quadratic equations by extracting square roots, factoring, completing the square, and using the quadratic formula",
          "Characterize roots of quadratic equations using the discriminant (b² - 4ac)",
          "Model real-life situations using quadratic functions and analyze their graphs (parabolas)",
          "Determine the vertex, axis of symmetry, domain, and range of quadratic functions",
        ],
        lessons: createSyllabus([
          {
            title: "Introduction to Quadratic Equations and Extracting Roots",
            summary: "Identify standard form ax² + bx + c = 0 and solve pure quadratic equations of the form x² = k by extracting square roots.",
            keyConcepts: ["Standard Quadratic Form", "Square Root Property", "Degree Two Equations", "Domain Constraints"],
          },
          {
            title: "Solving Quadratics by Factoring and Zero Product Property",
            summary: "Apply polynomial factoring to solve quadratic equations and verify roots through substitution.",
            keyConcepts: ["Zero Product Property", "Factoring Quadratics", "Extraneous Roots", "Multiple Roots"],
          },
          {
            title: "Completing the Square Method",
            summary: "Transform quadratic trinomials into perfect squares to solve equations with non-factorable real roots.",
            keyConcepts: ["Perfect Square Trinomial", "Completing the Square", "Algebraic Transformation", "Irrational Roots"],
          },
          {
            title: "The Quadratic Formula and the Discriminant",
            summary: "Derive and apply the quadratic formula. Use the discriminant b² - 4ac to characterize real, equal, unequal, or imaginary roots.",
            keyConcepts: ["Quadratic Formula", "Discriminant (b² - 4ac)", "Nature of Roots", "Imaginary Numbers"],
          },
          {
            title: "Sum and Product of Roots & Equation Construction",
            summary: "Calculate sum (-b/a) and product (c/a) of roots and construct quadratic equations from given roots or solutions.",
            keyConcepts: ["Sum of Roots (-b/a)", "Product of Roots (c/a)", "Reverse Engineering", "Root Symmetry"],
          },
          {
            title: "Quadratic Inequalities in One and Two Variables",
            summary: "Solve quadratic inequalities using sign charts, test intervals, and shade parabolic solution regions on the plane.",
            keyConcepts: ["Sign Analysis", "Critical Values", "Interval Notation", "Parabolic Shading"],
          },
          {
            title: "Graphs of Quadratic Functions: Vertex and Axis of Symmetry",
            summary: "Graph parabolas of the form y = a(x - h)² + k. Determine vertex, axis of symmetry, opening direction, domain, and range.",
            keyConcepts: ["Vertex (h, k)", "Axis of Symmetry", "Standard to Vertex Form", "Parabola Graphing"],
          },
          {
            title: "Real-World Trajectory and Optimization Problems",
            summary: "Model projectile trajectories, maximum revenue, and minimum cost scenarios using quadratic vertex optimization.",
            keyConcepts: ["Projectile Motion", "Maximum/Minimum Values", "Economic Optimization", "Quarter Review"],
          },
        ]),
      },
      "Quarter 2": {
        description:
          "Grade 9 Mathematics Quarter 2 covers Variations (Direct, Inverse, Joint, Combined), Zero and Negative Exponents, and Radical Expressions.",
        competencies: [
          "Illustrate situations that involve direct, inverse, joint, and combined variation",
          "Translate relation statements into variation equations and solve for constants of variation",
          "Apply laws of exponents to simplify expressions with zero, negative, and rational exponents",
          "Perform operations on radical expressions and solve radical equations",
        ],
        lessons: createSyllabus([
          {
            title: "Direct and Inverse Variation",
            summary: "Differentiate direct variation (y = kx) from inverse variation (y = k/x) and calculate the constant of variation k.",
            keyConcepts: ["Direct Variation", "Inverse Variation", "Constant of Variation", "Proportionality Graphs"],
          },
          {
            title: "Joint and Combined Variation",
            summary: "Model complex real-life relationships involving multiple interacting variables in joint and combined variation systems.",
            keyConcepts: ["Joint Variation", "Combined Variation", "Physics Applications", "Multi-Variable Systems"],
          },
          {
            title: "Integral Exponents: Zero and Negative Powers",
            summary: "Extend laws of exponents to include zero exponents (a⁰ = 1) and negative exponents (a⁻ⁿ = 1/aⁿ) for non-zero bases.",
            keyConcepts: ["Zero Exponent Rule", "Negative Exponents", "Fractional Reciprocals", "Power Simplification"],
          },
          {
            title: "Rational Exponents and Radicals Conversion",
            summary: "Translate between fractional exponents (a^(m/n)) and radical form (ⁿ√(a^m)) and evaluate principal values.",
            keyConcepts: ["Rational Exponents", "Radical Sign", "Index and Radicand", "Exponential Equivalence"],
          },
          {
            title: "Simplifying Radical Expressions",
            summary: "Remove perfect nth powers from radicands, rationalize denominators, and simplify radical fractions.",
            keyConcepts: ["Simplest Radical Form", "Rationalizing Denominators", "Conjugate Surds", "Index Reduction"],
          },
          {
            title: "Operations on Radicals: Addition and Subtraction",
            summary: "Identify like radicals with matching index and radicand to execute addition and subtraction operations.",
            keyConcepts: ["Like Radicals", "Radical Addition", "Radical Subtraction", "Distributive Property"],
          },
          {
            title: "Multiplication, Division, and Conjugate Rationalization",
            summary: "Multiply and divide radical expressions and rationalize binomial radical denominators using algebraic conjugates.",
            keyConcepts: ["Radical Products", "Quotient of Radicals", "Binomial Conjugates", "Rationalization"],
          },
          {
            title: "Solving Radical Equations & Extraneous Roots",
            summary: "Solve equations with variables under radical signs and rigorously test for extraneous roots created by squaring.",
            keyConcepts: ["Radical Equations", "Squaring Both Sides", "Extraneous Roots", "Quarter Review"],
          },
        ]),
      },
      "Quarter 3": {
        description:
          "Grade 9 Mathematics Quarter 3 focuses on Quadrilaterals, Parallelograms, Trapezoids, Kites, and Triangle Similarity.",
        competencies: [
          "Identify and prove properties of trapezoids and kites",
          "Solve problems involving proportions and apply the Fundamental Theorem of Proportionality",
          "Prove triangle similarity using AA, SAS, and SSS similarity theorems",
          "Apply the Pythagorean Theorem and Special Right Triangle ratios (45-45-90, 30-60-90) to solve real-world problems",
        ],
        lessons: createSyllabus([
          {
            title: "Properties of Trapezoids and Midsegment Theorem",
            summary: "Explore isosceles trapezoids and prove the Midsegment Theorem: median length equals half the sum of the bases.",
            keyConcepts: ["Trapezoid Midsegment", "Isosceles Trapezoid", "Base Angles", "Parallel Bases"],
          },
          {
            title: "Properties of Kites",
            summary: "Analyze kites with perpendicular diagonals, one bisected diagonal, and calculate kite area as half the diagonal product.",
            keyConcepts: ["Kite Properties", "Perpendicular Diagonals", "Kite Area Formula", "Geometric Deduction"],
          },
          {
            title: "Proportions and the Triangle Proportionality Theorem",
            summary: "Solve geometric proportions and prove that a line parallel to one side of a triangle divides the other two proportionally.",
            keyConcepts: ["Geometric Proportion", "Triangle Proportionality", "Parallel Transversals", "Scale Factors"],
          },
          {
            title: "Triangle Similarity: AA, SAS, and SSS Theorems",
            summary: "Differentiate congruence from similarity. Prove triangle similarity using Angle-Angle, SAS, and SSS similarity postulates.",
            keyConcepts: ["Similarity Postulates", "AA Similarity", "SAS Similarity", "Proportional Sides"],
          },
          {
            title: "Right Triangle Similarity & Geometric Mean",
            summary: "Prove that the altitude to the hypotenuse of a right triangle forms two smaller triangles similar to each other and the original.",
            keyConcepts: ["Altitude to Hypotenuse", "Geometric Mean", "Altitude Theorem", "Leg Theorem"],
          },
          {
            title: "The Pythagorean Theorem and Its Proofs",
            summary: "Derive the Pythagorean Theorem a² + b² = c² geometrically and algebraically and verify Pythagorean triples.",
            keyConcepts: ["Pythagorean Theorem", "Pythagorean Triples", "Hypotenuse Calculation", "Distance in 2D"],
          },
          {
            title: "Special Right Triangles: 45°-45°-90° and 30°-60°-90°",
            summary: "Derive and apply fixed side ratios for isosceles right triangles and half-equilateral right triangles.",
            keyConcepts: ["45-45-90 Ratios (1:1:√2)", "30-60-90 Ratios (1:√3:2)", "Exact Radical Values", "Trigonometric Prep"],
          },
          {
            title: "Quarter 3 Similarity and Metric Geometry Synthesis",
            summary: "Apply similarity theorems, right triangle metrics, and proportions to solve indirect surveying measurement problems.",
            keyConcepts: ["Indirect Measurement", "Shadow Reckoning", "Quarter Review", "Mastery Assessment"],
          },
        ]),
      },
      "Quarter 4": {
        description:
          "Grade 9 Mathematics Quarter 4 focuses on Trigonometry, Trigonometric Ratios, Angles of Elevation and Depression, and Laws of Sines and Cosines.",
        competencies: [
          "Illustrate the six trigonometric ratios: sine, cosine, tangent, secant, cosecant, and cotangent",
          "Find trigonometric ratios of special angles (30°, 45°, 60°) without a calculator",
          "Solve problems involving angles of elevation and angles of depression",
          "Apply the Law of Sines and Law of Cosines to solve oblique triangles",
        ],
        lessons: createSyllabus([
          {
            title: "The Six Trigonometric Ratios: SOH-CAH-TOA",
            summary: "Define sine, cosine, and tangent in right triangles along with reciprocal functions cosecant, secant, and cotangent.",
            keyConcepts: ["SOH CAH TOA", "Reciprocal Ratios", "Adjacent & Opposite", "Hypotenuse"],
          },
          {
            title: "Trigonometric Ratios of Special Angles",
            summary: "Compute exact radical trigonometric values for 30°, 45°, and 60° angles using unit special triangles.",
            keyConcepts: ["Special Angles", "Exact Values", "Unit Triangle Ratios", "Radical Values"],
          },
          {
            title: "Solving Right Triangles",
            summary: "Calculate missing sides and angles of right triangles given one side and one acute angle or two sides.",
            keyConcepts: ["Inverse Trig Functions", "Missing Angle Solution", "Missing Side Solution", "Triangle Completion"],
          },
          {
            title: "Angles of Elevation and Depression",
            summary: "Distinguish line of sight, horizontal reference lines, angles of elevation, and angles of depression in real surveying.",
            keyConcepts: ["Line of Sight", "Angle of Elevation", "Angle of Depression", "Surveying Applications"],
          },
          {
            title: "The Law of Sines for Oblique Triangles",
            summary: "Derive and apply the Law of Sines (a/sin A = b/sin B = c/sin C) for AAS, ASA, and ambiguous SSA triangle scenarios.",
            keyConcepts: ["Law of Sines", "Oblique Triangles", "AAS & ASA", "Ambiguous Case"],
          },
          {
            title: "The Law of Cosines for Oblique Triangles",
            summary: "Derive and apply the Law of Cosines (c² = a² + b² - 2ab cos C) to solve SAS and SSS oblique triangle configurations.",
            keyConcepts: ["Law of Cosines", "SAS Oblique Triangles", "SSS Triangles", "Generalized Pythagoras"],
          },
          {
            title: "Area of Oblique Triangles: SAS Formula and Heron's Formula",
            summary: "Calculate triangle areas using Area = 1/2 ab sin C and Heron's formula based on semi-perimeter s.",
            keyConcepts: ["Trigonometric Area", "Heron's Formula", "Semi-Perimeter", "Land Survey Area"],
          },
          {
            title: "Quarter 4 Capstone: Navigation & DepEd MATATAG Review",
            summary: "Synthesize trigonometry, surveying navigation, and algebra in a comprehensive Grade 9 exit examination.",
            keyConcepts: ["Navigation Problems", "Bearings", "Comprehensive Trig Synthesis", "Grade 9 Review"],
          },
        ]),
      },
    },
    "Grade 10": {
      "Quarter 1": {
        description:
          "Grade 10 Mathematics Quarter 1 focuses on Sequences (Arithmetic, Geometric, Harmonic, Fibonacci), Polynomial Functions, and Remainder/Factor Theorems.",
        competencies: [
          "Generate patterns and find the nth term of arithmetic and geometric sequences",
          "Determine arithmetic and geometric means and the sum of sequence terms",
          "Apply the Remainder Theorem, Factor Theorem, and Rational Root Theorem",
          "Graph polynomial functions and analyze intercepts, turning points, and end behavior",
        ],
        lessons: createSyllabus([
          {
            title: "Arithmetic Sequences and the nth Term Formula",
            summary: "Identify constant common differences (d) and derive the general nth term formula an = a1 + (n - 1)d.",
            keyConcepts: ["Arithmetic Sequence", "Common Difference (d)", "nth Term Formula", "Discrete Patterns"],
          },
          {
            title: "Arithmetic Means and Arithmetic Series",
            summary: "Insert arithmetic means between two terms and compute the sum of finite arithmetic series using Sn = n/2(a1 + an).",
            keyConcepts: ["Arithmetic Means", "Arithmetic Series", "Gauss Summation", "Linear Growth"],
          },
          {
            title: "Geometric Sequences and Geometric Series",
            summary: "Determine common ratios (r), calculate the nth term an = a1 r^(n-1), and compute finite and infinite geometric series.",
            keyConcepts: ["Common Ratio (r)", "Geometric Series", "Infinite Geometric Series (|r| < 1)", "Exponential Growth"],
          },
          {
            title: "Harmonic, Fibonacci, and Special Sequences",
            summary: "Examine harmonic sequences as reciprocals of arithmetic terms and explore natural patterns in the Fibonacci sequence.",
            keyConcepts: ["Harmonic Sequence", "Fibonacci Numbers", "Golden Ratio", "Recursive Sequences"],
          },
          {
            title: "Polynomial Division: Long Division and Synthetic Division",
            summary: "Divide polynomials by linear divisors using long division and synthetic division algorithms.",
            keyConcepts: ["Polynomial Long Division", "Synthetic Division", "Quotient & Remainder", "Depressed Equations"],
          },
          {
            title: "Remainder Theorem, Factor Theorem, and Rational Root Theorem",
            summary: "Evaluate P(c) using the Remainder Theorem and find rational roots using the Rational Root Theorem (p/q).",
            keyConcepts: ["Remainder Theorem", "Factor Theorem", "Rational Root Theorem", "Root Factoring"],
          },
          {
            title: "Graphs of Polynomial Functions and End Behavior",
            summary: "Analyze polynomial graphs using leading coefficients, degree parity, x-intercepts, and multiplicity of roots.",
            keyConcepts: ["Polynomial Functions", "Leading Coefficient Test", "Multiplicity of Roots", "Turning Points"],
          },
          {
            title: "Quarter 1 Sequences and Polynomials Capstone",
            summary: "Model financial compound growth and biological population dynamics using sequences and higher-degree polynomials.",
            keyConcepts: ["Financial Modeling", "Population Curves", "Quarter Review", "Comprehensive Assessment"],
          },
        ]),
      },
      "Quarter 2": {
        description:
          "Grade 10 Mathematics Quarter 2 covers Circles (Chords, Arcs, Central and Inscribed Angles, Tangents, Secants) and Coordinate Geometry.",
        competencies: [
          "Derive relationships among chords, arcs, central angles, and inscribed angles",
          "Prove theorems on secants, tangents, and segments of circles",
          "Apply the distance formula, midpoint formula, and coordinate proofs",
          "Determine the center, radius, and standard equation of a circle",
        ],
        lessons: createSyllabus([
          {
            title: "Circles: Chords, Arcs, and Central Angles",
            summary: "Investigate circle definitions, congruence of arcs, and prove that central angles equal their intercepted arcs in degrees.",
            keyConcepts: ["Central Angles", "Arc Measure", "Major & Minor Arcs", "Chord Properties"],
          },
          {
            title: "Inscribed Angles and Intercepted Arcs",
            summary: "Prove that the measure of an inscribed angle is half the measure of its intercepted arc and angles inscribed in semicircles are right angles.",
            keyConcepts: ["Inscribed Angle Theorem", "Semicircle Angle", "Intercepted Arcs", "Cyclic Quadrilaterals"],
          },
          {
            title: "Tangents and Secants to a Circle",
            summary: "Examine tangent lines perpendicular to radius lines and establish tangent segment equality from external points.",
            keyConcepts: ["Tangent Line", "Secant Line", "Radius Perpendicularity", "Point of Tangency"],
          },
          {
            title: "Angle Theorems for Secants and Tangents",
            summary: "Calculate angle measures formed by intersecting chords, secants, and tangents inside and outside circles.",
            keyConcepts: ["Interior Angle Sum", "Exterior Secant Angle", "Intersecting Chords", "Angle Calculations"],
          },
          {
            title: "Segment Theorems: Chords, Secants, and Tangents",
            summary: "Prove and apply Power of a Point theorems: chord segments products and tangent-secant segment relationships.",
            keyConcepts: ["Power of a Point", "Intersecting Chords Theorem", "Secant Segment Theorem", "Tangent-Secant Theorem"],
          },
          {
            title: "The Distance Formula, Midpoint, and Coordinate Proofs",
            summary: "Apply distance and midpoint formulas on the coordinate plane to prove geometric properties of polygons algebraically.",
            keyConcepts: ["Distance Formula", "Midpoint Formula", "Coordinate Proofs", "Algebraic Verification"],
          },
          {
            title: "The Equation of a Circle: Standard and General Form",
            summary: "Derive the standard equation (x - h)² + (y - k)² = r² and convert to general form x² + y² + Dx + Ey + F = 0 by completing squares.",
            keyConcepts: ["Center-Radius Form", "General Circle Equation", "Completing the Square", "Circle Graphing"],
          },
          {
            title: "Quarter 2 Circle Geometry and Coordinate Systems Synthesis",
            summary: "Solve radar, satellite epicenter, and circular architectural design problems using circle equations and theorems.",
            keyConcepts: ["Earthquake Epicenters", "Radar Coverage", "Quarter Synthesis", "Mastery Assessment"],
          },
        ]),
      },
      "Quarter 3": {
        description:
          "Grade 10 Mathematics Quarter 3 focuses on Permutations, Combinations, and Probability of Compound Events.",
        competencies: [
          "Illustrate permutations and combinations of objects",
          "Differentiate permutations from combinations in diverse contextual problems",
          "Calculate probabilities of mutually exclusive, inclusive, and independent events",
          "Apply counting techniques and probability to real-world decision making",
        ],
        lessons: createSyllabus([
          {
            title: "Permutations of Distinct Objects",
            summary: "Define linear permutations where order matters and compute P(n, r) = n! / (n - r)! using factorial notation.",
            keyConcepts: ["Permutation P(n,r)", "Factorial Notation", "Order Matters", "Arrangements"],
          },
          {
            title: "Circular Permutations and Permutations with Repetition",
            summary: "Calculate arrangements of objects in a circle ((n - 1)!) and permutations where identical items repeat.",
            keyConcepts: ["Circular Permutations", "Distinguishable Permutations", "Repeated Items", "Seating Problems"],
          },
          {
            title: "Combinations of n Objects Taken r at a Time",
            summary: "Define combinations where order does not matter and compute C(n, r) = n! / [r!(n - r)!].",
            keyConcepts: ["Combination C(n,r)", "Order Does Not Matter", "Selection Logic", "Committee Formation"],
          },
          {
            title: "Differentiating Permutations vs. Combinations",
            summary: "Analyze scenarios to categorize whether arrangement order is significant before selecting mathematical formulas.",
            keyConcepts: ["Decision Matrix", "Selection vs Arrangement", "Contextual Categorization", "Problem Modeling"],
          },
          {
            title: "Probability of Mutually Exclusive and Inclusive Events",
            summary: "Apply addition rules of probability P(A ∪ B) for mutually exclusive (disjoint) and overlapping (inclusive) events.",
            keyConcepts: ["Mutually Exclusive", "Inclusive Events", "Addition Rule", "Venn Diagram Probability"],
          },
          {
            title: "Independent and Dependent Events: Multiplication Rule",
            summary: "Calculate probability of sequential events with and without replacement using multiplication principles.",
            keyConcepts: ["Independent Events", "Dependent Events", "Multiplication Rule", "Conditional Probability Intro"],
          },
          {
            title: "Probability Trees and Real-World Risk Analysis",
            summary: "Construct multi-stage probability trees to evaluate medical diagnostic tests and quality control lot sampling.",
            keyConcepts: ["Probability Trees", "Risk Evaluation", "Quality Control", "Lot Testing"],
          },
          {
            title: "Quarter 3 Counting & Probability Synthesis",
            summary: "Solve integrated combinatorics and probability challenges reflecting Philippine educational and gaming scenarios.",
            keyConcepts: ["Combinatorics Synthesis", "Compound Probability", "Quarter Review", "Mastery Drill"],
          },
        ]),
      },
      "Quarter 4": {
        description:
          "Grade 10 Mathematics Quarter 4 focuses on Measures of Position: Quartiles, Deciles, Percentiles, and Box-and-Whisker Plots.",
        competencies: [
          "Illustrate the following measures of position: quartiles, deciles, and percentiles",
          "Calculate specified measures of position of a set of data (ungrouped and grouped)",
          "Interpret measures of position and draw box-and-whisker plots",
          "Conduct statistical mini-research and formulate decisions based on data",
        ],
        lessons: createSyllabus([
          {
            title: "Measures of Position for Ungrouped Data: Quartiles",
            summary: "Divide ranked datasets into four equal parts: Q1 (lower quartile), Q2 (median), and Q3 (upper quartile).",
            keyConcepts: ["Quartiles (Q1, Q2, Q3)", "Ranked Data", "Mendenhall & Sincich", "Interpolation"],
          },
          {
            title: "Deciles and Percentiles for Ungrouped Data",
            summary: "Compute deciles (D1 through D9) and percentiles (P1 through P99) to evaluate standardized test rankings like the NAT.",
            keyConcepts: ["Deciles", "Percentiles", "National Achievement Test (NAT)", "Rank Equivalents"],
          },
          {
            title: "The Interquartile Range and Box-and-Whisker Plots",
            summary: "Calculate IQR = Q3 - Q1, identify statistical outliers using 1.5 × IQR fences, and construct 5-number summary boxplots.",
            keyConcepts: ["Interquartile Range (IQR)", "Five-Number Summary", "Box-and-Whisker Plot", "Outlier Fences"],
          },
          {
            title: "Measures of Position for Grouped Data: Quartiles",
            summary: "Determine quartile classes and apply the grouped quartile formula with cumulative frequencies and class boundaries.",
            keyConcepts: ["Grouped Quartiles", "Cumulative Frequency Table", "Lower Class Boundary", "Class Width"],
          },
          {
            title: "Measures of Position for Grouped Data: Deciles & Percentiles",
            summary: "Calculate grouped deciles and percentiles to analyze income distributions and DepEd scholastic performance bands.",
            keyConcepts: ["Grouped Deciles", "Grouped Percentiles", "Income Distribution", "Scholastic Bands"],
          },
          {
            title: "Interpreting Measures of Position in Practical Contexts",
            summary: "Differentiate percentage scores from percentile ranks and explain what scoring in the 90th percentile truly means.",
            keyConcepts: ["Percentile Rank vs Percentage", "Norm-Referenced Scoring", "Educational Interpretation", "Data Literacy"],
          },
          {
            title: "Mini-Research: Formulating Data-Driven Conclusions",
            summary: "Formulate research hypotheses, gather real student survey data, compute position measures, and present conclusions.",
            keyConcepts: ["Statistical Mini-Research", "Hypothesis Verification", "Data Presentation", "Evidence-Based Decisions"],
          },
          {
            title: "Grade 10 Mathematics Capstone & Exit Assessment",
            summary: "Comprehensive four-quarter DepEd DO 015 review synthesizing sequences, circle geometry, combinatorics, and statistics.",
            keyConcepts: ["Year-End Capstone", "DO 015 Senior High Readiness", "Comprehensive Evaluation", "Mastery Achievement"],
          },
        ]),
      },
    },
  },
};

// =============================================================================
// GENERIC FALLBACK FOR REMAINING JHS SUBJECTS (SCI, ENG, FIL, AP, ESP, MAPEH, TLE)
// =============================================================================

const JHS_SUBJECT_THEMES: Record<
  string,
  {
    name: string;
    quarters: [string, string, string, string];
    skills: string[];
  }
> = {
  SCI: {
    name: "Science",
    quarters: [
      "Matter and Its Interactions (Chemistry)",
      "Living Things and Their Environment (Biology)",
      "Forces, Motion, and Energy (Physics)",
      "Earth and Space Systems (Geology & Astronomy)",
    ],
    skills: ["Scientific Method", "Empirical Observation", "Data Gathering", "Laboratory Safety"],
  },
  ENG: {
    name: "English",
    quarters: [
      "Informative Texts & Communicative Styles",
      "Persuasive Writing & Critical Reading",
      "Literary Analysis & World Literature",
      "Academic Essays & Research Syntheses",
    ],
    skills: ["Reading Comprehension", "Oral Fluency", "Grammar & Syntax", "Critical Literacy"],
  },
  FIL: {
    name: "Filipino",
    quarters: [
      "Mga Akdang Pampanitikan at Gramatika",
      "Sanaysay, Talumpati, at Pagsusuring Pampanitikan",
      "Kulturang Popular at Kontemporaryong Midya",
      "Pananaliksik at Obra Maestrang Pilipino",
    ],
    skills: ["Mapanuring Pagbasa", "Wastong Balarila", "Pagsulat ng Sanaysay", "Kulturang Pilipino"],
  },
  AP: {
    name: "Araling Panlipunan",
    quarters: [
      "Heograpiya at Sinaunang Kabihasnan",
      "Ekonomiks at Pambansang Kaunlaran",
      "Kasaysayan at Pamahalaan ng Pilipinas",
      "Kontemporaryong Isyu at Pandaigdigang Ugnayan",
    ],
    skills: ["Historikal na Pagsusuri", "Kamalayang Sibiko", "Pang-ekonomiyang Pagpapasya", "Katarungang Panlipunan"],
  },
  ESP: {
    name: "Edukasyon sa Pagpapakatao",
    quarters: [
      "Paghubog ng Sariling Pagkatao at Konsensiya",
      "Pakikipagkapwa at Pamilyang Pilipino",
      "Katarungang Panlipunan at Moral na Pagpapasiya",
      "Buhay, Pananampalataya, at Paglilingkod",
    ],
    skills: ["Moral na Pagpapasya", "Etikal na Pagkilos", "Empatiya", "Pagpapahalaga sa Buhay"],
  },
  MAPEH: {
    name: "Music, Arts, Physical Education, and Health",
    quarters: [
      "Traditional Southeast Asian & Philippine Arts",
      "Afro-Latin & Asian Musical Heritage",
      "Physical Fitness, Team Sports, and Rhythmic Dance",
      "Community, Environmental, and Consumer Health",
    ],
    skills: ["Musical Expression", "Visual Creativity", "Active Lifestyles", "Health Advocacy"],
  },
  TLE: {
    name: "Technology and Livelihood Education",
    quarters: [
      "Occupational Health & Safety and Tool Maintenance",
      "Technical Drafting and Mensuration Fundamentals",
      "Core Sector Specialization Modules (AFA, IA, HE, ICT)",
      "Entrepreneurship, Costing, and Project Fabrication",
    ],
    skills: ["Tool Competence", "Safety Compliance", "Drafting & Schematics", "Entrepreneurial Mindset"],
  },
};

/**
 * Resolves or synthesizes the JhsGradeQuarterScope for any JHS Core subject.
 */
export function getJhsGradeQuarterScope(
  abbr: string,
  grade: "Grade 7" | "Grade 8" | "Grade 9" | "Grade 10",
  quarter: "Quarter 1" | "Quarter 2" | "Quarter 3" | "Quarter 4"
): JhsGradeQuarterScope {
  const upperAbbr = abbr.toUpperCase();
  const gradeMatch = grade.match(/\d+/);
  const gNum = gradeMatch ? gradeMatch[0] : "7";
  const qMatch = quarter.match(/\d+/);
  const qNum = qMatch ? qMatch[0] : "1";
  const slug = `g${gNum}-q${qNum}-${upperAbbr.toLowerCase()}`;

  // Check custom database for MATH
  if (JHS_QUARTER_SCOPE_DATA[upperAbbr]?.[grade]?.[quarter]) {
    const data = JHS_QUARTER_SCOPE_DATA[upperAbbr][grade][quarter];
    return {
      grade,
      quarter,
      slug,
      description: data.description,
      competencies: data.competencies,
      lessons: data.lessons,
    };
  }

  // Synthesize rich syllabus for other JHS subjects (SCI, ENG, FIL, AP, ESP, MAPEH, TLE)
  const theme = JHS_SUBJECT_THEMES[upperAbbr] || {
    name: upperAbbr,
    quarters: [
      "Foundational Principles and Terminology",
      "Analytical Methods and Applications",
      "Advanced Problem Solving & Synthesis",
      "Real-World Projects & Performance Assessments",
    ],
    skills: ["Critical Inquiry", "Analytical Writing", "Practical Execution", "Ethics"],
  };

  const quarterIndex = parseInt(qNum, 10) - 1;
  const quarterTheme = theme.quarters[quarterIndex] || theme.quarters[0];

  const lessons = createSyllabus([
    {
      title: `Lesson 1: Introduction to ${quarterTheme}`,
      summary: `Examine the foundational definitions, historical background, and fundamental DepEd MATATAG principles of ${quarterTheme} in ${grade}.`,
      keyConcepts: [theme.skills[0], "Core Foundations", "Terminology", "Learning Goals"],
    },
    {
      title: `Lesson 2: Principles and Frameworks of ${theme.name}`,
      summary: `Analyze systematic methodologies, diagnostic criteria, and standard processes used in ${quarterTheme}.`,
      keyConcepts: [theme.skills[1], "Systematic Frameworks", "Methodologies", "Evaluation"],
    },
    {
      title: `Lesson 3: Core Competency Analysis & Hands-on Inquiry`,
      summary: `Engage with guided exercises, source materials, and interactive simulations exploring real-world dynamics of ${quarterTheme}.`,
      keyConcepts: ["Guided Practice", "Inquiry-Based Learning", "Analytical Skills", "Case Study"],
    },
    {
      title: `Lesson 4: Intermediate Problem-Solving & Case Studies`,
      summary: `Apply analytical models and conceptual tools to resolve common practical scenarios and challenges in Philippine communities.`,
      keyConcepts: ["Problem Solving", "Community Context", "Real-World Scenarios", "Scenario Analysis"],
    },
    {
      title: `Lesson 5: Collaborative Applications and Practical Execution`,
      summary: `Develop collaborative workflows, investigative write-ups, or technical drafts reflecting DepEd performance task rubrics.`,
      keyConcepts: [theme.skills[2], "Performance Tasks", "Rubrics Compliance", "Practical Execution"],
    },
    {
      title: `Lesson 6: Critical Evaluation, Ethics, and Society`,
      summary: `Reflect on ethical considerations, community impact, cultural relevance, and sustainable practices related to this unit.`,
      keyConcepts: [theme.skills[3], "Ethical Standards", "Cultural Relevance", "Social Impact"],
    },
    {
      title: `Lesson 7: Advanced Synthesis and Integrated Drills`,
      summary: `Connect topics across prior lessons to synthesize comprehensive solutions and practice Socratic AI guided drills.`,
      keyConcepts: ["Curriculum Synthesis", "Socratic Drills", "Multi-Concept Review", "Exam Prep"],
    },
    {
      title: `Lesson 8: ${quarter} Mastery, Performance Tasks & DO 015 Evaluation`,
      summary: `Execute the summative assessment and performance task review aligned with the DepEd DO 015 75% passing threshold.`,
      keyConcepts: ["Summative Assessment", "Transmuted Grade Prep", "MATATAG Evaluation", "Unit Mastery"],
    },
  ]);

  return {
    grade,
    quarter,
    slug,
    description: `${theme.name} for ${grade} (${quarter}) centers on ${quarterTheme}, delivering 8 sequential MATATAG lessons with 24 Socratic practice drills.`,
    competencies: [
      `Demonstrate mastery of core concepts in ${quarterTheme}`,
      `Apply critical thinking, investigation, and analytical tools in real-world scenarios`,
      `Complete collaborative and independent performance tasks adhering to DepEd standards`,
      `Pass standardized quarterly assessments reflecting the official 75% transmutation scale`,
    ],
    lessons,
  };
}

// =============================================================================
// SHS & GENERAL SUBJECT 8-LESSON SYLLABUS GENERATOR
// =============================================================================

export function getSubjectLessons(
  subjectCodeOrAbbr: string,
  subjectName: string,
  competencies: string[],
  description?: string
): SubjectScopeLesson[] {
  const cleanCode = subjectCodeOrAbbr.toUpperCase();

  // If specific high-value SHS subject, provide custom handcrafted 8-lesson curriculum
  if (cleanCode.includes("GENMATH")) {
    return createSyllabus([
      {
        title: "Functions, Piecewise Functions, and Real-World Modeling",
        summary: "Represent real-life situations using functions, including piecewise functions. Evaluate functions and solve operational problems.",
        keyConcepts: ["Piecewise Functions", "Function Notation", "Real-World Modeling", "Domain & Range"],
      },
      {
        title: "Rational Functions, Equations, and Inequalities",
        summary: "Distinguish between rational functions, equations, and inequalities. Solve rational equations using common denominators.",
        keyConcepts: ["Rational Equations", "Extraneous Roots", "Domain Restrictions", "LCD Technique"],
      },
      {
        title: "Graphing Rational Functions: Asymptotes and Intercepts",
        summary: "Determine vertical and horizontal asymptotes, holes, and x- and y-intercepts to sketch rational function curves accurately.",
        keyConcepts: ["Vertical Asymptotes", "Horizontal Asymptotes", "Holes in Graphs", "Intercepts"],
      },
      {
        title: "Inverse Functions and One-to-One Relationships",
        summary: "Verify one-to-one functions using the horizontal line test. Determine inverse functions algebraically and graph reflection symmetry across y = x.",
        keyConcepts: ["One-to-One Functions", "Horizontal Line Test", "Inverse Functions", "Line of Symmetry y=x"],
      },
      {
        title: "Exponential Functions, Equations, and Growth/Decay",
        summary: "Model exponential growth, radioactive decay, and compound interest. Solve exponential equations using like bases and graphing.",
        keyConcepts: ["Exponential Growth", "Half-Life Decay", "Compound Interest", "Exponential Equations"],
      },
      {
        title: "Logarithmic Functions, Properties, and Laws",
        summary: "Express exponential equations in logarithmic form and vice versa. Apply laws of logarithms to expand and condense logarithmic expressions.",
        keyConcepts: ["Logarithmic Laws", "Natural Logarithm", "Change of Base", "Logarithmic Graphs"],
      },
      {
        title: "Simple and Compound Interest & Annuities",
        summary: "Calculate ordinary and exact simple interest, compound interest, maturity values, and ordinary annuities in Philippine banking.",
        keyConcepts: ["Simple Interest (I=Prt)", "Compound Maturity", "Ordinary Annuities", "Present Value"],
      },
      {
        title: "Business Loans, Mortgages, and Logic Proposition Truth Tables",
        summary: "Examine amortization schedules, consumer loans, and evaluate compound logical propositions using formal truth tables.",
        keyConcepts: ["Amortization", "Mortgage Basics", "Truth Tables", "Tautologies & Fallacies"],
      },
    ]);
  }

  if (cleanCode.includes("PRECALC")) {
    return createSyllabus([
      {
        title: "Conic Sections: Circles and Parabolas",
        summary: "Derive standard equations of circles and parabolas. Determine vertex, focus, directrix, and axis of symmetry.",
        keyConcepts: ["Conic Sections", "Standard Circle", "Parabola Focus & Directrix", "Axis of Symmetry"],
      },
      {
        title: "Conic Sections: Ellipses and Hyperbolas",
        summary: "Graph horizontal and vertical ellipses and hyperbolas. Find foci, vertices, co-vertices, and asymptotes.",
        keyConcepts: ["Ellipses", "Hyperbolas", "Eccentricity", "Asymptotes"],
      },
      {
        title: "Systems of Non-Linear Equations",
        summary: "Solve systems of quadratic and linear equations in two variables algebraically and interpret intersections graphically.",
        keyConcepts: ["Non-Linear Systems", "Substitution Method", "Intersection Points", "Graphical Solutions"],
      },
      {
        title: "Series and Mathematical Induction",
        summary: "Apply sigma notation and prove mathematical statements for all positive integers using the Principle of Mathematical Induction.",
        keyConcepts: ["Sigma Notation", "Mathematical Induction", "Base Step & Inductive Step", "Summation Rules"],
      },
      {
        title: "The Binomial Theorem and Pascal's Triangle",
        summary: "Expand binomials of the form (a + b)ⁿ using Pascal's triangle and binomial coefficients nCr.",
        keyConcepts: ["Binomial Theorem", "Pascal's Triangle", "Combination Notation", "General Term"],
      },
      {
        title: "Trigonometric Functions on the Unit Circle",
        summary: "Define circular functions in standard position on the unit circle using radian measure and determine exact reference angle values.",
        keyConcepts: ["Unit Circle", "Radian Measure", "Circular Functions", "Reference Angles"],
      },
      {
        title: "Trigonometric Identities: Pythagorean, Sum, and Difference",
        summary: "Prove fundamental trigonometric identities and apply sum and difference formulas for sine, cosine, and tangent.",
        keyConcepts: ["Pythagorean Identities", "Sum & Difference Formulas", "Double-Angle Formulas", "Verifying Identities"],
      },
      {
        title: "Inverse Trigonometric Functions and Polar Coordinates",
        summary: "Evaluate inverse trigonometric functions and represent coordinates in the polar coordinate system (r, θ).",
        keyConcepts: ["Arcsine & Arccosine", "Domain Restrictions", "Polar Coordinates", "Rectangular-Polar Conversion"],
      },
    ]);
  }

  // Deterministic, domain-accurate 8-lesson curriculum for any other subject based on competencies and title
  const comp1 = competencies[0] || `Foundations and Principles of ${subjectName}`;
  const comp2 = competencies[1] || `Applied Methodologies and Analysis in ${subjectName}`;
  const comp3 = competencies[2] || `Advanced Real-World Problem Solving in ${subjectName}`;
  const comp4 = competencies[3] || `Industry Applications, Performance, and Standardized Evaluation in ${subjectName}`;

  return createSyllabus([
    {
      title: `Lesson 1: Foundations, Scope, and Principles of ${subjectName}`,
      summary: description ? `${description.slice(0, 160)}.` : `Understand introductory principles, official terminology, and the DepEd MATATAG curriculum framework for ${subjectName}.`,
      keyConcepts: ["Core Foundations", "Subject Terminology", "Curriculum Standards", "Framework Overview"],
    },
    {
      title: `Lesson 2: ${comp1.slice(0, 50)}`,
      summary: `Examine the operational concepts, systematic theories, and primary mechanisms governing ${comp1.toLowerCase()}.`,
      keyConcepts: ["Key Mechanism", "Theoretical Models", "Practical Principles", "Domain Standards"],
    },
    {
      title: `Lesson 3: Diagnostic Analysis & Guided Application`,
      summary: `Engage with guided exercises, investigative methods, and source material applications in real-world settings.`,
      keyConcepts: ["Diagnostic Methods", "Guided Drills", "Data Collection", "Analytical Reading"],
    },
    {
      title: `Lesson 4: ${comp2.slice(0, 50)}`,
      summary: `Apply intermediate analytical procedures and structured methodologies to resolve contextual scenarios and inquiries.`,
      keyConcepts: ["Applied Procedures", "Methodological Rigor", "Case Evaluation", "Problem Solving"],
    },
    {
      title: `Lesson 5: Collaborative Workflows & Practical Execution`,
      summary: `Execute collaborative projects, laboratory investigations, or technical drafts fulfilling DepEd performance criteria.`,
      keyConcepts: ["Performance Criteria", "Technical Execution", "Collaborative Inquiry", "Rubrics Alignment"],
    },
    {
      title: `Lesson 6: ${comp3.slice(0, 50)}`,
      summary: `Synthesize advanced concepts, critical evaluation metrics, and socio-economic relevance across Philippine communities.`,
      keyConcepts: ["Critical Evaluation", "Community Context", "Advanced Concepts", "Social Relevance"],
    },
    {
      title: `Lesson 7: ${comp4.slice(0, 50)}`,
      summary: `Prepare for comprehensive assessments through multi-concept Socratic drills and real-world scenario modeling.`,
      keyConcepts: ["Socratic Drills", "Scenario Modeling", "Integrated Review", "Synthesis"],
    },
    {
      title: `Lesson 8: Summative Evaluation & DO 015 Mastery Synthesis`,
      summary: `Complete the unit capstone and summative assessment aligned with the DepEd Order No. 015, s. 2026 75% passing benchmark.`,
      keyConcepts: ["Summative Assessment", "Transmuted Grade Evaluation", "DO 015 Benchmark", "Mastery Achievement"],
    },
  ]);
}
