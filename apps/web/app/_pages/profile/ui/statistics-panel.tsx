import { Award, MapPin, Shield, TrendingUp } from "lucide-react";

import { Card, CardContent } from "@turi/ui/components/card";

interface Statistics {
  totalCheckIns: number;
  totalVerifiedStamps: number;
  totalScorePercentage: number;
  memberSince?: string;
}

interface StatisticsPanelProps {
  statistics: Statistics;
}

export function StatisticsPanel({ statistics }: StatisticsPanelProps) {
  return (
    <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
      <Card>
        <CardContent className="relative px-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="bg-primary rounded-xl p-3 transition-transform duration-300 group-hover:scale-110">
              <MapPin className="text-background h-6 w-6" />
            </div>
          </div>
          <p className="text-muted-foreground mb-2 text-xs font-medium tracking-widest uppercase">
            Destinos
          </p>
          <p className="text-4xl font-bold">{statistics.totalCheckIns}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="relative px-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="bg-primary rounded-xl p-3 transition-transform duration-300 group-hover:scale-110">
              <Shield className="text-background h-6 w-6" />
            </div>
          </div>
          <p className="text-muted-foreground mb-2 text-xs font-medium tracking-widest uppercase">
            Verificados
          </p>
          <p className="text-4xl font-bold">{statistics.totalVerifiedStamps}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="relative px-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="bg-primary rounded-xl p-3 transition-transform duration-300 group-hover:scale-110">
              <TrendingUp className="text-background h-6 w-6" />
            </div>
          </div>
          <p className="text-muted-foreground mb-2 text-xs font-medium tracking-widest uppercase">
            Puntuación
          </p>
          <p className="text-4xl font-bold">
            {statistics.totalScorePercentage}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="relative px-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="bg-primary rounded-xl p-3 transition-transform duration-300 group-hover:scale-110">
              <Award className="text-background h-6 w-6" />
            </div>
          </div>
          <p className="text-muted-foreground mb-2 text-xs font-medium tracking-widest uppercase">
            Miembro desde
          </p>
          <p className="text-4xl font-bold">{new Date().getFullYear()}</p>
        </CardContent>
      </Card>
    </div>
  );
}
