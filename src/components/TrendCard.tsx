import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";

interface TrendCardProps {
  topic: string;
  explanation: string;
  relevance_score: number;
  onSelect: () => void;
  isSelected: boolean;
}

export const TrendCard = ({ topic, explanation, relevance_score, onSelect, isSelected }: TrendCardProps) => {
  return (
    <Card className={`transition-all hover:shadow-lg ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{topic}</CardTitle>
            <Badge variant="secondary" className="gap-1">
              <TrendingUp className="h-3 w-3" />
              Score: {relevance_score}/10
            </Badge>
          </div>
        </div>
        <CardDescription className="mt-3 text-base leading-relaxed">
          {explanation}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={onSelect}
          variant={isSelected ? "default" : "outline"}
          className="w-full"
        >
          {isSelected ? 'Selected ✓' : 'Select This Trend'}
        </Button>
      </CardContent>
    </Card>
  );
};