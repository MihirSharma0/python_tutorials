import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import type { CreateDonationRequest, UpdateDonationStatusRequest } from "@shared/schema";

export function useDonations() {
  return useQuery({
    queryKey: [api.donations.list.path],
    queryFn: async () => {
      const res = await fetch(api.donations.list.path);
      if (!res.ok) throw new Error("Failed to fetch donations");
      return api.donations.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateDonation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateDonationRequest) => {
      // Validate with shared schema input
      const validated = api.donations.create.input.parse(data);
      
      const res = await fetch(api.donations.create.path, {
        method: api.donations.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create donation");
      }
      return api.donations.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.donations.list.path] });
      toast({
        title: "Donation Posted!",
        description: "Your surplus food is now visible to nearby NGOs.",
        className: "bg-emerald-50 border-emerald-200 text-emerald-800",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateDonationStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateDonationStatusRequest & { id: number }) => {
      const validated = api.donations.updateStatus.input.parse(data);
      const url = buildUrl(api.donations.updateStatus.path, { id });

      const res = await fetch(url, {
        method: api.donations.updateStatus.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) throw new Error("Failed to update status");
      return api.donations.updateStatus.responses[200].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.donations.list.path] });
      
      let message = "Status updated";
      if (variables.status === 'requested') message = "Pickup requested successfully!";
      if (variables.status === 'collected') message = "Donation marked as collected.";

      toast({
        title: "Success",
        description: message,
        className: "bg-emerald-50 border-emerald-200 text-emerald-800",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
