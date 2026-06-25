export interface SeedSymptom {
  name: string;
  category: string;
  weight: number;
}

export interface SeedDisease {
  name: string;
  description: string;
  causes: string;
  diagnosis: string;
  treatment: string;
  riskFactors: string;
  severityLevel: string; // "Mild" | "Moderate" | "Severe" | "Life-threatening"
  symptoms: SeedSymptom[];
}

export const DISEASES: SeedDisease[] = [
  {
    name: "Epidermolysis Bullosa",
    description: "A group of rare diseases that cause fragile, blistering skin. Blisters may appear in response to minor injury, heat, rubbing, scratching or adhesive tape.",
    causes: "Inherited gene mutations passed down from one or both parents (autosomal dominant or recessive). The mutated genes fail to produce proteins needed to bind skin layers together (e.g., collagen or keratin).",
    diagnosis: "Skin biopsy (immunofluorescence mapping or transmission electron microscopy) and genetic testing.",
    treatment: "Wound care, blister management, pain management, infection prevention, and surgery for complications (e.g., esophagus dilation). No cure exists.",
    riskFactors: "Family history of the disease. It is usually diagnosed at birth or in early infancy.",
    severityLevel: "Severe",
    symptoms: [
      { name: "Fragile skin that blisters easily", category: "Skin Texture", weight: 1.0 },
      { name: "Fluid-filled blisters on hands and feet", category: "Lesions & Blisters", weight: 0.9 },
      { name: "Rough or thickened skin", category: "Skin Texture", weight: 0.7 },
      { name: "Deformed or missing nails", category: "Nails & Hair", weight: 0.8 },
      { name: "Blisters inside the mouth or throat", category: "Lesions & Blisters", weight: 0.6 }
    ]
  },
  {
    name: "Harlequin Ichthyosis",
    description: "A severe genetic disorder that mainly affects the skin. Infants with this condition are born with very hard, thick skin covering most of their bodies, split by deep fissures.",
    causes: "Mutations in the ABCA12 gene, which helps transport lipids in the skin's outermost layer. Inherited in an autosomal recessive pattern.",
    diagnosis: "Clinical evaluation at birth and confirmed by genetic testing of the ABCA12 gene.",
    treatment: "Immediate intensive care at birth, high humidity incubators, systemic retinoids (acitretin), topical moisturizers, antibiotics for fissures, and surgery to relieve constriction in limbs.",
    riskFactors: "Both parents carrying the mutated ABCA12 gene.",
    severityLevel: "Life-threatening",
    symptoms: [
      { name: "Thick diamond-shaped skin plates", category: "Skin Texture", weight: 1.0 },
      { name: "Deep fissures or cracks in the skin", category: "Skin Texture", weight: 1.0 },
      { name: "Ectropion (eyelids turned outwards)", category: "Systemic & Others", weight: 0.9 },
      { name: "Eclabium (lips turned outwards)", category: "Systemic & Others", weight: 0.9 },
      { name: "Constricted chest making breathing difficult", category: "Systemic & Others", weight: 0.8 }
    ]
  },
  {
    name: "Xeroderma Pigmentosum",
    description: "An inherited condition characterized by extreme sensitivity to ultraviolet (UV) rays from sunlight, leading to severe sunburns, freckling, and a very high risk of skin cancers.",
    causes: "Mutations in genes involved in nucleotide excision repair (NER), preventing the cell from repairing UV-induced DNA damage.",
    diagnosis: "Clinical history of severe sunburn, testing DNA repair capacity in skin cells (fibroblasts), and genetic testing.",
    treatment: "Complete protection from UV light (sunscreen, UV-blocking clothing, window shields), frequent skin examinations, surgical removal of skin cancers, and topical retinoids.",
    riskFactors: "Autosomal recessive inheritance; consanguineous parents (cousin marriages) increase risk.",
    severityLevel: "Severe",
    symptoms: [
      { name: "Extreme sensitivity to sunlight", category: "Itch & Pain", weight: 1.0 },
      { name: "Severe sunburn after minimal sun exposure", category: "Lesions & Blisters", weight: 0.9 },
      { name: "Heavy freckling on sun-exposed areas", category: "Skin Texture", weight: 0.95 },
      { name: "Dry, thinned skin (atrophy)", category: "Skin Texture", weight: 0.8 },
      { name: "Clouding of the cornea or eye inflammation", category: "Systemic & Others", weight: 0.7 }
    ]
  },
  {
    name: "Darier Disease",
    description: "A rare genetic skin condition characterized by warthy, greasy, smelly papules in seborrheic areas, nail changes, and mucous membrane lesions.",
    causes: "Mutations in the ATP2A2 gene, which encodes a calcium pump (SERCA2). This disrupts calcium signaling needed for cell adhesion in the epidermis.",
    diagnosis: "Skin biopsy showing characteristic dyskeratosis (round cells and grains) and acantholysis (loss of cell adhesion).",
    treatment: "Topical moisturizers, topical or oral retinoids (acitretin), topical corticosteroids, avoiding triggers (heat, humidity, UV light), and treating secondary infections.",
    riskFactors: "Autosomal dominant inheritance. Triggers include heat, sweat, friction, and UV radiation.",
    severityLevel: "Moderate",
    symptoms: [
      { name: "Greasy, wart-like yellow-brown papules", category: "Lesions & Blisters", weight: 1.0 },
      { name: "Crusted plaques in skin folds", category: "Skin Texture", weight: 0.8 },
      { name: "White and red longitudinal bands on nails", category: "Nails & Hair", weight: 0.9 },
      { name: "Smelly skin discharge", category: "Itch & Pain", weight: 0.7 },
      { name: "Rough white papules inside the mouth", category: "Lesions & Blisters", weight: 0.5 }
    ]
  },
  {
    name: "Hailey-Hailey Disease",
    description: "Also known as benign familial pemphigus, it is a rare genetic condition causing recurrent blisters and erosions, particularly in skin folds (armpits, groin, under breasts).",
    causes: "Mutations in the ATP2C1 gene, which encodes a calcium pump (SPCA1) in the Golgi apparatus, disrupting epidermal cell adhesion.",
    diagnosis: "Clinical inspection, skin biopsy showing 'dilapidated brick wall' acantholysis, and genetic confirmation.",
    treatment: "Topical corticosteroids, topical antibiotics or antifungals, oral antibiotics for flare-ups, botulinum toxin to reduce sweating, and in severe cases, surgical excision of affected skin folds.",
    riskFactors: "Autosomal dominant inheritance. Worse in summer due to heat, sweat, and friction.",
    severityLevel: "Moderate",
    symptoms: [
      { name: "Recurrent blisters and raw erosions in skin folds", category: "Lesions & Blisters", weight: 1.0 },
      { name: "Painful cracks or fissures in armpits or groin", category: "Itch & Pain", weight: 0.9 },
      { name: "Itching and burning in friction-prone areas", category: "Itch & Pain", weight: 0.85 },
      { name: "Macerated white plaques in flexures", category: "Skin Texture", weight: 0.8 },
      { name: "Fine white vertical lines on fingernails", category: "Nails & Hair", weight: 0.4 }
    ]
  },
  {
    name: "Netherton Syndrome",
    description: "A severe form of ichthyosis characterized by scaly skin, hair shaft abnormalities (bamboo hair), and a high susceptibility to allergies, asthma, and eczema.",
    causes: "Mutations in the SPINK5 gene, which encodes the LEKTI protein, a serine protease inhibitor. Lack of LEKTI causes premature shedding of skin cells.",
    diagnosis: "Microscopic hair shaft examination showing trichorrhexis invaginata (bamboo hair), genetic testing for SPINK5, and skin biopsy.",
    treatment: "Frequent application of emollients, low-potency topical steroids, topical calcineurin inhibitors (pimecrolimus), and intravenous immunoglobulin (IVIG) in severe cases.",
    riskFactors: "Autosomal recessive inheritance. Often misdiagnosed as severe eczema in infants.",
    severityLevel: "Severe",
    symptoms: [
      { name: "Red, dry, scaly skin from birth (erythroderma)", category: "Skin Texture", weight: 1.0 },
      { name: "Double-edged peeling scales (ichthyosis linearis circumflexa)", category: "Skin Texture", weight: 0.85 },
      { name: "Short, brittle, dry hair (bamboo hair)", category: "Nails & Hair", weight: 0.9 },
      { name: "Severe, persistent itching", category: "Itch & Pain", weight: 0.9 },
      { name: "High susceptibility to skin infections", category: "Systemic & Others", weight: 0.8 }
    ]
  },
  {
    name: "Pachyonychia Congenita",
    description: "A rare genetic keratin disorder that primarily causes extremely thickened nails and painful calluses on the soles of the feet and palms of the hands.",
    causes: "Mutations in any of several keratin genes (KRT6A, KRT6B, KRT6C, KRT16, KRT17), disrupting intermediate filament structures in epithelial cells.",
    diagnosis: "Clinical presentation of nails and calluses, confirmed by genetic sequencing of keratin genes.",
    treatment: "Trimming and filing thickened nails, podiatric care for calluses, customized footwear, topical keratolytics, and oral retinoids for pain reduction.",
    riskFactors: "Autosomal dominant inheritance. Usually manifests in infancy or early childhood.",
    severityLevel: "Moderate",
    symptoms: [
      { name: "Extremely thickened, yellowish nails", category: "Nails & Hair", weight: 1.0 },
      { name: "Painful, thick calluses on soles and palms", category: "Skin Texture", weight: 0.95 },
      { name: "Blisters forming under foot calluses", category: "Lesions & Blisters", weight: 0.7 },
      { name: "White plaques on the tongue and inside cheeks", category: "Skin Texture", weight: 0.6 },
      { name: "Excessive sweating of palms and soles", category: "Systemic & Others", weight: 0.5 }
    ]
  },
  {
    name: "Kindler Syndrome",
    description: "A subtype of epidermolysis bullosa characterized by skin blistering, photosensitivity, progressive skin atrophy, and abnormal pigmentation (poikiloderma).",
    causes: "Mutations in the FERMT1 gene, which encodes kindlin-1, a protein essential for cell adhesion and actin cytoskeleton organization.",
    diagnosis: "Genetic testing, immunofluorescence mapping of a skin biopsy showing split at the basement membrane zone.",
    treatment: "Wound care for blisters, strict sun protection, regular dental check-ups (due to gum disease risk), and monitoring for esophageal strictures and squamous cell carcinoma.",
    riskFactors: "Autosomal recessive inheritance. Blistering starts in infancy, while photosensitivity and atrophy develop later.",
    severityLevel: "Severe",
    symptoms: [
      { name: "Skin blistering in infancy", category: "Lesions & Blisters", weight: 0.9 },
      { name: "Extreme skin sensitivity to sunlight", category: "Itch & Pain", weight: 0.8 },
      { name: "Paper-thin, wrinkled skin (progressive atrophy)", category: "Skin Texture", weight: 0.95 },
      { name: "Mottled hyperpigmentation and hypopigmentation", category: "Skin Texture", weight: 0.9 },
      { name: "Fragile, bleeding gums", category: "Systemic & Others", weight: 0.7 }
    ]
  },
  {
    name: "Incontinentia Pigmenti",
    description: "A rare multi-system genetic disorder that affects the skin, hair, teeth, nails, and eyes. It is characterized by skin lesions that follow a distinct four-stage pattern.",
    causes: "Mutations in the IKBKG gene, which regulates NF-kappaB (helps protect cells from apoptosis). It is X-linked dominant and typically lethal in males.",
    diagnosis: "Clinical criteria, genetic testing for the IKBKG deletion, and skin biopsy showing eosinophilic infiltration.",
    treatment: "Symptomatic treatment of skin lesions, eye examinations to prevent retinal detachment, dental care, and monitoring for neurological deficits.",
    riskFactors: "X-linked dominant inheritance. Almost exclusively affects females.",
    severityLevel: "Severe",
    symptoms: [
      { name: "Linear blistering rashes in newborns (Stage 1)", category: "Lesions & Blisters", weight: 0.95 },
      { name: "Warty, thickened bumps on limbs (Stage 2)", category: "Skin Texture", weight: 0.85 },
      { name: "Swirling, marble-like hyperpigmented streaks (Stage 3)", category: "Skin Texture", weight: 1.0 },
      { name: "Faded, pale, hairless linear patches (Stage 4)", category: "Skin Texture", weight: 0.8 },
      { name: "Missing or abnormally shaped teeth (peg-like)", category: "Systemic & Others", weight: 0.8 }
    ]
  },
  {
    name: "Olmsted Syndrome",
    description: "A rare congenital skin condition characterized by mutilating palmoplantar keratoderma (extreme thickening of palms/soles) and periorificial plaques (plaques around body openings).",
    causes: "Mutations in the TRPV3 gene, which encodes a transient receptor potential channel involved in calcium transport and skin barrier function.",
    diagnosis: "Clinical presentation of periorificial plaques and palmoplantar keratoderma, confirmed by genetic testing.",
    treatment: "Systemic retinoids (acitretin), topical keratolytics, surgical debridement of painful calluses, skin grafting, and recently, epidermal growth factor receptor (EGFR) inhibitors.",
    riskFactors: "Can be autosomal dominant or recessive. Symptoms begin in early infancy.",
    severityLevel: "Severe",
    symptoms: [
      { name: "Extremely thickened, painful plaques on palms and soles", category: "Skin Texture", weight: 1.0 },
      { name: "Thick plaques around the mouth, nose, eyes, and anus", category: "Skin Texture", weight: 0.95 },
      { name: "Intense, burning itch and pain", category: "Itch & Pain", weight: 0.9 },
      { name: "Constriction bands leading to loss of fingers/toes", category: "Systemic & Others", weight: 0.6 },
      { name: "Sparse hair or patchy alopecia", category: "Nails & Hair", weight: 0.7 }
    ]
  },
  {
    name: "Peeling Skin Syndrome",
    description: "A group of rare genetic skin conditions characterized by continual, painless, spontaneous peeling of the outer layers of the skin, either generalized or localized.",
    causes: "Mutations in genes responsible for cell-to-cell adhesion in the outer skin layer (e.g., CDSN encoding corneodesmosin or CHST8).",
    diagnosis: "Skin biopsy showing separation at the stratum corneum level, and genetic screening.",
    treatment: "No cure. Emollients, petrolatum jelly to soften peeling skin, mild topical keratolytics, and avoiding friction.",
    riskFactors: "Autosomal recessive inheritance. Often exacerbated by humidity, heat, and friction.",
    severityLevel: "Mild",
    symptoms: [
      { name: "Painless, spontaneous peeling of the skin", category: "Skin Texture", weight: 1.0 },
      { name: "Redness and mild itching under peeled areas", category: "Itch & Pain", weight: 0.75 },
      { name: "Easy manual peeling of outer skin layer", category: "Skin Texture", weight: 0.9 },
      { name: "Susceptibility to moisture-induced skin damage", category: "Skin Texture", weight: 0.6 }
    ]
  },
  {
    name: "Dyschromatosis Universalis Hereditaria",
    description: "A rare genodermatosis characterized by generalized, mottled pigmentary changes, with intermingled hyperpigmented and hypopigmented macules over the body.",
    causes: "Mutations in the ABCB6 or SASH1 genes, which play roles in cellular pigmentation and traffic of melanin.",
    diagnosis: "Clinical pattern of universal freckling/pigment changes, skin biopsy showing pigment incontinence, and genetic analysis.",
    treatment: "Sunscreen and UV protection to prevent darkening of lesions. Cosmetics can help camouflage lesions. No active treatment to reverse pigmentation.",
    riskFactors: "Autosomal dominant or recessive inheritance. Pigmentation changes usually begin in childhood.",
    severityLevel: "Mild",
    symptoms: [
      { name: "Mottled brown and white spots all over the body", category: "Skin Texture", weight: 1.0 },
      { name: "Punctate pits on palms and soles", category: "Skin Texture", weight: 0.4 },
      { name: "Nail dystrophy or ridges", category: "Nails & Hair", weight: 0.3 }
    ]
  },
  {
    name: "Pseudoxanthoma Elasticum",
    description: "An inherited disorder that causes progressive calcification and fragmentation of elastic fibers in the skin, retina, and cardiovascular system.",
    causes: "Mutations in the ABCC6 gene, which regulates calcification. It prevents the body from suppressing calcium deposits in soft tissues.",
    diagnosis: "Skin biopsy showing calcified elastic fibers using Von Kossa stain, fundoscopy showing angioid streaks in the eye, and genetic testing.",
    treatment: "No cure. Dietary restriction of calcium has no benefit. Regular eye injections (anti-VEGF) for retinal bleeding, and managing cardiovascular risk factors.",
    riskFactors: "Autosomal recessive inheritance. Diagnosed in adolescence or adulthood based on skin changes or vision loss.",
    severityLevel: "Severe",
    symptoms: [
      { name: "Yellowish papules on the neck and underarms", category: "Lesions & Blisters", weight: 0.95 },
      { name: "Loose, sagging skin in body folds (plucked chicken skin)", category: "Skin Texture", weight: 1.0 },
      { name: "Loss of central vision (macular bleeding)", category: "Systemic & Others", weight: 0.8 },
      { name: "Intermittent claudication (leg pain while walking)", category: "Systemic & Others", weight: 0.6 }
    ]
  },
  {
    name: "Porphyria Cutanea Tarda",
    description: "The most common type of porphyria, it is characterized by painful blistering, scarring, and hair growth on sun-exposed areas of the skin, particularly the back of the hands.",
    causes: "Deficiency of the enzyme uroporphyrinogen decarboxylase (UROD) in the liver. Can be acquired (hepatitis C, alcohol, iron overload) or familial.",
    diagnosis: "Elevated levels of porphyrins in urine, stool, and blood, showing characteristic pink-red fluorescence under Wood's lamp.",
    treatment: "Regular therapeutic phlebotomy (blood draw) to reduce iron levels, low-dose chloroquine or hydroxychloroquine, and treating underlying liver issues.",
    riskFactors: "Excessive alcohol use, smoking, iron overload (hemochromatosis), estrogen therapy, and Hepatitis C.",
    severityLevel: "Moderate",
    symptoms: [
      { name: "Fragile skin on the back of hands", category: "Skin Texture", weight: 0.95 },
      { name: "Painful blisters on sun-exposed skin", category: "Lesions & Blisters", weight: 1.0 },
      { name: "Hyperpigmentation of face and hands", category: "Skin Texture", weight: 0.8 },
      { name: "Excessive hair growth on face (hypertrichosis)", category: "Nails & Hair", weight: 0.75 },
      { name: "Milium (tiny white cysts) in healing areas", category: "Lesions & Blisters", weight: 0.7 }
    ]
  },
  {
    name: "Livedoid Vasculopathy",
    description: "A chronic, painful skin condition characterized by persistent mottled discoloration (livedo reticularis) and recurrent, painful, ulcerations of the lower legs, healing with porcelain-white scars.",
    causes: "Thrombosis (blood clotting) and ischemia in the dermal microvasculature rather than true primary inflammation.",
    diagnosis: "Skin biopsy of ulcer margin showing hyaline thrombi in small dermal vessels, and screening for hypercoagulable states.",
    treatment: "Anticoagulants (heparin, warfarin, rivaroxaban), antiplatelets (aspirin, dipyridamole), hyperbaric oxygen therapy, and compression therapy.",
    riskFactors: "Thrombophilic risk factors (Factor V Leiden, protein C/S deficiency), collagen vascular diseases.",
    severityLevel: "Moderate",
    symptoms: [
      { name: "Recurrent, extremely painful ulcers on lower legs", category: "Lesions & Blisters", weight: 1.0 },
      { name: "Mottled purple discoloration of legs (livedo reticularis)", category: "Skin Texture", weight: 0.9 },
      { name: "Porcelain-white scars with red borders (atrophie blanche)", category: "Skin Texture", weight: 0.95 },
      { name: "Intense burning pain in legs and ankles", category: "Itch & Pain", weight: 1.0 }
    ]
  },
  {
    name: "Pyoderma Gangrenosum",
    description: "A rare inflammatory skin disease characterized by the rapid development of painful, necrotic ulcers with purplish, undermined borders, frequently triggered by minor trauma.",
    causes: "Dysfunction of neutrophils and immune system dysregulation. Often associated with systemic diseases like inflammatory bowel disease (IBD) or rheumatoid arthritis.",
    diagnosis: "Diagnosis of exclusion; skin biopsy to rule out other causes, and laboratory screening for autoimmune diseases.",
    treatment: "Systemic corticosteroids (prednisone), immunosuppressants (cyclosporine, mycophenolate mofetil), biological agents (infliximab), and careful non-surgical wound care.",
    riskFactors: "Inflammatory Bowel Disease (Crohn's/Colitis), Rheumatoid Arthritis, myelodysplastic syndrome, and minor skin trauma (pathergy).",
    severityLevel: "Severe",
    symptoms: [
      { name: "Rapidly spreading, highly painful skin ulcers", category: "Lesions & Blisters", weight: 1.0 },
      { name: "Ulcers with distinct purple, undermined borders", category: "Lesions & Blisters", weight: 0.95 },
      { name: "Small pustules that rapidly expand into raw sores", category: "Lesions & Blisters", weight: 0.8 },
      { name: "Wound worsening after minor scratches or biopsies (pathergy)", category: "Itch & Pain", weight: 0.75 },
      { name: "Systemic fever and joint pain", category: "Systemic & Others", weight: 0.5 }
    ]
  },
  {
    name: "Necrobiosis Lipoidica",
    description: "A rare, chronic granulomatous skin disorder typically affecting the shins, marked by yellowish, atrophic, waxy plaques with prominent telangiectasias (spider veins).",
    causes: "Unknown, but strongly linked to microangiopathy (small blood vessel disease) associated with diabetes mellitus.",
    diagnosis: "Clinical appearance and deep skin biopsy showing necrobiotic granulomas and collagen degeneration.",
    treatment: "High-potency topical or intralesional corticosteroids, antiplatelet therapy (aspirin), calcineurin inhibitors, and phototherapy.",
    riskFactors: "Diabetes mellitus (up to 75% of patients have diabetes or pre-diabetes), female gender.",
    severityLevel: "Moderate",
    symptoms: [
      { name: "Yellowish, waxy plaques on the shins", category: "Skin Texture", weight: 1.0 },
      { name: "Prominent spider veins (telangiectasias) in lesions", category: "Skin Texture", weight: 0.9 },
      { name: "Shiny, thin, atrophic skin in affected areas", category: "Skin Texture", weight: 0.85 },
      { name: "Painless plaques unless they ulcerate", category: "Itch & Pain", weight: 0.7 },
      { name: "Leg ulcers forming from minor knocks", category: "Lesions & Blisters", weight: 0.4 }
    ]
  },
  {
    name: "Sneddon Syndrome",
    description: "A rare, progressive neurovasculopathy characterized by the combination of livedo reticularis (mottled purple skin) and stroke-like neurological events.",
    causes: "Non-inflammatory thrombotic vasculopathy of medium-sized arteries, leading to narrowing and clotting.",
    diagnosis: "Skin biopsy showing thrombosis of deep dermal arteries, MRI brain scan showing small ischemic lesions, and blood tests.",
    treatment: "Long-term anticoagulation (warfarin) or antiplatelet therapy, blood pressure control, and smoking cessation.",
    riskFactors: "Antiphospholipid syndrome, female gender (young to middle-aged), smoking.",
    severityLevel: "Severe",
    symptoms: [
      { name: "Mottled purple discoloration of legs (livedo reticularis)", category: "Skin Texture", weight: 1.0 },
      { name: "Transient ischemic attacks or stroke", category: "Systemic & Others", weight: 0.9 },
      { name: "Chronic, severe headaches or migraines", category: "Itch & Pain", weight: 0.7 },
      { name: "Cognitive decline or memory issues", category: "Systemic & Others", weight: 0.6 },
      { name: "Raynaud's phenomenon (fingers turning white in cold)", category: "Systemic & Others", weight: 0.5 }
    ]
  },
  {
    name: "Wells Syndrome",
    description: "Also known as eosinophilic cellulitis, it is a rare, recurrent inflammatory skin condition characterized by painful, itchy hives or plaques that resemble cellulitis but do not respond to antibiotics.",
    causes: "Exaggerated hypersensitivity reaction triggered by insect bites, drug reactions, viral infections, or leukemia, causing eosinophil activation.",
    diagnosis: "Skin biopsy showing infiltration of eosinophils and characteristic 'flame figures' in the dermis, plus blood eosinophilia.",
    treatment: "Systemic corticosteroids (prednisone), topical steroids, oral antihistamines, and dapsone or cyclosporine for recurrent cases.",
    riskFactors: "History of insect bites, vaccination, or drug allergy. Can affect any age.",
    severityLevel: "Moderate",
    symptoms: [
      { name: "Rapidly spreading, red, swollen plaques", category: "Skin Texture", weight: 1.0 },
      { name: "Severe, burning itch and pain", category: "Itch & Pain", weight: 0.9 },
      { name: "Plaques that feel firm and hard", category: "Skin Texture", weight: 0.8 },
      { name: "Blisters forming on top of red plaques", category: "Lesions & Blisters", weight: 0.4 },
      { name: "Mild fever and general malaise", category: "Systemic & Others", weight: 0.5 }
    ]
  },
  {
    name: "Acrodermatitis Enteropathica",
    description: "A rare genetic disorder of zinc absorption characterized by severe dermatitis around body orifices and on limbs, alopecia, and chronic diarrhea.",
    causes: "Mutations in the SLC39A4 gene, which encodes a zinc transporter (ZIP4), leading to severe zinc deficiency.",
    diagnosis: "Low blood plasma zinc levels, low alkaline phosphatase levels, and genetic testing.",
    treatment: "Lifetime dietary zinc supplementation (usually zinc sulfate), which leads to complete clearing of symptoms.",
    riskFactors: "Autosomal recessive inheritance. Typically manifests in infants shortly after weaning from breast milk.",
    severityLevel: "Severe",
    symptoms: [
      { name: "Red, blistered, crusted skin around mouth and anus", category: "Lesions & Blisters", weight: 1.0 },
      { name: "Dermatitis on fingers, toes, and joints", category: "Skin Texture", weight: 0.95 },
      { name: "Complete hair loss (alopecia) on scalp and eyebrows", category: "Nails & Hair", weight: 0.9 },
      { name: "Severe, frequent watery diarrhea", category: "Systemic & Others", weight: 0.85 },
      { name: "Loss of appetite and poor growth in infants", category: "Systemic & Others", weight: 0.8 }
    ]
  },
  {
    name: "Cutis Laxa",
    description: "A group of rare connective tissue disorders characterized by loose, sagging skin that lacks elasticity and hangs in folds, giving a prematurely aged appearance.",
    causes: "Defects in elastic fibers, often due to mutations in genes like ELN (elastin) or FBLN5 (fibulin-5). Can be inherited or acquired (associated with drugs or inflammatory skin diseases).",
    diagnosis: "Clinical examination of skin elasticity, skin biopsy showing fragmented or absent elastic fibers, and genetic sequencing.",
    treatment: "Symptomatic. Plastic surgery for skin sagging (facelifts), regular cardiovascular monitoring (due to risk of aortic aneurysm), and lung function checks.",
    riskFactors: "Inherited forms (dominant, recessive, or X-linked) or acquired after severe inflammatory eruptions.",
    severityLevel: "Severe",
    symptoms: [
      { name: "Loose, sagging skin that lacks elasticity", category: "Skin Texture", weight: 1.0 },
      { name: "Prematurely aged, wrinkled facial appearance", category: "Skin Texture", weight: 0.95 },
      { name: "Loose skin folds on neck, armpits, and groin", category: "Skin Texture", weight: 0.9 },
      { name: "Hoarse voice or hernia development", category: "Systemic & Others", weight: 0.5 },
      { name: "Shortness of breath (emphysema risk)", category: "Systemic & Others", weight: 0.4 }
    ]
  },
  {
    name: "Buschke-Ollendorff Syndrome",
    description: "A rare hereditary connective tissue disorder characterized by multiple benign skin nodules (elastomas/dermatofibromas) and density changes in bones (osteopoikilosis).",
    causes: "Mutations in the LEMD3 gene, which regulates TGF-beta signaling, leading to excess accumulation of elastic tissue.",
    diagnosis: "X-ray showing circular spots of increased density in bones (osteopoikilosis), and skin biopsy showing increased elastic fibers.",
    treatment: "None required for bone spots (they are asymptomatic and benign). Surgical removal of skin nodules if they cause cosmetic concern or irritation.",
    riskFactors: "Autosomal dominant inheritance. Often discovered incidentally on X-rays.",
    severityLevel: "Mild",
    symptoms: [
      { name: "Firm, skin-colored or yellowish skin nodules", category: "Lesions & Blisters", weight: 1.0 },
      { name: "Nodules grouped on the lower back, buttocks, or limbs", category: "Skin Texture", weight: 0.85 },
      { name: "Mildly itchy nodules", category: "Itch & Pain", weight: 0.3 }
    ]
  },
  {
    name: "Degos Disease",
    description: "Also known as malignant atrophic papulosis, it is an extremely rare vasculopathy characterized by red bumps that heal into white scars with red borders on the skin, and potentially fatal internal organ involvement.",
    causes: "Unknown, but involves narrowing and blockage of small arteries due to endothelial cell swelling and platelet aggregation.",
    diagnosis: "Skin biopsy showing wedge-shaped infarct of the dermis, and endoscopy/laparoscopy to check for bowel lesions.",
    treatment: "Antiplatelets (aspirin), anticoagulants (heparin), and experimental immunotherapies (eculizumab). No highly effective treatment.",
    riskFactors: "Can occur at any age. The systemic form is highly fatal due to bowel perforation.",
    severityLevel: "Life-threatening",
    symptoms: [
      { name: "Small, dome-shaped red skin bumps", category: "Lesions & Blisters", weight: 1.0 },
      { name: "Bumps healing into porcelain-white scars with red borders (atrophie blanche)", category: "Skin Texture", weight: 0.95 },
      { name: "Severe abdominal pain or gastrointestinal bleeding", category: "Systemic & Others", weight: 0.7 },
      { name: "Chest pain or shortness of breath", category: "Systemic & Others", weight: 0.4 }
    ]
  },
  {
    name: "Erythropoietic Protoporphyria",
    description: "A rare genetic metabolic disorder causing extreme cutaneous photosensitivity, where exposure to sunlight triggers intense, burning pain and swelling without major blistering.",
    causes: "Mutations in the FECH gene, which causes deficiency of ferrochelatase. This leads to accumulation of protoporphyrin in red blood cells, which reacts to visible light.",
    diagnosis: "Elevated free protoporphyrin levels in red blood cells, and genetic testing.",
    treatment: "Strict sunlight avoidance, wearing protective clothing, taking beta-carotene or afamelanotide (scenesse) to improve light tolerance.",
    riskFactors: "Autosomal recessive or dominant inheritance. Symptoms begin in early childhood upon first sun exposure.",
    severityLevel: "Severe",
    symptoms: [
      { name: "Intense, burning pain upon sun exposure", category: "Itch & Pain", weight: 1.0 },
      { name: "Swelling and redness of sun-exposed skin", category: "Skin Texture", weight: 0.9 },
      { name: "Itching and tingling of skin before pain starts", category: "Itch & Pain", weight: 0.85 },
      { name: "Mild thickening of skin over knuckles (waxy skin)", category: "Skin Texture", weight: 0.6 }
    ]
  },
  {
    name: "Blau Syndrome",
    description: "A rare genetic inflammatory disorder characterized by a triad of granulomatous skin rashes, arthritis (joint swelling), and uveitis (eye inflammation), presenting before age 4.",
    causes: "Mutations in the NOD2 gene, leading to overactivation of the immune system and granuloma formation.",
    diagnosis: "Clinical triad of rash, arthritis, and eye inflammation before age 4, skin biopsy showing non-caseating granulomas, and NOD2 mutation testing.",
    treatment: "Oral corticosteroids, immunosuppressants (methotrexate), and biological TNF-alpha inhibitors (adalimumab, infliximab).",
    riskFactors: "Autosomal dominant inheritance. Triggers or worsens spontaneously in childhood.",
    severityLevel: "Severe",
    symptoms: [
      { name: "Tan, reddish-brown, or scaly skin rashes", category: "Lesions & Blisters", weight: 0.9 },
      { name: "Painless bumps under the skin", category: "Lesions & Blisters", weight: 0.75 },
      { name: "Swollen, stiff, and painful joints (arthritis)", category: "Systemic & Others", weight: 0.95 },
      { name: "Red, painful, light-sensitive eyes (uveitis)", category: "Systemic & Others", weight: 0.8 },
      { name: "Fever and fatigue during flare-ups", category: "Systemic & Others", weight: 0.6 }
    ]
  },
  {
    name: "Sweet Syndrome",
    description: "Also known as acute febrile neutrophilic dermatosis, it is a rare inflammatory condition characterized by fever, an elevated white blood cell count, and painful red plaques or nodules.",
    causes: "Hypersensitivity reaction to infections, inflammatory bowel disease, vaccines, pregnancy, drugs, or underlying cancers (like leukemia).",
    diagnosis: "Skin biopsy showing dense neutrophilic infiltration in the dermis, plus blood tests showing leukocytosis.",
    treatment: "Systemic corticosteroids (prednisone), which lead to rapid clearing, or alternative agents like potassium iodide, colchicine, or dapsone.",
    riskFactors: "Female gender (usually aged 30 to 50), preceding upper respiratory tract infection, or underlying malignancy.",
    severityLevel: "Severe",
    symptoms: [
      { name: "Sudden onset of painful red-purple bumps or plaques", category: "Lesions & Blisters", weight: 1.0 },
      { name: "High fever starting with the rash", category: "Systemic & Others", weight: 0.9 },
      { name: "Pustules on top of skin lesions", category: "Lesions & Blisters", weight: 0.4 },
      { name: "Joint pain and muscle aches", category: "Itch & Pain", weight: 0.7 },
      { name: "Headache and fatigue", category: "Systemic & Others", weight: 0.6 }
    ]
  },
  {
    name: "Linear IgA Bullous Dermatosis",
    description: "A rare autoimmune blistering skin disease characterized by tense blisters arranged in a ring or 'string of pearls' configuration, often triggered by medications.",
    causes: "Autoantibodies directed against components of the basement membrane zone. Often drug-induced (vancomycin is the most common trigger).",
    diagnosis: "Direct immunofluorescence (DIF) of a skin biopsy showing linear deposition of IgA antibodies along the basement membrane.",
    treatment: "Dapsone (first-line treatment), stopping the offending medication, oral corticosteroids, or antibiotics like erythromycin.",
    riskFactors: "Vancomycin usage, other drug exposures, or idiopathic (spontaneous). Can affect children or adults.",
    severityLevel: "Moderate",
    symptoms: [
      { name: "Tense blisters arranged in a ring (string of pearls)", category: "Lesions & Blisters", weight: 1.0 },
      { name: "Severe, intense itching and burning", category: "Itch & Pain", weight: 0.9 },
      { name: "Blisters on trunk, limbs, and face", category: "Lesions & Blisters", weight: 0.9 },
      { name: "Erosions or sores in the mouth", category: "Lesions & Blisters", weight: 0.5 }
    ]
  },
  {
    name: "Mastocytosis",
    description: "A rare disorder characterized by the accumulation of excess mast cells in the skin (cutaneous) and sometimes in other organs (systemic). Exposure to triggers causes mast cell degranulation.",
    causes: "Mutations in the KIT gene (often D816V), which regulates mast cell production and survival.",
    diagnosis: "Skin biopsy showing high numbers of mast cells, checking for Darier's sign (rubbing skin turns it red and swollen), and serum tryptase levels.",
    treatment: "Avoiding triggers (heat, friction, certain drugs, alcohol), oral antihistamines (H1 and H2 blockers), cromolyn sodium, and epinephrine auto-injectors.",
    riskFactors: "Family history of the condition. Can occur in infancy (urticaria pigmentosa) or adulthood.",
    severityLevel: "Moderate",
    symptoms: [
      { name: "Reddish-brown spots that hive when rubbed (Darier sign)", category: "Skin Texture", weight: 1.0 },
      { name: "Severe itching, especially with temperature changes", category: "Itch & Pain", weight: 0.95 },
      { name: "Flushing of the face and neck", category: "Systemic & Others", weight: 0.8 },
      { name: "Abdominal cramping or diarrhea", category: "Systemic & Others", weight: 0.5 },
      { name: "Dizziness or fainting due to low blood pressure", category: "Systemic & Others", weight: 0.4 }
    ]
  },
  {
    name: "Tuberous Sclerosis Complex",
    description: "A rare multi-system genetic disease that causes benign tumors to grow in the brain, kidneys, heart, eyes, lungs, and skin, with prominent cutaneous features.",
    causes: "Mutations in either the TSC1 (hamartin) or TSC2 (tuberin) genes, which act as tumor suppressors.",
    diagnosis: "Clinical criteria, brain/renal MRI, eye exam, and genetic screening of TSC1/TSC2 genes.",
    treatment: "Topical mTOR inhibitors (rapamycin/sirolimus) for facial tumors, anti-seizure medications, surgical removal of tumors, and regular organ surveillance.",
    riskFactors: "Autosomal dominant inheritance. Symptoms start in infancy or childhood.",
    severityLevel: "Severe",
    symptoms: [
      { name: "Leaf-shaped pale skin patches (ash-leaf spots)", category: "Skin Texture", weight: 0.9 },
      { name: "Red-brown bumps on cheeks and nose (angiofibromas)", category: "Lesions & Blisters", weight: 0.85 },
      { name: "Thick, leathery patch on lower back (shagreen patch)", category: "Skin Texture", weight: 0.8 },
      { name: "Fleshy growths under or around nails (fibromas)", category: "Nails & Hair", weight: 0.75 },
      { name: "Seizures or developmental delays", category: "Systemic & Others", weight: 0.8 }
    ]
  },
  {
    name: "Gorlin Syndrome",
    description: "Also known as nevoid basal cell carcinoma syndrome, it is a rare genetic disorder characterized by the development of multiple basal cell skin cancers, jaw cysts, and skeletal abnormalities.",
    causes: "Mutations in the PTCH1 gene, a tumor suppressor involved in the Hedgehog signaling pathway.",
    diagnosis: "Clinical major and minor criteria (e.g. multiple BCCs, jaw cysts on X-ray, palmar/plantar pits) and PTCH1 genetic testing.",
    treatment: "Surgical removal or photodynamic therapy for skin cancers, oral hedgehog inhibitors (vismodegib), avoiding radiation therapy (causes more BCCs), and jaw cyst surgery.",
    riskFactors: "Autosomal dominant inheritance. Extreme sensitivity to ionizing radiation.",
    severityLevel: "Severe",
    symptoms: [
      { name: "Multiple basal cell skin cancers starting at a young age", category: "Lesions & Blisters", weight: 0.95 },
      { name: "Small, pinhead-sized pits on palms or soles", category: "Skin Texture", weight: 0.85 },
      { name: "Jaw swelling or jaw pain from bone cysts", category: "Systemic & Others", weight: 0.75 },
      { name: "Enlarged head size (macrocephaly)", category: "Systemic & Others", weight: 0.5 },
      { name: "Skeletal ribs abnormality on X-rays", category: "Systemic & Others", weight: 0.6 }
    ]
  }
];
