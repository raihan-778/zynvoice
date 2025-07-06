// hooks/useInvoiceDrafts.ts (Custom hook for easier component usage)
import { useInvoiceStore } from "@/stores/invoiceStore";
import { useEffect } from "react";
import { toast } from "react-hot-toast"; // or your preferred toast library

export const useInvoiceDrafts = () => {
  const { drafts, isLoading, saveAsDraft, loadDrafts, loadDraft, deleteDraft } =
    useInvoiceStore();

  // Load drafts on mount
  useEffect(() => {
    loadDrafts();
  }, [loadDrafts]);

  const handleSaveAsDraft = async (saveToServer = true) => {
    const result = await saveAsDraft(saveToServer);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.error || "Failed to save draft");
    }

    return result;
  };

  const handleLoadDraft = async (draftId: string) => {
    const success = await loadDraft(draftId);

    if (success) {
      toast.success("Draft loaded successfully");
    } else {
      toast.error("Failed to load draft");
    }

    return success;
  };

  const handleDeleteDraft = async (draftId: string) => {
    const success = await deleteDraft(draftId);

    if (success) {
      toast.success("Draft deleted successfully");
      await loadDrafts(); // Refresh drafts list
    } else {
      toast.error("Failed to delete draft");
    }

    return success;
  };

  return {
    drafts,
    isLoading,
    saveAsDraft: handleSaveAsDraft,
    loadDraft: handleLoadDraft,
    deleteDraft: handleDeleteDraft,
    refreshDrafts: loadDrafts,
  };
};
