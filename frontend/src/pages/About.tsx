import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Target, Users, Zap } from 'lucide-react';

const About = () => {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Leaf className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold">About PlantClassify</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced AI-powered plant analysis system serving farmers, agricultural industries, 
            and pharmaceutical researchers worldwide.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To revolutionize plant health management through cutting-edge artificial intelligence 
              and machine learning technologies. We empower farmers, agricultural professionals, 
              and pharmaceutical researchers with instant, accurate insights to make informed decisions 
              about plant health, disease management, and medicinal properties.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-secondary" />
                Technology
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Our system uses state-of-the-art deep learning models trained on thousands of plant samples:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  94%+ accuracy in disease detection
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Real-time image processing
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Multi-species plant recognition
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Comprehensive medicinal analysis
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" />
                Who We Serve
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                PlantClassify provides specialized solutions for:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Individual farmers and small growers
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Agricultural businesses and large farms
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Pharmaceutical companies and researchers
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Herbal medicine practitioners
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2 text-primary">For Farmers</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Disease identification</li>
                  <li>• Quality scoring</li>
                  <li>• Market pricing</li>
                  <li>• Treatment recommendations</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-secondary">For Agriculture</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Soil analysis</li>
                  <li>• Crop health monitoring</li>
                  <li>• Yield predictions</li>
                  <li>• Nutrient tracking</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-accent">For Pharmaceutical</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Medicinal properties</li>
                  <li>• Safety assessment</li>
                  <li>• Quality evaluation</li>
                  <li>• Treatment options</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default About;
