Complete Component-to-Component Connection Guide
🏗️ Application Architecture Overview
Homepage (Entry Point)
↓
┌─────────────────────────────────────────────────────────┐
│ Authentication Layer │
│ ↓ │
│ Dashboard ←→ InvoiceForm ←→ InvoicePreview ←→ ClientMgmt │
│ ↓ ↓ ↓ ↓ │
│ Analytics DatabaseOps PDFExport EmailSender │
└─────────────────────────────────────────────────────────┘
📦 Core Component Structure

1. Global State Management (Context Layer)
   typescript// contexts/AppContext.tsx
   interface AppState {
   user: User | null;
   currentInvoice: Invoice | null;
   clients: Client[];
   companies: Company[];
   invoices: Invoice[];
   isLoading: boolean;
   }

interface AppActions {
setUser: (user: User) => void;
setCurrentInvoice: (invoice: Invoice) => void;
addClient: (client: Client) => void;
updateInvoice: (id: string, data: Partial<Invoice>) => void;
deleteInvoice: (id: string) => void;
}

const AppContext = createContext<{
state: AppState;
actions: AppActions;
}>()

// Usage in components:
const { state, actions } = useContext(AppContext); 2. Component Connection Map
🎯 Section 1: Homepage → All Components
typescript// components/Homepage.tsx
interface HomepageProps {
onNavigateToInvoice: () => void;
onNavigateToDashboard: () => void;
userStats?: DashboardStats;
}

const Homepage = ({ onNavigateToInvoice, onNavigateToDashboard, userStats }) => {
const { state } = useContext(AppContext);

return (
<div>
{/_ Hero Section _/}
<section className="hero">
<h1>Professional Invoice Generator</h1>

        {!state.user ? (
          <div className="cta-buttons">
            <Button onClick={() => router.push('/auth/login')}>
              Get Started
            </Button>
          </div>
        ) : (
          <div className="user-actions">
            <Button onClick={onNavigateToInvoice} className="primary">
              Create New Invoice
            </Button>
            <Button onClick={onNavigateToDashboard} variant="outline">
              View Dashboard
            </Button>
          </div>
        )}
      </section>

      {/* Quick Stats for Logged Users */}
      {state.user && userStats && (
        <QuickStatsSection stats={userStats} />
      )}
    </div>

);
};

// Connection Data Flow:
// Homepage → AuthCheck → Dashboard/InvoiceForm
// Data: User state, Quick stats from Dashboard
🔐 Section 3: Authentication → All Protected Components
typescript// components/auth/AuthGuard.tsx
interface AuthGuardProps {
children: React.ReactNode;
fallback?: React.ReactNode;
redirectTo?: string;
}

const AuthGuard = ({ children, fallback, redirectTo = '/auth/login' }) => {
const { state } = useContext(AppContext);
const router = useRouter();

useEffect(() => {
if (!state.user && !state.isLoading) {
router.push(redirectTo);
}
}, [state.user, state.isLoading]);

if (state.isLoading) return <LoadingSpinner />;
if (!state.user) return fallback || <LoginPrompt />;

return <>{children}</>;
};

// Usage in protected routes:
const ProtectedInvoiceForm = () => (
<AuthGuard>
<InvoiceForm />
</AuthGuard>
);

// Connection Data Flow:
// AuthGuard → Wraps all protected components
// Data: User session, Auth state
📝 Section 5: Invoice Form → Multiple Components
typescript// components/invoice/InvoiceForm.tsx
interface InvoiceFormProps {
initialData?: Partial<Invoice>;
clientId?: string;
onSave: (invoice: Invoice) => Promise<void>;
onPreview: (invoice: Invoice) => void;
onCancel: () => void;
}

