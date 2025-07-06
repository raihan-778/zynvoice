const handleSaveAsDraft = async () => {
  try {
    setIsLoading(true);

    // Clear any existing validation errors for draft save
    setValidationErrors({});

    // Prepare draft data with current timestamp
    const draftData = {
      ...invoiceData,
      status: "draft",
      isDraft: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      draftId: `draft_${Date.now()}`, // Unique draft ID
      // Optional: Add user identification if available
      // userId: currentUser?.id,
    };

    // Option 1: Save to localStorage (Client-side storage)
    const existingDrafts = JSON.parse(
      localStorage.getItem("invoiceDrafts") || "[]"
    );

    // Check if draft already exists (update existing draft)
    const existingDraftIndex = existingDrafts.findIndex(
      (draft) =>
        draft.draftId === draftData.draftId ||
        (draft.invoiceNumber === draftData.invoiceNumber && draft.invoiceNumber)
    );

    if (existingDraftIndex !== -1) {
      // Update existing draft
      existingDrafts[existingDraftIndex] = draftData;
    } else {
      // Add new draft
      existingDrafts.push(draftData);
    }

    // Save to localStorage
    localStorage.setItem("invoiceDrafts", JSON.stringify(existingDrafts));

    // Option 2: Save to Database (Server-side storage)
    // const response = await fetch('/api/invoices/drafts', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(draftData),
    // });

    // if (!response.ok) {
    //   throw new Error('Failed to save draft');
    // }

    // Show success message
    // You can use a toast notification library or set a success state
    console.log("Draft saved successfully!");

    // Optional: Show success notification
    // toast.success('Invoice saved as draft!');
  } catch (error) {
    console.error("Error saving draft:", error);

    // Show error message
    // toast.error('Failed to save draft. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

// Function to load drafts (useful for draft management)
const loadDrafts = () => {
  try {
    const drafts = JSON.parse(localStorage.getItem("invoiceDrafts") || "[]");
    return drafts;
  } catch (error) {
    console.error("Error loading drafts:", error);
    return [];
  }
};

// Function to delete a specific draft
const deleteDraft = (draftId) => {
  try {
    const existingDrafts = JSON.parse(
      localStorage.getItem("invoiceDrafts") || "[]"
    );
    const updatedDrafts = existingDrafts.filter(
      (draft) => draft.draftId !== draftId
    );
    localStorage.setItem("invoiceDrafts", JSON.stringify(updatedDrafts));
    return true;
  } catch (error) {
    console.error("Error deleting draft:", error);
    return false;
  }
};
