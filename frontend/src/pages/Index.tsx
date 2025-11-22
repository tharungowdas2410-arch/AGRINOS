import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { Leaf, Sprout, FlaskConical, TrendingUp, Shield, Zap } from 'lucide-react';

const Index = () => {
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 absolute inset-0"
            style={{ transform: `translateY(${offset * 0.15}px)` }}
          />
          <div
            className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
            style={{ transform: `translateY(${offset * 0.25}px)` }}
          />
          <div
            className="pointer-events-none absolute -right-24 top-24 h-64 w-64 rounded-full bg-secondary/10 blur-3xl"
            style={{ transform: `translateY(${offset * 0.35}px)` }}
          />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center" style={{ transform: `translateY(${offset * -0.08}px)` }}>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Leaf className="h-4 w-4" />
              AI-Powered Plant Analysis
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Revolutionize Plant Health Management
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Advanced AI classification system for farmers, agricultural professionals, and pharmaceutical industries. 
              Get instant insights on plant health, diseases, and medicinal properties.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="text-lg px-8">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose PlantClassify?</h2>
            <p className="text-lg text-muted-foreground">Powerful features for every role in agriculture</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Real-Time Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get instant AI-powered results on plant health, diseases, and actionable recommendations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-3">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Role-Based Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Customized analytics for farmers, agricultural industry, and pharmaceutical sectors.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Fast & Accurate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  94%+ accuracy with machine learning models trained on thousands of plant samples.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Role Cards Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Portal</h2>
            <p className="text-lg text-muted-foreground">Tailored solutions for every sector</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Farmer Portal */}
            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                  <Sprout className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-center text-2xl">Farmer Portal</CardTitle>
                <CardDescription className="text-center">
                  For individual farmers and small-scale growers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    Disease detection & identification
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    Quality score & market pricing
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    Fertilizer recommendations
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    Preventive action suggestions
                  </li>
                </ul>
                <Link to="/register" className="block mt-6">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Agricultural Industry Portal */}
            <Card className="border-2 hover:border-secondary transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4 mx-auto">
                  <TrendingUp className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="text-center text-2xl">Agricultural Industry</CardTitle>
                <CardDescription className="text-center">
                  For agricultural businesses and large farms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">✓</span>
                    Soil fertility analysis
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">✓</span>
                    Crop health index monitoring
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">✓</span>
                    Yield prediction & optimization
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">✓</span>
                    Nutrient level tracking (NPK)
                  </li>
                </ul>
                <Link to="/register" className="block mt-6">
                  <Button variant="secondary" className="w-full">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pharmaceutical Portal */}
            <Card className="border-2 hover:border-accent transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4 mx-auto">
                  <FlaskConical className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-center text-2xl">Pharmaceutical</CardTitle>
                <CardDescription className="text-center">
                  For herbal medicine and pharmaceutical research
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">✓</span>
                    Medicinal property analysis
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">✓</span>
                    Consumption safety assessment
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">✓</span>
                    Quality & effectiveness scoring
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">✓</span>
                    Treatment recommendations
                  </li>
                </ul>
                <Link to="/register" className="block mt-6">
                  <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground">Get Started</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-secondary to-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Ready to Transform Your Plant Management?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of farmers, agricultural professionals, and pharmaceutical researchers.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 PlantClassify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
