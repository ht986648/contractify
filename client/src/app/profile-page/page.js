"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Mail,
  Calendar,
  MapPin,
  Globe,
  User,
  Camera,
  ArrowLeft,
} from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const token = Cookies.get("authToken");
  const userType =
    typeof window !== "undefined" ? localStorage.getItem("userType") : null;
  const [isHovered, setIsHovered] = useState(false);
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
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [token, userType]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <p className="text-gray-500 text-lg">Loading Profile...</p>
      </div>
    );
  }

  // Function to get initials if no profile image
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  return (
    <div className="min-h-screen bg-white pb-12">
      <div className="max-w-4xl mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center space-x-2 text-blue-700 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="text-lg font-medium">Back to Dashboard</span>
        </button>

        {/* Profile Card */}
        <div className="bg-white shadow-md rounded-lg p-8 flex flex-col md:flex-row items-center md:items-start md:space-x-6 border border-gray-200">
          {/* Profile Picture / Initials */}
          <div
            className="relative flex items-center justify-center w-[120px] h-[120px] rounded-full border-4 border-gray-300 shadow-md cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {user.profileImage ? (
              <Image
                src={user.profileImage}
                alt="Profile Photo"
                width={120}
                height={120}
                className="rounded-full"
              />
            ) : (
              <div className="w-full h-full bg-yellow-500 text-white flex items-center justify-center text-4xl font-bold rounded-full">
                {getInitials(user.name)}
              </div>
            )}
            {/* Edit Icon on Hover */}
            {isHovered && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <Camera className="text-white w-8 h-8" />
              </div>
            )}
          </div>

          <div className="mt-4 md:mt-0 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-500 capitalize mt-1">
              Role : {userType === "contractor" ? "Contractor" : "Contractee"}
            </p>
          </div>
        </div>

        {/* User Details Section */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {/* Email */}
          <DetailCard
            icon={<Mail className="text-blue-500 h-7 w-7" />}
            label="Email"
            value={user.email}
          />

          {/* Date of Birth */}
          <DetailCard
            icon={<Calendar className="text-purple-500 h-7 w-7" />}
            label="Date of Birth"
            value={
              user.dob
                ? new Date(user.dob).toLocaleDateString()
                : "Not provided"
            }
          />

          {/* Gender */}
          <DetailCard
            icon={<User className="text-pink-500 h-7 w-7" />}
            label="Gender"
            value={user.gender || "Not specified"}
          />

          {/* Address */}
          <DetailCard
            icon={<MapPin className="text-green-500 h-7 w-7" />}
            label="Address"
            value={user.address || "Not provided"}
          />

          {/* Pincode */}
          <DetailCard
            icon={<Globe className="text-yellow-500 h-7 w-7" />}
            label="Pincode"
            value={user.pincode || "Not available"}
          />

          {/* City */}
          <DetailCard
            icon={<Globe className="text-orange-500 h-7 w-7" />}
            label="City"
            value={user.city || "Not available"}
          />

          {/* State */}
          <DetailCard
            icon={<Globe className="text-indigo-500 h-7 w-7" />}
            label="State"
            value={user.state || "Not available"}
          />

          {/* Email Verified */}
          <DetailCard
            icon={
              <Mail
                className={`h-7 w-7 ${
                  user.emailVerified ? "text-green-500" : "text-red-500"
                }`}
              />
            }
            label="Email Verified"
            value={user.emailVerified ? "Yes" : "No"}
          />
        </div>

        {/* Edit Profile Button */}
        <div className="mt-8 text-center">
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            onClick={() => router.push("/edit-profile")}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

// Detail Card Component
const DetailCard = ({ icon, label, value }) => (
  <div className="bg-white shadow-md rounded-lg p-5 flex items-center space-x-4 border border-gray-200">
    {icon}
    <div>
      <h3 className="text-lg font-semibold text-gray-700">{label}</h3>
      <p className="text-gray-600">{value}</p>
    </div>
  </div>
);
