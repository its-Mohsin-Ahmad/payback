import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastProvider } from '@/components/ui';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AppShell } from '@/layouts/AppShell';
import { AdminShell } from '@/layouts/AdminShell';

/* Public website */
import HomePage from '@/pages/public/Home';
import BusinessPage from '@/pages/public/Business';
import ProductsPage from '@/pages/public/Products';
import RatesPage from '@/pages/public/Rates';
import SecurityPage from '@/pages/public/Security';
import SupportPage from '@/pages/public/Support';
import AboutPage from '@/pages/public/About';
import PrivacyPage from '@/pages/public/Privacy';
import TermsPage from '@/pages/public/Terms';
import LoginPage from '@/pages/public/Login';
import RegisterPage from '@/pages/public/Register';
import BranchesPublicPage from '@/pages/public/Branches';

/* Customer app */
import ScanPayPage from '@/pages/app/ScanPay';
import MyQrPage from '@/pages/app/MyQr';
import QrPayPage from '@/pages/app/QrPay';
import VerifyTransactionPage from '@/pages/app/VerifyTransaction';
import AppDashboardPage from '@/pages/app/Dashboard';
import AccountsPage from '@/pages/app/Accounts';
import AccountDetailPage from '@/pages/app/AccountDetail';
import TransactionsPage from '@/pages/app/Transactions';
import TransactionDetailPage from '@/pages/app/TransactionDetail';
import AnalyticsPage from '@/pages/app/Analytics';
import TransferPage from '@/pages/app/Transfer';
import BillPaymentsPage from '@/pages/app/BillPayments';
import CardsPage from '@/pages/app/Cards';
import BeneficiariesPage from '@/pages/app/Beneficiaries';
import LimitsPage from '@/pages/app/Limits';
import LoansPage from '@/pages/app/Loans';
import InvestmentsPage from '@/pages/app/Investments';
import RewardsPage from '@/pages/app/Rewards';
import CurrencyExchangePage from '@/pages/app/CurrencyExchange';
import BranchesPage from '@/pages/app/Branches';
import StatementsPage from '@/pages/app/Statements';
import ProfilePage from '@/pages/app/Profile';
import SecurityCentrePage from '@/pages/app/Security';
import NotificationsPage from '@/pages/app/Notifications';
import SettingsPage from '@/pages/app/Settings';
import SupportCentrePage from '@/pages/app/Support';

/* Business banking */
import BusinessDashboardPage from '@/pages/business/app/Dashboard';
import BusinessAccountsPage from '@/pages/business/app/Accounts';
import CashflowPage from '@/pages/business/app/Cashflow';
import BusinessInvoicesPage from '@/pages/business/app/Invoices';
import BusinessVendorsPage from '@/pages/business/app/Vendors';
import BusinessPayrollPage from '@/pages/business/app/Payroll';
import BusinessApprovalsPage from '@/pages/business/app/Approvals';
import CorporateCardsPage from '@/pages/business/app/CorporateCards';
import BusinessTeamPage from '@/pages/business/app/Team';
import BusinessIntegrationsPage from '@/pages/business/app/Integrations';
import BusinessProfilePage from '@/pages/business/app/Profile';
import BusinessReportsPage from '@/pages/business/app/Reports';
import BusinessSupportPage from '@/pages/business/app/Support';

/* Admin platform */
import AdminDashboardPage from '@/pages/admin/Dashboard';
import AdminAnalyticsPage from '@/pages/admin/Analytics';
import AdminReportsPage from '@/pages/admin/Reports';
import AdminUsersPage from '@/pages/admin/Users';
import AdminTransactionsPage from '@/pages/admin/Transactions';
import AdminKycPage from '@/pages/admin/KYC';
import AdminDisputesPage from '@/pages/admin/Disputes';
import AdminRiskPage from '@/pages/admin/Risk';
import AdminFeesPage from '@/pages/admin/Fees';
import AdminRolesPage from '@/pages/admin/Roles';
import AdminIntegrationsPage from '@/pages/admin/Integrations';
import AdminAuditPage from '@/pages/admin/Audit';
import AdminSettingsPage from '@/pages/admin/Settings';

