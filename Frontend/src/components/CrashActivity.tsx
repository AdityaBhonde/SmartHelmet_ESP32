import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Heart, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CrashEvent {
  time: string;
  wear: string;
  hr: string;
  spo2: string;
  status: string;
  date?: string;
}

interface CrashActivityProps {
  crashActivity: CrashEvent[];
}

export const CrashActivity = ({ crashActivity }: CrashActivityProps) => {
  const formatDate = (time: string) => {
    const now = new Date();
    return now.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  return (
    <Card className="slide-up gradient-card border-2 border-primary/20 shadow-lg overflow-hidden relative group hover:border-primary/40 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-danger/10">
            <AlertCircle className="h-5 w-5 text-danger" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Crash Activity
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <ScrollArea className="h-64 w-full rounded-xl border-2 border-danger/10 bg-background/50 backdrop-blur-sm p-4">
          {crashActivity.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-8">
              <div className="p-4 rounded-full bg-muted/30 mb-3">
                <AlertCircle className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <p className="text-sm text-muted-foreground">
                No crash events recorded
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                All systems operational
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {crashActivity.map((event, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl border-2 border-danger/20 bg-danger/5 hover:border-danger/40 hover:shadow-lg hover:shadow-danger/10 transition-all duration-300 backdrop-blur-sm"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-danger/20">
                        <AlertCircle className="h-4 w-4 text-danger" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          {event.time}
                        </p>
                        <p className="text-xs text-muted-foreground font-medium">
                          {formatDate(event.time)}
                        </p>
                      </div>
                    </div>
                    <Badge variant="destructive" className="text-xs font-bold shadow-lg">
                      {event.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mt-4 p-3 rounded-lg bg-background/50">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <Heart className="h-3.5 w-3.5 text-success" />
                        <span className="text-xs text-muted-foreground font-medium">Heart Rate</span>
                      </div>
                      <span className="text-lg font-bold text-success">{event.hr}</span>
                      <span className="text-xs text-muted-foreground">bpm</span>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <Activity className="h-3.5 w-3.5 text-info" />
                        <span className="text-xs text-muted-foreground font-medium">SpO₂</span>
                      </div>
                      <span className="text-lg font-bold text-info">{event.spo2}</span>
                      <span className="text-xs text-muted-foreground">%</span>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <div className="h-3.5 w-3.5 rounded-full bg-primary" />
                        <span className="text-xs text-muted-foreground font-medium">Helmet</span>
                      </div>
                      <span className="text-lg font-bold text-foreground capitalize">
                        {event.wear}
                      </span>
                      <span className="text-xs text-muted-foreground">status</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
