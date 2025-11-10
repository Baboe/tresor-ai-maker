import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ExternalLink } from "lucide-react";

interface ProductCardProps {
  title: string;
  description: string;
  price: string;
  image: string;
  status?: string;
}

const ProductCard = ({
  title,
  description,
  price,
  image,
  status = "draft"
}: ProductCardProps) => {
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
          <Button className="flex-1 bg-gradient-to-r from-primary to-rose-dark hover:opacity-90">
            <Download className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
