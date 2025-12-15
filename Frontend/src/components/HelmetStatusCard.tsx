import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HardHat, Shield, ShieldAlert } from "lucide-react";

interface HelmetStatusCardProps {
  wear: string;
}

export const HelmetStatusCard = ({ wear }: HelmetStatusCardProps) => {
  const isWorn = wear === "worn";
  
  return (
    <Card className="slide-up gradient-card border-2 border-primary/20 shadow-lg overflow-hidden relative group hover:border-primary/40 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-primary/10 glow-primary">
            <HardHat className="h-5 w-5 text-primary" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Helmet Status
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <div className={`p-6 rounded-xl border-2 transition-all duration-300 ${
          isWorn 
            ? "bg-success/10 border-success/30 hover:border-success/50 hover:shadow-lg hover:shadow-success/20" 
            : "bg-warning/10 border-warning/30 hover:border-warning/50 hover:shadow-lg hover:shadow-warning/20"
        }`}>
          <div className="flex items-center gap-6">
            <div className={`p-4 rounded-2xl ${
              isWorn ? "bg-success/20" : "bg-warning/20"
            }`}>
              {isWorn ? (
                <Shield className="h-16 w-16 text-success glow-success" />
              ) : (
                <ShieldAlert className="h-16 w-16 text-warning" />
              )}
            </div>
            <div className="flex-1">
              <p className={`text-3xl font-bold capitalize mb-2 ${
                isWorn ? "text-success" : "text-warning"
              }`}>
                {wear || "Unknown"}
              </p>
              <p className="text-sm text-muted-foreground font-medium">
                {isWorn ? "✓ Helmet is properly secured" : "⚠ Check helmet status"}
              </p>
              <div className="mt-4 flex gap-2">
                <div className={`h-2 flex-1 rounded-full ${
                  isWorn ? "bg-success/30" : "bg-warning/30"
                }`}>
                  <div className={`h-full rounded-full transition-all duration-500 ${
                    isWorn ? "w-full bg-success" : "w-1/2 bg-warning"
                  }`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
