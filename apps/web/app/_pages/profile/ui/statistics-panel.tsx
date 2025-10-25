import { Award, MapPin, Shield, TrendingUp } from "lucide-react";

import { Badge } from "@turi/ui/components/badge";
import { Card, CardContent } from "@turi/ui/components/card";

interface Statistics {
  totalDestinations: number;
  verifiedStamps: number;
  verificationScore: number;
  memberSince: string;
}

interface StatisticsPanelProps {
  statistics: Statistics;
}

export function StatisticsPanel({ statistics }: StatisticsPanelProps) {
  return (
    <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
      <Card className="group border-border/50 from-card via-card to-primary/5 relative overflow-hidden border bg-gradient-to-br transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <div className="from-accent/5 absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        <CardContent className="relative p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="from-primary/20 to-primary/5 rounded-xl bg-gradient-to-br p-3 transition-transform duration-300 group-hover:scale-110">
              <MapPin className="text-primary h-6 w-6" />
            </div>
          </div>
          <p className="text-muted-foreground mb-2 text-xs font-medium tracking-widest uppercase">
            Destinos
          </p>
          <p className="from-primary to-accent bg-gradient-to-br bg-clip-text text-4xl font-bold text-transparent">
            {statistics.totalDestinations}
          </p>
        </CardContent>
      </Card>

      <Card className="group border-border/50 from-card via-card to-accent/5 relative overflow-hidden border bg-gradient-to-br transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <div className="from-accent/5 absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        <CardContent className="relative p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="from-accent/20 to-accent/5 rounded-xl bg-gradient-to-br p-3 transition-transform duration-300 group-hover:scale-110">
              <Shield className="text-primary h-6 w-6" />
            </div>
            <Badge className="bg-accent/10 text-accent-foreground border-accent/30 hover:bg-accent/20">
              ✓
            </Badge>
          </div>
          <p className="text-muted-foreground mb-2 text-xs font-medium tracking-widest uppercase">
            Verificados
          </p>
          <p className="from-primary to-accent bg-gradient-to-br bg-clip-text text-4xl font-bold text-transparent">
            {statistics.verifiedStamps}
          </p>
        </CardContent>
      </Card>

      <Card className="group border-border/50 from-card via-card to-primary/5 relative overflow-hidden border bg-gradient-to-br transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <div className="from-accent/5 absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        <CardContent className="relative p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="from-primary/20 to-primary/5 rounded-xl bg-gradient-to-br p-3 transition-transform duration-300 group-hover:scale-110">
              <TrendingUp className="text-primary h-6 w-6" />
            </div>
          </div>
          <p className="text-muted-foreground mb-2 text-xs font-medium tracking-widest uppercase">
            Puntuación
          </p>
          <p className="from-primary to-accent bg-gradient-to-br bg-clip-text text-4xl font-bold text-transparent">
            {statistics.verificationScore}%
          </p>
        </CardContent>
      </Card>

      <Card className="group border-border/50 from-card via-card to-accent/5 relative overflow-hidden border bg-gradient-to-br transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <div className="from-accent/5 absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        <CardContent className="relative p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="from-accent/20 to-accent/5 rounded-xl bg-gradient-to-br p-3 transition-transform duration-300 group-hover:scale-110">
              <Award className="text-primary h-6 w-6" />
            </div>
          </div>
          <p className="text-muted-foreground mb-2 text-xs font-medium tracking-widest uppercase">
            Miembro Desde
          </p>
          <p className="from-primary to-accent bg-gradient-to-br bg-clip-text text-4xl font-bold text-transparent">
            {statistics.memberSince}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
