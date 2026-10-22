import type { Language } from '../data/types';

type StringKey =
  | 'appName'
  | 'tagline'
  | 'getStarted'
  | 'createProfile'
  | 'nickname'
  | 'age'
  | 'pregnancyStatus'
  | 'notPregnant'
  | 'pregnant'
  | 'postMenopause'
  | 'unsure'
  | 'typicalCycleLen'
  | 'typicalPeriodLen'
  | 'save'
  | 'cancel'
  | 'days'
  | 'home'
  | 'cycle'
  | 'screening'
  | 'settings'
  | 'welcomeBack'
  | 'currentPhase'
  | 'dayOfCycle'
  | 'nextPeriod'
  | 'startLogging'
  | 'logPeriod'
  | 'logSymptoms'
  | 'startScreening'
  | 'recentResults'
  | 'noResultsYet'
  | 'menstrualPhase'
  | 'follicularPhase'
  | 'ovulationPhase'
  | 'lutealPhase'
  | 'phaseTracker'
  | 'startDate'
  | 'endDate'
  | 'flowIntensity'
  | 'spotting'
  | 'light'
  | 'moderate'
  | 'heavy'
  | 'symptoms'
  | 'fatigue'
  | 'dizziness'
  | 'nausea'
  | 'headache'
  | 'breathlessness'
  | 'cramps'
  | 'mood'
  | 'none'
  | 'mild_s'
  | 'moderate_s'
  | 'severe_s'
  | 'yogaExercises'
  | 'nutritionTips'
  | 'anaemiaScreening'
  | 'stepSymptoms'
  | 'stepPallor'
  | 'stepHb'
  | 'stepResults'
  | 'symptomQuestionnaire'
  | 'paleSkin'
  | 'heavyBleeding'
  | 'heavyBleedingHistory'
  | 'chestPain'
  | 'fainting'
  | 'extremeBreathlessness'
  | 'next'
  | 'back'
  | 'retakePhoto'
  | 'analyze'
  | 'captureEye'
  | 'captureNailbed'
  | 'pallorInstructions'
  | 'normalPallor'
  | 'significantPallor'
  | 'enterHbValue'
  | 'hbInGdl'
  | 'testSource'
  | 'lab'
  | 'pointOfCare'
  | 'viewResults'
  | 'severeRisk'
  | 'moderateRisk'
  | 'mildRisk'
  | 'lowRisk'
  | 'urgentCareNeeded'
  | 'medicalEvalRecommended'
  | 'dietaryCheckSuggested'
  | 'healthMaintenanceAdvice'
  | 'disclaimer'
  | 'fullDisclaimer'
  | 'language'
  | 'english'
  | 'kannada'
  | 'telugu'
  | 'profile'
  | 'editProfile'
  | 'dataExport'
  | 'aboutApp'
  | 'notForContraception'
  | 'ovulationWindow'
  | 'fertileWindow'
  | 'noneLogged'
  | 'saveSymptoms'
  | 'symptomsSaved'
  | 'periodSaved'
  | 'selectPhoto'
  | 'takePhoto'
  | 'chooseFromGallery'
  | 'analyzing'
  | 'rednessRatio'
  | 'erythemaIndex'
  | 'avgSaturation'
  | 'normalTissue'
  | 'significantPallorDetected'
  | 'compareBenchmarks'
  | 'ruralPrevalence'
  | 'yourHbLevel'
  | 'nfhsSource'
  | 'screeningHistory'
  | 'viewHistory'
  | 'deleteProfile'
  | 'confirmDelete'
  | 'deleteConfirmMessage'
  | 'enterPin'
  | 'setPin'
  | 'confirmPin'
  | 'pinMismatch'
  | 'noProfiles'
  | 'addNewProfile'
  | 'switchProfile'
  | 'selectProfile'
  | 'continue'
  | 'crampsLabel'
  | 'pallorAnalysis'
  | 'screeningComplete'
  | 'riskLevel'
  | 'recommendPHC'
  | 'ironRichFoods'
  | 'visitASHA'
  | 'periodHistory'
  | 'symptomHistory'
  | 'hbHistory'
  | 'screeningHistoryLabel'
  | 'lastResult'
  | 'noPeriodsLogged'
  | 'cycleLength'
  | 'periodLength'
  | 'averageCycle'
  | 'averagePeriod'
  | 'phaseInfo'
  | 'todayIs'
  | 'cycleDay'
  | 'tapToLog'
  | 'newScreening'
  | 'symptomRiskIndex'
  | 'pallorScore'
  | 'hbCategory'
  | 'summary'
  | 'generatedReport'
  | 'shareResult'
  | 'shareReport'
  | 'disclaimerTitle'
  | 'understand';

type TranslationMap = Record<StringKey, string>;

