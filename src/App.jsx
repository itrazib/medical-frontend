import React from "react";
import { createBrowserRouter} from "react-router";
import Layout from "./Layout";
import IndexPage from "./pages/IndexPage";
import ServicePage from "./pages/commonPages/servicePages.jsx/ServicePage";
import DoctorsPage from "./pages/commonPages/DoctorsPage";
import MedicalStaffsPage from "./pages/commonPages/MedicalStaffsPage";
import ContactPage from "./pages/commonPages/ContactPage";
import AddMember from "./pages/universityAdminPages/AddMember";
import RegisterPage from "./pages/authPages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import SetPasswordPage from "./pages/authPages/SetPasswordPage";
import AvailableMedicine from "./pages/AvailableMedicine";
import PrivateRoute from "./PrivateRoute";
import AccessDenied from "./AccessDeniedPage";
import AboutPage from "./pages/commonPages/AboutPage";
import GoogleRedirect from "./pages/authPages/GoogleRedirectPage";
import SetPasswordGoogle from "./pages/authPages/SetPasswordGoogle";
import PatientProfilePage from "./pages/doctorPages/PatientProfilePage";
import SearchMedicinesPage from "./pages/doctorPages/SearchMedicinesPage";
import ManageMedicinePage from "./pages/medicalStaffPages/ManageMedicinePage";
import MedicineOutOfStockPage from "./pages/medicalStaffPages/MedicineOutOfStockPage";
import TelemedicinePage from "./pages/commonPages/TelemedicinePage";
import BookingPage from "./pages/bookingPages/BookingPage";
import ManageDutyRosterDoctor from "./pages/medicalAdminPages/ManageDutyRosterDoctor";
import PrescriptionForm from "./pages/doctorPages/prescriptionPage/PrescriptionForm";
import PrescriptionView from "./pages/doctorPages/prescriptionPage/PrescriptionView";
import PrescriptionHistory from "./pages/patientPages/prescriptionPages/PrescriptionHistory";
import DutyRosterOfDoctorsPage from "./pages/DutyRosterOfDoctorsPage";
import DispenseMedicine from "./pages/medicalStaffPages/DispenseMedicine";
import EditMedicinePage from "./pages/medicalStaffPages/EditMedicinePage";
import MedicineView from "./pages/doctorPages/MedicineView";
import DoctorMedicineDetailPage from "./pages/doctorPages/MedicineDetail";
import StaffMedicineDetailPage from "./pages/medicalStaffPages/MedicineDetail";
import ForgotPasswordPage from "./pages/authPages/ForgotPasswordPage";
import ManageStaffDutyRoster from "./pages/medicalAdminPages/ManageStaffDutyRoster";
import TelemedicineDuty from "./pages/medicalAdminPages/TelemedicineDuty";
import AmbulanceAssignmentPage from "./pages/medicalAdminPages/AmbulanceAssignmentPage";
import DutyRosterViewer from "./pages/commonPages/DutyRosterViewer";
import DoctorPatientHistory from "./pages/doctorPages/DoctorPatientHistory";
import DoctorPrescriptionHistory from "./pages/doctorPages/DoctorPrescriptionHistory";
import AddMedicine from "./pages/medicalStaffPages/AddMedicine";
import MonthlyDispenseReport from "./pages/medicalStaffPages/MonthlyDispenseReport";

// Router configuration
export const router = createBrowserRouter([
  {
    path: "/",
    element: (
        <Layout />
    ),
    children: [
      { index: true, element: <IndexPage /> },
      { path: "services", element: <ServicePage /> },
      { path: "doctors", element: <DoctorsPage /> },
      { path: "medical-staffs", element: <MedicalStaffsPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "register", element: <RegisterPage /> },
      {
        path: "profile",
        element: (
          <PrivateRoute
            element={ProfilePage}
            roles={["patient", "doctor", "medical-staff"]}
          />
        ),
      },
      { path: "set-password", element: <SetPasswordPage /> },
      { path: "available-medicine", element: <AvailableMedicine /> },
      { path: "doctor/available-medicine", element: <MedicineView /> },
      {
        path: "university-admin/add-member",
        element: (
          <PrivateRoute element={AddMember} roles={["university-admin"]} />
        ),
      },
      { path: "access-denied", element: <AccessDenied /> },
      { path: "about", element: <AboutPage /> },
      { path: "google-redirect", element: <GoogleRedirect /> },
      { path: "set-password-google", element: <SetPasswordGoogle /> },
      { path: "patient-profile/:uniqueId", element: <PatientProfilePage /> },
      {
        path: "medical-staff/manage-medicine",
        element: <ManageMedicinePage />,
      },
      {
        path: "medical-staff/medicine-out-of-stock",
        element: <MedicineOutOfStockPage />,
      },
      { path: "duty-roster-of-doctors", element: <DutyRosterOfDoctorsPage /> },
      { path: "search-medicine", element: <SearchMedicinesPage /> },
      { path: "search-medicine/:medicineId", element: <SearchMedicinesPage /> },
      { path: "telemedicine", element: <TelemedicinePage /> },
      { path: "book-appointment", element: <BookingPage /> },
      { path: "write-prescription/:uniqueId", element: <PrescriptionForm /> },
      {
        path: "show-prescription/:prescriptionId",
        element: <PrescriptionView />,
      },
      { path: "patient/medical-history", element: <PrescriptionHistory /> },
      {
        path: "medical-staff/pending-medicine-requests",
        element: <DispenseMedicine />,
      },
      {
        path: "medical-staff/medicines/:id",
        element: <StaffMedicineDetailPage />,
      },
      { path: "doctor/medicines/:id", element: <DoctorMedicineDetailPage /> },
      { path: "medicines/:id/edit", element: <EditMedicinePage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      {
        path: "medical-admin/manage-medical-staff",
        element: <ManageStaffDutyRoster />,
      },
      {
        path: "medical-admin/telemedicine-duty",
        element: <TelemedicineDuty />,
      },
      {
        path: "medical-admin/set-driver",
        element: <AmbulanceAssignmentPage />,
      },
      { path: "duty-roster-staff", element: <DutyRosterViewer /> },
      {
        path: "doctor/patient-history/:uniqueId",
        element: <DoctorPatientHistory />,
      },
      {
        path: "doctor/prescription-history",
        element: <DoctorPrescriptionHistory />,
      },
      { path: "medical-staff/add-medicine", element: <AddMedicine /> },
      {
        path: "medical-staff/dispense-report",
        element: <MonthlyDispenseReport />,
      },
    ],
  },
]);


// export default function AppRouter() {
//   return <RouterProvider router={router} />;
// }
