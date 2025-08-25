import axios from "axios";
import React from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { Suspense, lazy } from "react";

// import Login from "./pages/Login";
// import Home from "./pages/home";
// import DashboardLayout from "./components/dashboard/dashboar-layout";
// import Dashboard from "./components/dashboard/dashboard";
// import CreateJob from "./components/dashboard/jobs/create-jobs";
// import ApplicantProfile from "./components/dashboard/jobs/applicants-profile";
// import Jobs from "./pages/jobs";
// import SettingsProfile from "./pages/SettingsProfile";
// import MyProfile from "./pages/Settings/MyProfile";
// import CreateJobFields from "./pages/Settings/CreateJobFields";
// import JobFields from "./pages/Settings/JobFields";
// import UserManagement from "./pages/Settings/UserManagement";
// import CreateUser from "./pages/Settings/CreateUser";
// import LoginPassword from "./pages/Settings/LoginPassword";
// import Candidates from "./components/dashboard/candidates/Candidates";
// import { JobProfile } from "./pages/job-profile";
// import CreateEmployee from "./components/dashboard/employee/CreateEmployee";
// import Employee from "./components/dashboard/employee/Employee";
// import CreateCandidates from "./components/dashboard/candidates/CreateCandidates";
// import AddCandidates from "./components/dashboard/candidates/AddCandidates";
// import CreateManager from "./components/dashboard/manager/CreateManager";
// import Managers from "./components/dashboard/manager/Managers";
// import Create from "./components/dashboard/company/create";
// import Company from "./components/dashboard/company/Company";
// import Careers from "./components/dashboard/careers/careers";
// import JobApplicants from "./components/dashboard/candidates/JobApplicants";
// import HiringProcess from "./pages/Settings/HiringProcess";
// import CreateHiringProcess from "./pages/Settings/CreateHiringProcess";
// // import InterviewTimeline from "./pages/InterviewTimeline";
// import Workflow from "./pages/Workflow";
// import { Toaster } from "react-hot-toast";
// import InterviewTemplates from "./pages/Settings/interview-templates";
// import InterviewTemplateForm from "./pages/Settings/edit-template";
// import InterviewTemplatePage from "./pages/Settings/Interview-template-page";
// import CareersPage from "./pages/CareersPage";

const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/home"));
const DashboardLayout = lazy(() =>
  import("./components/dashboard/dashboar-layout")
);
const Dashboard = lazy(() => import("./components/dashboard/dashboard"));
const CreateJob = lazy(() => import("./components/dashboard/jobs/create-jobs"));
const ApplicantProfile = lazy(() =>
  import("./components/dashboard/jobs/applicants-profile")
);
const Jobs = lazy(() => import("./pages/jobs"));
const SettingsProfile = lazy(() => import("./pages/SettingsProfile"));
const MyProfile = lazy(() => import("./pages/Settings/MyProfile"));
const CreateJobFields = lazy(() => import("./pages/Settings/CreateJobFields"));
const JobFields = lazy(() => import("./pages/Settings/JobFields"));
const UserManagement = lazy(() => import("./pages/Settings/UserManagement"));
const CreateUser = lazy(() => import("./pages/Settings/CreateUser"));
const LoginPassword = lazy(() => import("./pages/Settings/LoginPassword"));
const Candidates = lazy(() =>
  import("./components/dashboard/candidates/Candidates")
);
const JobProfile = lazy(() => import("./pages/job-profile"));
const CreateEmployee = lazy(() =>
  import("./components/dashboard/employee/CreateEmployee")
);
const Employee = lazy(() => import("./components/dashboard/employee/Employee"));
const CreateCandidates = lazy(() =>
  import("./components/dashboard/candidates/CreateCandidates")
);
const AddCandidates = lazy(() =>
  import("./components/dashboard/candidates/AddCandidates")
);
const CreateManager = lazy(() =>
  import("./components/dashboard/manager/CreateManager")
);
const Managers = lazy(() => import("./components/dashboard/manager/Managers"));
const Create = lazy(() => import("./components/dashboard/company/create"));
const Company = lazy(() => import("./components/dashboard/company/Company"));
const Careers = lazy(() => import("./components/dashboard/careers/careers"));
const JobApplicants = lazy(() =>
  import("./components/dashboard/candidates/JobApplicants")
);
const HiringProcess = lazy(() => import("./pages/Settings/HiringProcess"));
const CreateHiringProcess = lazy(() =>
  import("./pages/Settings/CreateHiringProcess")
);
const OffersTemplate = lazy(() => import("./pages/Settings/OffersTemplate"));
const Workflow = lazy(() => import("./pages/Workflow"));
const InterviewTemplates = lazy(() =>
  import("./pages/Settings/interview-templates")
);
const InterviewTemplateForm = lazy(() =>
  import("./pages/Settings/edit-template")
);
const InterviewTemplatePage = lazy(() =>
  import("./pages/Settings/Interview-template-page")
);
const CareersPage = lazy(() => import("./pages/CareersPage"));