const en: TranslationMap = {
  appName: 'AnaemiaMitra',
  tagline: 'Menstruation Tracking & Anaemia Screening',
  getStarted: 'Get Started',
  createProfile: 'Create Your Profile',
  nickname: 'Nickname',
  age: 'Age',
  pregnancyStatus: 'Pregnancy Status',
  notPregnant: 'Not Pregnant',
  pregnant: 'Pregnant',
  postMenopause: 'Post-Menopause',
  unsure: 'Not Sure',
  typicalCycleLen: 'Typical Cycle Length',
  typicalPeriodLen: 'Typical Period Length',
  save: 'Save',
  cancel: 'Cancel',
  days: 'days',
  home: 'Home',
  cycle: 'Cycle',
  screening: 'Screening',
  settings: 'Settings',
  welcomeBack: 'Welcome back',
  currentPhase: 'Current Phase',
  dayOfCycle: 'Day',
  nextPeriod: 'Next Period',
  startLogging: 'Start Logging',
  logPeriod: 'Log Period',
  logSymptoms: 'Log Symptoms',
  startScreening: 'Start Screening',
  recentResults: 'Recent Results',
  noResultsYet: 'No screening results yet',
  menstrualPhase: 'Menstrual Phase',
  follicularPhase: 'Follicular Phase',
  ovulationPhase: 'Ovulation',
  lutealPhase: 'Luteal Phase',
  phaseTracker: 'Cycle Phase Tracker',
  startDate: 'Start Date',
  endDate: 'End Date',
  flowIntensity: 'Flow Intensity',
  spotting: 'Spotting',
  light: 'Light',
  moderate: 'Moderate',
  heavy: 'Heavy',
  symptoms: 'Symptoms',
  fatigue: 'Fatigue',
  dizziness: 'Dizziness',
  nausea: 'Nausea',
  headache: 'Headache',
  breathlessness: 'Breathlessness',
  cramps: 'Cramps',
  mood: 'Mood',
  none: 'None',
  mild_s: 'Mild',
  moderate_s: 'Moderate',
  severe_s: 'Severe',
  yogaExercises: 'Yoga for Cramp Relief',
  nutritionTips: 'Iron-Rich Nutrition Tips',
  anaemiaScreening: 'Anaemia Screening',
  stepSymptoms: 'Symptoms',
  stepPallor: 'Pallor Test',
  stepHb: 'Hb Report',
  stepResults: 'Results',
  symptomQuestionnaire: 'Symptom Questionnaire',
  paleSkin: 'Pale skin or nails',
  heavyBleeding: 'Heavy menstrual bleeding',
  heavyBleedingHistory: 'Heavy menstrual bleeding history',
  chestPain: 'Chest pain',
  fainting: 'Fainting episodes',
  extremeBreathlessness: 'Extreme breathlessness',
  next: 'Next',
  back: 'Back',
  retakePhoto: 'Retake Photo',
  analyze: 'Analyze',
  captureEye: 'Inner Eyelid Photo',
  captureNailbed: 'Nailbed Photo',
  pallorInstructions: 'Take a clear photo of the lower inner eyelid (pull down gently) or nailbed under good lighting',
  normalPallor: 'Normal Tissue Pigmentation Detected',
  significantPallor: 'Significant Pallor Detected',
  enterHbValue: 'Enter Haemoglobin Value',
  hbInGdl: 'Haemoglobin (g/dL)',
  testSource: 'Test Source',
  lab: 'Laboratory',
  pointOfCare: 'Point of Care',
  viewResults: 'View Results',
  severeRisk: 'Severe Risk',
  moderateRisk: 'Moderate Risk',
  mildRisk: 'Mild Risk',
  lowRisk: 'Low Risk',
  urgentCareNeeded: 'Urgent Care Needed',
  medicalEvalRecommended: 'Medical Evaluation Recommended',
  dietaryCheckSuggested: 'Dietary & Routine Check Suggested',
  healthMaintenanceAdvice: 'Standard Health Maintenance Advice',
  disclaimer: 'Not a clinical diagnosis. Consult an ASHA worker or PHC doctor.',
  fullDisclaimer: 'This tool provides preliminary screening based on Anemia Mukt Bharat public health guidelines and image colorimetry. It is not a clinical laboratory diagnosis. Consult an ASHA worker or doctor at your nearest Primary Health Centre (PHC) for confirmatory blood tests.',
  language: 'Language',
  english: 'English',
  kannada: 'ಕನ್ನಡ',
  telugu: 'తెలుగు',
  profile: 'Profile',
  editProfile: 'Edit Profile',
  dataExport: 'Data Export',
  aboutApp: 'About App',
  notForContraception: 'Not for contraception. For informational purposes only.',
  ovulationWindow: 'Ovulation Window',
  fertileWindow: 'Fertile Window',
  noneLogged: 'Nothing logged yet',
  saveSymptoms: 'Save Symptoms',
  symptomsSaved: 'Symptoms saved successfully',
  periodSaved: 'Period logged successfully',
  selectPhoto: 'Select Photo',
  takePhoto: 'Take Photo',
  chooseFromGallery: 'Choose from Gallery',
  analyzing: 'Analyzing image...',
  rednessRatio: 'Redness Ratio',
  erythemaIndex: 'Erythema Index',
  avgSaturation: 'Avg Saturation',
  normalTissue: 'Normal Tissue Pigmentation Detected',
  significantPallorDetected: 'Significant Pallor / Pale Redness Index Detected',
  compareBenchmarks: 'Comparison with Rural Benchmarks',
  ruralPrevalence: 'Rural Prevalence',
  yourHbLevel: 'Your Hb Level',
  nfhsSource: 'Source: NFHS-5 (2019-21), India',
  screeningHistory: 'Screening History',
  viewHistory: 'View History',
  deleteProfile: 'Delete Profile',
  confirmDelete: 'Confirm Delete',
  deleteConfirmMessage: 'Are you sure? All data will be permanently deleted.',
  enterPin: 'Enter PIN',
  setPin: 'Set PIN (optional)',
  confirmPin: 'Confirm PIN',
  pinMismatch: 'PINs do not match',
  noProfiles: 'No profiles yet. Create one to get started.',
  addNewProfile: 'Add New Profile',
  switchProfile: 'Switch Profile',
  selectProfile: 'Select Profile',
  continue: 'Continue',
  crampsLabel: 'Cramps',
  pallorAnalysis: 'Pallor Analysis',
  screeningComplete: 'Screening Complete',
  riskLevel: 'Risk Level',
  recommendPHC: 'Please visit your nearest Primary Health Centre (PHC) immediately.',
  visitASHA: 'Contact your ASHA worker for guidance.',
  ironRichFoods: 'Increase iron-rich foods: Palak, Jaggery, Chana, Dal, Amla',
  periodHistory: 'Period History',
  symptomHistory: 'Symptom History',
  hbHistory: 'Hb Test History',
  screeningHistoryLabel: 'Screening History',
  lastResult: 'Last Result',
  noPeriodsLogged: 'No periods logged yet',
  cycleLength: 'Cycle Length',
  periodLength: 'Period Length',
  averageCycle: 'Avg Cycle',
  averagePeriod: 'Avg Period',
  phaseInfo: 'Phase Information',
  todayIs: 'Today is',
  cycleDay: 'Cycle Day',
  tapToLog: 'Tap to log',
  newScreening: 'New Screening',
  symptomRiskIndex: 'Symptom Risk Index',
  pallorScore: 'Pallor Score',
  hbCategory: 'Hb Category',
  summary: 'Summary',
  generatedReport: 'Generated Screening Report',
  shareResult: 'Share Result',
  shareReport: 'Share Report',
  disclaimerTitle: 'Important Disclaimer',
  understand: 'I Understand',
};

