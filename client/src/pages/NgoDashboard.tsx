import { useState } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useDonations, useUpdateDonationStatus } from "@/hooks/use-donations";
import { DonationCard } from "@/components/DonationCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function NgoDashboard() {
  const { user } = useAuth();
  const { data: donations, isLoading } = useDonations();
  const updateStatus = useUpdateDonationStatus();
  
  // Track which card is loading action
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleAction = (id: number, action: 'request' | 'collect') => {
    setLoadingId(id);
    const status = action === 'request' ? 'requested' : 'collected';
    
    updateStatus.mutate(
      { id, status, ngoId: user?.id },
      { onSettled: () => setLoadingId(null) }
    );
  };

  if (isLoading) {
     return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Filter lists
  const availableDonations = donations?.filter(d => d.status === "available") || [];
  const myRequests = donations?.filter(d => d.ngoId === user?.id && d.status !== "available") || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
       <div className="mb-12">
          <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Find food for your community or track active pickups.</p>
       </div>

       <Tabs defaultValue="feed" className="w-full">
         <TabsList className="mb-8 p-1 bg-emerald-50/50 rounded-xl">
           <TabsTrigger value="feed" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm px-6">Live Feed</TabsTrigger>
           <TabsTrigger value="my-requests" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm px-6">My Requests</TabsTrigger>
         </TabsList>

         <TabsContent value="feed">
           {availableDonations.length === 0 ? (
             <div className="text-center py-20">
               <p className="text-muted-foreground">No available donations nearby at the moment.</p>
             </div>
           ) : (
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               {availableDonations.map(donation => (
                 <motion.div 
                   key={donation.id}
                   layout
                   initial={{ opacity: 0 }} 
                   animate={{ opacity: 1 }}
                 >
                   <DonationCard 
                     donation={donation} 
                     userRole="ngo"
                     onAction={(id) => handleAction(id, 'request')}
                     isActionPending={loadingId === donation.id}
                   />
                 </motion.div>
               ))}
             </div>
           )}
         </TabsContent>

         <TabsContent value="my-requests">
            {myRequests.length === 0 ? (
             <div className="text-center py-20">
               <p className="text-muted-foreground">You haven't requested any pickups yet.</p>
             </div>
           ) : (
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               {myRequests.map(donation => (
                 <motion.div 
                   key={donation.id}
                   layout
                   initial={{ opacity: 0 }} 
                   animate={{ opacity: 1 }}
                 >
                   <DonationCard 
                     donation={donation} 
                     userRole="ngo"
                     onAction={(id) => handleAction(id, 'collect')}
                     isActionPending={loadingId === donation.id}
                   />
                 </motion.div>
               ))}
             </div>
           )}
         </TabsContent>
       </Tabs>
    </div>
  );
}