export default function App() {
  return (
    <ToastProvider>
      {/*
        `basename` is required, not decorative.

        The production build is served from the `/payback/` sub-path (see
        `base` in vite.config.ts). Without this, React Router treats the full
        pathname — `/payback/app/cards` — as the route path, matches no
        `<Route path="app/cards">`, and falls through to the catch-all
        `<Navigate to="/" replace />`. The observable symptom was that opening
        or reloading *any* deep link bounced the user to the marketing homepage
        instead of the page they asked for.

        `import.meta.env.BASE_URL` resolves to `/payback/` in a production build
        and `/` under `vite dev`, so the same code works in both.
      */}
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Routes>
          {/* ---------------- Public website ---------------- */}
          <Route element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="business" element={<BusinessPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="loans-products" element={<ProductsPage />} />
            <Route path="investments-products" element={<ProductsPage />} />
            <Route path="rates" element={<RatesPage />} />
            <Route path="security" element={<SecurityPage />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="terms" element={<TermsPage />} />
            <Route path="branches" element={<BranchesPublicPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>

          {/* ---------------- Customer app ---------------- */}
          <Route path="app" element={<AppShell variant="personal" />}>
            <Route index element={<AppDashboardPage />} />
            <Route path="accounts" element={<AccountsPage />} />
            <Route path="accounts/:id" element={<AccountDetailPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="transactions/:id" element={<TransactionDetailPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="transfer" element={<TransferPage />} />
            <Route path="scan" element={<ScanPayPage />} />
            <Route path="my-qr" element={<MyQrPage />} />
            <Route path="qr-pay" element={<QrPayPage />} />
            <Route path="verify" element={<VerifyTransactionPage />} />
            <Route path="bills" element={<BillPaymentsPage />} />
            <Route path="cards" element={<CardsPage />} />
            <Route path="beneficiaries" element={<BeneficiariesPage />} />
            <Route path="limits" element={<LimitsPage />} />
            <Route path="loans" element={<LoansPage />} />
            <Route path="investments" element={<InvestmentsPage />} />
            <Route path="rewards" element={<RewardsPage />} />
            <Route path="exchange" element={<CurrencyExchangePage />} />
            <Route path="branches" element={<BranchesPage />} />
            <Route path="statements" element={<StatementsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="security" element={<SecurityCentrePage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="support" element={<SupportCentrePage />} />
            <Route path="*" element={<Navigate to="/app" replace />} />
          </Route>

          {/* ---------------- Business banking ---------------- */}
          <Route path="business/app" element={<AppShell variant="business" />}>
            <Route index element={<BusinessDashboardPage />} />
            <Route path="accounts" element={<BusinessAccountsPage />} />
            <Route path="cashflow" element={<CashflowPage />} />
            <Route path="invoices" element={<BusinessInvoicesPage />} />
            <Route path="vendors" element={<BusinessVendorsPage />} />
            <Route path="payroll" element={<BusinessPayrollPage />} />
            <Route path="approvals" element={<BusinessApprovalsPage />} />
            <Route path="cards" element={<CorporateCardsPage />} />
            <Route path="team" element={<BusinessTeamPage />} />
            <Route path="integrations" element={<BusinessIntegrationsPage />} />
            <Route path="profile" element={<BusinessProfilePage />} />
            <Route path="support" element={<BusinessSupportPage />} />
            <Route path="reports" element={<BusinessReportsPage />} />
            <Route path="*" element={<Navigate to="/business/app" replace />} />
          </Route>

          {/* ---------------- Admin platform ---------------- */}
          <Route path="admin" element={<AdminShell />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="transactions" element={<AdminTransactionsPage />} />
            <Route path="kyc" element={<AdminKycPage />} />
            <Route path="disputes" element={<AdminDisputesPage />} />
            <Route path="risk" element={<AdminRiskPage />} />
            <Route path="fees" element={<AdminFeesPage />} />
            <Route path="roles" element={<AdminRolesPage />} />
            <Route path="integrations" element={<AdminIntegrationsPage />} />
            <Route path="audit" element={<AdminAuditPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}