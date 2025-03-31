"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
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
  FileSignature,
} from "lucide-react";
import SignatureModal from "../components/SignatureModal";

const statusColors = {
  Active: {
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
  Rejected: { bg: "bg-red-100", text: "text-red-800", indicator: "bg-red-500" },
  "Signed by Contractor": {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    indicator: "bg-yellow-500",
  },
};

const CheckContractPage = () => {
  const [email, setEmail] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [isContractor, setIsContractor] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureImage, setSignatureImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [status, setStatus] = useState("Signed by Contractor");
  const [successMsg, setSuccessMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setEmail(decoded.email);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.error("No token found");
    }
  }, []);

  useEffect(() => {
    if (!email) return;
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const uri = `${API_URL}/api/contracts/getContracts/${email}`;
    fetch(uri, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        setContracts(data.contracts || []);
      })
      .catch((error) => {
        console.error("Error fetching contracts:", error);
      });
  }, [email]);

  useEffect(() => {
    setFilteredContracts(
      contracts.filter((contract) => contract.status === "Signed by Contractor")
    );
  }, [contracts]);

  useEffect(() => {
    const userType = localStorage.getItem("userType");

    if (userType === "contractor") {
      setIsContractor(true);
    }
  }, []);

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

  const handleSignContract = async (signatureImage, type = "digital") => {
    if (!selectedContract || !signatureImage) {
      setErrorMsg("Signature is required to sign the contract.");
      return;
    }

    setLoading(true); // Show loading state
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(
        `${API_URL}/api/contracts/signContractByContractee`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            contractId: selectedContract._id,
            contracteeSignature: signatureImage,
          }),
        }
      );

      console.log("Signing Contract Successfully..");

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to sign the contract");
      }
      const response_pdf = await fetch(
        `${API_URL}/api/contracts/generatePDF/${selectedContract._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
        );
        if (!response_pdf.ok) {
            const data = await response.json();
            throw new Error(data.message || "Failed to sign the contract");
          }
      setLoading(false); // Hide loader immediately
      alert(
        "Contract signed successfully! It is now active, and you can download it."
      );

      // Redirect quickly after alert
      router.push("/dashboard");

      // Reset modal and contract state
      setShowSignatureModal(false);
      setIsModalOpen(false);
      setSelectedContract(null);
    } catch (error) {
      setLoading(false); // Hide loader in case of error
      setErrorMsg(
        error.message || "An error occurred while signing the contract."
      );
    }
  };

  const signContract = () => {
    router.push("/sign-contract");
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto p-6">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Contracts Ready to be Signed
        </h2>

        {/* Contracts List */}
        <div className="space-y-4">
          {filteredContracts.length === 0 ? (
            <p className="text-center text-gray-500">
              No contracts available for signing.
            </p>
          ) : (
            filteredContracts.map((contract) => {
              const statusColor =
                statusColors[contract.status] || statusColors.Pending;

              return (
                <div
                  key={contract._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-102 transition-all hover:shadow-xl w-full"
                  onClick={() => openContractModal(contract)}
                >
                  <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {contract.contractCategory}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${statusColor.bg} ${statusColor.text}`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${statusColor.indicator}`}
                      ></span>
                      <span>{contract.status || "Unknown"}</span>
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-gray-500 truncate">
                        {contract.contractee}
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {contract.contractValue === "NA"
                          ? ""
                          : `₹${contract.contractValue}`}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {contract.contractDescription}
                    </p>
                  </div>
                  <div className="bg-gray-50 px-4 py-2 text-sm text-gray-500 flex justify-between">
                    <span className="text-blue-600">View details</span>
                    <span>
                      {new Date(contract.startDate).toLocaleDateString("en-GB")}{" "}
                      - {new Date(contract.endDate).toLocaleDateString("en-GB")}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      {isModalOpen && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-0">
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-3 sm:p-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate max-w-[80%]">
                {selectedContract.contractCategory}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <XIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              {/* Status banner */}
              <div
                className={`mb-4 sm:mb-6 p-2 sm:p-3 rounded-lg ${
                  statusColors[selectedContract.status].bg
                }`}
              >
                <div className="flex items-center">
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
                    {selectedContract.status}
                  </span>
                </div>
              </div>

              {/* Contract details grid - responsive layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-500 flex items-center gap-2">
                      <UserIcon className="h-3 w-3 sm:h-4 sm:w-4" /> Client
                    </h3>
                    <p className="mt-1 text-base sm:text-lg font-medium text-gray-900 break-words">
                      {selectedContract.contractee}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-500 flex items-center gap-2">
                      <UserIcon className="h-3 w-3 sm:h-4 sm:w-4" /> Contractor
                    </h3>
                    <p className="mt-1 text-base sm:text-lg font-medium text-gray-900 break-words">
                      {selectedContract.contractor}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-500 flex items-center gap-2">
                      <IndianRupeeIcon className="h-3 w-3 sm:h-4 sm:w-4" />{" "}
                      Contract Value
                    </h3>
                    <p className="mt-1 text-base sm:text-lg font-medium text-gray-900">
                      {selectedContract.contractValue}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-500 flex items-center gap-2">
                      <ClipboardIcon className="h-3 w-3 sm:h-4 sm:w-4" />{" "}
                      Description
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-gray-700">
                      {selectedContract.contractDescription}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action buttons - responsive layout */}
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                {!isContractor && (
                  <button
                    type="button"
                    onClick={() => setShowSignatureModal(true)}
                    className={`w-full sm:flex-1 items-center gap-2 py-2 px-3 border rounded-lg transition-colors ${
                      loading
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "text-blue-600 hover:text-blue-800 border-blue-300 hover:bg-blue-50"
                    }`}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin h-5 w-5 mr-2"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          ></path>
                        </svg>
                        Signing...
                      </span>
                    ) : (
                      "Sign Contract"
                    )}
                  </button>
                )}

                {/* {selectedContract.status !== "Active" && (
                    <button className="w-full sm:flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm">
                      Activate Contract
                    </button>
                  )} */}
              </div>

              {/* Timeline section - more responsive */}
              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-5">
                  Contract Timeline
                </h3>
                <div className="space-y-4 sm:space-y-5">
                  {/* Contract Creation Date */}
                  <div className="flex items-start">
                    <div>
                      <div className="flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-green-200 text-green-900 mr-3 sm:mr-4">
                        <CheckIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div className="h-full w-0.5 bg-gray-300 ml-4 sm:ml-5 mt-1"></div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm sm:text-base font-semibold text-gray-700">
                        Contract Created
                      </h4>
                      <p className="text-sm sm:text-base font-medium text-gray-900">
                        {new Date(
                          selectedContract.contractCreationDate
                        ).toLocaleDateString("en-GB")}
                      </p>
                      <p className="text-xs sm:text-sm mt-1 text-gray-600">
                        Initial contract draft created and shared with
                        stakeholders.
                      </p>
                    </div>
                  </div>

                  {/* Contract Start Date */}
                  <div className="flex items-start">
                    <div>
                      <div className="flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-blue-200 text-blue-900 mr-3 sm:mr-4">
                        <PenToolIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div className="h-full w-0.5 bg-gray-300 ml-4 sm:ml-5 mt-1"></div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm sm:text-base font-semibold text-gray-700">
                        Contract Start Date
                      </h4>
                      <p className="text-sm sm:text-base font-medium text-gray-900">
                        {new Date(
                          selectedContract.startDate
                        ).toLocaleDateString("en-GB")}
                      </p>
                      <p className="text-xs sm:text-sm mt-1 text-gray-600">
                        Contract starts and becomes effective.
                      </p>
                    </div>
                  </div>

                  {/* Contract End Date */}
                  <div className="flex items-start">
                    <div>
                      <div className="flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-purple-200 text-purple-900 mr-3 sm:mr-4">
                        <ActivityIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm sm:text-base font-semibold text-gray-700">
                        Contract End Date
                      </h4>
                      <p className="text-sm sm:text-base font-medium text-gray-900">
                        {new Date(selectedContract.endDate).toLocaleDateString(
                          "en-GB"
                        )}
                      </p>
                      <p className="text-xs sm:text-sm mt-1 text-gray-600">
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
      <SignatureModal
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onSave={handleSignContract}
      />
    </div>
  );
};

export default CheckContractPage;
