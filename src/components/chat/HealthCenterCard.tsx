import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone } from "lucide-react";
import type { HealthCenter } from "@/lib/types";

type HealthCenterCardProps = {
  center: HealthCenter;
};

export function HealthCenterCard({ center }: HealthCenterCardProps) {
  return (
    <Card className="w-full bg-card/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{center.name}</CardTitle>
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
