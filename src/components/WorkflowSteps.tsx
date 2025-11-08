import { Card } from "@/components/ui/card";
import { TrendingUp, Lightbulb, FileText, Image, Database, Mail, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: TrendingUp,
    title: "Trend Discovery",
    description: "Search trending topics in digital side hustles, manifestation, and productivity",
    color: "text-rose-dark",
  },
  {
    icon: Lightbulb,
    title: "Product Selection",
    description: "Choose the most evergreen yet viral idea with creative brief",
    color: "text-primary",
  },
  {
    icon: FileText,
    title: "Product Creation",
    description: "Generate title, description, benefits, pricing, and hashtags",
    color: "text-rose",
  },
  {
    icon: Image,
    title: "Asset Generation",
    description: "Create PDF workbook and cover image with minimalist design",
    color: "text-gold",
  },
  {
    icon: Database,
    title: "Storage & Logging",
    description: "Save to Google Drive and update Notion database",
    color: "text-rose-dark",
  },
  {
    icon: Mail,
    title: "Email Summary",
    description: "Receive daily summary with product details and upload reminder",
    color: "text-primary",
  },
];

const WorkflowSteps = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {steps.map((step, index) => (
        <Card
          key={index}
          className="p-6 shadow-card hover:shadow-soft transition-all duration-300 bg-gradient-to-br from-card to-cream border-border hover:scale-105"
        >
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl bg-rose-light/30 ${step.color}`}>
              <step.icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-bold text-muted-foreground">
                  {index + 1}
                </span>
                <h3 className="font-semibold text-foreground">{step.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default WorkflowSteps;
