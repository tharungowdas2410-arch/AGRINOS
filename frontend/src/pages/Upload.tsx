import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ImageUpload } from '@/components/ImageUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/lib/auth';
import { api } from '@/lib/api';

const Upload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = authService.getCurrentUser();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!selectedImage) {
      toast({
        title: 'No image selected',
        description: 'Please upload an image first.',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await api.predict(selectedImage);
      sessionStorage.setItem('latest_prediction', JSON.stringify(response));
      toast({
        title: 'Analysis complete',
        description: 'Your plant has been analyzed successfully.',
      });
      navigate('/results');
    } catch (error) {
      console.error(error);
      toast({
        title: 'Analysis failed',
        description: 'Unable to analyze the image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRoleDescription = () => {
    switch (user?.role) {
      case 'farmer':
        return 'Upload a clear image of your plant leaf to get disease detection, quality assessment, and recommendations.';
      case 'agricultural':
        return 'Upload plant images or sensor data to analyze soil fertility, crop health, and yield predictions.';
      case 'pharmaceutical':
        return 'Upload medicinal plant images to assess quality, safety, and medicinal effectiveness.';
      default:
        return 'Upload a plant image for analysis.';
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Upload Plant Image</h1>
            <p className="text-muted-foreground">{getRoleDescription()}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Image Upload</CardTitle>
              <CardDescription>
                Drag and drop or click to upload a clear image of the plant leaf
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                onImageSelect={setSelectedImage}
                selectedImage={selectedImage}
                onClear={() => setSelectedImage(null)}
              />
            </CardContent>
          </Card>

          {selectedImage && (
            <Card>
              <CardHeader>
                <CardTitle>Analysis Options</CardTitle>
                <CardDescription>
                  Ready to analyze your plant image
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">AI-Powered Analysis</p>
                      <p className="text-sm text-muted-foreground">
                        Our advanced machine learning model will analyze your plant and provide detailed insights.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Analyze Plant
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Tips for Best Results</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  Use good lighting and take photos in daylight if possible
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  Ensure the leaf fills most of the frame
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  Avoid blurry images - keep the camera steady
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  Capture both sides of the leaf if showing symptoms
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default Upload;
