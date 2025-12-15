import { useState, useEffect, useRef } from "react";
import { BiometricCard } from "@/components/BiometricCard";
import { HelmetStatusCard } from "@/components/HelmetStatusCard";
import { CrashStatusCard } from "@/components/CrashStatusCard";
import { EventLog } from "@/components/EventLog";
import { CrashActivity } from "@/components/CrashActivity";
import { useHelmetData } from "@/hooks/useHelmetData";
import { useToast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";

const Index = () => {
  const { toast } = useToast();
  const API_URL = "http://localhost:8080/status";
  const data = useHelmetData(API_URL);

  const buzzerRef = useRef(null);
  const [countdown, setCountdown] = useState(0);

  const handleEmergencyCall = async () => {
    const emergencyNumber = "8446551285";
    toast({
      title: "Emergency Alert Sent",
      description: `Alert sent to ${emergencyNumber} with crash details and location`,
      variant: "destructive",
    });

    try {
      await fetch("http://localhost:8080/api/emergency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hr: data.hr,
          spo2: data.spo2,
          wear: data.wear,
          status: data.crashStatus,
          location: "GPS not available",
        }),
      });
    } catch (err) {
      console.error("Error sending alert:", err);
    }
  };

  // Crash detected → start local buzzer for 15s
  useEffect(() => {
    if (data.crashStatus === "pending") {
      setCountdown(15);
      buzzerRef.current = new Audio("/buzzer.mp3");
      buzzerRef.current.loop = true;
      buzzerRef.current.play();

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            buzzerRef.current.pause();
            buzzerRef.current.currentTime = 0;
            handleEmergencyCall();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [data.crashStatus]);

  return (
    <div className="min-h-screen bg-background p-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-info/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-success/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-4 mb-4 p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-info/10 to-success/10 border border-primary/20 backdrop-blur-sm">
            <div className="p-3 rounded-xl bg-primary/20 glow-primary float">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <div className="text-left">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-info to-success bg-clip-text text-transparent">
                Smart Helmet Dashboard
              </h1>
              <p className="text-sm text-muted-foreground mt-1 font-medium">
                Real-time Safety Monitoring System
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BiometricCard heartRate={data.hr} spO2={data.spo2} />
          <HelmetStatusCard wear={data.wear} />
          <CrashStatusCard
            crashStatus={data.crashStatus}
            onEmergencyCall={handleEmergencyCall}
          />
        </div>

        {/* Countdown Popup */}
        {data.crashStatus === "pending" && countdown > 0 && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl text-center shadow-xl border border-destructive/40">
              <h2 className="text-2xl font-bold text-destructive mb-2">
                🚨 Crash Detected!
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Confirm within {countdown}s to cancel alert
              </p>
              <button
                onClick={() => {
                  buzzerRef.current.pause();
                  buzzerRef.current.currentTime = 0;
                }}
                className="px-5 py-2 bg-destructive text-white rounded-lg hover:bg-destructive/80"
              >
                False Alarm — Stop Buzzer
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EventLog logs={data.logs} />
          <CrashActivity crashActivity={data.crashActivity} />
        </div>
      </div>
    </div>
  );
};

export default Index;
