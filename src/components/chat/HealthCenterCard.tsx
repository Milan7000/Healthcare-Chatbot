import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone } from "lucide-react";
import type { HealthCenter } from "@/lib/types";

type HealthCenterCardProps = {
  center: HealthCenter;
};

export function HealthCenterCard({ center }: HealthCenterCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base">{center.name}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{center.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>{center.phone}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">Get Directions</Button>
      </CardFooter>
    </Card>
  );
}
