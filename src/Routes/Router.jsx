import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout";
import Home from "../pages/Home/HOME/Home";
import AuthLayout from "../layout/AuthLayout";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import AllIssue from "../pages/AllIssue/AllIssue";
import IssueReport from "../pages/IssueReport/IssueReport";
import PrivateRoute from "./PrivateRoute";
import MyIssue from "../pages/Auth/DashBoard/MyIssue/MyIssue";
import DashboardLayout from "../layout/DashboardLayout";
import PaymentSuccess from "../pages/Auth/DashBoard/Payment/PaymentSuccess";
import PaymentCancel from "../pages/Auth/DashBoard/Payment/PaymentCancel";
import PaymentHistory from "../pages/Auth/DashBoard/PaymentHistory/PaymentHistory";
import IssueDetails from "../pages/AllIssue/IssueDetails";
import Bestaff from "../pages/BeStaff/BeStaff";
import AdminRoute from "./AdminRoute";
import ApproveStaff from "../pages/Auth/DashBoard/ApproveStaff/ApproveStaff";
import AssignStaff from "../pages/Auth/DashBoard/AssignStaff/AssignStaff";
import UserManagement from "../pages/Auth/DashBoard/UserManagement/UserManagement";
import IssueTrack from "../pages/IssuerTrack/IssuerTrack";
import RiderRoute from "./RiderRoute";
import AssignedIssues from "../pages/Auth/DashBoard/AssignedIssues/AssignedIssues";
import AllIssues from "../pages/Auth/DashBoard/AllIssues/AllIssues";
import CompletedIssues from "../pages/Auth/DashBoard/CompletedIssues/CompletedIssues";
import AccountRestricted from "../pages/Auth/DashBoard/AccountRestricted/AccountRestricted";
import PremiumSuccess from "../pages/Auth/DashBoard/Payment/PremiumSuccess";
import PremiumCancel from "../pages/Auth/DashBoard/Payment/PremiumCancel";
import Profile from "../components/Profile/Profile";
import DashBoardHome from "../pages/Auth/DashBoard/DashBoardHome/DashBoardHome";
import Error from "../components/Error/Error";
import ManageStaff from "../pages/Auth/DashBoard/ManageStaff/ManageStaff";
import AdminPayments from "../pages/Auth/DashBoard/AdminPayments/AdminPayments";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    errorElement: <Error></Error>,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "all_issue",
        Component: AllIssue,
      },
      {
        path: "issue_report",
        loader: () => fetch("/serviceCenters.json").then((res) => res.json()),
        Component: IssueReport,
      },
      {
        path: "profile",
        Component: Profile,
      },
      // {
      //   path: "be_staff",
      //   loader: () => fetch("/serviceCenters.json").then((res) => res.json()),
      //   element: (
      //     <PrivateRoute>
      //       <Bestaff></Bestaff>
      //     </PrivateRoute>
      //   ),
      // },
      {
        path: "issue_track/:trackingId",
        Component: IssueTrack,
      },
      {
        path: "issues/:id",
        element: (
          <PrivateRoute>
            <IssueDetails></IssueDetails>
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        Component: DashBoardHome,
      },
      {
        path: "my_issues",
        Component: MyIssue,
      },
      {
        path: "payment_history",
        Component: PaymentHistory,
      },
      {
        path: "payment_success",
        Component: PaymentSuccess,
      },
      {
        path: "payment_cancel",
        Component: PaymentCancel,
      },
      {
        path: "account_restricted",
        Component: AccountRestricted,
      },
      {
        path: "premium_success",
        Component: PremiumSuccess,
      },
      {
        path: "premium_cancel",
        Component: PremiumCancel,
      },
      {
        path: "assigned_issue",
        element: (
          <RiderRoute>
            <AssignedIssues></AssignedIssues>
          </RiderRoute>
        ),
      },
      {
        path: "completed_issues",
        element: (
          <RiderRoute>
            <CompletedIssues></CompletedIssues>
          </RiderRoute>
        ),
      },
      //admin only routes
      {
        path: "all_issues",
        element: (
          <AdminRoute>
            <AllIssues></AllIssues>
          </AdminRoute>
        ),
      },
      {
        path: "manage_staff",
        loader: () => fetch("/serviceCenters.json").then((res) => res.json()),
        element: (
          <AdminRoute>
            <ManageStaff></ManageStaff>
          </AdminRoute>
        ),
      },
      {
        path: "assign_staff",
        element: (
          <AdminRoute>
            <AssignStaff></AssignStaff>
          </AdminRoute>
        ),
      },
      {
        path: "users_management",
        element: (
          <AdminRoute>
            <UserManagement></UserManagement>
          </AdminRoute>
        ),
      },
      {
        path: "admin-payments",
        element: (
          <AdminRoute>
            <AdminPayments></AdminPayments>
          </AdminRoute>
        ),
      },
    ],
  },
]);
