import { Award, MapPin, Shield, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";

import { Card, CardContent } from "@turi/ui/components/card";

interface Statistics {
  totalCheckIns: number;
  totalVerifiedStamps: number;
  totalScorePercentage: number;
  memberSince?: string;
}

interface StatisticsPanelProps {
  statistics: Statistics;
  turiBalance?: string;
  reputationScore?: number;
}

export function StatisticsPanel({ statistics, turiBalance = "0.00", reputationScore = 0 }: StatisticsPanelProps) {
  const t = useTranslations("home.profile.statistics");

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
            {t("destinations")}
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
            {t("reputation")}
          </p>
          <p className="text-4xl font-bold">{reputationScore}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="relative px-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="bg-primary rounded-xl p-3 transition-transform duration-300 group-hover:scale-110">
              <Wallet className="text-background h-6 w-6" />
            </div>
          </div>
          <p className="text-muted-foreground mb-2 text-xs font-medium tracking-widest uppercase">
            {t("turiBalance")}
          </p>
          <p className="font-mono text-4xl font-bold">
            {turiBalance}
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
            {t("memberSince")}
          </p>
          <p className="text-4xl font-bold">{new Date().getFullYear()}</p>
        </CardContent>
      </Card>
    </div>
  );
}
