export const farmerData = {
  totalUploads: 47,
  commonDisease: 'Leaf Blight',
  marketPrice: '$2.40/kg',
  recentAnalyses: [
    { date: '2024-01-15', status: 'Healthy', quality: 92 },
    { date: '2024-01-14', status: 'Diseased', quality: 65 },
    { date: '2024-01-13', status: 'Healthy', quality: 88 },
  ],
  priceHistory: [
    { month: 'Jan', price: 2.1 },
    { month: 'Feb', price: 2.3 },
    { month: 'Mar', price: 2.4 },
    { month: 'Apr', price: 2.6 },
    { month: 'May', price: 2.5 },
    { month: 'Jun', price: 2.4 },
  ],
};

export const agriculturalData = {
  soilFertility: 78,
  cropHealthIndex: 85,
  yieldPrediction: [
    { month: 'Jan', yield: 420 },
    { month: 'Feb', yield: 480 },
    { month: 'Mar', yield: 550 },
    { month: 'Apr', yield: 620 },
    { month: 'May', yield: 580 },
    { month: 'Jun', yield: 650 },
  ],
  sensorData: {
    nitrogen: 45,
    phosphorus: 32,
    potassium: 38,
    ph: 6.5,
    moisture: 65,
  },
  alerts: [
    { type: 'warning', message: 'Low nitrogen levels detected in Zone A' },
    { type: 'info', message: 'Optimal growth conditions in Zone B' },
  ],
};

export const pharmaceuticalData = {
  herbQuality: 92,
  consumptionSafety: 'Safe',
  demandValue: 85,
  medicinalEffectiveness: 88,
  recentAnalyses: [
    { plant: 'Aloe Vera', quality: 94, safety: 'Safe' },
    { plant: 'Turmeric', quality: 89, safety: 'Safe' },
    { plant: 'Neem', quality: 87, safety: 'Caution' },
  ],
  safetyDistribution: [
    { status: 'Safe', count: 65 },
    { status: 'Caution', count: 25 },
    { status: 'Risky', count: 10 },
  ],
};

export const analysisResult = {
  farmer: {
    plantStatus: 'Diseased',
    diseaseName: 'Early Blight',
    qualityScore: 68,
    vulnerabilityScore: 72,
    medicinalValue: 'Low',
    marketPrice: '$2.15/kg',
    suggestions: [
      'Apply copper-based fungicide within 24-48 hours',
      'Remove and destroy infected leaves',
      'Improve air circulation around plants',
      'Avoid overhead watering',
      'Apply nitrogen fertilizer to boost plant immunity',
    ],
    confidence: 94,
  },
  agricultural: {
    species: 'Solanum lycopersicum (Tomato)',
    characteristics: {
      leafType: 'Compound pinnate',
      venation: 'Reticulate',
      margin: 'Serrated',
      texture: 'Slightly hairy',
    },
    fertilityIndex: 76,
    diseaseProbability: 78,
    growthStage: 'Vegetative',
    nutrients: {
      nitrogen: 42,
      phosphate: 35,
      potassium: 38,
    },
    alerts: [
      'Disease detected: Early intervention recommended',
      'Nitrogen levels slightly below optimal',
    ],
  },
  pharmaceutical: {
    plantIdentity: 'Solanum lycopersicum',
    healthValue: 72,
    healthPercentage: 68,
    status: 'Diseased',
    isCurable: true,
    treatments: [
      'Fungicidal treatment with copper compounds',
      'Biological control using Bacillus subtilis',
      'Cultural practices: proper spacing and ventilation',
    ],
    sideEffects: [
      'Reduced medicinal alkaloid content',
      'Potential contamination if disease spreads',
      'Lower market value for medicinal purposes',
    ],
    medicinalProperties: {
      antioxidants: 'Moderate',
      antiInflammatory: 'Low (due to disease)',
      vitamins: 'Reduced C content',
    },
  },
};
