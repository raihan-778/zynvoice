here i have given mu zustend store data and all functionalities which I want to emplement in a invoicecreator component using zustend sotore without changing the ui which created by using react-hook form, which have a previewCompoent when i click on previewInvoice after giving all invoice data it sent me to this preview component which have downloadpdf button theme customization button dulicatebutton etc.now what shuld i show you first what would be my promp structure to get proper output from you?

1. First, show me your Zustand store:
   "Here's my Zustand store with all the invoice data structure and functionalities:"
   [paste your store code]
2. Then, show me your current Invoice Creator component:
   "Here's my current Invoice Creator component using React Hook Form:"
   [paste your component code]
3. Next, show me your Preview component:
   "Here's my Preview component with download PDF, theme customization, duplicate buttons:"
   [paste your preview component code]
4. Finally, specify your requirements:
   "I want to:

- Keep the existing UI exactly the same
- Replace React Hook Form state management with Zustand store
- Maintain all current functionalities
- Ensure smooth data flow between Invoice Creator and Preview components
- [any other specific requirements]"
  What to start with:
  Start with your Zustand store - this will help me understand your data structure and available actions, which is crucial for the integration.
  This approach will allow me to:

Understand your data flow
Preserve your existing UI/UX
Provide targeted integration code
Ensure all functionalities work seamlessly

Which component would you like to share first?RetryClaude does not have the ability to run the code it generates yet.Wbut i am using your free version , if i give you all requird component at a time then you give me the error with limit aleartEditYou're absolutely right! Let's break this down into manageable chunks to work within the free version limits.
Optimal Step-by-Step Approach:
Step 1: Start with Zustand Store Only

Share just your Zustand store code
I'll analyze the data structure and available actions
This gives me the foundation to understand your state management

Step 2: Invoice Creator Component (Core Logic)

Share your main Invoice Creator component
I'll show you how to integrate it with Zustand while keeping your React Hook Form UI intact

Step 3: Preview Component Integration

Share your Preview component
I'll show you how to connect it with the Zustand store for data flow

Step 4: Final Integration & Testing

Any remaining components or specific functionality
Final adjustments and optimization

Let's Start:
Please share your Zustand store code first - this is the most important piece as it contains:

Your data structure
All available actions/methods
State management logic

Once I understand your store structure, I can provide targeted advice for each component integration without overwhelming the response limit.
Just paste your Zustand store code and nothing else for now.
✅ Zustand Integration: Replaced local state with Zustand store state
✅ React Hook Form Preserved: Kept for validation while syncing with Zustand
✅ Bidirectional Sync: Form changes update Zustand, Zustand updates form
✅ Handler Functions: Created specific handlers for all form interactions
✅ Same UI: Preserved exact same UI structure and classes

Important Notes:

Form Validation: Still using React Hook Form for validation, but state comes from Zustand
Automatic Calculations: Your calculateTotals() function will be called automatically
Real-time Updates: Any changes to the form will update the Zustand store immediately

Next Steps:

First: Test this integration with your existing UI
Then: I'll show you the remaining form sections (Invoice Details, Items, etc.)
Finally: We'll integrate the Preview component

Would you like me to:

Show you the complete form with all sections integrated?
Focus on a specific section that needs special attention?
Move to the Preview component integration?

Let me know what you'd like to see next!

✅ Zustand Integration: Replaced local state with Zustand store state
✅ React Hook Form Preserved: Kept for validation while syncing with Zustand
✅ Bidirectional Sync: Form changes update Zustand, Zustand updates form
✅ Handler Functions: Created specific handlers for all form interactions
✅ Same UI: Preserved exact same UI structure and classes

Important Notes:

Form Validation: Still using React Hook Form for validation, but state comes from Zustand
Automatic Calculations: Your calculateTotals() function will be called automatically
Real-time Updates: Any changes to the form will update the Zustand store immediately

Next Steps:

First: Test this integration with your existing UI
Then: I'll show you the remaining form sections (Invoice Details, Items, etc.)
Finally: We'll integrate the Preview component

Would you like me to:

Show you the complete form with all sections integrated?
Focus on a specific section that needs special attention?
Move to the Preview component integration?

Let me know what you'd like to see next!
import { Calendar, RefreshCw, FileText, Plus, Trash2 } from 'lucide-react';

// Invoice Details Section
const InvoiceDetailsSection = () => {
const {
formData,
currencies,
generateInvoiceNumber,
setInvoiceData,
selectedCurrency,
error,
validationErrors
} = useInvoiceFormStore();
