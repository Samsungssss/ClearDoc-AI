import { DocumentAnalysis } from '../types/document';

export const SAMPLE_HOUSING_NOTICE: DocumentAnalysis = {
  id: 'sample-housing-notice-2026',
  fileName: 'Housing_Authority_Notice_of_Inspection_Remedy.pdf',
  fileSize: 248190,
  fileType: 'application/pdf',
  uploadDate: new Date().toISOString(),
  documentType: 'Municipal Housing Compliance Notice',
  oneSentenceSummary: 'The City Housing Authority found two building maintenance infractions during a random check and requires you to submit proof of repairs within 14 days or face a $250 non-compliance fine.',
  shortSummary: 'This is an official Notice of Violation and Corrective Action issued by the Metro Housing Inspection Bureau. It specifies that during a physical inspection conducted on October 1, 2026, two items failed standard code: a non-functional hallway smoke detector and a slow secondary fire exit latch. You have until October 19, 2026, to fix the issues, photograph them, submit the compliance certification form, and settle an administrative re-inspection charge of $85.00.',
  detailedSummary: 'The Metro Housing Inspection Bureau (MHIB) operates under Municipal Code Title 14-C governing residential safety. This formal notice certifies that inspector badge #449 entered the common areas and recorded 2 Class-B non-hazardous life safety infractions. Specifically: Section 14.2 (smoke alarm audible threshold below 85dB at 10 feet) and Section 18.4 (exterior exit hardware resistance exceeding 15 lbs force). Property owners or primary tenants of record must remediate both conditions before the statutory cure period expires on October 19, 2026. Failure to file an executed Affidavit of Rectification or to request an Administrative Hearing within 10 calendar days results in an automatic escalating penalty schedule starting at $250 per week plus mandatory court referral.',
  whatItMeans: {
    overview: 'This document is a warning from city housing inspectors. They checked the building and found two small safety issues with the smoke alarm and exit door. You are not in legal trouble yet, but you must fix them within two weeks so you do not get fined.',
    plainLanguageExplanation: [
      'The city inspected your building on October 1, 2026, and flagged two minor safety problems.',
      'Problem 1: The hallway smoke alarm is either battery-dead or too quiet. It needs to be replaced or tested.',
      'Problem 2: The back exit door is sticking and hard to push open. It needs lubricating or latch alignment.',
      'You have until October 19, 2026 (14 business days) to make the repairs and send photos to the city portal.',
      'There is an $85 administrative re-inspection fee due with your submission.',
      'If you ignore this, the city will issue a $250 fine and send an inspector again.'
    ],
    jargonExplained: [
      {
        term: 'Class-B Non-Hazardous Infraction',
        simpleExplanation: 'A safety defect that needs fixing, but is not dangerous enough to force anyone to leave the building immediately.'
      },
      {
        term: 'Statutory Cure Period',
        simpleExplanation: 'The exact legal time window given to you to fix the problem before penalties begin.'
      },
      {
        term: 'Affidavit of Rectification',
        simpleExplanation: 'A signed official paper where you swear under oath that you have finished the required repairs.'
      },
      {
        term: 'Administrative Re-inspection Assessment',
        simpleExplanation: 'The fee the city charges you to review your repair photos and process your paperwork.'
      }
    ]
  },
  importantInformation: {
    deadlines: [
      {
        title: 'Submit Repair Proof & Affidavit',
        date: 'October 19, 2026 (5:00 PM EST)',
        timeRemaining: '14 calendar days remaining',
        consequence: 'Automatic $250 civil penalty assessed weekly; case transferred to Municipal Hearing Board.',
        isUrgent: true
      },
      {
        title: 'Appeal or Request Administrative Hearing',
        date: 'October 12, 2026 (5:00 PM EST)',
        timeRemaining: '7 days remaining',
        consequence: 'Forfeiture of right to contest inspector findings without formal court appearance.',
        isUrgent: false
      }
    ],
    amounts: [
      {
        label: 'Administrative Review & Processing Fee',
        amount: '$85.00',
        currency: 'USD',
        dueDate: 'October 19, 2026',
        isPayableByYou: true,
        paymentMethodOrNotes: 'Payable via MetroPay portal (Invoice #MHIB-8829) or check payable to City Treasurer.'
      },
      {
        label: 'Potential Default Penalty (If Deadline Missed)',
        amount: '$250.00 / week',
        currency: 'USD',
        dueDate: 'After October 19, 2026',
        isPayableByYou: false,
        paymentMethodOrNotes: 'Only applies if cure proof is not uploaded before the deadline.'
      }
    ],
    requiredDocuments: [
      {
        name: 'Form MH-14: Affidavit of Rectification',
        purpose: 'Certifies repairs were completed in compliance with local safety standards.',
        isOriginalRequired: false
      },
      {
        name: 'Time-stamped photographs of repairs',
        purpose: 'Photo 1 showing working smoke detector with green test light; Photo 2 showing clear exit door threshold.',
        isOriginalRequired: false
      },
      {
        name: 'Contractor receipt or hardware purchase receipt',
        purpose: 'Proof that commercial grade smoke detector battery or latch hardware was purchased.',
        isOriginalRequired: false
      }
    ],
    contactInformation: [
      {
        nameOrEntity: 'Metro Housing Inspection Bureau (MHIB)',
        role: 'Issuing Municipal Department',
        phone: '(555) 019-4820',
        email: 'compliance@metrohousing.gov',
        address: '450 Civic Center Plaza, Room 310, Metro City',
        website: 'https://housing.metrocity.gov/compliance'
      },
      {
        nameOrEntity: 'Inspector Marcus Vance (Badge #449)',
        role: 'Field Code Enforcement Officer',
        phone: '(555) 019-4829',
        email: 'mvance@metrohousing.gov'
      }
    ],
    referenceNumbers: [
      {
        type: 'Case Tracking ID',
        value: 'MHIB-2026-09418',
        notes: 'Quote this in all emails and payment forms'
      },
      {
        type: 'Parcel / Property Code',
        value: 'PAR-4482-019-A',
        notes: 'Identifies the physical real estate lot'
      },
      {
        type: 'Payment Portal Pin',
        value: '849201',
        notes: 'Required to unlock online invoice payment'
      }
    ],
    warnings: [
      {
        title: 'Firm 14-day statutory cure window',
        detail: 'The municipal computer system automatically logs fines if no upload is registered by 5:00 PM EST on October 19, 2026. Inspector has no discretion to waive after this date.',
        severity: 'critical'
      },
      {
        title: 'Only battery alarms with 10-year sealed batteries accepted',
        detail: 'Do not install basic 9V battery alarms; code requires 10-year tamper-resistant sealed lithium units.',
        severity: 'warning'
      }
    ]
  },
  actionPlan: [
    {
      id: 'step-1',
      stepNumber: 1,
      task: 'Purchase and install a 10-year sealed lithium smoke detector',
      details: 'Replace the existing unit in the hallway. Ensure audible test button sounds clearly and green power indicator is illuminated.',
      deadline: 'October 14, 2026',
      priority: 'high',
      completed: false
    },
    {
      id: 'step-2',
      stepNumber: 2,
      task: 'Adjust and lubricate the secondary exit door strike plate',
      details: 'Loosen strike plate screws, align latch with door frame, lubricate hinges, and verify door opens with less than 15 lbs force without sticking.',
      deadline: 'October 15, 2026',
      priority: 'high',
      completed: false
    },
    {
      id: 'step-3',
      stepNumber: 3,
      task: 'Take 2 date-stamped photographs of the completed repairs',
      details: 'Capture a close-up of the installed smoke alarm with power light, and a wide shot showing the open secondary exit door.',
      deadline: 'October 16, 2026',
      priority: 'medium',
      completed: false
    },
    {
      id: 'step-4',
      stepNumber: 4,
      task: 'Complete and sign Form MH-14 (Affidavit of Rectification)',
      details: 'Fill in Case ID MHIB-2026-09418, describe the repairs, sign and date.',
      deadline: 'October 17, 2026',
      priority: 'medium',
      completed: false
    },
    {
      id: 'step-5',
      stepNumber: 5,
      task: 'Upload documentation and pay the $85 fee via MetroPay portal',
      details: 'Visit housing.metrocity.gov/compliance, enter Case ID and PIN 849201, attach photos and Form MH-14, then submit $85 payment before 5:00 PM October 19.',
      deadline: 'October 19, 2026',
      priority: 'high',
      completed: false
    }
  ],
  missingInformation: [
    {
      item: 'Specific building unit number or floor designation',
      whyItMatters: 'The notice lists the building address but does not state whether the hallway was on the 2nd or 3rd floor.',
      recommendation: 'Check all common hallways in the building to ensure both detectors meet code, or call Inspector Vance at (555) 019-4829 to confirm which floor was inspected.'
    },
    {
      item: 'Direct download link for Form MH-14 blank template',
      whyItMatters: 'Form MH-14 is referenced repeatedly but the blank form was not attached to the notice.',
      recommendation: 'Download Form MH-14 directly from the city compliance portal or request it via email from compliance@metrohousing.gov.'
    }
  ],
  importantSections: [
    {
      title: 'Section 4: Remediation Standards & Evidentiary Proof',
      originalQuote: '"...All remediations must be verified by photographic evidence corroborated by certified proof of purchase or licensed contractor bill of lading..."',
      simplifiedMeaning: 'You cannot just say you fixed it; you must provide clear photographs and the purchase store receipt or contractor invoice.'
    },
    {
      title: 'Section 7: Automatic Escalation Penalty Clause',
      originalQuote: '"...Failure to secure closure on or before Day 14 post-issuance initiates immediate assessment of $250.00 recurring weekly administrative civil fines..."',
      simplifiedMeaning: 'If you miss the 14-day deadline, you will automatically be charged $250 every week until the city officially closes the file.'
    }
  ],
  deepThinkingAnalysis: {
    clauseBreakdown: [
      {
        clause: 'Section 14.2 & Section 18.4 Combined Liability',
        riskLevel: 'high',
        finding: 'The inspector grouped two distinct code classes into a single ticket without granting separate cure timelines.',
        userImpact: 'If you repair the smoke detector but delay the exit door latch repair, the entire notice defaults and the full $250 penalty triggers.'
      },
      {
        clause: 'Administrative Fee Non-Refundability',
        riskLevel: 'low',
        finding: 'The $85 review fee is required regardless of whether your repair proof is accepted on the first review.',
        userImpact: 'Ensure photos are sharp and clear on the first submission; if rejected, a secondary re-review fee of $85 may be charged.'
      }
    ],
    hiddenRisks: [
      'The notice states compliance must be "approved", not merely "submitted". Submitting on the final day leaves zero buffer if the reviewer requests clearer photos.',
      'Unresolved exit door citations can invalidate certain commercial or residential property insurance coverage terms in case of fire.'
    ],
    unfavorableTerms: [
      'Short 10-day appeal window is 4 days shorter than the 14-day repair deadline, effectively cutting off administrative dispute rights early.'
    ],
    strategicAdvice: [
      'Complete the physical fixes within 5 days so you have ample time to submit before the weekend of October 17-18.',
      'Always save the electronic receipt and PDF confirmation screen after paying the $85 fee on the city portal.'
    ]
  },
  translations: {
    es: {
      language: 'Spanish',
      languageCode: 'es',
      simpleSummary: 'La Autoridad de Vivienda de la Ciudad encontró dos infracciones de mantenimiento (detector de humo y pestillo de salida) y exige que envíe comprobante de reparación en un plazo de 14 días o pagará una multa de $250.',
      whatItMeans: 'Este documento es una advertencia oficial. La ciudad inspeccionó su edificio el 1 de octubre de 2026. Debe reparar el detector de humo y ajustar la puerta de salida antes del 19 de octubre de 2026, y pagar una tarifa de $85 para evitar sanciones.',
      actionPlan: [
        { task: 'Comprar e instalar un detector de humo con batería sellada de 10 años', details: 'Asegúrese de que el botón de prueba suene claramente.' },
        { task: 'Alinear y lubricar el pestillo de la puerta de salida secundaria', details: 'Verifique que la puerta abra suavemente sin atascarse.' },
        { task: 'Tomar fotos con fecha de las dos reparaciones', details: 'Una foto del detector y otra de la puerta.' },
        { task: 'Firmar el Formulario MH-14 y pagar $85 en el portal', details: 'Completar antes del 19 de octubre de 2026.' }
      ]
    }
  },
  extractedText: `METRO HOUSING INSPECTION BUREAU
DEPARTMENT OF RESIDENTIAL COMPLIANCE & SAFETY
450 Civic Center Plaza, Room 310, Metro City
Tel: (555) 019-4820 | Email: compliance@metrohousing.gov

OFFICIAL NOTICE OF CODE VIOLATION AND REMEDIATION DIRECTIVE
Case Tracking ID: MHIB-2026-09418
Parcel Code: PAR-4482-019-A
Portal PIN: 849201
Date of Issuance: October 05, 2026
Inspection Date: October 01, 2026
Inspecting Officer: Marcus Vance (Badge #449)

RECIPIENT / PROPERTY RECORD:
Attn: Property Manager / Leaseholder of Record
Premises: 742 Evergreen Promenade, Metro City

SUMMARY OF FINDINGS:
Notice is hereby served pursuant to Municipal Code Title 14-C. On October 01, 2026, an authorized municipal physical safety inspection of common residential circulation corridors revealed two (2) Class-B non-hazardous safety code non-compliances:

1. Section 14.2 - Audible Warning Device Standard:
Corridor primary early detection smoke alarm failed battery voltage test threshold (<85dB measured at 10ft corridor centerline). Replacement required with tamper-proof 10-year sealed lithium ionization/photoelectric unit.

2. Section 18.4 - Means of Egress Resistance:
Secondary ground-level egress hardware demonstrated resistance exceeding 15 lbs force due to strike plate misalignment and hinge corrosion. Door fails self-latching fire barrier tolerance. Alignment and lubrication required.

MANDATORY STATUTORY CURE TIMELINE:
You are granted a fourteen (14) calendar day cure window expiring at 5:00 PM EST on October 19, 2026. To achieve certified compliance closure, the following conditions MUST be met:
a) Complete all necessary repairs according to city building specs.
b) Execute and submit Form MH-14 (Affidavit of Rectification).
c) Provide clear photographic evidence of both repairs with date-stamps.
d) Remit the standard Administrative Re-inspection Assessment fee of Eighty-Five Dollars ($85.00 USD).

DEFAULT PENALTIES:
Failure to cure by 5:00 PM EST on October 19, 2026, shall result in immediate automatic assessment of $250.00 weekly civil recurring fines, entry into the High-Risk Landlord Registry, and issuance of a summons before the Municipal Hearing Board.

APPEAL RIGHTS:
Any formal contest of this notice must be filed within ten (10) calendar days (October 12, 2026) using Form MH-909 accompanied by a fifty-dollar ($50.00) filing bond.

ISSUED UNDER SEAL:
Metro Housing Inspection Bureau
Metro City Administrative Enforcement Division`,
  isSample: true
};

export const SAMPLE_DOCUMENTS: DocumentAnalysis[] = [
  SAMPLE_HOUSING_NOTICE
];
