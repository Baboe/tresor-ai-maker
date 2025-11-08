import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, TrendingUp, FileText, Image, Database, Mail, Calendar } from "lucide-react";
import WorkflowSteps from "@/components/WorkflowSteps";
import ProductCard from "@/components/ProductCard";

const Index = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // TODO: Implement product generation workflow
    setTimeout(() => setIsGenerating(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-cream">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="flex items-center justify-center mb-6 gap-2">
          <Sparkles className="w-10 h-10 text-primary animate-pulse" />
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-rose-dark via-primary to-rose bg-clip-text text-transparent">
            TrésorAI
          </h1>
        </div>
        <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto">
          Your elegant AI assistant for daily digital product creation
        </p>
        <p className="text-base text-muted-foreground mb-8 max-w-xl mx-auto">
          Each morning, discover trending topics, create beautiful digital products, and get ready-to-upload packs for your Stan Store ✨
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-primary to-rose-dark hover:opacity-90 transition-opacity shadow-soft hover:shadow-hover text-lg px-8"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            <Sparkles className="mr-2 w-5 h-5" />
            {isGenerating ? "Creating Magic..." : "Generate Product Now"}
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-2 border-primary text-primary hover:bg-rose-light/20 text-lg px-8"
          >
            <Calendar className="mr-2 w-5 h-5" />
            Schedule Daily
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-16">
          {[
            { icon: TrendingUp, label: "Trending Topics", value: "Daily" },
            { icon: FileText, label: "Products Created", value: "0" },
            { icon: Database, label: "Ready to Upload", value: "0" },
          ].map((stat, i) => (
            <Card key={i} className="p-6 shadow-card hover:shadow-soft transition-shadow bg-gradient-to-br from-card to-cream border-border">
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Workflow Steps */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-4 text-foreground">
          Your Automated Workflow
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          TrésorAI handles everything from trend discovery to final delivery
        </p>
        <WorkflowSteps />
      </section>

      {/* Recent Products Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-4 text-foreground">
          Recent Creations
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          Your AI-generated digital products
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Placeholder for products */}
          <Card className="p-8 text-center shadow-card bg-gradient-to-br from-card to-cream border-dashed border-2 border-border">
            <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No products yet</p>
            <p className="text-sm text-muted-foreground mt-2">Click "Generate Product Now" to start</p>
          </Card>
        </div>
      </section>

      {/* Footer */}
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