import { Toaster } from "react-hot-toast";
import NotFound from "./pages/not-found";
import CandidateDetails from "./pages/CandidateDetails";

axios.defaults.baseURL = "http://147.79.71.240:8090/api";
export const baseURL = "http://147.79.71.240:8090/api";
// axios.defaults.baseURL = "http://192.168.29.215:8080/api";
// export const baseURL = "http://192.168.29.215:8080/api";
export const aiBaseUrl = "http://147.79.71.240:9090/";

const App = () => {
  function ProtectedRoute({ children, allowedRoles = "" }) {
    const role = localStorage.getItem("role");
    const location = useLocation();
    if (!role || !allowedRoles.includes(role)) {
      return <Navigate to="/not-found" state={{ from: location }} />;
    }
    return children;
  }
  return (
    <main>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="flex justify-center items-center min-h-screen text-lg">
              Loading...
            </div>
          }
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<Workflow />} />
            <Route path="/careers/:parentId" element={<Careers />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <Routes>
                    <Route path="/" element={<DashboardLayout />}>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/jobs" element={<Jobs />} />
                      <Route path="/jobs/create-jobs" element={<CreateJob />} />
                      <Route path="/settings" element={<SettingsProfile />} />
                      <Route
                        path="settings/my-profile"
                        element={<MyProfile />}
                      />
                      <Route
                        path="settings/job-fields/:create"
                        element={<CreateJobFields />}
                      />
                      <Route
                        path="settings/job-fields"
                        element={<JobFields />}
                      />
                      <Route
                        path="settings/hiring-process"
                        element={<HiringProcess />}
                      />
                      <Route
                        path="settings/hiring-process/create"
                        element={<CreateHiringProcess />}
                      />
                      <Route
                        path="settings/hiring-process/:id/interview-template"
                        element={<InterviewTemplates />}
                      />
                      <Route
                        path="settings/user-management"
                        element={<UserManagement />}
                      />
                      <Route
                        path="settings/interview-templates/create"
                        element={<InterviewTemplateForm />}
                      />
                      <Route
                        path="settings/user-management/create-user"
                        element={<CreateUser />}
                      />
                      <Route
                        path="settings/interview-templates"
                        element={<InterviewTemplatePage />}
                      />

                      <Route
                        path="settings/offers-template"
                        element={<OffersTemplate />}
                      />

                      <Route path="/candidates" element={<Candidates />} />
                      <Route
                        path="/candidates/:candidateId"
                        element={<CandidateDetails />}
                      />
                      <Route
                        path="settings/login-password"
                        element={<LoginPassword />}
                      />
                      <Route
                        path="/managers/create"
                        element={<CreateManager />}
                      />
                      <Route path="/managers" element={<Managers />} />
                      {/* <Route path="/sub-admin" element={<Employee />} /> */}
                      {/* <Route
                        path="/sub-admin/create"
                        element={<CreateEmployee />}
                      /> */}
                      <Route
                        path="/jobs/job-profile/:id"
                        element={<JobApplicants />}
                      />
                    </Route>
                  </Routes>
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/*"
              element={
                <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
                  <Routes>
                    <Route path="/" element={<DashboardLayout />}>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/candidates" element={<Candidates />} />
                      <Route
                        path="/candidates/:candidateId"
                        element={<CandidateDetails />}
                      />
                      <Route
                        path="/candidates/add"
                        element={<AddCandidates />}
                      />
                      <Route path="/jobs" element={<Jobs />} />
                      <Route path="/jobs/create-jobs" element={<CreateJob />} />
                      <Route
                        path="/jobs/job-profile/:id"
                        element={<JobApplicants />}
                      />
                    </Route>
                  </Routes>
                </ProtectedRoute>
              }
            />
            <Route
              path="/superadmin/*"
              element={
                <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
                  <Routes>
                    <Route path="/" element={<DashboardLayout />}>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/jobs" element={<Jobs />} />
                      <Route path="/jobs/create-jobs" element={<CreateJob />} />
                      <Route path="/company" element={<Company />} />
                      <Route path="/company/create" element={<Create />} />
                      <Route
                        path="/jobs/job-profile/:id"
                        element={<JobProfile />}
                      />
                      <Route
                        path="/jobs/job-profile/:jobId/job-applicants/:applicantId"
                        element={<ApplicantProfile />}
                      />
                    </Route>
                  </Routes>
                </ProtectedRoute>
              }
            />

            <Route
              path="/company/*"
              element={
                <ProtectedRoute allowedRoles={["COMPANY"]}>
                  <Routes>
                    <Route path="/" element={<DashboardLayout />}>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/jobs" element={<Jobs />} />
                      <Route path="/jobs/create-jobs" element={<CreateJob />} />
                      <Route path="/managers" element={<Managers />} />
                      <Route path="/settings" element={<SettingsProfile />} />
                      <Route
                        path="settings/my-profile"
                        element={<MyProfile />}
                      />
                      <Route
                        path="settings/offers-template"
                        element={<OffersTemplate />}
                      />
                      <Route path="/employee" element={<Employee />} />
                      <Route
                        path="/employee/create"
                        element={<CreateEmployee />}
                      />
                      <Route
                        path="settings/job-fields/:create"
                        element={<CreateJobFields />}
                      />
                      <Route
                        path="settings/job-fields"
                        element={<JobFields />}
                      />
                      <Route
                        path="settings/hiring-process"
                        element={<HiringProcess />}
                      />
                      <Route
                        path="settings/hiring-process/create"
                        element={<CreateHiringProcess />}
                      />
                      <Route
                        path="settings/hiring-process/:hiringProcessId"
                        element={<CreateHiringProcess />}
                      />
                      <Route
                        path="settings/hiring-process/:hiringProcessId/interview-template"
                        element={<InterviewTemplates />}
                      />
                      <Route
                        path="settings/interview-templates"
                        element={<InterviewTemplatePage />}
                      />
                      <Route
                        path="settings/interview-templates/create"
                        element={<InterviewTemplateForm />}
                      />
                      <Route
                        path="settings/hiring-process/:hiringProcessId/interview-template/:templateProcessId/edit"
                        element={<InterviewTemplateForm />}
                      />
                      <Route
                        path="settings/interview-templates/:templateProcessId/edit"
                        element={<InterviewTemplateForm />}
                      />
                      <Route
                        path="settings/user-management"
                        element={<UserManagement />}
                      />
                      <Route
                        path="settings/user-management/create-user"
                        element={<CreateUser />}
                      />
                      <Route path="/candidates" element={<Candidates />} />
                      <Route
                        path="/candidates/:candidateId"
                        element={<CandidateDetails />}
                      />
                      <Route
                        path="settings/login-password"
                        element={<LoginPassword />}
                      />
                      <Route
                        path="/managers/create"
                        element={<CreateManager />}
                      />
                      {/* <Route
                        path="/sub-admin/create"
                        element={<CreateEmployee />}
                      /> */}
                      <Route
                        path="/jobs/job-profile/:id"
                        element={<JobApplicants />}
                      />
                      <Route
                        path="/jobs/job-profile/:jobId/job-applicants/:applicantId"
                        element={<ApplicantProfile />}
                      />
                    </Route>
                  </Routes>
                </ProtectedRoute>
              }
            />

            <Route
              path="/employee/*"
              element={
                <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
                  <Routes>
                    <Route path="/" element={<DashboardLayout />}>
                      <Route path="/" element={<Dashboard />} />
                      {/* <Route path="/users" element={<User />} /> */}
                      <Route path="/candidates" element={<Candidates />} />
                      <Route
                        path="/candidates/add"
                        element={<AddCandidates />}
                      />
                      <Route path="/jobs" element={<Jobs />} />
                      <Route path="/settings" element={<SettingsProfile />} />
                      <Route
                        path="settings/my-profile"
                        element={<MyProfile />}
                      />
                      <Route
                        path="settings/login-password"
                        element={<LoginPassword />}
                      />
                      <Route path="/jobs/create-jobs" element={<CreateJob />} />
                      <Route
                        path="/candidates/create"
                        element={<CreateCandidates />}
                      />
                      <Route
                        path="/jobs/job-profile/:id"
                        element={<JobProfile />}
                      />
                      <Route
                        path="/jobs/job-profile/:jobId/job-applicants/:applicantId"
                        element={<ApplicantProfile />}
                      />
                    </Route>
                  </Routes>
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/*"
              element={
                <ProtectedRoute allowedRoles={["USER"]}>
                  <Routes>
                    <Route path="/" element={<DashboardLayout />}>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/jobs" element={<Jobs />} />
                      {/* <Route path="/users" element={<User />} /> */}
                      <Route path="/settings" element={<SettingsProfile />} />
                      <Route
                        path="settings/my-profile"
                        element={<MyProfile />}
                      />
                      <Route
                        path="settings/login-password"
                        element={<LoginPassword />}
                      />
                      <Route
                        path="/jobs/job-profile/:id"
                        element={<JobProfile />}
                      />
                      <Route
                        path="/jobs/job-profile/:jobId/job-applicants/:applicantId"
                        element={<ApplicantProfile />}
                      />
                    </Route>
                  </Routes>
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/*"
              element={
                <ProtectedRoute allowedRoles={["RECRUITER"]}>
                  <Routes>
                    <Route path="/" element={<DashboardLayout />}>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/jobs" element={<Jobs />} />
                      <Route path="/jobs/:id" element={<Candidates />} />
                      <Route path="/jobs/create-jobs" element={<CreateJob />} />
                      {/* <Route path="/users" element={<User />} /> */}
                      <Route path="/employee" element={<Employee />} />
                      <Route path="/settings" element={<SettingsProfile />} />
                      <Route
                        path="settings/my-profile"
                        element={<MyProfile />}
                      />
                      <Route
                        path="settings/login-password"
                        element={<LoginPassword />}
                      />
                      <Route
                        path="/employee/create"
                        element={<CreateEmployee />}
                      />
                      <Route
                        path="/jobs/job-profile/:id"
                        element={<JobApplicants />}
                      />
                      <Route
                        path="/jobs/job-profile/:jobId/job-applicants/:applicantId"
                        element={<ApplicantProfile />}
                      />
                      <Route path="*" element={<NotFound />} />
                    </Route>
                  </Routes>
                </ProtectedRoute>
              }
            />

            <Route
              path="/recruitment_manager/*"
              element={
                <ProtectedRoute allowedRoles={["RECRUITMENT_MANAGER"]}>
                  <Routes>
                    <Route path="/" element={<DashboardLayout />}>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/jobs" element={<Jobs />} />
                      <Route path="/jobs/create-jobs" element={<CreateJob />} />
                      <Route path="/employee" element={<Employee />} />
                      <Route
                        path="/employee/create"
                        element={<CreateEmployee />}
                      />
                      <Route path="/settings" element={<SettingsProfile />} />
                      <Route
                        path="settings/my-profile"
                        element={<MyProfile />}
                      />
                      <Route
                        path="settings/login-password"
                        element={<LoginPassword />}
                      />

                      <Route
                        path="/jobs/job-profile/:id"
                        element={<JobProfile />}
                      />
                      <Route
                        path="/jobs/job-profile/:jobId/job-applicants/:applicantId"
                        element={<ApplicantProfile />}
                      />
                    </Route>
                  </Routes>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toaster position="bottom-right" reverseOrder={false} />
    </main>
  );
};

export default App;
