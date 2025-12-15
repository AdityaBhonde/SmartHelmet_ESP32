import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

interface CrashStatusCardProps {
  crashStatus: string;
  onEmergencyCall: () => void;
}

export const CrashStatusCard = ({ crashStatus, onEmergencyCall }: CrashStatusCardProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isCritical = crashStatus === "trueCrash" || crashStatus === "pending";

  useEffect(() => {
    if (isCritical && !audioRef.current) {
      // Create alarm sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 880; // A5 note
      oscillator.type = "sine";
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      
      oscillator.start();
      
      // Pulsing effect
      const pulse = () => {
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      };
      
      const interval = setInterval(pulse, 1000);
      
      return () => {
        clearInterval(interval);
        oscillator.stop();
        audioContext.close();
      };
    }
  }, [isCritical]);

  const getStatusConfig = () => {
    switch (crashStatus) {
      case "trueCrash":
        return {
          icon: <AlertTriangle className="h-8 w-8" />,
          text: "True Crash Detected!",
          description: "Emergency services notified",
          color: "text-danger-foreground",
          bg: "bg-danger",
          showButton: true
        };
      case "pending":
        return {
          icon: <AlertTriangle className="h-8 w-8" />,
          text: "Crash Detected (Pending)",
          description: "Awaiting confirmation...",
          color: "text-warning-foreground",
          bg: "bg-warning",
          showButton: false
        };
      case "falseAlert":
        return {
          icon: <CheckCircle className="h-8 w-8" />,
          text: "False Alert",
          description: "Crash cancelled by user",
          color: "text-success-foreground",
          bg: "bg-success",
          showButton: false
        };
      default:
        return {
          icon: <CheckCircle className="h-8 w-8" />,
          text: "Normal",
          description: "All systems operational",
          color: "text-card-foreground",
          bg: "bg-card",
          showButton: false
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Card className={`slide-up overflow-hidden relative ${
      isCritical ? "pulse-alert border-2 border-danger/50" : "gradient-card border-2 border-primary/20"
    } shadow-lg group hover:border-primary/40 transition-all duration-300`}>
      {isCritical && (
        <div className="absolute inset-0 bg-gradient-to-br from-danger/20 via-danger/5 to-transparent animate-pulse" />
      )}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className={`p-2 rounded-lg ${
            isCritical ? "bg-danger/20" : "bg-primary/10 glow-primary"
          }`}>
            <AlertTriangle className={`h-5 w-5 ${
              isCritical ? "text-danger" : "text-primary"
            }`} />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Crash Status
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative">
        <div className={`p-6 rounded-xl border-2 transition-all duration-300 ${config.bg} border-transparent`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className={`p-4 rounded-2xl ${
                crashStatus === "trueCrash" ? "bg-danger/20" :
                crashStatus === "pending" ? "bg-warning/20" :
                crashStatus === "falseAlert" ? "bg-success/20" :
                "bg-primary/20"
              }`}>
                <div className={config.color}>
                  {config.icon}
                </div>
              </div>
              <div>
                <p className={`text-2xl font-bold mb-1 ${config.color}`}>
                  {config.text}
                </p>
                <p className={`text-sm ${config.color} opacity-80 font-medium`}>
                  {config.description}
                </p>
                {isCritical && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-danger/80">
                    <div className="h-2 w-2 rounded-full bg-danger animate-pulse" />
                    <span>ALERT ACTIVE</span>
                  </div>
                )}
              </div>
            </div>
            {config.showButton && (
              <Button
                onClick={onEmergencyCall}
                size="lg"
                className="bg-white text-danger hover:bg-white/90 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Phone className="h-5 w-5 mr-2" />
                Call Emergency
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
