window.PHARMA_DATA = [
    // ==========================================
    // 1. ANTIBIOTICS AND ANTI-INFECTIVES
    // ==========================================
    {
        name: "Amoxicillin + Clavulanic Acid",
        brands: "Augmentin, Klamoks, Amoklavin, Bioment",
        category: "Antibiotics",
        forms: "Tablet, Syrup (Suspension), Injection (IV Vial)",
        usage: "Respiratory tract infections, deep wound infections, animal bites, middle ear inflammation, and dental abscesses.",
        contra: "Causes anaphylactic shock (fatal allergy) in those with penicillin allergy. Not used in severe liver failure.",
        fieldNote: "Powder syrup spoils within 7 days after reconstitution if not refrigerated; tablets and dry vials last for a long time."
    },
    {
        name: "Ciprofloxacin",
        brands: "Cipro, Ciprasid, Ciflosin, Roxin",
        category: "Antibiotics",
        forms: "Tablet, Injection (IV Serum/Vial), Eye/Ear Drop",
        usage: "Urinary tract infections, severe bacterial diarrhea (dysentery, typhoid), bone-joint infections, and anthrax exposure.",
        contra: "Not used in pregnant women, nursing mothers, and children under 18 due to joint/cartilage damage risk. Risk of Achilles tendon rupture.",
        fieldNote: "Absorption drops to zero if swallowed with dairy products, calcium, or iron supplements."
    },
    {
        name: "Doxycycline",
        brands: "Tetradox, Monodoks, Doksin",
        category: "Antibiotics",
        forms: "Tablet, Capsule",
        usage: "Tick-borne diseases (Lyme, rickettsia), malaria prophylaxis, cholera, pneumonia, and skin infections.",
        contra: "Causes permanent tooth staining and bone development disorders in pregnant women and children under 8.",
        fieldNote: "CRITICAL WARNING: Expired or heat-damaged tetracycline/doxycycline tablets turn into toxic compounds that destroy kidneys (Fanconi syndrome). NEVER use if expired."
    },
    {
        name: "Azithromycin",
        brands: "Azitro, Zitromax, Azax, Macrol",
        category: "Antibiotics",
        forms: "Tablet, Capsule, Syrup (Suspension)",
        usage: "Upper and lower respiratory tract infections, pneumonia, whooping cough, and some bacterial intestinal infections.",
        contra: "Not used in patients with severe heart rhythm disorders (QT prolongation) or macrolide allergy.",
        fieldNote: "A practical field antibiotic that is usually effective in short 3-day courses because it stays in tissues for a long time."
    },
    {
        name: "Metronidazole",
        brands: "Flagyl, Nidazol",
        category: "Antibiotics",
        forms: "Tablet, Syrup, Injection (IV Vial), Gel",
        usage: "Amoebic dysentery, giardia parasite, anaerobic (growing in an oxygen-free environment) deep tissue infections, dental and intra-abdominal abscesses.",
        contra: "Not used in the first 3 months of pregnancy. Causes severe vomiting and blood pressure drop (disulfiram reaction) if alcohol is consumed during or 48 hours after treatment.",
        fieldNote: "The primary lifesaver in bloody/mucous diarrhea caused by parasites transmitted from dirty water."
    },
    {
        name: "Ceftriaxone",
        brands: "Rocephin, Novosef, Unacefin, İesef",
        category: "Antibiotics",
        forms: "Injection (IM Gluteal / IV Intravenous Vial)",
        usage: "Severe pneumonia, meningitis, blood poisoning (sepsis), severe urinary tract and abdominal infections.",
        contra: "Not used in those with cephalosporin or severe penicillin allergy. Never administered through the same IV line as calcium-containing serums (Ringer's Lactate).",
        fieldNote: "Injection form only; if administered intramuscularly (IM), it must be diluted with a lidocaine solvent ampoule."
    },
    {
        name: "Clindamycin",
        brands: "Cleocin, Klindan, Klinoksin",
        category: "Antibiotics",
        forms: "Capsule, Injection (Ampoule), Topical Solution/Gel",
        usage: "Deep wound, bone, dental, and soft tissue infections in those with penicillin allergy.",
        contra: "Must be stopped immediately if severe intestinal inflammation (pseudomembranous colitis) develops.",
        fieldNote: "The most important alternative antibiotic for casualties with penicillin allergy."
    },
    {
        name: "Sulfamethoxazole + Trimethoprim",
        brands: "Bactrim, Bakton, Kemoprim",
        category: "Antibiotics",
        forms: "Tablet, Syrup (Suspension), Injection (Ampoule)",
        usage: "Urinary tract infections, traveler's diarrhea, bronchitis, and some opportunistic lung infections.",
        contra: "Not used in those with sulfonamide allergy, severe kidney/liver failure, or G6PD enzyme deficiency (favism).",
        fieldNote: "Must be taken with plenty of water to prevent kidney stone formation."
    },
    {
        name: "Mupirocin / Fusidic Acid (Topical Antibiotics)",
        brands: "Bactroban, Fucidin, Stafine",
        category: "Antibiotics",
        forms: "Ointment, Cream",
        usage: "Inflamed skin wounds, impetigo, secondary skin infections after burns, and protection of sutures.",
        contra: "Do not apply heavily inside the eye or on wide open vascular beds.",
        fieldNote: "The basic field ointment that prevents small cuts from turning into gangrene or systemic infection."
    },

    // ==========================================
    // 2. ANTISEPTICS AND DISINFECTANTS
    // ==========================================
    {
        name: "Povidone Iodine (Batticon)",
        brands: "Batticon, Biokadin, Poviod, Betadine",
        category: "Antiseptics & Disinfectants",
        forms: "Solution, Ointment, Surgical Soap",
        usage: "Cleaning around open wounds, disinfection of cuts and scrapes, skin preparation before surgical intervention.",
        contra: "Not used in those with iodine allergy, thyroid patients, and on large burn surfaces (due to iodine absorption poisoning).",
        fieldNote: "If poured directly deep into an open wound, it burns healthy tissue and delays healing; apply around the wound."
    },
    {
        name: "Chlorhexidine Gluconate",
        brands: "Klorhex, Savlon (with Cetrimide), Andorex",
        category: "Antiseptics & Disinfectants",
        forms: "Solution, Mouthwash, Spray",
        usage: "Skin and wound cleaning, medical instrument disinfection, and mouth/throat infections.",
        contra: "Must not contact the inside of the eye or the middle ear (risk of permanent hearing and vision loss).",
        fieldNote: "Causes less tissue damage than povidone iodine and leaves a permanent antibacterial protective layer on the skin."
    },
    {
        name: "Hydrogen Peroxide (3%)",
        brands: "Hydrogen Peroxide (General)",
        category: "Antiseptics & Disinfectants",
        forms: "Solution",
        usage: "First mechanical cleaning and expelling dead tissue by foaming in wounds contaminated with soil or rust.",
        contra: "Never inject into deep closed cavities (risk of gas embolism). Do not reapply to a clean, healing wound.",
        fieldNote: "Used only once for initial dirty wound cleaning; afterwards, rinse with clean water or normal saline."
    },
    {
        name: "Silver Sulfadiazine",
        brands: "Silverdin, Silvamed",
        category: "Antiseptics & Disinfectants",
        forms: "Cream",
        usage: "Protection and treatment of 2nd and 3rd-degree burns from infection.",
        contra: "Not used in those with sulfonamide allergy, late pregnancy, and infants under 2 months.",
        fieldNote: "The most critical field cream that prevents infection in burn treatment; apply by covering with sterile gauze."
    },

    // ==========================================
    // 3. PAINKILLERS AND ANTIPYRETICS
    // ==========================================
    {
        name: "Paracetamol (Acetaminophen)",
        brands: "Parol, Minoset, Calpol, Vermidon, Tamol",
        category: "Painkillers & Antipyretics",
        forms: "Tablet, Syrup, Suppository, Injection (IV Vial)",
        usage: "Fever reduction, headache, muscle pain, and mild to moderate pain. Does not harm the stomach.",
        contra: "Not used in severe liver failure. Causes fatal liver failure if the daily dose of 4000 mg (8 tablets) is exceeded in adults.",
        fieldNote: "The only basic painkiller that can be safely used in casualties with suspected internal bleeding because it does not increase bleeding."
    },
    {
        name: "Ibuprofen (NSAID)",
        brands: "Nurofen, Dolven, Brufen, Artril, Advil",
        category: "Painkillers & Antipyretics",
        forms: "Tablet, Syrup, Gel",
        usage: "Inflammatory joint/muscle pain, sprains, toothache, and high fever.",
        contra: "Absolutely not used in those with stomach ulcers/bleeding, kidney failure, dehydrated patients, and in cases of suspected internal bleeding.",
        fieldNote: "Causes stomach bleeding if taken on an empty stomach; must be taken with food and plenty of water."
    },
    {
        name: "Diclofenac Sodium / Potassium",
        brands: "Voltaren, Dikloron, Cataflam, Miyadren",
        category: "Painkillers & Antipyretics",
        forms: "Tablet, Injection (IM Ampoule), Gel, Suppository",
        usage: "Severe musculoskeletal pain, kidney stone colic, lumbago, and trauma pain.",
        contra: "Not used in stomach bleeding, severe cardiovascular disease, kidney failure, and bleeding disorders.",
        fieldNote: "Ampoule form is only injected deep into the gluteal muscle (IM); absolutely never injected intravenously (IV)."
    },
    {
        name: "Acetylsalicylic Acid (Aspirin)",
        brands: "Aspirin, Coraspin, Ecopirin",
        category: "Painkillers & Antipyretics",
        forms: "Tablet",
        usage: "Blood thinner (clot preventer) in suspected heart attacks, fever, and mild pain.",
        contra: "Not used in patients with open wounds or bleeding (does not stop bleeding), stomach ulcers, and children with viral fevers (risk of Reye's syndrome).",
        fieldNote: "Having a person showing chest pain and heart attack symptoms chew 1 tablet (300 mg) is lifesaving."
    },
    {
        name: "Tramadol / Morphine Sulfate (Opioid Analgesics)",
        brands: "Contramal, Tradolex, Morfin HCl",
        category: "Painkillers & Antipyretics",
        forms: "Capsule, Drop, Injection (Ampoule)",
        usage: "Unbearable severe trauma pain in fractures, amputations, severe burns, and rescue operations.",
        contra: "Not used in head trauma (suspected brain hemorrhage) and respiratory failure (can stop breathing).",
        fieldNote: "Causes respiratory depression at high doses; pulse and respiratory rate must be continuously monitored."
    },

    // ==========================================
    // 4. ALLERGY, ANAPHYLAXIS AND CORTICOSTEROIDS
    // ==========================================
    {
        name: "Adrenaline (Epinephrine)",
        brands: "Adrenaline Ampoule, EpiPen (Auto-injector)",
        category: "Allergy & Anaphylaxis",
        forms: "Injection (Ampoule / Auto-injector)",
        usage: "Fatal anaphylactic shock (shortness of breath, throat swelling, blood pressure collapse) due to bee/insect sting, drug or food allergy, and cardiac arrest.",
        contra: "Has no contraindications in life-threatening situations (anaphylaxis or cardiac arrest); directly saves lives.",
        fieldNote: "In anaphylactic shock, 0.3 - 0.5 mg is injected into the outer thigh muscle (IM); if the clear liquid turns pink or brown, it is spoiled."
    },
    {
        name: "Methylprednisolone / Dexamethasone (Cortisone)",
        brands: "Prednol, Dekort, Onadron, Ultralan",
        category: "Allergy & Anaphylaxis",
        forms: "Tablet, Injection (Ampoule / Vial), Ointment",
        usage: "Severe allergic reactions, asthma attacks, brain edema, severe tissue swelling after snake/scorpion bites, and shock support treatment.",
        contra: "Not used in untreated active systemic fungal infections and live vaccine administrations; can cause stomach ulcer bleeding.",
        fieldNote: "Injected after adrenaline in severe allergic swellings to prevent the reaction from recurring."
    },
    {
        name: "Pheniramine / Diphenhydramine (Antihistamines)",
        brands: "Avil, Fenistil, Benadryl, Zyrtec (Cetirizine)",
        category: "Allergy & Anaphylaxis",
        forms: "Tablet, Syrup, Injection (Ampoule), Gel",
        usage: "Hives (urticaria), insect sting itching, allergic rhinitis, and mild-moderate allergic rashes.",
        contra: "May cause urinary retention in those with narrow-angle glaucoma or prostate enlargement; causes severe drowsiness.",
        fieldNote: "Avil ampoule must be given very slowly intravenously; fast injection causes sudden blood pressure drop and dizziness."
    },

    // ==========================================
    // 5. RESPIRATORY SYSTEM AND ASTHMA MEDICATIONS
    // ==========================================
    {
        name: "Salbutamol (Albuterol)",
        brands: "Ventolin, Salbutam, Ronkotol",
        category: "Respiratory & Asthma",
        forms: "Inhaler, Nebule (Respiratory Device Capsule), Syrup",
        usage: "Asthma attacks, bronchoconstriction, wheezing shortness of breath due to smoke inhalation, and COPD exacerbations.",
        contra: "Use with caution in severe heart rhythm disorders; hand tremors and palpitations are normal side effects.",
        fieldNote: "The primary lifesaver that opens airways in seconds after inhaling fire smoke or chemical gas."
    },
    {
        name: "Ipratropium Bromide + Salbutamol",
        brands: "Combivent, İprasal",
        category: "Respiratory & Asthma",
        forms: "Nebule (Single Dose Vial), Inhaler",
        usage: "Severe bronchospasm not responding to salbutamol alone and acute respiratory distress.",
        contra: "Some inhaler forms are not used in those with soy or peanut allergies; avoid getting it in the eyes.",
        fieldNote: "Opens the airway with a dual mechanism in severe asthma and smoke poisoning crises."
    },
    {
        name: "Acetylcysteine (Mucolytic / Expectorant)",
        brands: "Asist, Muconex, NAC 600",
        category: "Respiratory & Asthma",
        forms: "Effervescent Tablet, Capsule, Syrup, Injection (Ampoule)",
        usage: "Bronchitis with thick sputum, pneumonia support treatment, and the only antidote for high-dose Paracetamol (Parol) poisoning.",
        contra: "Use with caution in patients with active stomach ulcer bleeding.",
        fieldNote: "CRITICAL INFO: If someone accidentally swallows too many Paracetamol, giving high-dose Acetylcysteine within the first 8 hours saves the liver from fatal failure."
    },

    // ==========================================
    // 6. STOMACH, INTESTINAL AND POISONING MEDICATIONS
    // ==========================================
    {
        name: "Activated Charcoal (Medical Charcoal)",
        brands: "Eucarbon (Low dose), Carbo-Mix, Medical Activated Charcoal Powder",
        category: "Stomach & Intestines",
        forms: "Powder (for Suspension), Tablet",
        usage: "Preventing poison absorption into the blood from the intestines in poisonous mushroom, spoiled food, drug overdose, and chemical ingestions.",
        contra: "ABSOLUTELY NOT given in bleach, spirits of salt (acid/base corrosives), petroleum products (gasoline/thinner), and alcohol poisoning (causes vomiting and burns the esophagus).",
        fieldNote: "If mixed with water and drunk within the first 1-2 hours after poisoning, it acts like a sponge to absorb the poison and expels it via stool."
    },
    {
        name: "Loperamide (Anti-Diarrheal)",
        brands: "Lopermid, İmodium, Diarex",
        category: "Stomach & Intestines",
        forms: "Tablet, Capsule",
        usage: "Temporarily stopping excessive fluid loss in severe watery diarrhea without fever and blood (e.g., during long walks or evacuation).",
        contra: "ABSOLUTELY NOT used in diarrhea with high fever, blood, or mucus (dysentery, cholera) (traps the microbe in the intestine and causes intestinal perforation).",
        fieldNote: "Does not cure diarrhea, only freezes bowel movement; must be taken with plenty of fluids and salt-sugar supplements."
    },
    {
        name: "Metoclopramide / Ondansetron (Anti-Emetic)",
        brands: "Metpamid, Primperan, Zofran, Zofer",
        category: "Stomach & Intestines",
        forms: "Tablet, Drop, Injection (Ampoule)",
        usage: "Preventing unstoppable severe vomiting and fluid loss after food poisoning, migraine, radiation sickness, or trauma.",
        contra: "Absolutely not used in suspected intestinal obstruction or stomach perforation.",
        fieldNote: "Since a vomiting patient cannot drink water, stopping vomiting is the lifesaving first step."
    },
    {
        name: "Pantoprazole / Omeprazole (Stomach Protector - PPI)",
        brands: "Pulcet, Pantpas, Nexium, Lansor",
        category: "Stomach & Intestines",
        forms: "Tablet, Capsule, Injection (IV Vial)",
        usage: "Stomach ulcers, gastritis, stress-induced stomach bleeding risk, and preventing painkillers (Ibuprofen/Diclofenac) from perforating the stomach.",
        contra: "No major contraindication in emergencies other than known allergy to the active ingredient.",
        fieldNote: "Must be given alongside strong painkillers (NSAIDs) or cortisone to every casualty in field conditions to prevent stomach bleeding."
    },

    // ==========================================
    // 7. SERUMS AND ELECTROLYTE SOLUTIONS
    // ==========================================
    {
        name: "Isotonic Sodium Chloride (0.9% NaCl - Normal Saline)",
        brands: "İzotonik, Polifleks %0.9, Biofleks",
        category: "Serums & Electrolytes",
        forms: "Solution (IV Serum Bag / Ampoule)",
        usage: "Treatment of heavy blood loss, burn shock, severe dehydration, keeping the IV line open, and sterile washing of open wounds/eyes.",
        contra: "Not administered too fast and in high volume in those with severe heart failure and pulmonary edema.",
        fieldNote: "The safest sterile liquid both as a lifesaving IV fluid and for washing open wounds and chemically exposed eyes."
    },
    {
        name: "Ringer's Lactate Solution",
        brands: "Ringer Laktat, Polifleks RL",
        category: "Serums & Electrolytes",
        forms: "Solution (IV Serum Bag)",
        usage: "Replacing electrolyte losses due to extensive burns, severe bleeding shock, and heavy diarrhea/vomiting.",
        contra: "Not used in severe liver failure and not given through the same IV line with Ceftriaxone (Rocephin) antibiotic.",
        fieldNote: "Maintains the body's acid-base balance better than Isotonic saline in trauma and burn patients."
    },
    {
        name: "Oral Rehydration Salts (ORS)",
        brands: "Ge-Oral, ORS Packet",
        category: "Serums & Electrolytes",
        forms: "Powder (Packet mixed with water)",
        usage: "Treating fatal dehydration orally without needing an IV line in cholera, dysentery, and severe diarrhea/vomiting.",
        contra: "Not given to someone unconscious (no swallowing reflex) or with intestinal obstruction.",
        fieldNote: "If no ready packet is available: Mix 6 level teaspoons of sugar + half a teaspoon of salt into 1 liter of boiled, cooled clean water to make an exact replica."
    },

    // ==========================================
    // 8. HEART, BLOOD PRESSURE AND VASCULAR MEDICATIONS
    // ==========================================
    {
        name: "Glyceryl Trinitrate / Isosorbide Dinitrate (Sublingual)",
        brands: "Nitrolingual Sprey, İsordil 5 mg Dilaltı",
        category: "Heart & Blood Pressure",
        forms: "Tablet (Sublingual), Spray, Injection (IV)",
        usage: "Suspected heart attack, chest tightness (angina pectoris), and suddenly rising hypertensive crisis.",
        contra: "Causes a fatal blood pressure drop in those with low blood pressure (systolic < 90 mmHg) and those who took Viagra/Sildenafil derivatives within the last 24-48 hours.",
        fieldNote: "The patient must be seated or laid down before application; if given while standing, they will faint from a sudden blood pressure drop."
    },
    {
        name: "Captopril (Emergency Blood Pressure Reducer)",
        brands: "Kapril, Kaptoril",
        category: "Heart & Blood Pressure",
        forms: "Tablet",
        usage: "Very high blood pressure carrying a risk of brain hemorrhage (hypertensive emergency) and heart failure.",
        contra: "Absolutely not used in pregnant women. Causes acute kidney failure in those with renal artery stenosis.",
        fieldNote: "Safely lowers high blood pressure within 15-30 minutes when swallowed or dissolved under the tongue."
    },
    {
        name: "Amlodipine / Nifedipine (Calcium Channel Blockers)",
        brands: "Norvasc, Monodur, Nidilat",
        category: "Heart & Blood Pressure",
        forms: "Tablet, Capsule",
        usage: "Chronic high blood pressure control and support treatment for cold-induced vascular constriction (Raynaud's / early frostbite).",
        contra: "Not used in cardiogenic shock and severe aortic stenosis.",
        fieldNote: "The capsule must not be popped and squeezed under the tongue for rapid effect; a sudden drop in blood pressure can lead to a stroke. It must be swallowed whole."
    },
    {
        name: "Metoprolol / Propranolol (Beta Blockers)",
        brands: "Beloc, Dideral, Saneloc",
        category: "Heart & Blood Pressure",
        forms: "Tablet, Injection (IV Ampoule)",
        usage: "Severe heart palpitations (tachycardia), rhythm disorders, high blood pressure, and severe panic/tremor control.",
        contra: "Not used in asthma and COPD patients (blocks bronchi and causes suffocation) and those with a pulse below 50.",
        fieldNote: "Must never be given to someone with a history of asthma."
    },
    {
        name: "Furosemide (Strong Diuretic)",
        brands: "Lasix, Desal, Furomid",
        category: "Heart & Blood Pressure",
        forms: "Tablet, Injection (Ampoule)",
        usage: "Pulmonary edema (fluid in the lungs), heart failure swelling, and high blood pressure crises.",
        contra: "Causes fatal shock in dehydrated, bleeding, or low blood pressure casualties.",
        fieldNote: "Rapidly expels water and potassium from the body; used only if there is fluid buildup in the lungs (frothy sputum and a feeling of suffocation)."
    },

    // ==========================================
    // 9. NERVOUS SYSTEM, EPILEPSY AND SEDATIVES
    // ==========================================
    {
        name: "Diazepam / Midazolam (Benzodiazepines)",
        brands: "Diazem, Dormicum, Nervium",
        category: "Nervous System & Sedatives",
        forms: "Tablet, Injection (Ampoule), Rectal Tube",
        usage: "Continuous epileptic seizures, febrile convulsions in children, tetanus muscle spasms, and severe trauma shock sedative.",
        contra: "Not used in severe respiratory failure and sleep apnea; stops breathing if given with alcohol or morphine.",
        fieldNote: "In seizing patients where IV access cannot be found, rectal tube or intranasal application stops the seizure in seconds."
    },
    {
        name: "Levetiracetam / Phenytoin / Valproic Acid",
        brands: "Keppra, Epdantoin, Depakin",
        category: "Nervous System & Sedatives",
        forms: "Tablet, Syrup, Injection (IV Vial)",
        usage: "Preventing seizures in chronic epilepsy patients and seizure protection after head trauma.",
        contra: "Valproic acid is not used in pregnant women and severe liver disease.",
        fieldNote: "Sudden withdrawal of medication by epilepsy patients leads to fatal continuous seizures (Status Epilepticus)."
    },
    {
        name: "Haloperidol / Chlorpromazine (Emergency Antipsychotic)",
        brands: "Nörodol, Largactil",
        category: "Nervous System & Sedatives",
        forms: "Tablet, Drop, Injection (Ampoule)",
        usage: "Severe psychotic aggression causing harm to self or others during a crisis, and uncontrollable hiccups.",
        contra: "Not used in coma, severe heart rhythm disorders, and Parkinson's disease.",
        fieldNote: "Intramuscular (IM) injection controls severe aggression crises within 15-20 minutes."
    },

    // ==========================================
    // 10. LOCAL ANESTHETICS (SURGICAL INTERVENTION)
    // ==========================================
    {
        name: "Lidocaine (Local Anesthetic)",
        brands: "Jetokain, Aritmal, Anestol (Ointment), Xylocaine",
        category: "Local Anesthetics",
        forms: "Injection (Ampoule / Vial), Ointment, Spray",
        usage: "Numbing the area before suturing open wounds, foreign body (bullet/splinter/glass) removal, and abscess drainage.",
        contra: "Adrenaline-containing forms (Jetokain) are ABSOLUTELY NOT injected into extremities like fingertips, nose, ears, and penis (constricts vessels and causes gangrene).",
        fieldNote: "Injected around the wound edges before suturing; numbness starts in 2-3 minutes and lasts for 1 hour."
    },

    // ==========================================
    // 11. EYE, EAR AND NOSE MEDICATIONS
    // ==========================================
    {
        name: "Tobramycin / Gentamicin / Moxifloxacin Eye Drops",
        brands: "Tobrex, Gentagut, Vigamox, Tobrased",
        category: "Eye & Ear",
        forms: "Drop, Eye Ointment",
        usage: "Eye inflammation (conjunctivitis), eye infection after dust/smoke exposure, corneal scratches, and outer ear canal inflammation.",
        contra: "Cortisone eye drops (Tobrased, etc.) are not used if there are scratches/ulcers or herpes in the eye (can perforate the eye).",
        fieldNote: "Use only plain antibiotic drops/ointments for eye injuries; avoid cortisone ones."
    },
    {
        name: "Oxymetazoline / Xylometazoline (Nasal Decongestant)",
        brands: "İliadin, Otrivine, Burnil",
        category: "Eye & Ear",
        forms: "Spray, Drop",
        usage: "Clearing blocked nasal passages and temporarily constricting the bleeding vessel in nosebleeds.",
        contra: "Destroys nasal mucosa if used continuously for more than 5 days; use with caution in severe hypertension.",
        fieldNote: "In unstoppable anterior nosebleeds, spraying it onto a cotton ball and placing it in the nostril rapidly stops the bleeding."
    },

    // ==========================================
    // 12. DIABETES AND THYROID HORMONES
    // ==========================================
    {
        name: "Insulin (Regular / NPH / Glargine)",
        brands: "Humulin R, Novorapid, Lantus, Levemir",
        category: "Diabetes & Hormone",
        forms: "Injection (Pen / Vial)",
        usage: "Survival of Type 1 diabetes patients and severe high blood sugar (diabetic coma).",
        contra: "If given to someone with low blood sugar (hypoglycemia), it causes brain death and coma within minutes.",
        fieldNote: "Even if the cold chain is broken, unopened vials remain effective at room temperature (below 25°C) for about 28 days; do not use frozen or crystallized insulin."
    },
    {
        name: "Metformin / Gliclazide (Diabetes Pills)",
        brands: "Glucophage, Matofin, Diamicron, Betanorm",
        category: "Diabetes & Hormone",
        forms: "Tablet",
        usage: "Blood sugar control in Type 2 diabetes.",
        contra: "Not used in severe dehydration, kidney failure, and starvation (Gliclazide drops sugar fatally if taken on an empty stomach).",
        fieldNote: "In field conditions, if food cannot be found, blood sugar-lowering pills should not be taken."
    },
    {
        name: "Levothyroxine Sodium (Thyroid Hormone)",
        brands: "Euthyrox, Levotiron, Tefor",
        category: "Diabetes & Hormone",
        forms: "Tablet",
        usage: "Daily hormone support for patients whose thyroid gland is removed or who have hypothyroidism.",
        contra: "Not used in untreated adrenal insufficiency and acute heart attack.",
        fieldNote: "Should be taken in the morning on an empty stomach with water, at least 30 minutes before other medications."
    },

    // ==========================================
    // 13. MOST COMMON PAINKILLERS AND COLD MEDICATIONS
    // ==========================================
    {
        name: "Dexketoprofen (Arveles)",
        brands: "Arveles, Dexofen, Elektra, Rastel",
        category: "Painkillers & Antipyretics",
        forms: "Tablet, Injection (Ampoule), Gel",
        usage: "Severe toothache, neck-back stiffness, muscle-joint pain, menstrual cramps, and sharp pain after surgery/trauma.",
        contra: "Not used in those with stomach ulcers/bleeding, kidney failure, the last 3 months of pregnancy, and casualties with open bleeding.",
        fieldNote: "A very fast-acting, strong painkiller; must be taken on a full stomach or with a stomach protector to prevent stomach perforation."
    },
    {
        name: "Naproxen Sodium (Apranax / Naprosyn)",
        brands: "Apranax, Apranax Fort, Naprosyn, Aprol",
        category: "Painkillers & Antipyretics",
        forms: "Tablet, Gel (Naprosyn Gel)",
        usage: "Muscle injuries, sprains, rheumatic pain, severe headaches, and menstrual cramps.",
        contra: "Seriously increases the risk of stomach bleeding in those with stomach bleeding, severe heart-kidney failure, and those taking blood thinners.",
        fieldNote: "The gel form (Naprosyn) stops pain by applying it directly to the sprained or injured area without harming the stomach."
    },
    {
        name: "Paracetamol + Chlorpheniramine + Pseudoephedrine (Cold Combinations)",
        brands: "A-ferin, Tylol Hot, Theraflu, Katarin, İburamin Cold",
        category: "Respiratory & Cold",
        forms: "Tablet, Capsule, Hot Water Powder (Sachet), Children's Syrup",
        usage: "Flu, common cold, runny nose, sinusitis congestion, malaise, and fever.",
        contra: "In those with high blood pressure (hypertension), the pseudoephedrine inside dangerously raises blood pressure; not used in severe heart patients.",
        fieldNote: "Since it already contains Paracetamol, taking extra Parol/Minoset at the same time causes liver poisoning (overdose)."
    },

    // ==========================================
    // 14. BLOOD THINNERS, BLOOD PRESSURE AND CHOLESTEROL MEDICATIONS
    // ==========================================
    {
        name: "Clopidogrel (Plavix)",
        brands: "Plavix, Karum, Pingel, Planor",
        category: "Heart & Blood Pressure",
        forms: "Tablet",
        usage: "Preventing vascular blockage and clots in patients who had a heart attack, stroke, or have a heart stent.",
        contra: "Not used in active internal bleeding, stomach ulcer bleeding, and open-wound trauma patients (does not stop bleeding).",
        fieldNote: "Sudden discontinuation of Plavix by a patient with a stent causes the stent to clog with a clot, leading to a sudden heart attack."
    },
    {
        name: "Enoxaparin Sodium (Blood Thinner Injection)",
        brands: "Clexane, Oksapar, Enox",
        category: "Heart & Blood Pressure",
        forms: "Injection (Pre-filled Syringe)",
        usage: "Leg vein blockage (deep vein thrombosis), pulmonary embolism, clot prevention in immobilized casualties, and heart attack.",
        contra: "Not used in those with active bleeding, suspected brain hemorrhage, and head trauma.",
        fieldNote: "Administered subcutaneously around the navel at a 90-degree angle; the area is not rubbed after injection."
    },
    {
        name: "Valsartan + Amlodipine / Olmesartan Combinations",
        brands: "Exforge, Excaliba, Kombisar, Co-Diovan",
        category: "Heart & Blood Pressure",
        forms: "Tablet",
        usage: "Daily control of moderate to high blood pressure (hypertension) that does not drop with a single drug.",
        contra: "Not used in pregnant women (causes severe harm to the baby) and those with low blood pressure.",
        fieldNote: "Combines two different blood pressure medications in a single tablet; sudden withdrawal in regular users causes a hypertensive crisis."
    },
    {
        name: "Fenofibrate / Atorvastatin (Cholesterol and Triglyceride Medications)",
        brands: "Lipantil, Lipitor, Ator, Crestor",
        category: "Heart & Blood Pressure",
        forms: "Capsule, Tablet",
        usage: "Lowering high fat (triglycerides) and bad cholesterol in the blood to prevent arteriosclerosis and pancreatitis crises.",
        contra: "Not used in active liver disease, gallstone obstruction, and pregnancy.",
        fieldNote: "Not an emergency lifesaver; however, long-term discontinuation in patients with extremely high triglycerides using Lipantil can trigger pancreas inflammation."
    },

    // ==========================================
    // 15. STOMACH, REFLUX, INTESTINAL, LAXATIVE, LIVER AND KIDNEY MEDICATIONS
    // ==========================================
    {
        name: "Calcium Carbonate / Sodium Alginate (Heartburn and Reflux)",
        brands: "Rennie, Gaviscon, Talcid, Rennie Duo",
        category: "Stomach & Intestines",
        forms: "Chewable Tablet, Syrup (Suspension)",
        usage: "Heartburn, sour stomach, acid reflux, esophagus irritation, and mild stomach ache.",
        contra: "Not used in high doses in severe kidney failure and high blood calcium levels.",
        fieldNote: "Rennie is chewed, and Gaviscon is drunk after meals to build a protective barrier over stomach acid; leave a 2-hour gap with other medications."
    },
    {
        name: "Hyoscine-N-Butylbromide (Abdominal and Kidney Colic Spasmolytic)",
        brands: "Buscopan, Spazmol, Molit",
        category: "Stomach & Intestines",
        forms: "Tablet, Injection (Ampoule)",
        usage: "Severe gastrointestinal cramps, gallbladder colic, kidney stone pain, and menstrual cramps.",
        contra: "Not used in cases of bowel obstruction, glaucoma, and inability to urinate (prostate obstruction).",
        fieldNote: "When administered with Diclofenac (Voltaren) or Arveles for kidney stone colic, it relaxes the contracted urinary tract and facilitates stone passage."
    },
    {
        name: "Bisacodyl / Sennoside / Lactulose (Laxatives and Constipation Medications)",
        brands: "Dulcolax, Bekunis, Duphalac, Osmolak, Libalaks (Enema)",
        category: "Stomach & Intestines",
        forms: "Tablet, Syrup, Enema (Rectal Tube)",
        usage: "Emptying the bowels in severe constipation developing due to dry food and dehydration.",
        contra: "ABSOLUTELY NOT given in suspected appendicitis (lower right abdominal pain), intestinal twisting, and severe abdominal pain (can rupture the intestine).",
        fieldNote: "Dry rations and low water consumption cause constipation in field conditions; extra water must be consumed when using a laxative."
    },
    {
        name: "Simethicone / Trimebutine (Gas and Bowel Regulator)",
        brands: "Metsil, Sab Simplex, Debridat, Tribudat",
        category: "Stomach & Intestines",
        forms: "Tablet, Drop, Syrup (Suspension)",
        usage: "Painful trapped intestinal gas, bloating, infant gas pain (colic), and restless bowel spasms.",
        contra: "A safe drug with no contraindications other than known allergy; it pops gas bubbles in the intestine without entering the bloodstream.",
        fieldNote: "Metsil/Sab Simplex drops are safely used for crying crises related to gas pain in babies and children."
    },
    {
        name: "Ursodeoxycholic Acid / Silymarin (Liver and Gallbladder Protectors)",
        brands: "Ursofalk, Ursactive, Legalon (Milk Thistle Extract)",
        category: "Liver & Kidney",
        forms: "Capsule, Tablet",
        usage: "Supporting cell regeneration in fatty liver, biliary sludge, drug or mushroom/toxin-induced liver stress.",
        contra: "Not used in acute gallbladder inflammation (acute cholecystitis) and when bile ducts are completely blocked by stones.",
        fieldNote: "Used as support to protect the liver after suspected poisoning from plants, mushrooms, or spoiled food."
    },
    {
        name: "Tamsulosin / Potassium Citrate (Kidney Stone Expeller and Channel Opener)",
        brands: "Flomax, Üromax, Urocit-K",
        category: "Liver & Kidney",
        forms: "Capsule, Tablet",
        usage: "Accelerating the passage of kidney stones from the urinary tract and reducing urinary tract burning.",
        contra: "Must be used with caution in severe liver failure and severe low blood pressure (causes dizziness upon standing).",
        fieldNote: "Expands the channel and shortens stone passing time when a kidney stone is stuck."
    },

    // ==========================================
    // 16. WOUND, BURN, HERPES, FUNGAL AND HEMORRHOID OINTMENTS
    // ==========================================
    {
        name: "Centella Asiatica / Dexpanthenol (Wound and Burn Healer)",
        brands: "Madecassol, Bepanthol, Bepanthen Plus, Hametan",
        category: "Ointment & Skin Care",
        forms: "Ointment, Cream, Lotion",
        usage: "Healing open wounds, 1st and 2nd-degree burns, frostbite skin cracks, diaper rash, and friction wounds.",
        contra: "Not applied directly inside deep, infected, and dirty open wounds (must be cleaned with an antiseptic first).",
        fieldNote: "Madecassol and Bepanthol accelerate tissue regeneration; Hametan is soothing for both burns and hemorrhoids/irritation."
    },
    {
        name: "Acyclovir (Herpes and Shingles Cream / Tablet)",
        brands: "Zovirax, Aklovir, Hernovir, Zovimax",
        category: "Ointment & Skin Care",
        forms: "Cream (Herpes Ointment), Tablet, Eye Ointment",
        usage: "Lip and facial herpes, painful blistering shingles rashes, and herpes-induced eye inflammation.",
        contra: "High-dose tablet form is not used in patients with kidney failure without adjustment.",
        fieldNote: "If the cream is applied in the first few hours when tingling is felt on the lip, it prevents the herpes from erupting and spreading."
    },
    {
        name: "Tribenoside + Lidocaine / Ruscogenin (Hemorhoid / Piles Medications)",
        brands: "Procto-Glyvenol, Kortos, Hedensa, Ultraproct",
        category: "Ointment & Skin Care",
        forms: "Cream (Pomade), Suppository",
        usage: "Relieving the pain of painful, swollen, and bleeding hemorrhoids and anal fissures.",
        contra: "Cortisone forms (Kortos/Ultraproct) are not used for long periods if there is active fungal or tuberculosis/viral skin infection in the area.",
        fieldNote: "Rapidly soothes hemorrhoid crises frequently seen in field conditions due to carrying heavy loads, sitting on cold ground, and constipation."
    },
    {
        name: "Terbinafine / Ketoconazole / Clotrimazole (Antifungals)",
        brands: "Lamisil, Terbisil, Ketoral, Travazol, Canesten",
        category: "Ointment & Skin Care",
        forms: "Cream, Spray, Tablet, Shampoo",
        usage: "Athlete's foot (trench foot onset), jock itch, nail fungus, and fungal infections developing in humid environments.",
        contra: "Terbinafine tablet is not used in active liver disease.",
        fieldNote: "Athlete's foot developing in those walking for long hours with wet boots and socks can turn into an open wound and get infected; early cream intervention is essential."
    },
    {
        name: "Budesonide / Fluticasone (Lung Inhalers and Cortisone Inhalers)",
        brands: "Pulmicort, Symbicort, Seretide, Flixotide",
        category: "Respiratory & Asthma",
        forms: "Inhaler (Air / Dry Powder), Nebule Capsule",
        usage: "Suppressing long-term bronchial inflammation and opening the breath in chronic asthma, COPD, cold air or smoke-induced inflammation.",
        contra: "Must be used with caution in those with untreated active pulmonary tuberculosis.",
        fieldNote: "The mouth must be rinsed with water after using cortisone inhalers (Pulmicort/Symbicort), otherwise, it causes thrush (fungus) in the mouth."
    },

    // ==========================================
    // 17. EYE AND EAR DROPS (GENERAL USE)
    // ==========================================
    {
        name: "Ciprofloxacin / Ofloxacin Ear and Eye Drops",
        brands: "Siprogut, Ciloxan, Exocin",
        category: "Eye & Ear",
        forms: "Drop (Eye / Ear)",
        usage: "Outer ear canal inflammation after dirty water entry (swimmer's ear), ear discharge, and bacterial eye discharge.",
        contra: "Safe other than known quinolone allergy; one of the rare safe drops that can be used even if the eardrum is perforated.",
        fieldNote: "Cold ear drops cause dizziness and vomiting; warm the bottle in the palm of your hand to body temperature before instilling."
    },
    {
        name: "Glycerin / Carbamide Peroxide (Ear Wax Softener)",
        brands: "Glycerin Ear Drops, Otowax, Remo-Wax",
        category: "Eye & Ear",
        forms: "Drop",
        usage: "Softening hardened ear wax (cerumen) when it causes blockage and hearing loss.",
        contra: "ABSOLUTELY NOT instilled in case of suspected eardrum perforation, blood/pus coming from the ear, and severe earache.",
        fieldNote: "Used only if there is a painless sensation of blockage."
    },
    {
        name: "Artificial Tears (Sodium Hyaluronate / Carbomer)",
        brands: "Refresh, Tears Naturale, Eyestil, Viscotears",
        category: "Eye & Ear",
        forms: "Drop (Single Dose / Bottle), Eye Gel",
        usage: "Cleaning eye burning, stinging, and foreign body sensation caused by dust, wind, smoke, and dry air.",
        contra: "Has no known contraindications; safely used at any age.",
        fieldNote: "When dust or ash gets into the eye, washing it with plenty of artificial tears or normal saline before rubbing prevents corneal scratching."
    },

    // ==========================================
    // 18. WOMEN'S HEALTH MEDICATIONS
    // ==========================================
    {
        name: "Miconazole / Clotrimazole / Metronidazole Vaginal Ovule",
        brands: "Gyno-Lomaxin, Neo-Penotran, Zalain, Candimax",
        category: "Women's Health",
        forms: "Vaginal Suppository (Ovule), Cream",
        usage: "Vaginal fungal and bacterial infections developing due to lack of hygiene, wet clothes, and antibiotic use.",
        contra: "Metronidazole-containing forms are not used in the first 3 months of pregnancy; alcohol is not consumed during treatment.",
        fieldNote: "Used in the treatment of the most common infections in women in field conditions where clean water and underwear are scarce."
    },
    {
        name: "Tranexamic Acid (Severe Bleeding Stopper)",
        brands: "Transamin, Herem",
        category: "Women's Health",
        forms: "Tablet, Injection (Ampoule)",
        usage: "Unstoppable excessive menstrual bleeding, postpartum bleeding, and severe internal/external trauma bleeding.",
        contra: "Not used in people who have had active vascular occlusion (clot/embolism) and intracerebral hemorrhages.",
        fieldNote: "Saves lives by preserving clots in both excessive blood loss due to gynecological diseases and severe trauma bleeding."
    },
    {
        name: "Levonorgestrel / Ethinylestradiol (Birth Control and Emergency Contraception)",
        brands: "Ella, NorLevo, Yasmin, Microgynon",
        category: "Women's Health",
        forms: "Tablet",
        usage: "Prevention of unwanted pregnancies, emergency contraception (first 72-120 hours), and hormonal irregularity bleeding.",
        contra: "Not used in cases of vascular occlusion history, severe liver disease, and existing pregnancy.",
        fieldNote: "Critical for preventing pregnancy after unprotected contact in crisis and disaster environments."
    },

    // ==========================================
    // 19. CHILDREN'S MEDICATIONS (100% BASIC PEDIATRIC LIST)
    // ==========================================
    {
        name: "Children's Paracetamol Syrup and Suppository",
        brands: "Calpol (120 mg / 250 mg), Parol Suspension, Paranox S (Suppository)",
        category: "Children's Medications",
        forms: "Syrup (Suspension), Suppository",
        usage: "Fever reduction in infants and children, post-vaccination fever, teething pain, and ear/throat pain.",
        contra: "Not used in severe liver disease. Pediatric doses must be calculated based on the child's weight (10-15 mg/kg); not given more frequently than every 4-6 hours.",
        fieldNote: "In vomiting infants or those who cannot take syrup, Paranox S suppository safely lowers fever when administered rectally."
    },
    {
        name: "Children's Ibuprofen Syrup",
        brands: "Dolven, Pedifen, İbufen",
        category: "Children's Medications",
        forms: "Syrup (Suspension)",
        usage: "High fever resistant to Paracetamol, middle ear infection pain, and tonsillitis pain.",
        contra: "Not used in infants under 6 months, children with chickenpox, and dehydrated children due to diarrhea/vomiting.",
        fieldNote: "Can be used alternately with Calpol (every 4 hours) for high fever; must be given on a full stomach."
    },
    {
        name: "Children's Antibiotic Suspensions (Amoxicillin / Cefuroxime / Azithromycin)",
        brands: "Augmentin BID Suspension, Klamoks BID, Zinnat Suspension, Azitro Syrup",
        category: "Children's Medications",
        forms: "Syrup (Dry Suspension)",
        usage: "Middle ear infection, throat infection (beta), pneumonia, urinary tract infection, and inflamed wounds in children.",
        contra: "Augmentin/Klamoks is not used in children with penicillin allergy (Azitro syrup is chosen instead).",
        fieldNote: "The dry powder in the bottle must be reconstituted with boiled and cooled clean water up to the line and shaken well."
    },
    {
        name: "Children's Allergy and Cough / Bronchodilator Syrups",
        brands: "Zaditen, Zyrtec Drop/Syrup, Aerius Syrup, Ventolin Syrup",
        category: "Children's Medications",
        forms: "Syrup, Drop",
        usage: "Insect sting allergy, hives, allergic shortness of breath, and wheezy bronchitis in children.",
        contra: "Cough suppressant syrups are not given to infants under 1 year old without a doctor's control.",
        fieldNote: "If the child's body develops widespread swelling after a bee or insect sting, Zyrtec/Aerius syrup rapidly suppresses the allergy."
    },
    {
        name: "Children's Probiotic and Diarrhea Powders (Zinc + Probiotic)",
        brands: "Reflor (Sachet), Maflor Drop, Zinco Syrup, Ge-Oral",
        category: "Children's Medications",
        forms: "Powder (Sachet), Drop, Syrup",
        usage: "Stopping diarrhea developing due to dirty water or antibiotic use in children and repairing intestinal flora.",
        contra: "Live yeast (Reflor) must be used with caution in severely ill patients whose immune system has completely collapsed.",
        fieldNote: "The number one cause of diarrhea deaths in children is fluid loss; while probiotics and zinc shorten diarrhea, Ge-Oral/salt-sugar water saves lives."
    }   
];