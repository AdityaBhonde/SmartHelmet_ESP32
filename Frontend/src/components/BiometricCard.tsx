import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Heart } from "lucide-react";

interface BiometricCardProps {
  heartRate: number | null;
  spO2: number | null;
}

export const BiometricCard = ({ heartRate, spO2 }: BiometricCardProps) => {
  return (
    <Card className="slide-up gradient-card border-2 border-primary/20 shadow-lg overflow-hidden relative group hover:border-primary/40 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-primary/10 glow-primary">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Biometric Data
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 relative">
        <div className="p-4 rounded-xl bg-success/10 border border-success/20 hover:border-success/40 transition-all duration-300 hover:shadow-lg hover:shadow-success/20">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-full bg-success/20">
              <Heart className="h-4 w-4 text-success pulse-glow" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Heart Rate</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-5xl font-bold text-success tracking-tight">
                {heartRate ?? "--"}
              </p>
              <p className="text-sm text-success/70 mt-1 font-medium">beats per minute</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-success/60 uppercase tracking-wide">Status</div>
              <div className="text-sm font-semibold text-success">Normal</div>
            </div>
          </div>
        </div>
        
        <div className="p-4 rounded-xl bg-info/10 border border-info/20 hover:border-info/40 transition-all duration-300 hover:shadow-lg hover:shadow-info/20">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-full bg-info/20">
              <div className="h-4 w-4 rounded-full bg-gradient-to-br from-info to-info/60 pulse-glow" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Blood Oxygen</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-5xl font-bold text-info tracking-tight">
                {spO2 ?? "--"}
              </p>
              <p className="text-sm text-info/70 mt-1 font-medium">oxygen saturation</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-info/60 uppercase tracking-wide">Status</div>
              <div className="text-sm font-semibold text-info">Normal</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
