import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import { generateWorkbookPDF } from "@/lib/pdfGenerator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

function generateFileName(title: string): string {
  const sanitizedTitle = title
    ?.trim()
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  if (!sanitizedTitle) {
    return "workbook.pdf";
  }

  return `${sanitizedTitle}.pdf`;
}

function downloadPDF(pdfBytes: ArrayBuffer, fileName: string) {
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
}

interface Pillar {
  name: string;
  description: string;
  why_it_matters: string;
  how_to_apply: string;
}

interface ProductCardProps {
  title: string;
  description: string;
  price: string;
  image: string;
  status?: string;
  benefits?: string[] | null;
  tagline?: string;
  introduction?: string;
  pillars?: Pillar[] | null;
  worksheets?: string[] | null;
  bonus_assets?: string[] | null;
  reflection_questions?: string[] | null;
  next_steps?: string;
  social_caption?: string;
}

const ProductCard = ({
  title,
  description,
  price,
  image,
  status = "draft",
  benefits = [],
  tagline,
  introduction,
  pillars,
  worksheets,
  bonus_assets,
  reflection_questions,
  next_steps,
  social_caption
}: ProductCardProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGeneratePDF = async () => {
    const normalizedBenefits = Array.isArray(benefits)
      ? benefits.filter((benefit): benefit is string => typeof benefit === 'string' && benefit.trim().length > 0)
      : [];

    setIsGenerating(true);
    try {
      const pdfBytes = await generateWorkbookPDF({
        title,
        tagline,
        description,
        introduction,
        benefits: normalizedBenefits,
        pillars,
        worksheets,
        bonus_assets,
        reflection_questions,
        next_steps,
        price_range: price,
        social_caption,
      });

      const fileName = generateFileName(title);
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });

      const { error } = await supabase.storage
        .from('product-pdfs')
        .upload(fileName, blob, {
          contentType: 'application/pdf',
          upsert: true,
        });

      if (error) throw error;

      downloadPDF(pdfBytes.buffer as ArrayBuffer, fileName);

      toast({
        title: "✨ Workbook Generated!",
        description: "Your PDF workbook is ready and saved to storage.",
      });
    } catch (error: any) {
      console.error('PDF generation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate PDF workbook",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 bg-gradient-to-br from-card to-cream border-border">
      <div className="aspect-[4/3] bg-beige relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-lg text-foreground line-clamp-2">
            {title}
          </h3>
          <Badge className="bg-primary/10 text-primary border-primary/20">
            {price}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {description}
        </p>
        
        <div className="mb-4">
          <Badge variant={status === "ready" ? "default" : "secondary"}>
            {status === "ready" ? "Ready to Upload" : "Draft"}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleGeneratePDF}
            disabled={isGenerating}
            className="flex-1 bg-gradient-to-r from-primary to-rose-dark hover:opacity-90"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Generate PDF
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
