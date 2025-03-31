"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BellIcon, MenuIcon, XIcon, SearchIcon, CheckIcon } from "lucide-react";
import Cookies from "js-cookie";

export default function Navbar({ contractorName }) {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("authToken");
      if (!token) return;

      const response = await fetch(`${API_URL}/api/notifications`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = Cookies.get("authToken");
      if (!token) return;

      const response = await fetch(
        `${API_URL}/api/notifications/markNotificationsAsRead`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      // Update the UI by removing the read notification or updating its status
      setNotifications(
        notifications.filter((notif) => notif._id !== notificationId)
      );

      // Optionally navigate to the contract if clicked
      // const notification = notifications.find((n) => n._id === notificationId);
      // if (notification) {
      //   router.push(`/contracts/${notification.contractId}`);
      // }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const token = Cookies.get("authToken");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`${API_URL}/api/auth/logOut`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout request failed");
      }

      const data = await response.json();
      if (data.status === "Success") {
        localStorage.clear();
        Cookies.remove("authToken");
        Cookies.remove("userType");
        router.push("/");
      } else {
        throw new Error(data.error || "Logout failed");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Format the timestamp to a more readable format
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden focus:outline-none"
            >
              {isMenuOpen ? (
                <XIcon className="h-6 w-6 text-gray-700" />
              ) : (
                <MenuIcon className="h-6 w-6 text-gray-700" />
              )}
            </button>

            {/* Styled Text Logo */}
            <h1 className="text-2xl font-bold text-gray-800 cursor-pointer">
              Contractify
            </h1>
          </div>

          {/* Center - Search Bar */}
          <div className="hidden md:flex relative w-64">
            <input
              type="text"
              placeholder="Search contracts..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          </div>

          {/* Right Section - Profile & Notifications */}
          <div className="flex items-center space-x-4">
            {/* Notifications Bell */}
            <div className="relative">
              <button
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileDropdownOpen(false);
                }}
              >
                <BellIcon className="h-6 w-6 text-gray-700" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg max-h-96 overflow-y-auto">
                  <div className="p-3 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Notifications
                    </h3>
                  </div>

                  {loading ? (
                    <div className="p-4 text-center text-gray-500">
                      Loading notifications...
                    </div>
                  ) : notifications.length > 0 ? (
                    <div>
                      {notifications.map((notification) => (
                        <div
                          key={notification._id}
                          className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                          onClick={() => markAsRead(notification._id)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatTime(notification.createdAt)}
                              </p>
                            </div>
                            <button
                              className="ml-2 p-1 hover:bg-gray-200 rounded-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification._id);
                              }}
                            >
                              <CheckIcon className="h-4 w-4 text-gray-500" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No new notifications
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsProfileDropdownOpen(!isProfileDropdownOpen);
                  setIsNotificationsOpen(false);
                }}
                className="flex items-center space-x-2 focus:outline-none"
              >
                {/* Profile Placeholder with Initial */}
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-500 text-white font-bold text-lg border border-gray-300">
                  {contractorName
                    ? contractorName.charAt(0).toUpperCase()
                    : "?"}
                </div>

                <span className="hidden md:block text-gray-700 font-medium">
                  {contractorName}
                </span>
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg transition-transform duration-200">
                  <button
                    onClick={() => router.push("/profile-page")}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-md py-2">
            <Link
              href="/dashboard"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Dashboard
            </Link>
            <Link
              href="/contracts"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Contracts
            </Link>
            <Link
              href="/analytics"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Analytics
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
