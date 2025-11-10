import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, TrendingUp } from "lucide-react";
import { TrendCard } from "./TrendCard";

interface Trend {
  topic: string;
  explanation: string;
  relevance_score: number;
}

export const ProductGenerator = () => {
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [trends, setTrends] = useState<Trend[]>([]);
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);
  const { toast } = useToast();

  const discoverTrends = async () => {
    setIsDiscovering(true);
    try {
      const { data, error } = await supabase.functions.invoke('discover-trends');
      
      if (error) throw error;
      
      setTrends(data.trends);
      toast({
        title: "✨ Trends Discovered!",
        description: "3 trending product ideas ready for selection.",
      });
    } catch (error: any) {
      console.error('Error discovering trends:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to discover trends",
        variant: "destructive",
      });
    } finally {
      setIsDiscovering(false);
    }
  };

  const generateProduct = async () => {
    if (!selectedTrend) return;
    
    setIsGenerating(true);
    try {
      // Step 1: Generate product data
      const { data: productData, error: productError } = await supabase.functions.invoke('generate-product', {
        body: {
          topic: selectedTrend.topic,
          explanation: selectedTrend.explanation
        }
      });
      
      if (productError) throw productError;
      
      const product = productData.product;
      
      // Step 2: Generate cover image
      toast({
        title: "Creating cover image...",
        description: "This may take a moment. ✨",
      });
      
      const { data: imageData, error: imageError } = await supabase.functions.invoke('generate-cover-image', {
        body: {
          title: product.title,
          description: product.description
        }
      });
      
      if (imageError) {
        console.error('Image generation error:', imageError);
        toast({
          title: "Note",
          description: "Product created without cover image. You can generate it later.",
          variant: "default",
        });
      }
      
      // Step 3: Save to database
      const { error: dbError } = await supabase.from('products').insert({
        title: product.title,
        description: product.description,
        benefits: product.benefits,
        price_range: product.price_range,
        hashtags: product.hashtags,
        social_caption: product.social_caption,
        cover_image_url: imageData?.imageUrl || null,
        status: 'ready'
      });
      
      if (dbError) throw dbError;
      
      toast({
        title: "🎉 Product Created!",
        description: `"${product.title}" is ready for Stan Store upload.`,
      });
      
      // Reset state
      setTrends([]);
      setSelectedTrend(null);
      
    } catch (error: any) {
      console.error('Error generating product:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate product",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-subtle border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Product Generator
          </CardTitle>
          <CardDescription>
            Discover trending topics and generate ready-to-sell digital products
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {trends.length === 0 ? (
            <Button 
              onClick={discoverTrends}
              disabled={isDiscovering}
              size="lg"
              className="w-full"
            >
              {isDiscovering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Discovering Trends...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Discover Trending Topics
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                {trends.map((trend, index) => (
                  <TrendCard
                    key={index}
                    {...trend}
                    isSelected={selectedTrend?.topic === trend.topic}
                    onSelect={() => setSelectedTrend(trend)}
                  />
                ))}
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={generateProduct}
                  disabled={!selectedTrend || isGenerating}
                  size="lg"
                  className="flex-1"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Product...
                    </>
                  ) : (
                    'Generate Complete Product'
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setTrends([]);
                    setSelectedTrend(null);
                  }}
                  variant="outline"
                  size="lg"
                >
                  Start Over
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};