const InvoiceForm = ({
initialData,
clientId,
onSave,
onPreview,
onCancel
}) => {
const { state, actions } = useContext(AppContext);
const [formData, setFormData] = useState<InvoiceFormData>(initialData || {});
const [currentStep, setCurrentStep] = useState(1);
const [previewMode, setPreviewMode] = useState(false);

// Step Components
const steps = [
{
id: 1,
component: CompanyInfoStep,
props: {
data: formData.company,
onChange: (data) => setFormData(prev => ({ ...prev, company: data }))
}
},
{
id: 2,
component: ClientSelectionStep,
props: {
clients: state.clients,
selectedClient: formData.client,
preselectedId: clientId,
onChange: (client) => setFormData(prev => ({ ...prev, client })),
onAddClient: (client) => actions.addClient(client)
}
},
{
id: 3,
component: InvoiceItemsStep,
props: {
items: formData.items,
onChange: (items) => setFormData(prev => ({ ...prev, items }))
}
},
{
id: 4,
component: InvoicePreviewStep,
props: {
invoiceData: formData,
onEdit: () => setCurrentStep(3),
onSave: handleSave,
onPDFExport: handlePDFExport,
onEmailSend: handleEmailSend
}
}
];

const handleSave = async () => {
try {
const invoice = await onSave(formData);
actions.setCurrentInvoice(invoice);
router.push(`/invoice/success?id=${invoice.id}`);
} catch (error) {
// Error handling
}
};

const handlePreview = () => {
onPreview(formData);
setPreviewMode(true);
};

return (
<div className="invoice-form">
<StepIndicator steps={steps} currentStep={currentStep} />

      {steps.map(step => (
        currentStep === step.id && (
          <step.component
            key={step.id}
            {...step.props}
            onNext={() => setCurrentStep(currentStep + 1)}
            onPrev={() => setCurrentStep(currentStep - 1)}
          />
        )
      ))}

      {previewMode && (
        <InvoicePreviewModal
          invoiceData={formData}
          onClose={() => setPreviewMode(false)}
          onSave={handleSave}
        />
      )}
    </div>

);
};

// Connection Data Flow:
// InvoiceForm → CompanyInfo + ClientSelection + ItemsEntry → InvoicePreview
// Data: Form data flows through steps, Client data from global state
👁️ Section 6: Invoice Preview → Export & Email Components
typescript// components/invoice/InvoicePreview.tsx
interface InvoicePreviewProps {
invoiceData: Invoice;
mode: 'modal' | 'page';
onEdit?: () => void;
onSave?: () => Promise<void>;
onPDFExport?: (invoice: Invoice) => Promise<void>;
onEmailSend?: (invoice: Invoice, emailData: EmailData) => Promise<void>;
onClose?: () => void;
}

const InvoicePreview = ({
invoiceData,
mode,
onEdit,
onSave,
onPDFExport,
onEmailSend,
onClose
}) => {
const [showEmailModal, setShowEmailModal] = useState(false);
const [isExporting, setIsExporting] = useState(false);

const handlePDFExport = async () => {
setIsExporting(true);
try {
await onPDFExport?.(invoiceData);
} finally {
setIsExporting(false);
}
};

const handleEmailSend = async (emailData: EmailData) => {
try {
await onEmailSend?.(invoiceData, emailData);
setShowEmailModal(false);
} catch (error) {
// Error handling
}
};

return (
<div className={`invoice-preview ${mode === 'modal' ? 'modal' : 'page'}`}>
{/_ Preview Header _/}
<div className="preview-header">
<h2>Invoice Preview</h2>
<div className="actions">
{onEdit && (
<Button onClick={onEdit} variant="outline">
Edit Invoice
</Button>
)}
{onSave && (
<Button onClick={onSave} className="primary">
Save Invoice
</Button>
)}
</div>
</div>

      {/* Invoice Display */}
      <InvoiceTemplate
        data={invoiceData}
        template={invoiceData.template || 'modern'}
      />

      {/* Action Buttons */}
      <div className="preview-actions">
        <Button
          onClick={handlePDFExport}
          disabled={isExporting}
          className="export-btn"
        >
          {isExporting ? <Spinner /> : <Download />}
          Export PDF
        </Button>

        <Button
          onClick={() => setShowEmailModal(true)}
          className="email-btn"
        >
          <Mail />
          Send via Email
        </Button>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <EmailInvoiceModal
          invoice={invoiceData}
          onSend={handleEmailSend}
          onClose={() => setShowEmailModal(false)}
        />
      )}

      {mode === 'modal' && onClose && (
        <Button onClick={onClose} className="close-btn">
          Close
        </Button>
      )}
    </div>

);
};

