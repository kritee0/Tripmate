import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";

import Landing from "../pages/user/Landingpage";
import Register from "../pages/user/Register";
import Login from "../pages/user/Login";
import Homepage from "../pages/user/HomePage";
import ExplorePage from "../pages/explorepage/Explore";
import RecommendationPage from "../pages/explorepage/recommendation/Recommendationpage";
import BlogCreatePage from "../pages/explorepage/blog/Blogcreate";
import BlogEdit from "../pages/explorepage/blog/BlogEdit";
import BlogList from "../pages/explorepage/blog/BlogList";

import CategoryPage from "../components/home/Categorypages";



import SearchResults from "../components/Place/SearchResult";
import Places from "../components/Place/Places";
import PlaceDetail from "../components/Place/PlaceDetail";

import TravelJourney from "../components/TravelJourney/Card/TravelJourney";
import TravelPackages from "../pages/travelpackagepage/TravelPackages";
import BookingForm from "../pages/travelpackagepage/BookingForm";


import Dashboard from "../pages/user/Dashboard";
import AgencyForm from "../components/agency/pages/AgencyForm"; 
import AgencyDashboard from "../components/agency/pages/AgencyDashboard";
import ManagePackage from "../components/agency/pages/MangePackage";
import ManageProfile from "../components/agency/pages/Profile"
import ManageUser from "../pages/admin/ManageUser";
import ManageAgencies from "../pages/admin/ManageAgencies";
import ManagePlaces from "../pages/admin/ManagePlaces";
import ManageBookings from "../components/agency/pages/Booking ";
import AdminDashboard from "../pages/admin/AdminDashboard";
import SidebarWrapper from "../pages/admin/SideBarWrapper";

import ManageRecommendation from "../pages/admin/AdminRecommendation"
import ManageBlogs from "../pages/admin/ManageBlogs";
import BlogDetails from "../pages/explorepage/blog/BlogDetails";





const PageRoutes = () => {
  return (
    <Routes>
    
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route path="/homepage" element={<MainLayout><Homepage /></MainLayout>} />
      <Route path="/places" element={<MainLayout><Places /></MainLayout>} />
      <Route path="/places/:id" element={<MainLayout><PlaceDetail /></MainLayout>} />
       <Route path="/category/:category" element={<CategoryPage />} />
      <Route path="/search" element={<MainLayout><SearchResults /></MainLayout>} />
      <Route path="/journey" element={<MainLayout><TravelJourney /></MainLayout>} />
      <Route path="/packages" element={<MainLayout><TravelPackages /></MainLayout>} />

      <Route path="/packages/:id" element={<MainLayout>< TravelPackages/></MainLayout>} />

      <Route path="/my-bookings" element={<MainLayout><BookingForm /></MainLayout>} />
      

     
    
      <Route path="/explore" element={<MainLayout><ExplorePage /></MainLayout>} />
       <Route path="/explore/recommendplace" element={<MainLayout><RecommendationPage /></MainLayout>} />
        <Route path="/blogs/create" element={<MainLayout><BlogCreatePage /></MainLayout>} />
        <Route path="/edit-blog/:id" element={<BlogEdit />} />
       

         <Route path="/blogs/my-blogs" element={<MainLayout><BlogList /></MainLayout>} />
         <Route path="/blogs/:id" element={<BlogDetails />} />
      
      
      
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/agency" element={<AgencyDashboard />} />
      <Route path="/dashboard/agency/form" element={<AgencyForm />} />
      
       <Route path="/agency/manage-booking" element={<ManageBookings />} />
      <Route path="/agency/manage-package" element={<ManagePackage />} />
      <Route path="/agency/manage-profile" element={<ManageProfile />} />

      <Route path="/admin/dashboard" element={ <AdminDashboard />} />
      <Route path="/admin/manage-agencies" element={<SidebarWrapper><ManageAgencies /></SidebarWrapper>} />
      <Route path="/admin/manage-places" element={<SidebarWrapper><ManagePlaces /></SidebarWrapper> }/>
      <Route path="/admin/manage-user" element={<SidebarWrapper><ManageUser /></SidebarWrapper>} />
       
        <Route path="/admin/manage-recommendation" element={<SidebarWrapper><ManageRecommendation /></SidebarWrapper>} />
         <Route path="/admin/manage-blogs" element={<SidebarWrapper><ManageBlogs /></SidebarWrapper>} />
      
     
    </Routes>
  );
};

export default PageRoutes;


