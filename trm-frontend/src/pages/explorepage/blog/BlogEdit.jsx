// BlogEditPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../utils/apiUtiles";
import BlogCreate from "./BlogCreate";
import { useAuth } from "../../../context/AuthContext";
import Loader from "../../../components/common/Loader";
import toast from "react-hot-toast";

const BlogEditPage = () => {
  const { id } = useParams();
  const {  user,loading: authL } = useAuth();
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {

      if (authL) return;

      try {
        const res = await api.get(`/blogs/${id}`, {
          // headers: { Authorization: `Bearer ${user.token}` },
        });

        if (res.data.success) {
          const blog = res.data.data;

          // Only author or admin can edit draft or ready blogs
          if (
            blog.status === "draft" &&
            blog.author._id !== user._id &&
            user.role !== "Admin"
          ) {
            toast.error("You cannot edit this draft blog");
            navigate("/blogs/my-blogs");
            return;
          }

          setBlogData(blog);
        } else {
          toast.error("Blog not found");
          navigate("/blogs/my-blogs");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch blog");
        navigate("/blogs/my-blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id,  user, navigate, authL]);

  if (loading) return <Loader fullscreen />;

  if (!blogData) return null; // wait until blogData is fetched

  return <BlogCreate initialData={blogData} />;
};

export default BlogEditPage;

