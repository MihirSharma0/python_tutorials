import { formatDistanceToNow, isPast } from "date-fns";
import { MapPin, Clock, Truck, CheckCircle, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Donation } from "@shared/schema";

interface DonationCardProps {
  donation: Donation;
  userRole?: "donor" | "ngo";
  onAction?: (id: number) => void;
  isActionPending?: boolean;
}

export function DonationCard({ donation, userRole, onAction, isActionPending }: DonationCardProps) {
  const isExpired = isPast(new Date(donation.expiryTime));
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "requested": return "bg-amber-100 text-amber-800 border-amber-200";
      case "collected": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-border/60 p-6 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        <Badge variant="outline" className={`${getStatusColor(donation.status)} capitalize px-3 py-1 text-xs font-semibold tracking-wide`}>
          {donation.status}
        </Badge>
      </div>

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-orange-50 text-orange-600">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground font-display leading-tight">{donation.foodType}</h3>
            <p className="text-sm text-muted-foreground font-medium">{donation.quantity}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 text-primary/60" />
          <span>{donation.location}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className={`w-4 h-4 ${isExpired ? "text-destructive" : "text-primary/60"}`} />
          <span className={isExpired ? "text-destructive font-medium" : ""}>
            Expires {formatDistanceToNow(new Date(donation.expiryTime), { addSuffix: true })}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-border/50">
        {userRole === "ngo" && donation.status === "available" && !isExpired && (
          <Button 
            className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
            onClick={() => onAction?.(donation.id)}
            disabled={isActionPending}
          >
            {isActionPending ? "Requesting..." : (
              <>
                <Truck className="w-4 h-4 mr-2" /> Request Pickup
              </>
            )}
          </Button>
        )}

        {userRole === "ngo" && donation.status === "requested" && (
          <Button 
            variant="outline"
            className="w-full border-primary/20 text-primary hover:bg-primary/5"
            onClick={() => onAction?.(donation.id)}
            disabled={isActionPending}
          >
             {isActionPending ? "Updating..." : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" /> Mark Collected
              </>
            )}
          </Button>
        )}

        {userRole === "donor" && (
          <p className="text-xs text-center text-muted-foreground italic">
            {donation.status === "available" ? "Waiting for NGO request" : 
             donation.status === "requested" ? "Pickup requested by NGO" : 
             "Collection complete"}
          </p>
        )}
      </div>
    </div>
  );
}