// Connection Data Flow:
// InvoicePreview → PDFExporter + EmailSender
// Data: Invoice data, Export preferences, Email data
📊 Section 9: Dashboard → All Management Components
typescript// components/dashboard/Dashboard.tsx
interface DashboardProps {
onCreateInvoice: () => void;
onManageClients: () => void;
onViewInvoice: (id: string) => void;
}

const Dashboard = ({ onCreateInvoice, onManageClients, onViewInvoice }) => {
const { state } = useContext(AppContext);
const [stats, setStats] = useState<DashboardStats>();
const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
const [chartData, setChartData] = useState<ChartData>();

useEffect(() => {
loadDashboardData();
}, []);

const loadDashboardData = async () => {
try {
const [statsRes, invoicesRes, chartRes] = await Promise.all([
fetch('/api/dashboard/stats'),
fetch('/api/invoices?recent=true&limit=10'),
fetch('/api/dashboard/analytics')
]);

      setStats(await statsRes.json());
      setRecentInvoices(await invoicesRes.json());
      setChartData(await chartRes.json());
    } catch (error) {
      // Error handling
    }

};

return (
<div className="dashboard">
{/_ Quick Stats _/}
<section className="stats-section">
<StatsGrid stats={stats} />
</section>

      {/* Quick Actions */}
      <section className="actions-section">
        <div className="quick-actions">
          <ActionCard
            title="Create Invoice"
            description="Generate a new invoice"
            icon={<Plus />}
            onClick={onCreateInvoice}
          />
          <ActionCard
            title="Manage Clients"
            description="Add or edit client information"
            icon={<Users />}
            onClick={onManageClients}
          />
        </div>
      </section>

      {/* Analytics Charts */}
      <section className="analytics-section">
        <div className="charts-grid">
          <RevenueChart data={chartData?.revenue} />
          <InvoiceStatusChart data={chartData?.statuses} />
          <ClientActivityChart data={chartData?.clients} />
        </div>
      </section>

      {/* Recent Invoices */}
      <section className="recent-section">
        <h3>Recent Invoices</h3>
        <InvoiceTable
          invoices={recentInvoices}
          onView={onViewInvoice}
          onEdit={(id) => router.push(`/invoice/edit/${id}`)}
          onPDF={(id) => handlePDFExport(id)}
          onEmail={(id) => handleEmailInvoice(id)}
          onDelete={(id) => handleDeleteInvoice(id)}
        />
      </section>
    </div>

);
};

// Connection Data Flow:
// Dashboard → InvoiceForm + ClientManagement + InvoicePreview + Analytics
// Data: Dashboard stats, Recent invoices, Chart data
👥 Section 10: Client Management → Invoice Form Connection
typescript// components/clients/ClientManagement.tsx
interface ClientManagementProps {
onCreateInvoiceForClient: (clientId: string) => void;
onClientUpdated: (client: Client) => void;
}

const ClientManagement = ({ onCreateInvoiceForClient, onClientUpdated }) => {
const { state, actions } = useContext(AppContext);
const [clients, setClients] = useState<Client[]>(state.clients);
const [selectedClient, setSelectedClient] = useState<Client | null>(null);
const [showAddModal, setShowAddModal] = useState(false);

const handleCreateInvoice = (clientId: string) => {
onCreateInvoiceForClient(clientId);
};

const handleAddClient = async (clientData: Partial<Client>) => {
try {
const response = await fetch('/api/clients', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(clientData)
});

      const newClient = await response.json();
      actions.addClient(newClient);
      onClientUpdated(newClient);
      setShowAddModal(false);
    } catch (error) {
      // Error handling
    }

};

