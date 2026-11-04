# Contract: Curriculum Catalog Expansion (Arts & Design, Sports, TVL)

**Feature**: `006-filipino-hero-subscription-scope-catalog`  
**Contract ID**: `CTR-CURRICULUM-EXPANSION-003`  
**Status**: Approved  
**Consumers**: `features/curriculum/utils/curriculum-data.ts`, `features/landing/components/TrackDetail.tsx`, `tests/unit/tracks-data.test.ts`, `/tracks/[id]`

---

## 1. Catalog Additions Specifications

### 1.1 Arts and Design Track
- **`TRACKS_DATA` Key**: `"arts-design-track"`
- **Icon**: `Palette` (Lucide React)
- **Badge**: `"Arts and Design Secondary Track"`
- **Grades**: `"Grades 11 and 12"`
- **Subjects Count**: `"6 General + 5 Specializations"`
- **General Subjects (6)**:
  1. `Creative Industries I: Arts and Design Appreciation and Production` (Grade 11, Sem 1, 80h)
  2. `Creative Industries II: Performing Arts` (Grade 11, Sem 2, 80h)
  3. `Physical and Personal Development in the Arts` (Grade 11, Sem 1, 80h)
  4. `Developing Filipino Identity in the Arts` (Grade 11, Sem 2, 80h)
  5. `Integrating the Elements and Principles of Organization in the Arts` (Grade 12, Sem 1, 80h)
  6. `Leadership and Management in Different Arts Fields` (Grade 12, Sem 2, 80h)
- **Specializations Streams (5)**:
  - Media Arts & Visual Arts (160h Apprenticeship + Exhibit Production)
  - Literary Arts (160h Apprenticeship + Scriptwriting / Staged Reading)
  - Dance (160h Apprenticeship + Choreographed Production)
  - Music (160h Apprenticeship + Performance / Production)
  - Theater (160h Apprenticeship + Stage Play Production)

### 1.2 Sports Track
- **`TRACKS_DATA` Key**: `"sports-track"`
- **Icon**: `Trophy` (Lucide React)
- **Badge**: `"Sports Science & Athletics Track"`
- **Grades**: `"Grades 11 and 12"`
- **Subjects Count**: `"9 Specialized Subjects"`
- **Specialized Subjects (9)**:
  1. `Safety and First Aid` (Grade 11, Sem 1, 80h, Red Cross certification)
  2. `Human Movement` (Grade 11, Sem 1, 80h)
  3. `Fundamentals of Coaching` (Grade 11, Sem 2, 80h)
  4. `Sports Officiating and Activity Management` (Grade 11, Sem 2, 80h, NSA/TESDA certification)
  5. `Fitness, Sports, and Recreation Leadership` (Grade 12, Sem 1, 80h)
  6. `Psychosocial Aspects of Sports and Exercise` (Grade 12, Sem 1, 80h)
  7. `Fitness Testing and Exercise Programming` (Grade 12, Sem 1, 80h)
  8. `Practicum (in-campus)` (Grade 12, Sem 2, 80h)
  9. `Apprenticeship (off-campus)` (Grade 12, Sem 2, 80h)

### 1.3 Technical-Vocational-Livelihood (TVL) 4-Sector Specializations
- **Agri-Fishery Arts (AFA)**:
  - Agricultural Crops Production NC II (640h)
  - Animal Production NC II (320h)
  - Aquaculture NC II (640h)
  - Food Processing NC II (640h)
  - Organic Agriculture NC II (320h)
- **Industrial Arts (IA)**:
  - Automotive Servicing NC I & II (640h)
  - Shielded Metal Arc Welding (SMAW) NC I & II (320h)
  - Electrical Installation and Maintenance NC II (640h)
  - Electronic Products Assembly and Servicing NC II (640h)
  - Carpentry NC II (640h)
  - Domestic Refrigeration & Air-Conditioning (DOMRAC) NC II (640h)
- **Home Economics (HE)**:
  - Caregiving NC II (640h)
  - Cookery NC II (320h)
  - Bread and Pastry Production NC II (160h)
  - Food and Beverage Services NC II (160h)
  - Front Office Services NC II (160h)
  - Housekeeping NC II (160h)
  - Tourism Promotion Services NC II (160h)
- **Information & Communications Technology (ICT)**:
  - Computer Systems Servicing NC II (640h)
  - Animation NC II (320h)
  - Computer Programming NC III (.NET / Java / Oracle) (320h)
  - Technical Drafting NC II (320h)

---

## 2. Test Integrity Guarantees

In `tests/unit/tracks-data.test.ts`:
- Total tracked IDs increased from 7 to 9:
  ```typescript
  const expectedTrackIds = [
    "junior-high-core",
    "stem-strand",
    "abm-strand",
    "humss-strand",
    "shs-core",
    "gas-strand",
    "tvl-track",
    "arts-design-track",
    "sports-track",
  ];
  ```
- Every track MUST provide:
  - Non-empty `id`, `name`, `badge`, `headline`, `overview`, `grades`, `icon`.
  - Non-empty `learningGoals` array.
  - Non-empty `careerPathways` array.
  - Non-empty `aiTutorCapabilities` array.
  - Non-empty `featuredSubjects` array where each subject has `modules === 8`.
