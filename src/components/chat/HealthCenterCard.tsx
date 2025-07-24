import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone } from "lucide-react";
import type { HealthCenter } from "@/lib/types";

type HealthCenterCardProps = {
  center: HealthCenter;
};

export function HealthCenterCard({ center }: HealthCenterCardProps) {
  return (
    <Card className="w-full bg-card/50">
      <CardHeader className="pb-2 flex-row items-start justify-between">
        <CardTitle className="text-base font-semibold">{center.name}</CardTitle>
        {center.specialty && <Badge variant="secondary">{center.specialty}</Badge>}
      </CardHeader>
      <CardContent className="text-sm space-y-1 pt-0">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{center.address}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>{center.phone}</span>
        </div>
      </CardContent>
    </Card>
  );
}