return (
<div className="client-management">
<div className="header">
<h2>Client Management</h2>
<Button onClick={() => setShowAddModal(true)}>
<Plus /> Add Client
</Button>
</div>

      <ClientTable
        clients={clients}
        onEdit={setSelectedClient}
        onDelete={handleDeleteClient}
        onCreateInvoice={handleCreateInvoice}
        onViewHistory={(clientId) => router.push(`/clients/${clientId}/invoices`)}
      />

      {showAddModal && (
        <AddClientModal
          onSave={handleAddClient}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {selectedClient && (
        <EditClientModal
          client={selectedClient}
          onSave={handleUpdateClient}
          onClose={() => setSelectedClient(null)}
        />
      )}
    </div>

);
};

// Connection Data Flow:
// ClientManagement → InvoiceForm (with pre-selected client)
// Data: Client list, Selected client data
🔄 Inter-Component Data Flow
Navigation Flow with Data Passing
typescript// hooks/useNavigation.ts
const useNavigation = () => {
const router = useRouter();
const { actions } = useContext(AppContext);

const navigateToInvoiceForm = (options?: {
clientId?: string;
template?: string;
initialData?: Partial<Invoice>;
}) => {
if (options?.clientId) {
router.push(`/invoice?clientId=${options.clientId}`);
} else if (options?.initialData) {
actions.setCurrentInvoice(options.initialData as Invoice);
router.push('/invoice');
} else {
router.push('/invoice');
}
};

const navigateToPreview = (invoiceId: string) => {
router.push(`/invoice/preview/${invoiceId}`);
};

const navigateToClientManagement = () => {
router.push('/clients');
};

return {
navigateToInvoiceForm,
navigateToPreview,
navigateToClientManagement
};
};
Parent-Child Component Communication
typescript// pages/invoice/index.tsx - Main Invoice Page
const InvoicePage = () => {
const { navigateToPreview } = useNavigation();
const { actions } = useContext(AppContext);

const handleSaveInvoice = async (invoiceData: Invoice) => {
const response = await fetch('/api/invoices', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(invoiceData)
});

    const savedInvoice = await response.json();
    actions.setCurrentInvoice(savedInvoice);
    return savedInvoice;

};

const handlePreviewInvoice = (invoiceData: Invoice) => {
actions.setCurrentInvoice(invoiceData);
navigateToPreview(invoiceData.id);
};

return (
<InvoiceForm
onSave={handleSaveInvoice}
onPreview={handlePreviewInvoice}
onCancel={() => router.push('/dashboard')}
/>
);
};

// pages/dashboard/index.tsx - Main Dashboard Page
const DashboardPage = () => {
const { navigateToInvoiceForm, navigateToClientManagement } = useNavigation();

const handleCreateInvoice = () => {
navigateToInvoiceForm();
};

const handleManageClients = () => {
navigateToClientManagement();
};

const handleViewInvoice = (invoiceId: string) => {
router.push(`/invoice/preview/${invoiceId}`);
};

return (
<Dashboard
      onCreateInvoice={handleCreateInvoice}
      onManageClients={handleManageClients}
      onViewInvoice={handleViewInvoice}
    />
);
};
🎯 Complete Connection Implementation
Root App Structure with Context
typescript// pages/\_app.tsx
function MyApp({ Component, pageProps }: AppProps) {
return (
<AppContextProvider>
<AuthContextProvider>
<Component {...pageProps} />
</AuthContextProvider>
</AppContextProvider>
);
}

// Layout wrapper for consistent navigation
const MainLayout = ({ children }: { children: React.ReactNode }) => {
const { state } = useContext(AppContext);
const { navigateToInvoiceForm, navigateToClientManagement } = useNavigation();

return (
<div className="app-layout">
<Header 
        user={state.user}
        onCreateInvoice={navigateToInvoiceForm}
        onManageClients={navigateToClientManagement}
      />
<main>{children}</main>
<Footer />
</div>
);
};
This structure ensures every component is properly connected with clear data flow and communication patterns. Each component receives the data it needs and has clear interfaces for interacting with other components.