const kn: TranslationMap = {
  ...en,
  tagline: 'ಋತುಚಕ್ರ ಟ್ರ್ಯಾಕಿಂಗ್ ಮತ್ತು ರಕ್ತಹೀನತೆ ಪರೀಕ್ಷೆ',
  getStarted: 'ಪ್ರಾರಂಭಿಸಿ',
  createProfile: 'ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ರಚಿಸಿ',
  nickname: 'ಅಡ್ಡಹೆಸರು',
  age: 'ವಯಸ್ಸು',
  pregnancyStatus: 'ಗರ್ಭಧಾರಣೆ ಸ್ಥಿತಿ',
  notPregnant: 'ಗರ್ಭಿಣಿ ಅಲ್ಲ',
  pregnant: 'ಗರ್ಭಿಣಿ',
  postMenopause: 'ಮೆನೋಪಾಸ್ ನಂತರ',
  unsure: 'ಖಚಿತವಿಲ್ಲ',
  typicalCycleLen: 'ಸಾಮಾನ್ಯ ಋತುಚಕ್ರ ಅವಧಿ',
  typicalPeriodLen: 'ಸಾಮಾನ್ಯ ಋತುಮಾಸ ಅವಧಿ',
  save: 'ಉಳಿಸಿ',
  cancel: 'ರದ್ದುಮಾಡಿ',
  days: 'ದಿನಗಳು',
  home: 'ಮುಖಪುಟ',
  cycle: 'ಋತುಚಕ್ರ',
  screening: 'ಪರೀಕ್ಷೆ',
  settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
  welcomeBack: 'ಮರಳಿ ಸ್ವಾಗತ',
  currentPhase: 'ಪ್ರಸ್ತುತ ಹಂತ',
  dayOfCycle: 'ದಿನ',
  nextPeriod: 'ಮುಂದಿನ ಋತುಮಾಸ',
  startLogging: 'ದಾಖಲಿಸಲು ಪ್ರಾರಂಭಿಸಿ',
  logPeriod: 'ಋತುಮಾಸ ದಾಖಲಿಸಿ',
  logSymptoms: 'ಲಕ್ಷಣಗಳನ್ನು ದಾಖಲಿಸಿ',
  startScreening: 'ಪರೀಕ್ಷೆ ಪ್ರಾರಂಭಿಸಿ',
  recentResults: 'ಇತ್ತೀಚಿನ ಫಲಿತಾಂಶಗಳು',
  noResultsYet: 'ಇನ್ನೂ ಯಾವುದೇ ಫಲಿತಾಂಶಗಳಿಲ್ಲ',
  menstrualPhase: 'ಋತುಮಾಸ ಹಂತ',
  follicularPhase: 'ಫಾಲಿಕ್ಯುಲರ್ ಹಂತ',
  ovulationPhase: 'ಅಂಡೋತ್ಪತ್ತಿ',
  lutealPhase: 'ಲ್ಯೂಟಿಯಲ್ ಹಂತ',
  phaseTracker: 'ಋತುಚಕ್ರ ಹಂತ ಟ್ರ್ಯಾಕರ್',
  startDate: 'ಪ್ರಾರಂಭ ದಿನಾಂಕ',
  endDate: 'ಅಂತಿಮ ದಿನಾಂಕ',
  flowIntensity: 'ರಕ್ತಸ್ರಾವ ತೀವ್ರತೆ',
  spotting: 'ಚುಕ್ಕು',
  light: 'ಹಗುರು',
  moderate: 'ಮಧ್ಯಮ',
  heavy: 'ಭಾರೀ',
  symptoms: 'ಲಕ್ಷಣಗಳು',
  fatigue: 'ದಣಿವು',
  dizziness: 'ತಲೆತಿರುಗುವಿಕೆ',
  nausea: 'ವಾಕರಿಕೆ',
  headache: 'ತಲೆನೋವು',
  breathlessness: 'ಉಸಿರುಕಟ್ಟುವಿಕೆ',
  cramps: 'ಸೆಳೆತ',
  mood: 'ಮನೋಭಾವ',
  none: 'ಇಲ್ಲ',
  mild_s: 'ಹಗುರು',
  moderate_s: 'ಮಧ್ಯಮ',
  severe_s: 'ತೀವ್ರ',
  yogaExercises: 'ಸೆಳೆತ ಪರಿಹಾರಕ್ಕೆ ಯೋಗ',
  nutritionTips: 'ಕಬ್ಬಿಣ ಸಮೃದ್ಧ ಆಹಾರ ಸಲಹೆಗಳು',
  anaemiaScreening: 'ರಕ್ತಹೀನತೆ ಪರೀಕ್ಷೆ',
  stepSymptoms: 'ಲಕ್ಷಣಗಳು',
  stepPallor: 'ಪಲ್ಲರ್ ಪರೀಕ್ಷೆ',
  stepHb: 'ಎಚ್‌ಬಿ ವರದಿ',
  stepResults: 'ಫಲಿತಾಂಶ',
  symptomQuestionnaire: 'ಲಕ್ಷಣ ಪ್ರಶ್ನಾವಳಿ',
  paleSkin: 'ಚರ್ಮ ಅಥವಾ ಉಗುರುಗಳಲ್ಲಿ ಪ್ಯಾಲರ್',
  heavyBleedingHistory: 'ಭಾರೀ ಋತುಸ್ರಾವ ಇತಿಹಾಸ',
  chestPain: 'ಎದೆ ನೋವು',
  fainting: 'ಮೂರ್ಛೆ',
  extremeBreathlessness: 'ತೀವ್ರ ಉಸಿರುಕಟ್ಟುವಿಕೆ',
  next: 'ಮುಂದೆ',
  back: 'ಹಿಂದೆ',
  retakePhoto: 'ಮರುಚಿತ್ರ',
  analyze: 'ವಿಶ್ಲೇಷಿಸಿ',
  captureEye: 'ಕಣ್ಣಿನ ಒಳ ಅಂಚಿನ ಚಿತ್ರ',
  captureNailbed: 'ಉಗುರು ಹಾಸು ಚಿತ್ರ',
  pallorInstructions: 'ಒಳ ಕಣ್ಣಿನ ಅಥವಾ ಉಗುರು ಹಾಸಿನ ಸ್ಪಷ್ಟ ಚಿತ್ರ ತೆಗೆಯಿರಿ',
  normalPallor: 'ಸಾಮಾನ್ಯ ಅಂಗಾಂಶ ವರ್ಣದ್ರವ್ಯ',
  significantPallor: 'ಗಣನೀಯ ಪ್ಯಾಲರ್ ಕಂಡುಬಂದಿದೆ',
  enterHbValue: 'ಹಿಮೋಗ್ಲೋಬಿನ್ ಮೌಲ್ಯ ನಮೂದಿಸಿ',
  hbInGdl: 'ಹಿಮೋಗ್ಲೋಬಿನ್ (g/dL)',
  testSource: 'ಪರೀಕ್ಷೆ ಮೂಲ',
  lab: 'ಪ್ರಯೋಗಾಲಯ',
  pointOfCare: 'ಪಾಯಿಂಟ್ ಆಫ್ ಕೇರ್',
  viewResults: 'ಫಲಿತಾಂಶ ನೋಡಿ',
  severeRisk: 'ತೀವ್ರ ಅಪಾಯ',
  moderateRisk: 'ಮಧ್ಯಮ ಅಪಾಯ',
  mildRisk: 'ಹಗುರು ಅಪಾಯ',
  lowRisk: 'ಕಡಿಮೆ ಅಪಾಯ',
  urgentCareNeeded: 'ತುರ್ತು ಆರೈಕೆ ಅಗತ್ಯ',
  medicalEvalRecommended: 'ವೈದ್ಯಕೀಯ ಮೌಲ್ಯಮಾಪನ ಶಿಫಾರಸು',
  dietaryCheckSuggested: 'ಆಹಾರ ಮತ್ತು ದಿನಚರಿ ಪರಿಶೀಲನೆ',
  healthMaintenanceAdvice: 'ಸಾಮಾನ್ಯ ಆರೋಗ್ಯ ಸಲಹೆ',
  disclaimer: 'ಇದು ವೈದ್ಯಕೀಯ ರೋಗನಿರ್ಣಯವಲ್ಲ. ಆಶಾ ಕಾರ್ಯಕರ್ತೆ ಅಥವಾ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.',
  fullDisclaimer: 'ಇದು ಅನೇಮಿಯಾ ಮುಕ್ತ್ ಭಾರತ್ ಸಾರ್ವಜನಿಕ ಆರೋಗ್ಯ ಮಾರ್ಗಸೂಚಿಗಳು ಮತ್ತು ಚಿತ್ರ ಕಲರಿಮೆಟ್ರಿ ಆಧಾರಿತ ಪ್ರಾಥಮಿಕ ಪರೀಕ್ಷೆ. ಇದು ವೈದ್ಯಕೀಯ ಪ್ರಯೋಗಾಲಯ ರೋಗನಿರ್ಣಯವಲ್ಲ. ದೃಢೀಕರಣ ರಕ್ತ ಪರೀಕ್ಷೆಗಾಗಿ ನಿಮ್ಮ ಹತ್ತಿರದ PHC ಯಲ್ಲಿ ಆಶಾ ಕಾರ್ಯಕರ್ತೆ ಅಥವಾ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.',
  language: 'ಭಾಷೆ',
  english: 'English',
  kannada: 'ಕನ್ನಡ',
  telugu: 'తెలుగు',
  profile: 'ಪ್ರೊಫೈಲ್',
  editProfile: 'ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ',
  dataExport: 'ಡೇಟಾ ರಫ್ತು',
  aboutApp: 'ಅಪ್ಲಿಕೇಶನ್ ಬಗ್ಗೆ',
  notForContraception: 'ಗರ್ಭನಿರೋಧಕಕ್ಕಾಗಿ ಅಲ್ಲ. ಮಾಹಿತಿ ಉದ್ದೇಶಕ್ಕಷ್ಟೇ.',
  ovulationWindow: 'ಅಂಡೋತ್ಪತ್ತಿ ಕಿಟಕಿ',
  fertileWindow: 'ಫಲವತ್ತಾ ಕಿಟಕಿ',
  noneLogged: 'ಇನ್ನೂ ಏನೂ ದಾಖಲಿಸಿಲ್ಲ',
  saveSymptoms: 'ಲಕ್ಷಣಗಳನ್ನು ಉಳಿಸಿ',
  symptomsSaved: 'ಲಕ್ಷಣಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ',
  periodSaved: 'ಋತುಮಾಸ ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಾಗಿದೆ',
  selectPhoto: 'ಚಿತ್ರ ಆಯ್ಕೆ',
  takePhoto: 'ಚಿತ್ರ ತೆಗೆಯಿರಿ',
  chooseFromGallery: 'ಗ್ಯಾಲರಿಯಿಂದ ಆಯ್ಕೆ',
  analyzing: 'ಚಿತ್ರ ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...',
  rednessRatio: 'ಲಾಲಿಮೆ ಅನುಪಾತ',
  erythemaIndex: 'ಎರಿಥೆಮಾ ಸೂಚ್ಯಂಕ',
  avgSaturation: 'ಸರಾಸರಿ ಸ್ಯಾಚುರೇಶನ್',
  normalTissue: 'ಸಾಮಾನ್ಯ ಅಂಗಾಂಶ ವರ್ಣದ್ರವ್ಯ ಕಂಡುಬಂದಿದೆ',
  significantPallorDetected: 'ಗಣನೀಯ ಪ್ಯಾಲರ್ / ಪೇಲ್ ರೆಡ್‌ನೆಸ್ ಸೂಚ್ಯಂಕ ಕಂಡುಬಂದಿದೆ',
  compareBenchmarks: 'ಗ್ರಾಮೀಣ ಮಾನದಂಡಗಳೊಂದಿಗೆ ಹೋಲಿಕೆ',
  ruralPrevalence: 'ಗ್ರಾಮೀಣ ಪ್ರಸರಣ',
  yourHbLevel: 'ನಿಮ್ಮ Hb ಮಟ್ಟ',
  nfhsSource: 'ಮೂಲ: NFHS-5 (2019-21), ಭಾರತ',
  screeningHistory: 'ಪರೀಕ್ಷೆ ಇತಿಹಾಸ',
  viewHistory: 'ಇತಿಹಾಸ ನೋಡಿ',
  deleteProfile: 'ಪ್ರೊಫೈಲ್ ಅಳಿಸಿ',
  confirmDelete: 'ಅಳಿಸುವಿಕೆ ದೃಢೀಕರಿಸಿ',
  deleteConfirmMessage: 'ಖಚಿತವೇ? ಎಲ್ಲಾ ಡೇಟಾ ಶಾಶ್ವತವಾಗಿ ಅಳಿಸಲ್ಪಡುತ್ತದೆ.',
  enterPin: 'PIN ನಮೂದಿಸಿ',
  setPin: 'PIN ಹೊಂದಿಸಿ (ಐಚ್ಛಿಕ)',
  confirmPin: 'PIN ದೃಢೀಕರಿಸಿ',
  pinMismatch: 'PIN ಹೊಂದಿಲ್ಲ',
  noProfiles: 'ಇನ್ನೂ ಪ್ರೊಫೈಲ್‌ಗಳಿಲ್ಲ. ಪ್ರಾರಂಭಿಸಲು ಒಂದನ್ನು ರಚಿಸಿ.',
  addNewProfile: 'ಹೊಸ ಪ್ರೊಫೈಲ್ ಸೇರಿಸಿ',
  switchProfile: 'ಪ್ರೊಫೈಲ್ ಬದಲಿಸಿ',
  selectProfile: 'ಪ್ರೊಫೈಲ್ ಆಯ್ಕೆ',
  continue: 'ಮುಂದುವರಿಸಿ',
  crampsLabel: 'ಸೆಳೆತ',
  pallorAnalysis: 'ಪಲ್ಲರ್ ವಿಶ್ಲೇಷಣೆ',
  screeningComplete: 'ಪರೀಕ್ಷೆ ಪೂರ್ಣಗೊಂಡಿದೆ',
  riskLevel: 'ಅಪಾಯ ಮಟ್ಟ',
  recommendPHC: 'ದಯವಿಟ್ಟು ತಕ್ಷಣ ನಿಮ್ಮ ಹತ್ತಿರದ PHC ಗೆ ಭೇಟಿ ನೀಡಿ.',
  visitASHA: 'ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ನಿಮ್ಮ ಆಶಾ ಕಾರ್ಯಕರ್ತೆಯನ್ನು ಸಂಪರ್ಕಿಸಿ.',
  ironRichFoods: 'ಕಬ್ಬಿಣ ಸಮೃದ್ಧ ಆಹಾರ ಹೆಚ್ಚಿಸಿ: ಪಾಲಕ್, ಬೆಲ್ಲ, ಚನಾ, ದಾಲ್, ಆಮ್ಲಾ',
  periodHistory: 'ಋತುಮಾಸ ಇತಿಹಾಸ',
  symptomHistory: 'ಲಕ್ಷಣ ಇತಿಹಾಸ',
  hbHistory: 'Hb ಪರೀಕ್ಷೆ ಇತಿಹಾಸ',
  screeningHistoryLabel: 'ಪರೀಕ್ಷೆ ಇತಿಹಾಸ',
  lastResult: 'ಕೊನೆಯ ಫಲಿತಾಂಶ',
  noPeriodsLogged: 'ಇನ್ನೂ ಋತುಮಾಸ ದಾಖಲಾಗಿಲ್ಲ',
  cycleLength: 'ಋತುಚಕ್ರ ಅವಧಿ',
  periodLength: 'ಋತುಮಾಸ ಅವಧಿ',
  averageCycle: 'ಸರಾಸರಿ ಋತುಚಕ್ರ',
  averagePeriod: 'ಸರಾಸರಿ ಋತುಮಾಸ',
  phaseInfo: 'ಹಂತ ಮಾಹಿತಿ',
  todayIs: 'ಇಂದು',
  cycleDay: 'ಋತುಚಕ್ರ ದಿನ',
  tapToLog: 'ದಾಖಲಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ',
  newScreening: 'ಹೊಸ ಪರೀಕ್ಷೆ',
  symptomRiskIndex: 'ಲಕ್ಷಣ ಅಪಾಯ ಸೂಚ್ಯಂಕ',
  pallorScore: 'ಪಲ್ಲರ್ ಸ್ಕೋರ್',
  hbCategory: 'Hb ವರ್ಗ',
  summary: 'ಸಾರಾಂಶ',
  generatedReport: 'ಪರೀಕ್ಷಾ ವರದಿ ತಯಾರಿಸಲಾಗಿದೆ',
  shareResult: 'ಫಲಿತಾಂಶ ಹಂಚಿಕೊಳ್ಳಿ',
  shareReport: 'ವರದಿ ಹಂಚಿಕೊಳ್ಳಿ',
  disclaimerTitle: 'ಮುಖ್ಯ ಎಚ್ಚರಿಕೆ',
  understand: 'ನನಗೆ ಅರ್ಥವಾಗಿದೆ',
};

