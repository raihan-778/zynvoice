Invoice Generator App - Smart Prompting System
🎯 How to Use This System
For Each Section Request:
SECTION [NUMBER]: [SECTION NAME]
Context: [Brief description of what you've already built]
Need: [Specific component/feature you want]
Status: [NEW/CONTINUE/DEBUG/INTEGRATE]

📋 Section Quick Reference
✅ COMPLETED SECTIONS
[ ] Section 1: Project Setup & Foundation
[ ] Section 2: Database Schema & Models
[ ] Section 3: Authentication & Security
[ ] Section 4: Core UI Components
[ ] Section 5: Invoice Form Builder
[ ] Section 6: Invoice Preview & Templates
[ ] Section 7: PDF Generation & Export
[ ] Section 8: Email Integration
[ ] Section 9: Dashboard & Analytics
[ ] Section 10: Client Management
[ ] Section 11: Advanced Features
[ ] Section 12: Production Optimization

🔄 Memory Tricks for New Chats

1. Context Snapshot Prompt
   CONTEXT: I'm building an invoice generator app using Next.js 15 + TypeScript + MongoDB.

COMPLETED:

- [List what you've finished]
- [Key components built]
- [Current file structure]

CURRENT ISSUE:

- [Specific problem/feature you're working on]
- [Error message if any]

NEED: [Exactly what you want next]

2. Component Status Tracker
   Keep this updated after each section:
   COMPONENTS BUILT:
   ✅ Layout (Header, Sidebar, Footer)
   ✅ Auth (Login, Register, Middleware)
   ✅ Database (User, Invoice, Client models)
   ⏳ Invoice Form (In Progress)
   ❌ PDF Export (Not Started)

3. File Structure Snapshot
   PROJECT STRUCTURE:
   /app
   /api
   /auth - [STATUS: Complete]
   /invoices - [STATUS: Partial]
   /dashboard - [STATUS: Complete]
   /components
   /ui - [STATUS: Complete]
   /forms - [STATUS: In Progress]

🎯 Optimized Prompts for Each Section
Section 1: Project Setup
SECTION 1: Project Setup & Foundation
Status: NEW
Need: Complete Next.js 15 setup with TypeScript, TailwindCSS, shadcn/ui
Include: Folder structure, package.json, basic layout components
Skip: Don't include auth or database yet

Section 2: Database Schema
SECTION 2: Database Schema & Models
Context: Basic Next.js app setup completed
Need: MongoDB models for User, Invoice, Client, Company
Include: Mongoose schemas, validation, TypeScript interfaces
Skip: Don't include API routes yet

Section 3: Authentication
SECTION 3: Authentication System
Context: Database models ready
Need: NextAuth.js setup with email/password + Google
Include: Middleware, protected routes, login/register pages
Skip: Don't include dashboard yet

Section 4: UI Components
SECTION 4: Core UI Components
Context: Auth system working
Need: Reusable components using shadcn/ui
Include: Form inputs, buttons, modals, loading states
Skip: Don't include invoice-specific components yet

Section 5: Invoice Form
SECTION 5: Invoice Form Builder
Context: UI components ready
Need: Dynamic invoice creation form
Include: Company info, client selector, line items, calculations
Skip: Don't include PDF generation yet

Section 6: Invoice Preview
SECTION 6: Invoice Preview & Templates
Context: Invoice form working
Need: Live preview with multiple templates
Include: Template switching, customization options
Skip: Don't include PDF export yet

Section 7: PDF Export
SECTION 7: PDF Generation
Context: With home I will intigrate Invoice preview to see live preview i am confused
Need: PDF generation and export functionality
Include: @react-pdf/renderer usage flow or any other best stack used in industries, export API
Skip: Don't include email sending yet

Section 8: Email Integration
SECTION 8: Email System
Context: PDF export working
Need: Email invoice sending functionality
Include: Nodemailer/SendGrid setup, email templates
Skip: Don't include dashboard analytics yet

Section 9: Dashboard
SECTION 9: Dashboard & Analytics
Context: Email system working
Need: Invoice dashboard with stats and charts
Include: Overview page, charts, recent invoices
Skip: Don't include client management yet

Section 10: Client Management
SECTION 10: Client Management
Context: Dashboard ready
Need: Client CRUD operations and management
Include: Client list, add/edit forms, search/filter
Skip: Don't include advanced features yet

🚨 When Code Gets Cut Off
Continue Prompt:
CONTINUE: The code got cut off at [mention the last line you saw]
Context: We were building [component name] for [section name]
Need: Continue from where you stopped + complete the component

Debug Prompt:
DEBUG: Having issues with [specific error]
Context: Working on [component name] from Section [X]
Code: [paste the problematic code snippet]
Need: Fix + explanation

📁 File Tracking System
Keep This Updated:
CURRENT FILES:
✅ app/layout.tsx - [Complete]
✅ app/page.tsx - [Complete]  
✅ lib/auth.ts - [Complete]
⏳ components/InvoiceForm.tsx - [In Progress - line 45]
❌ components/PDFExport.tsx - [Not Started]

NEXT TO BUILD:

- Complete InvoiceForm validation
- Add PDF export functionality

💡 Pro Tips

1. One Component Per Chat
   Instead of asking for entire sections, ask for single components:
   COMPONENT: InvoiceForm
   Context: Building Section 5 - have UI components ready
   Need: Just the invoice form component with validation

2. Specific Integration Requests
   INTEGRATE: Connect InvoiceForm to database
   Context: Have working form + database models
   Need: API route + form submission handling

3. Incremental Building
   ENHANCE: Add real-time preview to InvoiceForm
   Context: Basic form working, need live preview
   Current: [describe current state]
   Add: [specific feature]

🎯 Perfect Prompt Template
SECTION [X]: [Name]
CONTEXT: [What's already built]
CURRENT STATUS: [Specific files/components ready]
SPECIFIC NEED: [Exactly what you want - be very specific]
CONSTRAINTS: [Any limitations or preferences]
INTEGRATION: [What this needs to connect to]

Example:
SECTION 5: Invoice Form Builder
CONTEXT: UI components library completed, auth working
CURRENT STATUS: Have Button, Input, Select components ready
SPECIFIC NEED: Invoice form with company info, client selector, line items
CONSTRAINTS: Use existing UI components, TypeScript strict mode
INTEGRATION: Connect to Client and Invoice models from Section 2

This approach will help you get exactly what you need without repetition!

Invoice Generator App - Smart Prompting System
🎯 How to Use This System
For Each Section Request:
SECTION [NUMBER]: [SECTION NAME]
Context: [Brief description of what you've already built]
Need: [Specific component/feature you want]
Status: [NEW/CONTINUE/DEBUG/INTEGRATE]

📋 Section Quick Reference
✅ COMPLETED SECTIONS
[ ] Section 1: Project Setup & Foundation
[ ] Section 2: Database Schema & Models
[ ] Section 3: Authentication & Security
[ ] Section 4: Core UI Components
[ ] Section 5: Invoice Form Builder
[ ] Section 6: Invoice Preview & Templates
[ ] Section 7: PDF Generation & Export
[ ] Section 8: Email Integration
[ ] Section 9: Dashboard & Analytics
[ ] Section 10: Client Management
[ ] Section 11: Advanced Features
[ ] Section 12: Production Optimization

🔄 Memory Tricks for New Chats

1. Context Snapshot Prompt
   CONTEXT: I'm building an invoice generator app using Next.js 15 + TypeScript + MongoDB.

COMPLETED:

- [List what you've finished]
- [Key components built]
- [Current file structure]

CURRENT ISSUE:

- [Specific problem/feature you're working on]
- [Error message if any]

NEED: [Exactly what you want next]

2. Component Status Tracker
   Keep this updated after each section:
   COMPONENTS BUILT:
   ✅ Layout (Header, Sidebar, Footer)
   ✅ Auth (Login, Register, Middleware)
   ✅ Database (User, Invoice, Client models)
   ⏳ Invoice Form (In Progress)
   ❌ PDF Export (Not Started)

3. File Structure Snapshot
   PROJECT STRUCTURE:
   /app
   /api
   /auth - [STATUS: Complete]
   /invoices - [STATUS: Partial]
   /dashboard - [STATUS: Complete]
   /components
   /ui - [STATUS: Complete]
   /forms - [STATUS: In Progress]

🎯 Optimized Prompts for Each Section
Section 1: Project Setup
SECTION 1: Project Setup & Foundation
Status: NEW
Need: Complete Next.js 15 setup with TypeScript, TailwindCSS, shadcn/ui
Include: Folder structure, package.json, basic layout components
Skip: Don't include auth or database yet

Section 2: Database Schema
SECTION 2: Database Schema & Models
Context: Basic Next.js app setup completed
Need: MongoDB models for User, Invoice, Client, Company
Include: Mongoose schemas, validation, TypeScript interfaces
Skip: Don't include API routes yet

Section 3: Authentication
SECTION 3: Authentication System
Context: Database models ready
Need: NextAuth.js setup with email/password + Google
Include: Middleware, protected routes, login/register pages
Skip: Don't include dashboard yet

Section 4: UI Components
SECTION 4: Core UI Components
Context: Auth system working
Need: Reusable components using shadcn/ui
Include: Form inputs, buttons, modals, loading states
Skip: Don't include invoice-specific components yet

Section 5: Invoice Form
SECTION 5: Invoice Form Builder
Context: UI components ready
Need: Dynamic invoice creation form
Include: Company info, client selector, line items, calculations
Skip: Don't include PDF generation yet

Section 6: Invoice Preview
SECTION 6: Invoice Preview & Templates
Context: Invoice form working
Need: Live preview with multiple templates
Include: Template switching, customization options
Skip: Don't include PDF export yet

Section 7: PDF Export
SECTION 7: PDF Generation
Context: Invoice preview working
Need: PDF generation and export functionality
Include: @react-pdf/renderer setup, export API
Skip: Don't include email sending yet

Section 8: Email Integration
SECTION 8: Email System
Context: PDF export working
Need: Email invoice sending functionality
Include: Nodemailer/SendGrid setup, email templates
Skip: Don't include dashboard analytics yet

Section 9: Dashboard
SECTION 9: Dashboard & Analytics
Context: Email system working
Need: Invoice dashboard with stats and charts
Include: Overview page, charts, recent invoices
Skip: Don't include client management yet

Section 10: Client Management
SECTION 10: Client Management
Context: Dashboard ready
Need: Client CRUD operations and management
Include: Client list, add/edit forms, search/filter
Skip: Don't include advanced features yet

🚨 When Code Gets Cut Off
Continue Prompt:
CONTINUE: The code got cut off at [mention the last line you saw]
Context: We were building [component name] for [section name]
Need: Continue from where you stopped + complete the component

Debug Prompt:
DEBUG: Having issues with [specific error]
Context: Working on [component name] from Section [X]
Code: [paste the problematic code snippet]
Need: Fix + explanation

📁 File Tracking System
Keep This Updated:
CURRENT FILES:
✅ app/layout.tsx - [Complete]
✅ app/page.tsx - [Complete]  
✅ lib/auth.ts - [Complete]
⏳ components/InvoiceForm.tsx - [In Progress - line 45]
❌ components/PDFExport.tsx - [Not Started]

NEXT TO BUILD:

- Complete InvoiceForm validation
- Add PDF export functionality

💡 Pro Tips

1. One Component Per Chat
   Instead of asking for entire sections, ask for single components:
   COMPONENT: InvoiceForm
   Context: Building Section 5 - have UI components ready
   Need: Just the invoice form component with validation

2. Specific Integration Requests
   INTEGRATE: Connect InvoiceForm to database
   Context: Have working form + database models
   Need: API route + form submission handling

3. Incremental Building
   ENHANCE: Add real-time preview to InvoiceForm
   Context: Basic form working, need live preview
   Current: [describe current state]
   Add: [specific feature]

🎯 Perfect Prompt Template
SECTION [X]: [Name]
CONTEXT: [What's already built]
CURRENT STATUS: [Specific files/components ready]
SPECIFIC NEED: [Exactly what you want - be very specific]
CONSTRAINTS: [Any limitations or preferences]
INTEGRATION: [What this needs to connect to]

Example:
SECTION 5: Invoice Form Builder
CONTEXT: UI components library completed, auth working
CURRENT STATUS: Have Button, Input, Select components ready
SPECIFIC NEED: Invoice form with company info, client selector, line items
CONSTRAINTS: Use existing UI components, TypeScript strict mode
INTEGRATION: Connect to Client and Invoice models from Section 2

This approach will help you get exactly what you need without repetition!
Now following this instruction lets start and can you tell an alert before end your free limit when give me the code?
