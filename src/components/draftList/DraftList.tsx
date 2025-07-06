// components/DraftsList.tsx (Component to display drafts)

import { useInvoiceDrafts } from "@/hooks/use-invoice-draft";
import { formatDistanceToNow } from "date-fns";

export const DraftsList = () => {
  const { drafts, isLoading, loadDraft, deleteDraft } = useInvoiceDrafts();

  if (isLoading) {
    return <div className="p-4">Loading drafts...</div>;
  }

  if (drafts.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">No drafts saved yet</div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Saved Drafts</h3>

      {drafts.map((draft) => (
        <div
          key={draft.draftId}
          className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="font-medium">
                {draft.invoiceNumber || "Untitled Invoice"}
              </h4>
              <p className="text-sm text-gray-600">
                Updated {formatDistanceToNow(new Date(draft.updatedAt))} ago
              </p>
              <p className="text-sm text-gray-500">
                Items: {draft.items.length} | Total: $
                {draft.items
                  .reduce((sum, item) => sum + item.amount, 0)
                  .toFixed(2)}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => loadDraft(draft.draftId)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Load
              </button>
              <button
                onClick={() => deleteDraft(draft.draftId)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
