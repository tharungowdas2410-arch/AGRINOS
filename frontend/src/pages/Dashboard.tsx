import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardWidget } from '@/components/DashboardWidget';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { authService } from '@/lib/auth';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Upload, TrendingUp, Activity, AlertCircle, Leaf, Sprout, FlaskConical, DollarSign } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
 
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
};

type PharmaPayload = {
  medicinalUses: string;
  nutritionalValue: string;
  healthPercentage: number;
  toxicityRisk: string;
  curable: boolean;
  disadvantages: string;
  severity: string;
};

type PredictionHistoryItem = { id: string; createdAt?: string; payload: FarmerPayload | IndustryPayload | PharmaPayload | Record<string, unknown> };

const Dashboard = () => {
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      const y = window.scrollY || 0;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setOffset(y));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  const user = authService.getCurrentUser();

  if (!user) return null;

  const FarmerDashboard = () => {
    const { data: history = [], isLoading } = useQuery<PredictionHistoryItem[]>({
      queryKey: ['predictionHistory'],
      queryFn: () => api.predictionHistory(),
      refetchInterval: 5000
    });

    const uploads = history.length;
    const last = history[0]?.payload ?? null;
    const diseaseCounts: Record<string, number> = {};
    history.forEach((h) => {
      const d = h.payload?.disease;
      if (d) diseaseCounts[d] = (diseaseCounts[d] ?? 0) + 1;
    });
    const commonDisease = Object.entries(diseaseCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'N/A';
    const marketPrice = typeof last?.averageMarketPrice === 'number' ? `$${last.averageMarketPrice.toFixed(2)}` : 'N/A';
    const qualityAvg = Math.round(
      history.reduce((acc, h) => acc + (h.payload?.qualityIndex ?? 0), 0) / Math.max(history.length, 1)
    );

    const recentAnalyses = history.slice(0, 6).map((h) => ({
      date: h.createdAt ? new Date(h.createdAt).toLocaleString() : 'Recent',
      quality: h.payload?.qualityIndex ?? 0,
      status: h.payload?.severity === 'low' ? 'Healthy' : 'Issue'
    }));

    const priceHistory = history
      .filter((h) => typeof h.payload?.averageMarketPrice === 'number')
      .slice(0, 6)
      .reverse()
      .map((h) => ({
        month: h.createdAt ? new Date(h.createdAt).toLocaleDateString() : 'Entry',
        price: h.payload.averageMarketPrice
      }));

    return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}</p>
        </div>
        <Button onClick={() => navigate('/upload')}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Image
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardWidget
          title="Total Uploads"
          value={isLoading ? '...' : uploads}
          icon={Leaf}
          description="Plants analyzed this month"
        />
        <DashboardWidget
          title="Common Disease"
          value={isLoading ? '...' : commonDisease}
          icon={AlertCircle}
          description="Most detected issue"
        />
        <DashboardWidget
          title="Market Price"
          value={isLoading ? '...' : marketPrice}
          icon={DollarSign}
          description="Average price today"
          trend="+5.2% from last week"
        />
        <DashboardWidget
          title="Average Quality"
          value={isLoading ? '...' : `${qualityAvg}%`}
          icon={TrendingUp}
          description="Crop health score"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Price Trend</CardTitle>
            <CardDescription>Recent market price from analyses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={priceHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Analyses</CardTitle>
            <CardDescription>Your latest plant health checks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAnalyses.map((analysis, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{analysis.date}</p>
                    <p className="text-sm text-muted-foreground">Quality: {analysis.quality}%</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    analysis.status === 'Healthy' 
                      ? 'bg-success/10 text-success' 
                      : 'bg-destructive/10 text-destructive'
                  }`}>
                    {analysis.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
  };

  const AgriculturalDashboard = () => {
    const { data: sensors = [], isLoading } = useQuery<Array<{ ph: number; ec: number; moisture: number; temperature: number; createdAt: string }>>({
      queryKey: ['sensorHistory'],
      queryFn: () => api.sensorHistory(),
      refetchInterval: 3000
    });
    const latest = sensors[0];
    const moistureSeries = sensors.slice(0, 10).reverse().map((s, i) => ({
      idx: i + 1,
      moisture: s.moisture
    }));
    return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Agricultural Industry Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}</p>
        </div>
        <Button onClick={() => navigate('/upload')} variant="secondary">
          <Upload className="mr-2 h-4 w-4" />
          Upload Data
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardWidget
          title="Moisture"
          value={isLoading || !latest ? '...' : `${latest.moisture}%`}
          icon={Sprout}
          description="Latest field reading"
        />
        <DashboardWidget
          title="pH"
          value={isLoading || !latest ? '...' : latest.ph}
          icon={Activity}
          description="Soil acidity"
          trend=""
        />
        <DashboardWidget
          title="EC"
          value={isLoading || !latest ? '...' : latest.ec}
          icon={TrendingUp}
          description="Electrical conductivity"
        />
        <DashboardWidget
          title="Temperature"
          value={isLoading || !latest ? '...' : `${latest.temperature}°C`}
          icon={AlertCircle}
          description="Ambient"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Moisture Trend</CardTitle>
            <CardDescription>Recent moisture readings</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={moistureSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="idx" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="moisture" fill="hsl(var(--secondary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Sensors</CardTitle>
            <CardDescription>Current readings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">pH</span>
                  <span className="text-sm text-muted-foreground">{isLoading || !latest ? '...' : latest.ph}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${Math.min(100, Math.max(0, (latest?.ph ?? 0) * 10))}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">EC</span>
                  <span className="text-sm text-muted-foreground">{isLoading || !latest ? '...' : latest.ec}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-secondary h-2 rounded-full" style={{ width: `${Math.min(100, Math.max(0, (latest?.ec ?? 0) * 10))}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Moisture</span>
                  <span className="text-sm text-muted-foreground">{isLoading || !latest ? '...' : `${latest.moisture}%`}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full" style={{ width: `${Math.min(100, Math.max(0, latest?.moisture ?? 0))}%` }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sensor History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sensors.slice(0, 5).map((s, idx) => (
              <div key={idx} className="p-3 rounded-lg border flex justify-between">
                <span className="text-sm text-muted-foreground">{new Date(s.createdAt).toLocaleString()}</span>
                <span className="text-sm">pH {s.ph} • EC {s.ec} • Moist {s.moisture}% • {s.temperature}°C</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
  };

  const PharmaceuticalDashboard = () => {
    const { data: history = [] } = useQuery<PredictionHistoryItem[]>({
      queryKey: ['predictionHistoryPharma'],
      queryFn: () => api.predictionHistory(),
      refetchInterval: 5000
    });
    const COLORS = ['hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--destructive))'];
    const recentAnalyses = history.slice(0, 6).map((h) => ({
      plant: h.payload?.species ?? 'Unknown',
      quality: h.payload?.healthPercentage ?? h.payload?.qualityIndex ?? 0,
      safety: h.payload?.toxicityRisk === 'HIGH' ? 'Caution' : 'Safe'
    }));
    const safetyDistribution = [
      { status: 'Safe', count: history.filter((h) => h.payload?.toxicityRisk !== 'HIGH').length },
      { status: 'Caution', count: history.filter((h) => h.payload?.toxicityRisk === 'HIGH').length },
      { status: 'Unknown', count: history.filter((h) => !h.payload?.toxicityRisk).length }
    ];
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Pharmaceutical Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.name}</p>
          </div>
          <Button onClick={() => navigate('/upload')} className="bg-accent hover:bg-accent/90">
            <Upload className="mr-2 h-4 w-4" />
            Analyze Plant
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardWidget
            title="Herb Quality"
            value={`${Math.round(history.reduce((acc, h) => acc + (h.payload?.healthPercentage ?? h.payload?.qualityIndex ?? 0), 0) / Math.max(history.length, 1))}%`}
            icon={FlaskConical}
            description="Average quality score"
          />
          <DashboardWidget
            title="Safety Status"
            value={history.some((h) => h.payload?.toxicityRisk === 'HIGH') ? 'Caution' : 'Safe'}
            icon={AlertCircle}
            description="Consumption assessment"
          />
          <DashboardWidget
            title="Demand Value"
            value={history.length}
            icon={TrendingUp}
            description="Market demand index"
          />
          <DashboardWidget
            title="Effectiveness"
            value={`${Math.round(history.reduce((acc, h) => acc + (h.payload?.healthPercentage ?? 0), 0) / Math.max(history.length, 1))}%`}
            icon={Activity}
            description="Medicinal potential"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Safety Distribution</CardTitle>
              <CardDescription>Plant samples by safety category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={safetyDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ status, count }) => `${status}: ${count}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {safetyDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Analyses</CardTitle>
              <CardDescription>Latest medicinal plant evaluations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAnalyses.map((analysis, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{analysis.plant}</p>
                      <p className="text-sm text-muted-foreground">Quality: {analysis.quality}%</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      analysis.safety === 'Safe' 
                        ? 'bg-success/10 text-success' 
                        : 'bg-warning/10 text-warning'
                    }`}>
                      {analysis.safety}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" style={{ transform: `translateY(${offset * 0.1}px)` }} />
          </div>
        </div>
        {user.role === 'farmer' && <FarmerDashboard />}
        {user.role === 'agricultural' && <AgriculturalDashboard />}
        {user.role === 'pharmaceutical' && <PharmaceuticalDashboard />}
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default Dashboard;
