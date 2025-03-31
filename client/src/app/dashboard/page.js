"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

import {
  PlusIcon,
  FileTextIcon,
  BarChartIcon,
  ClockIcon,
  FilterIcon,
  XIcon,
  CalendarIcon,
  UserIcon,
  DollarSignIcon,
  TagIcon,
  CheckIcon,
  PenToolIcon,
  ActivityIcon,
  ClipboardIcon,
  IndianRupeeIcon,
  CheckCircle,
} from "lucide-react";
import FeaturesSlider from "../components/dashboard/FeaturesSlider";
import Navbar from "../components/dashboard/Navbar";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [email, setEmail] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [statusCounts, setStatusCounts] = useState({});
  const [isContractor, setIsContractor] = useState(false);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  // In your first useEffect where you decode the token
  useEffect(() => {
    fetch(`${API_URL}/api/auth/get-token`, {
      method: "GET",
      credentials: "include", // Ensure cookies are sent
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          console.log("Token received from backend:", data.token);
          const decoded = jwtDecode(data.token);
          console.log("Decoded token:", decoded);
          setEmail(decoded.email);
        } else {
          console.log("No token received");
        }
      })
      .catch((error) => console.log("Error fetching token:", error));
  }, []);

  const [contractorName, setContractorName] = useState("");

  // Separate useEffect to wait for email to be set
  useEffect(() => {
    const token = Cookies.get("authToken"); // Ensure the correct cookie name
    if (!token) {
      // If no token exists, redirect to login immediately
      router.push("/");
      return;
    }
    if (!email) {
      console.log("Email is required");
      return;
    }

    console.log(
      "Making API request to:",
      `${API_URL}/api/contracts/getContracts/${email}`
    );
    const uri = `${API_URL}/api/contracts/getContracts/${email}`;
    fetch(uri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // This is critical - it includes cookies in the request
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("API Response:", data);
        setContracts(data.contracts);
        setFilteredContracts(data.contracts);
        calculateStatusCounts(data.contracts);
        if (data.contracts.length > 0) {
          setContractorName(
            isContractor
              ? data.contracts[0].contractor
              : data.contracts[0].contractee || "N/A"
          );
        }
      })
      .catch((error) => {
        console.log("Error fetching contracts:", error);
      });
    console.log(contracts);
  }, [email]);

  //useEffect for updating expired contracts
  useEffect(() => {
    console.log("Updating expired contracts...");

    fetch(`${API_URL}/api/contracts/updateContractStatusToExpired`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Ensures cookies are sent if needed
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Expired contracts updated:", data);
      })
      .catch((error) => {
        console.log("Error updating expired contracts:", error);
      });
  }, []);

  //useEffect for userType to change dashboard
  useEffect(() => {
    const userType = localStorage.getItem("userType");

    if (userType === "contractor") {
      setIsContractor(true);
    }
  }, []);

  const calculateStatusCounts = (contracts) => {
    const counts = contracts.reduce((acc, contract) => {
      acc[contract.status] = (acc[contract.status] || 0) + 1;
      return acc;
    }, {});
    setStatusCounts(counts);
  };

  const filterContracts = (status) => {
    setStatusFilter(status);

    if (status === "All") {
      setFilteredContracts(contracts);
    } else if (status === "Active") {
      setFilteredContracts(
        contracts.filter((contract) => contract.status === "Ongoing")
      );
    } else if (status === "Expired") {
      setFilteredContracts(
        contracts.filter((contract) => new Date(contract.endDate) < new Date())
      );
    } else {
      setFilteredContracts(
        contracts.filter((contract) => contract.status === status)
      );
    }
  };

  // const expiredContracts = contracts.filter(
  //   (contract) => new Date(contract.endDate) < new Date()
  // ).length;

  const handleCreateContract = () => {
    // TODO: Implement create contract logic
    console.log("Trying to set user name");
    console.log(contractorName);
    localStorage.setItem("userName", contractorName);

    router.push("/create-contract");

    // alert("Create Contract Functionality");
  };

  const seeContractsReadyTobeSigned = () => {
    router.push("/check-contract");
  };

  const [filter, setFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  const openContractModal = (contract) => {
    setSelectedContract(contract);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedContract(null);
  };

  const downloadfunc = () => {
    fetch(`${API_URL}/api/contracts/downloadPDF/${selectedContract._id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // This is critical - it includes cookies in the request
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("API Response:", data.pdfurl);
        window.open(data.pdfurl);
      })
      .catch((error) => {
        console.log("Error fetching contracts:", error);
      });
  };

  // Status colors mapping
  const statusColors = {
    Active: {
      bg: "bg-green-100",
      text: "text-green-800",
      indicator: "bg-green-500",
    },
    Accepted: {
      bg: "bg-green-100",
      text: "text-green-800",
      indicator: "bg-green-500",
    },
    Pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      indicator: "bg-yellow-500",
    },
    Expired: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      indicator: "bg-gray-500",
    },
    Rejected: {
      bg: "bg-red-100",
      text: "text-red-800",
      indicator: "bg-red-500",
    },
    "Signed by Contractor": {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      indicator: "bg-yellow-500",
    },
    "Signed by Contractee": {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      indicator: "bg-yellow-500",
    },
    "Signed by Both": {
      bg: "bg-green-100",
      text: "text-green-800",
      indicator: "bg-green-500",
    },
    Ongoing: {
      bg: "bg-green-100",
      text: "text-green-800",
      indicator: "bg-green-500",
    },
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar contractorName={contractorName} />
      <main className='pt-16 sm:pt-20 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto'>
        {/* Header with responsive layout */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8'>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-800'>
            Dashboard
          </h1>
          {isContractor ? (
            <button
              onClick={handleCreateContract}
              className='w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg 
          hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 
          focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg'
            >
              <PlusIcon className='h-5 w-5' />
              Create New Contract
            </button>
          ) : (
            <button
              onClick={seeContractsReadyTobeSigned}
              className='w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg 
          hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 
          focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg'
            >
              <CheckCircle className='h-5 w-5' />
              Contracts Ready to be Signed
            </button>
          )}
        </div>

        {/* Grid with responsive columns */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
          {/* Recent Contracts */}
          <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
            <div className='flex items-center justify-between p-3 sm:p-4 border-b'>
              <h2 className='text-lg sm:text-xl font-semibold text-gray-800'>
                Recent Contracts
              </h2>
              <FileTextIcon className='h-5 w-5 sm:h-6 sm:w-6 text-gray-500' />
            </div>
            <div className='divide-y'>
              {contracts
                .map((contract) => ({
                  ...contract,
                  startDate: new Date(contract.startDate),
                }))
                .sort((a, b) => b.startDate - a.startDate) // Sort by most recent start date
                .slice(0, 3) // Show only the latest 3
                .map((contract) => (
                  <div
                    key={contract._id}
                    className='px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-50 transition-colors flex justify-between items-center cursor-pointer'
                    onClick={() => openContractModal(contract)}
                  >
                    <div className='overflow-hidden'>
                      <p className='font-medium text-gray-800 truncate'>
                        {contract.contractCategory || "No Category"}
                      </p>
                      <p className='text-xs sm:text-sm text-gray-500 truncate'>
                        {contract.contractee || "No Contractee"}
                      </p>
                    </div>
                    <div className='flex items-center flex-shrink-0 ml-2'>
                      <span className='text-xs sm:text-sm font-semibold mr-2 whitespace-nowrap'>
                        ₹{contract.contractValue || "N/A"}
                      </span>
                      <span
                        className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs flex items-center gap-1 ${
                          statusColors[contract.status]?.bg || "bg-gray-200"
                        } ${
                          statusColors[contract.status]?.text || "text-gray-800"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                            statusColors[contract.status]?.indicator ||
                            "bg-gray-400"
                          }`}
                        ></span>
                        <span className='hidden xs:inline'>
                          {contract.status || "Unknown"}
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Contract Analytics */}
          <div className='bg-white rounded-xl shadow-lg p-3 sm:p-4'>
            <div className='flex items-center justify-between mb-3 sm:mb-4'>
              <h2 className='text-lg sm:text-xl font-semibold text-gray-800'>
                Contract Analytics
              </h2>
              <BarChartIcon className='h-5 w-5 sm:h-6 sm:w-6 text-gray-500' />
            </div>
            <div className='grid grid-cols-2 gap-2 sm:gap-4'>
              <div className='bg-blue-50 p-2 sm:p-4 rounded-lg text-center'>
                <p className='text-xs sm:text-sm text-gray-600'>
                  Total Contracts
                </p>
                <p className='text-xl sm:text-2xl font-bold text-blue-600'>
                  {contracts.length}
                </p>
              </div>
              <div className='bg-green-50 p-2 sm:p-4 rounded-lg text-center'>
                <p className='text-xs sm:text-sm text-gray-600'>
                  Active Contracts
                </p>
                <p className='text-xl sm:text-2xl font-bold text-green-600'>
                  {statusCounts["Ongoing"] || 0}
                </p>
              </div>
              <div className='bg-yellow-50 p-2 sm:p-4 rounded-lg text-center'>
                <p className='text-xs sm:text-sm text-gray-600'>Pending</p>
                <p className='text-xl sm:text-2xl font-bold text-yellow-600'>
                  {statusCounts["Signed by Contractor"] || 0}
                </p>
              </div>
              <div className='bg-red-50 p-2 sm:p-4 rounded-lg text-center'>
                <p className='text-xs sm:text-sm text-gray-600'>Expired</p>
                <p className='text-xl sm:text-2xl font-bold text-red-600'>
                  {statusCounts["Expired"] || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Upcoming Renewals */}
          <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
            <div className='flex items-center justify-between p-3 sm:p-4 border-b'>
              <h2 className='text-lg sm:text-xl font-semibold text-gray-800'>
                Upcoming Renewals
              </h2>
              <ClockIcon className='h-5 w-5 sm:h-6 sm:w-6 text-gray-500' />
            </div>
            <div className='divide-y'>
              {contracts
                .map((contract) => {
                  const today = new Date(); // Get today's date
                  today.setHours(0, 0, 0, 0); // Normalize to midnight for accurate comparison

                  const endDate = new Date(contract.endDate);
                  endDate.setHours(0, 0, 0, 0); // Normalize time

                  const daysLeft = Math.ceil(
                    (endDate - today) / (1000 * 60 * 60 * 24)
                  ); // Calculate remaining days

                  return { ...contract, daysLeft }; // Attach daysLeft to contract object
                })
                .filter((contract) => contract.daysLeft > 0) // Only contracts expiring in 30 days
                .sort((a, b) => a.daysLeft - b.daysLeft) // Sort by nearest expiry
                .slice(0, 3) // Show only top 3
                .map((contract) => (
                  <div
                    key={contract._id}
                    className='px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-50 transition-colors flex justify-between items-center cursor-pointer'
                    onClick={() => openContractModal(contract)}
                  >
                    <div className='overflow-hidden'>
                      <p className='font-medium text-gray-800 truncate'>
                        {contract.contractCategory || "No Category"}
                      </p>
                      <p className='text-xs sm:text-sm text-gray-500 truncate'>
                        {contract.contractee || "No Contractee"}
                      </p>
                    </div>
                    <span
                      className={`ml-2 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs whitespace-nowrap ${
                        contract.daysLeft <= 20
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {contract.daysLeft} days
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Enhanced Contract Filter */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-8 mb-8'>
          <h2 className='text-xl font-semibold text-gray-800'>
            Contract Management
          </h2>
          <div className='w-full sm:w-auto flex items-center gap-2'>
            <div className='w-full sm:w-auto flex rounded-lg overflow-hidden shadow-md'>
              <button
                className={`flex-1 px-2 sm:px-4 py-2 text-xs sm:text-sm ${
                  filter === "All"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } transition-colors`}
                onClick={() => {
                  setFilter("All");
                  filterContracts("All"); // Pass "All", not filter
                }}
              >
                All
              </button>

              <button
                className={`flex-1 px-2 sm:px-4 py-2 text-xs sm:text-sm ${
                  filter === "Active"
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } transition-colors`}
                onClick={() => {
                  setFilter("Active");
                  filterContracts("Active"); // Corrected from "Signed by Both"
                }}
              >
                Active
              </button>

              <button
                className={`flex-1 px-2 sm:px-4 py-2 text-xs sm:text-sm ${
                  filter === "Pending"
                    ? "bg-yellow-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } transition-colors`}
                onClick={() => {
                  setFilter("Pending");
                  filterContracts("Signed by Contractor"); // Pass actual status
                }}
              >
                Pending
              </button>

              <button
                className={`flex-1 px-2 sm:px-4 py-2 text-xs sm:text-sm ${
                  filter === "Rejected"
                    ? "bg-red-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } transition-colors`}
                onClick={() => {
                  setFilter("Rejected");
                  filterContracts("Rejected");
                }}
              >
                Rejected
              </button>

              <button
                className={`flex-1 px-2 sm:px-4 py-2 text-xs sm:text-sm ${
                  filter === "Expired"
                    ? "bg-gray-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } transition-colors`}
                onClick={() => {
                  setFilter("Expired");
                  filterContracts("Expired");
                }}
              >
                Expired
              </button>
            </div>
          </div>
        </div>

        {/* Display Contracts with responsive grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4'>
          {filteredContracts.map((contract) => {
            const statusColor = statusColors[contract.status] || {
              bg: "bg-gray-100",
              text: "text-gray-800",
              indicator: "bg-gray-500",
            }; // Fallback if status is missing

            return (
              <div
                key={contract._id}
                className='bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-102 transition-all hover:shadow-xl'
                onClick={() => openContractModal(contract)}
              >
                <div className='flex items-center justify-between p-3 sm:p-4 border-b'>
                  <h3 className='font-semibold text-gray-800 truncate max-w-[70%]'>
                    {contract.contractCategory}
                  </h3>
                  <span
                    className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs flex items-center gap-1 whitespace-nowrap ${statusColor.bg} ${statusColor.text}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${statusColor.indicator}`}
                    ></span>
                    <span className='xs:inline'>
                      {contract.status || "Unknown"}
                    </span>
                  </span>
                </div>
                <div className='p-3 sm:p-4'>
                  <div className='flex justify-between items-center mb-2'>
                    <p className='text-xs sm:text-sm text-gray-500 truncate max-w-[70%]'>
                      {contract.contractee}
                    </p>
                    <p className='text-xs sm:text-sm font-semibold text-gray-800'>
                      {contract.contractValue === "NA"
                        ? " "
                        : `₹${contract.contractValue}`}
                    </p>
                  </div>
                  <p className='text-xs text-gray-500 truncate'>
                    {contract.contractDescription}
                  </p>
                </div>
                <div className='bg-gray-50 px-3 sm:px-4 py-1.5 sm:py-2 text-xs text-gray-500 flex flex-col xs:flex-row justify-between items-start xs:items-center gap-1'>
                  <span className='text-blue-600'>View details</span>
                  <span className='text-xs whitespace-nowrap'>
                    {new Date(contract.startDate).toLocaleDateString("en-GB")} -{" "}
                    {new Date(contract.endDate).toLocaleDateString("en-GB")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contract Detail Modal - Responsive improvements */}
        {isModalOpen && selectedContract && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-0'>
            <div
              className='bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'
              onClick={(e) => e.stopPropagation()}
            >
              <div className='flex justify-between items-center p-3 sm:p-4 border-b sticky top-0 bg-white z-10'>
                <h2 className='text-lg sm:text-xl font-bold text-gray-800 truncate max-w-[80%]'>
                  {selectedContract.contractCategory}
                </h2>
                <button
                  onClick={closeModal}
                  className='text-gray-500 hover:text-gray-700 focus:outline-none'
                >
                  <XIcon className='h-5 w-5 sm:h-6 sm:w-6' />
                </button>
              </div>

              <div className='p-4 sm:p-6'>
                {/* Status banner */}
                <div
                  className={`mb-4 sm:mb-6 p-2 sm:p-3 rounded-lg ${
                    statusColors[selectedContract.status].bg
                  }`}
                >
                  <div className='flex items-center'>
                    <span
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                        statusColors[selectedContract.status].indicator
                      } mr-2`}
                    ></span>
                    <span
                      className={`text-sm font-medium ${
                        statusColors[selectedContract.status].text
                      }`}
                    >
                      {selectedContract.status} Contract
                    </span>
                  </div>
                </div>

                {/* Contract details grid - responsive layout */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
                  <div className='space-y-3 sm:space-y-4'>
                    <div>
                      <h3 className='text-xs sm:text-sm font-medium text-gray-500 flex items-center gap-2'>
                        <UserIcon className='h-3 w-3 sm:h-4 sm:w-4' /> Client
                      </h3>
                      <p className='mt-1 text-base sm:text-lg font-medium text-gray-900 break-words'>
                        {selectedContract.contractee}
                      </p>
                    </div>
                    <div>
                      <h3 className='text-xs sm:text-sm font-medium text-gray-500 flex items-center gap-2'>
                        <UserIcon className='h-3 w-3 sm:h-4 sm:w-4' />{" "}
                        Contractor
                      </h3>
                      <p className='mt-1 text-base sm:text-lg font-medium text-gray-900 break-words'>
                        {selectedContract.contractor}
                      </p>
                    </div>

                    <div>
                      <h3 className='text-xs sm:text-sm font-medium text-gray-500 flex items-center gap-2'>
                        <IndianRupeeIcon className='h-3 w-3 sm:h-4 sm:w-4' />{" "}
                        Contract Value
                      </h3>
                      <p className='mt-1 text-base sm:text-lg font-medium text-gray-900'>
                        {selectedContract.contractValue}
                      </p>
                    </div>
                    <div>
                      <h3 className='text-xs sm:text-sm font-medium text-gray-500 flex items-center gap-2'>
                        <ClipboardIcon className='h-3 w-3 sm:h-4 sm:w-4' />{" "}
                        Description
                      </h3>
                      <p className='mt-1 text-xs sm:text-sm text-gray-700'>
                        {selectedContract.contractDescription}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action buttons - responsive layout */}
                <div className='mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4'>
                  {isContractor &&
                    selectedContract.status === "Signed by Contractor" && (
                      <button
                      onClick={() => {
                        localStorage.setItem("editContract", JSON.stringify(selectedContract));
                        router.push(`/edit-contract?id=${selectedContract._id}`);
                      }}
                      className='w-full sm:flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm'
                    >
                      Edit Contract
                    </button>
                    )}
                  {selectedContract.status === "Ongoing" && (
                    <button
                      onClick={downloadfunc}
                      className='w-full sm:flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm'
                    >
                      Download PDF
                    </button>
                  )}
                  {/* {selectedContract.status !== "Active" && (
                    <button className="w-full sm:flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm">
                      Activate Contract
                    </button>
                  )} */}
                </div>

                {/* Timeline section - more responsive */}
                <div className='mt-6 sm:mt-8 pt-4 sm:pt-6 border-t'>
                  <h3 className='text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-5'>
                    Contract Timeline
                  </h3>
                  <div className='space-y-4 sm:space-y-5'>
                    {/* Contract Creation Date */}
                    <div className='flex items-start'>
                      <div>
                        <div className='flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-green-200 text-green-900 mr-3 sm:mr-4'>
                          <CheckIcon className='h-4 w-4 sm:h-5 sm:w-5' />
                        </div>
                        <div className='h-full w-0.5 bg-gray-300 ml-4 sm:ml-5 mt-1'></div>
                      </div>
                      <div className='flex-1'>
                        <h4 className='text-sm sm:text-base font-semibold text-gray-700'>
                          Contract Created
                        </h4>
                        <p className='text-sm sm:text-base font-medium text-gray-900'>
                          {new Date(
                            selectedContract.contractCreationDate
                          ).toLocaleDateString("en-GB")}
                        </p>
                        <p className='text-xs sm:text-sm mt-1 text-gray-600'>
                          Initial contract draft created and shared with
                          stakeholders.
                        </p>
                      </div>
                    </div>

                    {/* Contract Start Date */}
                    <div className='flex items-start'>
                      <div>
                        <div className='flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-blue-200 text-blue-900 mr-3 sm:mr-4'>
                          <PenToolIcon className='h-4 w-4 sm:h-5 sm:w-5' />
                        </div>
                        <div className='h-full w-0.5 bg-gray-300 ml-4 sm:ml-5 mt-1'></div>
                      </div>
                      <div className='flex-1'>
                        <h4 className='text-sm sm:text-base font-semibold text-gray-700'>
                          Contract Start Date
                        </h4>
                        <p className='text-sm sm:text-base font-medium text-gray-900'>
                          {new Date(
                            selectedContract.startDate
                          ).toLocaleDateString("en-GB")}
                        </p>
                        <p className='text-xs sm:text-sm mt-1 text-gray-600'>
                          Contract starts and becomes effective.
                        </p>
                      </div>
                    </div>

                    {/* Contract End Date */}
                    <div className='flex items-start'>
                      <div>
                        <div className='flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-purple-200 text-purple-900 mr-3 sm:mr-4'>
                          <ActivityIcon className='h-4 w-4 sm:h-5 sm:w-5' />
                        </div>
                      </div>
                      <div className='flex-1'>
                        <h4 className='text-sm sm:text-base font-semibold text-gray-700'>
                          Contract End Date
                        </h4>
                        <p className='text-sm sm:text-base font-medium text-gray-900'>
                          {new Date(
                            selectedContract.endDate
                          ).toLocaleDateString("en-GB")}
                        </p>
                        <p className='text-xs sm:text-sm mt-1 text-gray-600'>
                          Contract ends and will no longer be in effect.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
