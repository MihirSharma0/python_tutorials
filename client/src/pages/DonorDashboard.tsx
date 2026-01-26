import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Plus, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { api } from "@shared/routes";

import { useAuth } from "@/hooks/use-auth";
import { useDonations, useCreateDonation } from "@/hooks/use-donations";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DonationCard } from "@/components/DonationCard";

// Schema for the form
const formSchema = api.donations.create.input.omit({ donorId: true });
type FormValues = z.infer<typeof formSchema>;

export default function DonorDashboard() {
  const { user } = useAuth();
  const { data: donations, isLoading } = useDonations();
  const createMutation = useCreateDonation();
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      foodType: "",
      quantity: "",
      location: "",
      notes: "",
      // Default expiry to 24 hours from now
      expiryTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    },
  });

  const onSubmit = (data: FormValues) => {
    if (!user) return;
    
    // Convert datetime-local string to Date object
    const payload = {
      ...data,
      donorId: user.id,
      expiryTime: new Date(data.expiryTime),
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const myDonations = donations?.filter(d => d.donorId === user?.id) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground mt-1">Manage your active listings and track collections.</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="rounded-xl shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
              <Plus className="w-5 h-5 mr-2" /> Post Donation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Share Food</DialogTitle>
              <DialogDescription>
                Details provided help NGOs respond quickly.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="foodType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Food Item(s)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 20 Boxed Meals, Fresh Produce" className="rounded-xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 5kg, 30 boxes" className="rounded-xl" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="expiryTime"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Expires By</FormLabel>
                        <FormControl>
                          <Input 
                            type="datetime-local" 
                            className="rounded-xl" 
                            value={value instanceof Date ? value.toISOString().slice(0, 16) : value}
                            onChange={e => onChange(e.target.value)}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pickup Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Address or specific entrance" className="rounded-xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Vegetarian? Contains nuts? Special pickup instructions?" 
                          className="rounded-xl resize-none" 
                          {...field} 
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full rounded-xl h-12 text-lg font-semibold bg-primary hover:bg-primary/90 mt-2"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Posting...
                    </>
                  ) : (
                    "Post Donation"
                  )}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {myDonations.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-border">
          <div className="bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-primary/50" />
          </div>
          <h3 className="text-xl font-medium text-foreground">No donations yet</h3>
          <p className="text-muted-foreground mt-2">Your active and past donations will appear here.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myDonations.map((donation) => (
            <motion.div 
              key={donation.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <DonationCard donation={donation} userRole="donor" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
