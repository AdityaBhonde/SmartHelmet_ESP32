import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";

interface EventLogProps {
  logs: string[];
}

export const EventLog = ({ logs }: EventLogProps) => {
  const parseLog = (log: string) => {
    const timeMatch = log.match(/\[([\d:]+)\]/);
    const time = timeMatch ? timeMatch[1] : "";
    const content = log.replace(/\[[\d:]+\]/, "").trim();
    
    return { time, content };
  };

  const getEventTypeColor = (content: string) => {
    if (content.includes("finalCrash") || content.includes("trueCrash")) {
      return "text-danger";
    }
    if (content.includes("crash") || content.includes("pending")) {
      return "text-warning";
    }
    if (content.includes("cancel") || content.includes("falseAlert")) {
      return "text-success";
    }
    if (content.includes("biometric")) {
      return "text-info";
    }
    return "text-muted-foreground";
  };

  return (
    <Card className="slide-up gradient-card border-2 border-primary/20 shadow-lg overflow-hidden relative group hover:border-primary/40 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-primary/10 glow-primary">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Event Log
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <ScrollArea className="h-64 w-full rounded-xl border-2 border-primary/10 bg-background/50 backdrop-blur-sm p-4">
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-8">
              <div className="p-4 rounded-full bg-muted/30 mb-3">
                <FileText className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <p className="text-sm text-muted-foreground">
                No events logged yet
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log, index) => {
                const { time, content } = parseLog(log);
                const eventColor = getEventTypeColor(content);
                return (
                  <div
                    key={index}
                    className="text-sm font-mono p-3 rounded-lg bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-card/80 transition-all duration-200 backdrop-blur-sm"
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex items-center gap-2 min-w-[70px]">
                        <div className={`h-1.5 w-1.5 rounded-full ${
                          eventColor === "text-danger" ? "bg-danger" :
                          eventColor === "text-warning" ? "bg-warning" :
                          eventColor === "text-success" ? "bg-success" :
                          eventColor === "text-info" ? "bg-info" :
                          "bg-muted-foreground"
                        } pulse-glow`} />
                        <span className="text-primary font-semibold text-xs">{time}</span>
                      </div>
                      <span className={`${eventColor} flex-1 break-all`}>
                        {content}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
