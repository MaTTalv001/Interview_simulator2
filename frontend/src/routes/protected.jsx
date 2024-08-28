import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Loading } from "../components/Loading";
import { RoutePath } from "../config/route_path";
import { HomePage } from "../pages/HomePage";
import { MyPage } from "../pages/MyPage";
import { Interview } from "../pages/Interview";
import { Sharings} from "../pages/Sharings";
import { Logs } from "../pages/Logs";
import { PrivacyPolicy } from "../pages/PrivacyPolicy";
import { TermsOfService } from "../pages/TermsOfService";

const App = () => {
  return (
    <>
      <Suspense fallback={<Loading />} />
      <Outlet />
    </>
  );
};

export const PROTECTED_ROUTES = [
  {
    path: RoutePath.Home.path,
    element: <App />,
    children: [{ path: RoutePath.Home.path, element: <HomePage /> }],
  },
  {
    path: RoutePath.MyPage.path,
    element: <App />,
    children: [{ path: RoutePath.MyPage.path, element: <MyPage /> }],
  },
  {
    path: RoutePath.Interview.path,
    element: <App />,
    children: [{ path: RoutePath.Interview.path, element: <Interview /> }],
  },
  {
    path: RoutePath.Logs.path,
    element: <App />,
    children: [{ path: RoutePath.Logs.path, element: <Logs /> }],
  },
  {
    path: RoutePath.Sharings.path,
    element: <App />,
    children: [{ path: RoutePath.Sharings.path, element: <Sharings /> }],
  },
  {
    path: RoutePath.PrivacyPolicy.path,
    element: <App />,
    children: [{ path: RoutePath.PrivacyPolicy.path, element: <PrivacyPolicy /> }],
  },
  {
    path: RoutePath.TermsOfService.path,
    element: <App />,
    children: [{ path: RoutePath.TermsOfService.path, element: <TermsOfService /> }],
  }
];