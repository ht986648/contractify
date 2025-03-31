"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Calendar, MapPin, Globe, User, Loader } from "lucide-react";
import Cookies from "js-cookie";

export default function EditProfilePage() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = Cookies.get("authToken");
  const userType =
    typeof window !== "undefined" ? localStorage.getItem("userType") : null;
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token || !userType) return;

      try {
        const endpoint =
          userType === "contractor"
            ? "/profile/getContractorProfile"
            : "/profile/getContracteeProfile";

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api${endpoint}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await res.json();
        setUser(data.user);

        // Populate form with existing user details
        setFormData({
          name: data.user.name || "",
          dob: data.user.dob
            ? new Date(data.user.dob).toISOString().split("T")[0]
            : "",
          gender: data.user.gender || "",
          address: data.user.address || "",
          pincode: data.user.pincode || "",
          city: data.user.city || "",
          state: data.user.state || "",
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [token, userType]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formattedDob = formData.dob
        ? new Date(formData.dob).toISOString().split("T")[0]
        : "";

      const requestData = {
        ...formData,
        dob: formattedDob, // Ensure correct date format
      };
      const endpoint =
        userType === "contractor"
          ? "/profile/editContractorProfile"
          : "/profile/editContracteeProfile";

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify(requestData),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to update profile");
      }

      // Show success message before redirecting
      alert("Profile updated successfully!");

      router.push("/profile-page"); // Redirect after successful update
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <Loader className="animate-spin text-gray-500 w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-3xl mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => router.push("/profile-page")}
          className="text-blue-600  flex items-center mb-6"
        >
          ← Back to Profile
        </button>

        {/* Edit Profile Form */}
        <div className="bg-white shadow-md rounded-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Edit Profile
          </h2>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="grid gap-4">
            {/* Name */}
            <InputField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />

            {/* Date of Birth */}
            <InputField
              label="Date of Birth"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
            />

            {/* Gender */}
            <div>
              <label className="block text-gray-700 font-medium">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-md text-black"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Address */}
            <InputField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />

            {/* Pincode */}
            <InputField
              label="Pincode"
              name="pincode"
              type="number"
              value={formData.pincode}
              onChange={handleChange}
            />

            {/* City */}
            <InputField
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />

            {/* State */}
            <InputField
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
            />

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Reusable Input Component
const InputField = ({ label, name, type = "text", value, onChange }) => (
  <div>
    <label className="block text-gray-700 font-medium">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full mt-1 p-2 border rounded-md text-black"
    />
  </div>
);
