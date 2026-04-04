import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

/* ===== PUBLIC PAGES ===== */
import Home from "./pages/Home";
import About from "./pages/About";
import Activities from "./pages/Activities";
import ActivityDetails from "./pages/ActivityDetails";
import Careers from "./pages/company/Careers";
import Tours from "./pages/Tours";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import GalleryPage from "./pages/GalleryPage";
import Guidelines from "./pages/Guidelines";
import Faqs from "./pages/support/Faqs";
import HelpCenter from "./pages/support/HelpCenter";
import PrivacyPolicy from "./pages/support/PrivacyPolicy";
import TermsOfService from "./pages/support/TermsOfService";
import BlogDetails from "./pages/BlogDetails";
import Booking from "./pages/Booking";
import DestinationsPage from "./pages/DestinationsPage";
import DestinationDetails from "./pages/DestinationDetails";
import SeasonDetails from "./pages/SeasonDetails";
import TourDetails from "./pages/TourDetails";
import NotFound from "./pages/NotFound";
import SearchPage from "./pages/features/Search";
import WishlistPage from "./pages/features/Wishlist";
import CartPage from "./pages/features/Cart";
import CustomPlanRequest from "./pages/features/CustomPlanRequest";
import PaymentStatus from "./pages/PaymentStatus";

/* ===== ADMIN COMPONENTS ===== */
import AdminLayout from "./admin/layout/AdminLayout";
import DashboardHome from "./admin/dashboard/DashboardHome";
import BookingManagement from "./admin/bookings/BookingManagement";
import BookingDetails from "./admin/bookings/BookingDetails";
import GalleryManagement from "./admin/gallery/GalleryList";
import BlogManagement from "./admin/blogs/BlogList";
import UserManagement from "./admin/users/UserList";
import ContactManagement from "./admin/contact/ContactMessages";
import SiteSettings from "./admin/settings/SiteSettings";
import ContentManagement from "./admin/content/ContentManagement";
import DestinationsManagement from "./admin/content/DestinationsManagement";
import ActivitiesManagement from "./admin/content/ActivitiesManagement";
import ServicesManagement from "./admin/content/ServicesManagement";
import SeasonsManagement from "./admin/content/SeasonsManagement";
import BlogForm from "./admin/blogs/BlogForm";
import TourManagement from "./admin/tours/TourManagement";
import TestimonialsManagement from "./admin/testimonials/TestimonialsManagement";
import Login from "./pages/Login";
import RequireAdminAuth from "./components/auth/RequireAdminAuth";
import RequireRole from "./components/auth/RequireRole";
import { useAuth } from "./context/useAuth";

/* ===== ADMIN PROFILE COMPONENTS (New) ===== */
import MyProfile from "./admin/profile/MyProfile";
import AccountSettings from "./admin/profile/AccountSettings";
import ActivityLog from "./admin/profile/ActivityLog";
import Notifications from "./admin/notifications/Notifications";
import PublicLayout from "./layouts/PublicLayout";

const RouteRevealObserver = () => {
  const location = useLocation();

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll("[data-ql-reveal]"));
    if (!elements.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [location.pathname]);
  return null;
};

const RouteScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname, location.search, location.hash]);

  return null;
};

const AdminIndexGate = () => {
  const { user } = useAuth();
  if (user?.role === "Editor") return <ContentManagement fixedType="activity" />;
  return <DashboardHome />;
};

const App = () => {
  return (
    <Router>
      <RouteScrollToTop />
      <RouteRevealObserver />
      <Routes>
        {/* ========== ADMIN DASHBOARD (Nested Routes) ========== */}
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <RequireAdminAuth>
              <AdminLayout />
            </RequireAdminAuth>
          }
        >
          <Route index element={<AdminIndexGate />} />

          {/* Profile Section Routes */}
          <Route path="profile/MyProfile" element={<MyProfile />} />
          <Route path="profile/AccountSettings" element={<AccountSettings />} />
          <Route path="profile/ActivityLog" element={<ActivityLog />} />

          <Route path="bookings" element={<RequireRole roles={["Admin"]} fallback="/admin/content"><BookingManagement /></RequireRole>} />
          <Route path="bookings/:id" element={<RequireRole roles={["Admin"]} fallback="/admin/content"><BookingDetails /></RequireRole>} />
          <Route path="tours" element={<TourManagement />} />
          <Route path="gallery" element={<GalleryManagement />} />
          <Route path="blogs" element={<BlogManagement />} />
          <Route path="blogs/new" element={<BlogForm />} />
          <Route path="blogs/edit/:id" element={<BlogForm />} />
          <Route path="testimonials" element={<TestimonialsManagement />} />
          <Route path="users" element={<RequireRole roles={["Admin"]} fallback="/admin/content"><UserManagement /></RequireRole>} />
          <Route path="contacts" element={<RequireRole roles={["Admin"]} fallback="/admin/content"><ContactManagement /></RequireRole>} />
          <Route path="content" element={<ContentManagement />} />
          <Route path="destinations" element={<DestinationsManagement />} />
          <Route path="activities" element={<ActivitiesManagement />} />
          <Route path="services" element={<ServicesManagement />} />
          <Route path="seasons" element={<SeasonsManagement />} />
          <Route path="settings" element={<RequireRole roles={["Admin"]} fallback="/admin/content"><SiteSettings /></RequireRole>} />
          <Route path="notifications" element={<RequireRole roles={["Admin"]} fallback="/admin/content"><Notifications /></RequireRole>} />
        </Route>

        {/* ========== PUBLIC WEBSITE ========== */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="tours" element={<Tours />} />
          <Route path="blog" element={<Blog />} />
          <Route path="about" element={<About />} />
          <Route path="careers" element={<Careers />} />
          <Route path="activities" element={<Activities />} />
          <Route path="activities/:slug" element={<ActivityDetails />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:slug" element={<ServiceDetails />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="guidelines" element={<Guidelines />} />
          <Route path="faqs" element={<Faqs />} />
          <Route path="help" element={<HelpCenter />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsOfService />} />
          <Route path="blog/:slug" element={<BlogDetails />} />
          <Route path="contact" element={<Contact />} />
          <Route path="tours/:slug" element={<TourDetails />} />
          <Route path="destinations" element={<DestinationsPage />} />
          <Route path="destinations/:slug" element={<DestinationDetails />} />
          <Route path="seasons/:slug" element={<SeasonDetails />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="custom-plan-request" element={<CustomPlanRequest />} />
          <Route path="book" element={<Booking />} />
          <Route path="book/:tourId" element={<Booking />} />
          <Route path="custom-booking" element={<Booking />} />
          <Route path="payment/success" element={<PaymentStatus mode="success" />} />
          <Route path="payment/cancel" element={<PaymentStatus mode="cancel" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;



