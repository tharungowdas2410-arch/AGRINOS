import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { authService } from '@/lib/auth';
import { api } from '@/lib/api';
import { AlertCircle, Leaf, Loader2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type FarmerPayload = {
  disease: string;
  cureSteps: string;
  vulnerabilityScore: number;
  curable: boolean;
  medicinalValue: string;
  averageMarketPrice: number | null;
  qualityIndex: number;
  severity: string;
  advisory: string;
  aiDescription?: {
    speciesName: string;
    about: string;
    cause: string;
    curability: string;
    steps: string[];
    precautions?: string[];
  } | null;
};

type IndustryPayload = {
  species: string;
  healthCondition: string;
  soilFertilitySuggestions: string;
  nutrientDeficiencyAnalysis: string;
  realTimeSensor: {
    ph: number;
    ec: number;
    moisture: number;
    temperature: number;
    createdAt: string;
  } | null;
  plantInformation: {
    species: string;
    medicinalValue: string;
    nutritionalInfo: string;
    avgMarketPrice: number;
    cures: string;
  } | null;
  qualityIndex: number;
  aiDescription?: {
    speciesName: string;
    about: string;
    cause: string;
    curability: string;
    steps: string[];
    precautions?: string[];
  } | null;
};

type PharmaPayload = {
  medicinalUses: string;
  nutritionalValue: string;
  healthPercentage: number;
  toxicityRisk: string;
  curable: boolean;
  disadvantages: string;
  severity: string;
  aiDescription?: {
    speciesName: string;
    about: string;
    cause: string;
    curability: string;
    steps: string[];
    precautions?: string[];
  } | null;
};

const STORAGE_KEY = 'latest_prediction';

const Results = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<FarmerPayload | IndustryPayload | PharmaPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await api.predictionHistory();
        if (Array.isArray(history) && history.length > 0) {
          const latest = history[0];
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ predictionId: latest.id, result: latest.payload }));
          setResult(latest.payload);
        } else {
          const cached = sessionStorage.getItem(STORAGE_KEY);
          if (cached) {
            try {
              const parsed = JSON.parse(cached);
              setResult(parsed.result);
            } catch (e) { void e; }
          } else {
            setError('No previous predictions available. Upload a plant image first.');
          }
        }
      } catch (err) {
        console.error(err);
        const cached = sessionStorage.getItem(STORAGE_KEY);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            setResult(parsed.result);
          } catch (e) {
            void e;
            setError('Unable to load prediction results.');
          }
        } else {
          setError('Unable to load prediction results.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (!user) return null;

  const renderFarmerView = (data: FarmerPayload) => (
    <div className="space-y-6">
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">Disease: {data.disease}</CardTitle>
              <CardDescription>Detected severity: {data.severity}</CardDescription>
            </div>
            <Badge variant={data.severity === 'high' ? 'destructive' : 'default'} className="text-sm">
              {data.severity.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Quality Index</p>
              <p className="text-2xl font-bold">{data.qualityIndex}%</p>
              <Progress value={data.qualityIndex} className="h-2 mt-2" />
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Vulnerability</p>
              <p className="text-2xl font-bold">{data.vulnerabilityScore}%</p>
              <Progress value={data.vulnerabilityScore} className="h-2 mt-2" />
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Avg. Market Price</p>
              <p className="text-2xl font-bold">
                {data.averageMarketPrice ? `$${data.averageMarketPrice.toFixed(2)}` : 'N/A'}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Leaf className="h-4 w-4 text-primary" />
                Medicinal Value
              </h3>
              <p className="text-sm text-muted-foreground">{data.medicinalValue}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Advisory</h3>
              <p className="text-sm text-muted-foreground">{data.advisory}</p>
            </div>
          </div>

          {data.aiDescription?.steps && data.aiDescription.steps.length > 0 ? (
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-primary" />
                  Treatment Plan - 10 Step Cure Guide
                </CardTitle>
                <CardDescription>
                  AI-generated comprehensive treatment steps for {data.disease}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.aiDescription.about && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium mb-1">About the Disease:</p>
                    <p className="text-sm text-muted-foreground">{data.aiDescription.about}</p>
                  </div>
                )}
                {data.aiDescription.cause && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium mb-1">Cause:</p>
                    <p className="text-sm text-muted-foreground">{data.aiDescription.cause}</p>
                  </div>
                )}
                {data.aiDescription.curability && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium mb-1">Curability:</p>
                    <p className="text-sm text-muted-foreground">{data.aiDescription.curability}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg">Treatment Steps:</h4>
                  <div className="grid gap-3">
                    {data.aiDescription.steps.map((step, index) => (
                      <div key={index} className="flex gap-3 p-3 bg-primary/5 border border-primary/10 rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <p className="text-sm flex-1 pt-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {data.aiDescription.precautions && data.aiDescription.precautions.length > 0 && (
                  <div className="mt-4 p-4 bg-warning/10 border border-warning/20 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Important Precautions:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {data.aiDescription.precautions.map((precaution, index) => (
                        <li key={index}>{precaution}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-3 flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">Curable:</p>
                  <Badge variant={data.curable ? 'default' : 'destructive'}>
                    {data.curable ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="p-4 border rounded-lg bg-muted/40">
              <h3 className="font-semibold mb-2">Recommended Cure Steps</h3>
              <p className="text-sm leading-relaxed">{data.cureSteps}</p>
              <div className="mt-3">
                <p className="text-sm text-muted-foreground">Curable</p>
                <Badge variant={data.curable ? 'default' : 'destructive'}>
                  {data.curable ? 'Yes' : 'No'}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {data.aiDescription && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle>AI Description</CardTitle>
            <CardDescription>Generated insights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Species</p>
              <p className="font-medium">{data.aiDescription.speciesName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">About</p>
              <p className="text-sm">{data.aiDescription.about}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cause</p>
              <p className="text-sm">{data.aiDescription.cause}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Curability</p>
              <p className="text-sm">{data.aiDescription.curability}</p>
            </div>
            {!!data.aiDescription.steps?.length && (
              <div>
                <p className="text-sm text-muted-foreground">Steps</p>
                <ul className="list-disc ml-5 text-sm">
                  {data.aiDescription.steps.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {!!data.aiDescription.precautions?.length && (
              <div>
                <p className="text-sm text-muted-foreground">Precautions</p>
                <ul className="list-disc ml-5 text-sm">
                  {data.aiDescription.precautions.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderIndustryView = (data: IndustryPayload) => (
    <div className="space-y-6">
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl">{data.species}</CardTitle>
          <CardDescription>Health condition: {data.healthCondition}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Quality Index</p>
              <p className="text-2xl font-bold">{data.qualityIndex}%</p>
              <Progress value={data.qualityIndex} className="h-2 mt-2" />
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Soil Fertility</p>
              <p className="text-sm">{data.soilFertilitySuggestions}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Nutrient Analysis</p>
              <p className="text-sm">{data.nutrientDeficiencyAnalysis}</p>
            </div>
          </div>

          {data.realTimeSensor && (
            <div className="grid gap-4 md:grid-cols-4">
              {(['ph', 'ec', 'moisture', 'temperature'] as const).map((metric) => (
                <div key={metric} className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1 uppercase">{metric}</p>
                  <p className="text-xl font-semibold">{data.realTimeSensor?.[metric]}</p>
                </div>
              ))}
            </div>
          )}

          {data.plantInformation && (
            <div className="p-4 border rounded-lg bg-muted/40">
              <h3 className="font-semibold mb-2">Plant Knowledge</h3>
              <p className="text-sm text-muted-foreground mb-1">{data.plantInformation.medicinalValue}</p>
              <p className="text-sm text-muted-foreground">
                Average market price: ${data.plantInformation.avgMarketPrice.toFixed(2)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {data.aiDescription && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle>AI Description</CardTitle>
            <CardDescription>Generated insights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Species</p>
              <p className="font-medium">{data.aiDescription.speciesName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">About</p>
              <p className="text-sm">{data.aiDescription.about}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cause</p>
              <p className="text-sm">{data.aiDescription.cause}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Curability</p>
              <p className="text-sm">{data.aiDescription.curability}</p>
            </div>
            {!!data.aiDescription.steps?.length && (
              <div>
                <p className="text-sm text-muted-foreground">Steps</p>
                <ul className="list-disc ml-5 text-sm">
                  {data.aiDescription.steps.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {!!data.aiDescription.precautions?.length && (
              <div>
                <p className="text-sm text-muted-foreground">Precautions</p>
                <ul className="list-disc ml-5 text-sm">
                  {data.aiDescription.precautions.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderPharmaView = (data: PharmaPayload) => (
    <div className="space-y-6">
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl">Medicinal Assessment</CardTitle>
          <CardDescription>Severity: {data.severity}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Health %</p>
              <p className="text-2xl font-bold">{data.healthPercentage}%</p>
              <Progress value={data.healthPercentage} className="h-2 mt-2" />
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Toxicity Risk</p>
              <Badge variant={data.toxicityRisk === 'HIGH' ? 'destructive' : 'secondary'}>
                {data.toxicityRisk}
              </Badge>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Curable</p>
              <Badge variant={data.curable ? 'default' : 'destructive'}>
                {data.curable ? 'Yes' : 'No'}
              </Badge>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Medicinal Uses</h3>
            <p className="text-sm text-muted-foreground">{data.medicinalUses}</p>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Nutritional Value</h3>
            <p className="text-sm text-muted-foreground">{data.nutritionalValue}</p>
          </div>

          <div className="p-4 border rounded-lg bg-muted/40">
            <h3 className="font-semibold mb-2">Risks if Untreated</h3>
            <p className="text-sm text-muted-foreground">{data.disadvantages}</p>
          </div>
        </CardContent>
      </Card>

      {data.aiDescription && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle>AI Description</CardTitle>
            <CardDescription>Generated insights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Species</p>
              <p className="font-medium">{data.aiDescription.speciesName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">About</p>
              <p className="text-sm">{data.aiDescription.about}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cause</p>
              <p className="text-sm">{data.aiDescription.cause}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Curability</p>
              <p className="text-sm">{data.aiDescription.curability}</p>
            </div>
            {!!data.aiDescription.steps?.length && (
              <div>
                <p className="text-sm text-muted-foreground">Steps</p>
                <ul className="list-disc ml-5 text-sm">
                  {data.aiDescription.steps.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {!!data.aiDescription.precautions?.length && (
              <div>
                <p className="text-sm text-muted-foreground">Precautions</p>
                <ul className="list-disc ml-5 text-sm">
                  {data.aiDescription.precautions.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderResult = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      );
    }

    if (error || !result) {
      return (
        <Card className="border-dashed border-2">
          <CardContent className="py-10 text-center space-y-4">
            <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">{error ?? 'No prediction data available.'}</p>
            <Button onClick={() => navigate('/upload')}>
              <Upload className="mr-2 h-4 w-4" />
              Upload a Plant Image
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (user.role === 'farmer') {
      return renderFarmerView(result as FarmerPayload);
    }

    if (user.role === 'agricultural') {
      return renderIndustryView(result as IndustryPayload);
    }

    return renderPharmaView(result as PharmaPayload);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Latest Analysis</h1>
              <p className="text-muted-foreground">
                Role-specific recommendations generated from the AI inference service.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </Button>
              <Button onClick={() => navigate('/upload')}>
                <Upload className="mr-2 h-4 w-4" />
                Analyze Another
              </Button>
            </div>
          </div>

          {renderResult()}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default Results;
