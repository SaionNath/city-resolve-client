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

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
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
        path: "be_staff",
        loader: () => fetch("/serviceCenters.json").then((res) => res.json()),
        element: 
        <PrivateRoute>
          <Bestaff></Bestaff>
        </PrivateRoute>
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
    ],
  },
]);