const te: TranslationMap = {
  ...en,
  tagline: 'ఋతుచక్ర ట్రాకింగ్ మరియు రక్తహీనత పరీక్ష',
  getStarted: 'ప్రారంభించండి',
  createProfile: 'మీ ప్రొఫైల్ సృష్టించండి',
  nickname: 'మారుపేరు',
  age: 'వయస్సు',
  pregnancyStatus: 'గర్భం స్థితి',
  notPregnant: 'గర్భిణి కాదు',
  pregnant: 'గర్భిణి',
  postMenopause: 'మెనోపాజ్ తర్వాత',
  unsure: 'ఖచ్చితంగా తెలియదు',
  typicalCycleLen: 'సాధారణ ఋతుచక్ర పొడవు',
  typicalPeriodLen: 'సాధారణ ఋతుస్రావ పొడవు',
  save: 'సేవ్',
  cancel: 'రద్దు',
  days: 'రోజులు',
  home: 'హోమ్',
  cycle: 'ఋతుచక్రం',
  screening: 'పరీక్ష',
  settings: 'సెట్టింగ్‌లు',
  welcomeBack: 'తిరిగి స్వాగతం',
  currentPhase: 'ప్రస్తుత దశ',
  dayOfCycle: 'రోజు',
  nextPeriod: 'తదుపరి ఋతుస్రావం',
  startLogging: 'నమోదు ప్రారంభించండి',
  logPeriod: 'ఋతుస్రావం నమోదు',
  logSymptoms: 'లక్షణాలు నమోదు',
  startScreening: 'పరీక్ష ప్రారంభించండి',
  recentResults: 'ఇటీవలి ఫలితాలు',
  noResultsYet: 'ఇంకా ఫలితాలు లేవు',
  menstrualPhase: 'ఋతుస్రావ దశ',
  follicularPhase: 'ఫాలిక్యులర్ దశ',
  ovulationPhase: 'అండోత్పత్తి',
  lutealPhase: 'ల్యూటియల్ దశ',
  phaseTracker: 'ఋతుచక్ర దశ ట్రాకర్',
  startDate: 'ప్రారంభ తేదీ',
  endDate: 'ముగింపు తేదీ',
  flowIntensity: 'రక్తస్రావ తీవ్రత',
  spotting: 'చుక్కలు',
  light: 'తేలిక',
  moderate: 'మధ్యమ',
  heavy: 'భారీ',
  symptoms: 'లక్షణాలు',
  fatigue: 'అలసట',
  dizziness: 'తలతిరగడం',
  nausea: 'వికారం',
  headache: 'తలనొప్పి',
  breathlessness: 'శ్వాస ఆడకపోవడం',
  cramps: 'నొప్పి',
  mood: 'మూడ్',
  none: 'లేదు',
  mild_s: 'తేలిక',
  moderate_s: 'మధ్యమ',
  severe_s: 'తీవ్ర',
  yogaExercises: 'నొప్పి ఉపశమనానికి యోగ',
  nutritionTips: 'ఇనుము ఎక్కువ ఆహార చిట్కాలు',
  anaemiaScreening: 'రక్తహీనత పరీక్ష',
  stepSymptoms: 'లక్షణాలు',
  stepPallor: 'పల్లర్ పరీక్ష',
  stepHb: 'ఎచ్‌బి నివేదిక',
  stepResults: 'ఫలితాలు',
  symptomQuestionnaire: 'లక్షణాల ప్రశ్నావళి',
  paleSkin: 'చర్మం లేదా గోళ్లలో పల్లర్',
  heavyBleedingHistory: 'భారీ ఋతుస్రావ చరిత్ర',
  chestPain: 'ఛాతీ నొప్పి',
  fainting: 'మూర్ఛ',
  extremeBreathlessness: 'తీవ్ర శ్వాస ఆడకపోవడం',
  next: 'తదుపరి',
  back: 'వెనుకకు',
  retakePhoto: 'మళ్లీ ఫోటో',
  analyze: 'విశ్లేషణ',
  captureEye: 'కంటి లోపల అంచు ఫోటో',
  captureNailbed: 'గోరు ఫోటో',
  pallorInstructions: 'లోపల కంటి లేదా గోరు స్పష్టమైన ఫోటో తీయండి',
  normalPallor: 'సాధారణ కణజాల వర్ణద్రవ్యం',
  significantPallor: 'గణనీయ పల్లర్ గుర్తించబడింది',
  enterHbValue: 'హిమోగ్లోబిన్ విలువ నమోదు',
  hbInGdl: 'హిమోగ్లోబిన్ (g/dL)',
  testSource: 'పరీక్ష మూలం',
  lab: 'ప్రయోగశాల',
  pointOfCare: 'పాయింట్ ఆఫ్ కేర్',
  viewResults: 'ఫలితాలు చూడండి',
  severeRisk: 'తీవ్ర ప్రమాదం',
  moderateRisk: 'మధ్యమ ప్రమాదం',
  mildRisk: 'తేలిక ప్రమాదం',
  lowRisk: 'తక్కువ ప్రమాదం',
  urgentCareNeeded: 'అత్యవసర సంరక్షణ అవసరం',
  medicalEvalRecommended: 'వైద్య మూల్యాంకన సిఫారసు',
  dietaryCheckSuggested: 'ఆహార మరియు రొటీన్ తనిఖీ',
  healthMaintenanceAdvice: 'సాధారణ ఆరోగ్య సలహా',
  disclaimer: 'ఇది వైద్య నిర్ధారణ కాదు. ఆషా వర్కర్ లేదా వైద్యుడిని సంప్రదించండి.',
  fullDisclaimer: 'ఇది అనేమియా ముక్త్ భారత్ ప్రజారోగ్య మార్గదర్శకాలు మరియు ఇమేజ్ కలరిమెట్రీ ఆధారిత ప్రాథమిక పరీక్ష. ఇది వైద్య ప్రయోగశాల నిర్ధారణ కాదు. ధృవీకరణ రక్త పరీక్ష కోసం మీ సమీపంలోని PHC లో ఆషా వర్కర్ లేదా వైద్యుడిని సంప్రదించండి.',
  language: 'భాష',
  english: 'English',
  kannada: 'ಕನ್ನಡ',
  telugu: 'తెలుగు',
  profile: 'ప్రొఫైల్',
  editProfile: 'ప్రొఫైల్ సవరించు',
  dataExport: 'డేటా ఎగుమతి',
  aboutApp: 'యాప్ గురించి',
  notForContraception: 'గర్భనిరోధకం కోసం కాదు. సమాచార ఉద్దేశం మాత్రమే.',
  ovulationWindow: 'అండోత్పత్తి కిటికీ',
  fertileWindow: 'ఫలవంతమైన కిటికీ',
  noneLogged: 'ఇంకా ఏమీ నమోదు కాలేదు',
  saveSymptoms: 'లక్షణాలు సేవ్',
  symptomsSaved: 'లక్షణాలు విజయవంతంగా సేవ్ అయ్యాయి',
  periodSaved: 'ఋతుస్రావం విజయవంతంగా నమోదు అయింది',
  selectPhoto: 'ఫోటో ఎంచుకోండి',
  takePhoto: 'ఫోటో తీయండి',
  chooseFromGallery: 'గ్యాలరీ నుండి ఎంచుకోండి',
  analyzing: 'చిత్రం విశ్లేషణ జరుగుతోంది...',
  rednessRatio: 'ఎరుపు నిష్పత్తి',
  erythemaIndex: 'ఎరిథెమా సూచిక',
  avgSaturation: 'సగటు సాచురేషన్',
  normalTissue: 'సాధారణ కణజాల వర్ణద్రవ్యం గుర్తించబడింది',
  significantPallorDetected: 'గణనీయ పల్లర్ / పేల్ రెడ్‌నెస్ సూచిక గుర్తించబడింది',
  compareBenchmarks: 'గ్రామీణ ప్రామాణికాలతో పోలిక',
  ruralPrevalence: 'గ్రామీణ వ్యాప్తి',
  yourHbLevel: 'మీ Hb స్థాయి',
  nfhsSource: 'మూలం: NFHS-5 (2019-21), భారతదేశం',
  screeningHistory: 'పరీక్ష చరిత్ర',
  viewHistory: 'చరిత్ర చూడండి',
  deleteProfile: 'ప్రొఫైల్ తొలగించు',
  confirmDelete: 'తొలగింపు నిర్ధారించు',
  deleteConfirmMessage: 'ఖచ్చితమా? అన్ని డేటా శాశ్వతంగా తొలగించబడుతుంది.',
  enterPin: 'PIN నమోదు',
  setPin: 'PIN సెట్ చేయండి (ఐచ్ఛిక)',
  confirmPin: 'PIN నిర్ధారించు',
  pinMismatch: 'PIN లు సరిపోలలేదు',
  noProfiles: 'ఇంకా ప్రొఫైల్‌లు లేవు. ప్రారంభించడానికి ఒకటి సృష్టించండి.',
  addNewProfile: 'కొత్త ప్రొఫైల్ జోడించు',
  switchProfile: 'ప్రొఫైల్ మార్చు',
  selectProfile: 'ప్రొఫైల్ ఎంచుకోండి',
  continue: 'కొనసాగించు',
  crampsLabel: 'నొప్పి',
  pallorAnalysis: 'పల్లర్ విశ్లేషణ',
  screeningComplete: 'పరీక్ష పూర్తయింది',
  riskLevel: 'ప్రమాద స్థాయి',
  recommendPHC: 'దయచేసి వెంటనే మీ సమీపంలోని PHC కి వెళ్లండి.',
  visitASHA: 'మార్గదర్శన కోసం మీ ఆషా వర్కర్‌ను సంప్రదించండి.',
  ironRichFoods: 'ఇనుము ఎక్కువ ఆహారాలు పెంచండి: పాలకూర, బెల్లం, శనగలు, పప్పు, ఉసిరి',
  periodHistory: 'ఋతుస్రావ చరిత్ర',
  symptomHistory: 'లక్షణాల చరిత్ర',
  hbHistory: 'Hb పరీక్ష చరిత్ర',
  screeningHistoryLabel: 'పరీక్ష చరిత్ర',
  lastResult: 'చివరి ఫలితం',
  noPeriodsLogged: 'ఇంకా ఋతుస్రావం నమోదు కాలేదు',
  cycleLength: 'ఋతుచక్ర పొడవు',
  periodLength: 'ఋతుస్రావ పొడవు',
  averageCycle: 'సగటు ఋతుచక్రం',
  averagePeriod: 'సగటు ఋతుస్రావం',
  phaseInfo: 'దశ సమాచార్',
  todayIs: 'ఈరోజు',
  cycleDay: 'ఋతుచక్ర రోజు',
  tapToLog: 'నమోదు కోసం ట్యాప్',
  newScreening: 'కొత్త పరీక్ష',
  symptomRiskIndex: 'లక్షణ ప్రమాద సూచిక',
  pallorScore: 'పల్లర్ స్కోర్',
  hbCategory: 'Hb వర్గం',
  summary: 'సారాంశం',
  generatedReport: 'పరీక్షా నివేదిక తయారు',
  shareResult: 'ఫలితం పంచుకోండి',
  shareReport: 'నివేదిక పంచుకోండి',
  disclaimerTitle: 'ముఖ్య హెచ్చరిక',
  understand: 'నాకు అర్థమైంది',
};

const translations: Record<Language, TranslationMap> = { en, kn, te };

export { translations, type StringKey, type TranslationMap };
