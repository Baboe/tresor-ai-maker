import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Calendar, TrendingUp, Package } from "lucide-react";
import WorkflowSteps from "@/components/WorkflowSteps";
import ProductCard from "@/components/ProductCard";
import { ProductGenerator } from "@/components/ProductGenerator";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data;
    }
  });

  const stats = {
    trending: 12,
    created: products.length,
    ready: products.filter(p => p.status === 'ready').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-cream">
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-10 h-10 text-primary animate-pulse mr-3" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-rose-dark via-primary to-rose bg-clip-text text-transparent">
              TrésorAI
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your elegant AI assistant creating ready-to-sell digital products daily ✨
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trending Topics</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.trending}</div>
              <p className="text-xs text-muted-foreground">Discovered this week</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products Created</CardTitle>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.created}</div>
              <p className="text-xs text-muted-foreground">Total generated</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ready to Upload</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.ready}</div>
              <p className="text-xs text-muted-foreground">Awaiting Stan Store</p>
            </CardContent>
          </Card>
        </div>

        <ProductGenerator />
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-4">Your Automated Workflow</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          TrésorAI handles everything from trend discovery to final delivery
        </p>
        <WorkflowSteps />
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recent Creations</h2>
          <Package className="h-5 w-5 text-muted-foreground" />
        </div>
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <Card className="bg-card/50 backdrop-blur border-border/50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">No products yet</p>
              <p className="text-sm text-muted-foreground">Generate your first product above!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard 
                key={product.id}
                title={product.title}
                description={product.description}
                price={product.price_range}
                image={product.cover_image_url || "https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=400"}
                status={product.status}
                benefits={product.benefits as string[] | null}
                tagline={product.tagline}
                introduction={product.introduction}
                pillars={product.pillars as any}
                worksheets={product.worksheets as string[] | null}
                bonus_assets={product.bonus_assets as string[] | null}
                reflection_questions={product.reflection_questions as string[] | null}
                next_steps={product.next_steps}
                social_caption={product.social_caption}
              />
            ))}
          </div>
        )}
      </section>

      <footer className="container mx-auto px-4 py-8 text-center border-t border-border mt-16">
        <p className="text-muted-foreground">
          Your AI assistant, <span className="text-primary font-semibold">TrésorAI</span> ✨
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Supportive • Elegant • Slightly French
        </p>
      </footer>
    </div>
  );
};

export default Index;
