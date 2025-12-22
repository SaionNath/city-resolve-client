import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout";
import Home from "../pages/Home/HOME/Home";
import AuthLayout from "../layout/AuthLayout";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import AllIssue from "../pages/AllIssue/AllIssue";
import IssueReport from "../pages/IssueReport/IssueReport";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
        {
            index: true,
            Component: Home
        },
        {
          path: "all_issue",
          Component: AllIssue,
        },
        {
          path: 'issue_report',
          loader: () => fetch("/serviceCenters.json").then((res) => res.json()),
          Component: IssueReport
        }
    ]
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
]);