"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CalendarIcon,
  PlusIcon,
  SaveIcon,
  ArrowLeftIcon,
  XIcon,
} from "lucide-react";
import Navbar from "../components/dashboard/Navbar";
import SignatureModal from "../components/SignatureModal";
import { FileSignature } from "lucide-react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export default function EditContractPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditContract />
    </Suspense>
  );
}
const EditContract = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contractId = searchParams.get("id");

  const [formData, setFormData] = useState({
    contractCategory: "",
    contractor: "",
    contractee: "",
    contractorEmail: "",
    contracteeEmail: "",
    contractValue: "",
    contractCreationDate: new Date().toISOString().split("T")[0],
    startDate: "",
    endDate: "",
    contractDescription: "",
    contractorSignature: {
      digital: "",
      photo: "",
    },
  });
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [customFields, setCustomFields] = useState([]);
  const [errors, setErrors] = useState({});
  const [wordCount, setWordCount] = useState(0);
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

  useEffect(() => {
    const name = localStorage.getItem("userName");
    console.log(name);
    setContractorName(name);
  }, []);

  // Fetch contract data when component mounts
  useEffect(() => {
    if (!contractId) {
      console.error("Contract ID is missing");
      router.push("/dashboard");
      return;
    }

    const fetchContractData = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/contracts/getContract/${contractId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch contract data");
        }

        const data = await response.json();
        console.log("Fetched contract data:", data);

        // The contract object is nested inside the response
        const contractData = data.contract;

        // Extract custom fields from the dynamicFields object
        const customFieldsArray = contractData.dynamicFields
          ? Object.entries(contractData.dynamicFields).map(
              ([field, value]) => ({ field, value })
            )
          : [];

        setCustomFields(customFieldsArray);

        // Update form data with the fetched contract data
        setFormData({
          contractCategory: contractData.contractCategory || "",
          contractor: contractData.contractor || "",
          contractee: contractData.contractee || "",
          contractorEmail: contractData.contractorEmail || "",
          contracteeEmail: contractData.contracteeEmail || "",
          contractValue: contractData.contractValue || "",
          contractCreationDate:
            contractData.contractCreationDate?.split("T")[0] ||
            new Date().toISOString().split("T")[0],
          startDate: contractData.startDate?.split("T")[0] || "",
          endDate: contractData.endDate?.split("T")[0] || "",
          contractDescription: contractData.contractDescription || "",
          contractorSignature: contractData.contractorSignature || {
            digital: "",
            photo: "",
          },
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching contract data:", error);
        alert("Failed to load contract data. Redirecting to dashboard.");
        router.push("/dashboard");
      }
    };
    fetchContractData();
  }, [contractId, router, API_URL]);

  // Count words in description
  useEffect(() => {
    const words = formData.contractDescription.trim()
      ? formData.contractDescription.trim().split(/\s+/).length
      : 0;
    setWordCount(words);
  }, [formData.contractDescription]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for the field being changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const saveSignature = (signatureImage, type = "digital") => {
    setFormData({
      ...formData,
      contractorSignature: {
        ...formData.contractorSignature,
        [type]: signatureImage,
      },
    });

    // Clear any signature error if it exists
    if (errors.signature) {
      setErrors({
        ...errors,
        signature: "",
      });
    }
  };

  const addCustomField = () => {
    setCustomFields([...customFields, { field: "", value: "" }]);
  };

  const updateCustomField = (index, key, value) => {
    const updatedFields = [...customFields];
    updatedFields[index][key] = value;
    setCustomFields(updatedFields);
  };

  const removeCustomField = (index) => {
    const updatedFields = [...customFields];
    updatedFields.splice(index, 1);
    setCustomFields(updatedFields);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loader

    // Basic validation
    const newErrors = {};
    if (!formData.contractCategory)
      newErrors.contractCategory = "Contract category is required";
    if (!formData.contractor)
      newErrors.contractor = "Contractor name is required";
    if (!formData.contractee)
      newErrors.contractee = "Contractee name is required";
    if (!formData.contracteeEmail)
      newErrors.contracteeEmail = "Contractee email is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (
      !formData.contractorSignature.digital &&
      !formData.contractorSignature.photo
    ) {
      newErrors.signature = "Signature is required";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      formData.contractorEmail &&
      !emailRegex.test(formData.contractorEmail)
    ) {
      newErrors.contractorEmail = "Invalid email format";
    }
    if (
      formData.contracteeEmail &&
      !emailRegex.test(formData.contracteeEmail)
    ) {
      newErrors.contracteeEmail = "Invalid email format";
    }

    // Date validation
    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.startDate) > new Date(formData.endDate)
    ) {
      newErrors.endDate = "End date must be after start date";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false); // Stop loader if errors exist
      return;
    }

    // Form is valid, prepare payload with custom fields
    let payload = { ...formData };

    // Add custom fields to payload
    customFields.forEach((field) => {
      if (field.field && field.field.trim()) {
        payload[field.field] = field.value;
      }
    });

    console.log("Submitting updated contract form with payload:", payload);

    try {
      const response = await fetch(
        `${API_URL}/api/contracts/editContract/${contractId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          credentials: "include",
        }
      );

      console.log("Response status:", response.status);
      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (response.ok) {
        alert("Contract updated successfully!");
        router.push("/dashboard");
      } else {
        alert(
          `Failed to update contract: ${
            responseData.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error updating contract:", error);
      alert("An error occurred while updating the contract. Please try again.");
    } finally {
      setLoading(false); // Stop loader after response
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto'></div>
          <p className='mt-4 text-lg text-gray-700'>Loading contract data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar contractorName={contractorName} />
      <main className='pt-16 sm:pt-20 px-3 sm:px-6 lg:px-8 max-w-4xl mx-auto pb-12'>
        {/* Header */}
        <div className='flex items-center gap-4 mb-6'>
          <button
            onClick={() => router.push("/dashboard")}
            className='inline-flex items-center justify-center p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors'
          >
            <ArrowLeftIcon className='h-5 w-5 text-gray-600' />
          </button>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-800'>
            Edit Contract
          </h1>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className='bg-white rounded-xl shadow-lg p-4 sm:p-6'
        >
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
            {/* Contract Category */}
            <div>
              <label
                htmlFor='contractCategory'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Contract Category*
              </label>
              <select
                id='contractCategory'
                name='contractCategory'
                value={formData.contractCategory}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.contractCategory ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value=''>Select a category</option>
                <option value='Service'>Service</option>
                <option value='Employment'>Employment</option>
                <option value='Sales'>Sales</option>
                <option value='Rental'>Rental</option>
                <option value='License'>License</option>
                <option value='Partnership'>Partnership</option>
                <option value='Other'>Other</option>
              </select>
              {errors.contractCategory && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.contractCategory}
                </p>
              )}
            </div>

            {/* Contract Value */}
            <div>
              <label
                htmlFor='contractValue'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Contract Value
              </label>
              <input
                type='text'
                id='contractValue'
                name='contractValue'
                value={formData.contractValue}
                onChange={handleChange}
                placeholder='Enter contract value'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <p className='mt-1 text-xs text-gray-500'>
                {!formData.contractValue &&
                  "If no value is specified, N/A will be displayed"}
              </p>
            </div>

            {/* Contractor Name */}
            <div>
              <label
                htmlFor='contractor'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Contractor Name*
              </label>
              <input
                type='text'
                id='contractor'
                name='contractor'
                value={formData.contractor}
                onChange={handleChange}
                placeholder='Enter contractor name'
                className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.contractor ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.contractor && (
                <p className='mt-1 text-sm text-red-500'>{errors.contractor}</p>
              )}
            </div>

            {/* Contractee Name */}
            <div>
              <label
                htmlFor='contractee'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Contractee Name*
              </label>
              <input
                type='text'
                id='contractee'
                name='contractee'
                value={formData.contractee}
                onChange={handleChange}
                placeholder='Enter contractee name'
                className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.contractee ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.contractee && (
                <p className='mt-1 text-sm text-red-500'>{errors.contractee}</p>
              )}
            </div>

            {/* Contractor Email */}
            <div>
              <label
                htmlFor='contractorEmail'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Contractor Email*
              </label>
              <input
                type='email'
                disabled
                id='contractorEmail'
                name='contractorEmail'
                value={formData.contractorEmail}
                onChange={handleChange}
                placeholder={email}
                className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.contractorEmail ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.contractorEmail && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.contractorEmail}
                </p>
              )}
            </div>

            {/* Contractee Email */}
            <div>
              <label
                htmlFor='contracteeEmail'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Contractee Email*
              </label>
              <input
                type='email'
                id='contracteeEmail'
                name='contracteeEmail'
                value={formData.contracteeEmail}
                onChange={handleChange}
                placeholder='Enter contractee email'
                className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.contracteeEmail ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.contracteeEmail && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.contracteeEmail}
                </p>
              )}
            </div>

            {/* Creation Date */}
            <div>
              <label
                htmlFor='contractCreationDate'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Creation Date
              </label>
              <div className='relative'>
                <input
                  type='date'
                  id='contractCreationDate'
                  name='contractCreationDate'
                  value={formData.contractCreationDate}
                  onChange={handleChange}
                  readOnly
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 bg-gray-100 cursor-not-allowed'
                />
                <CalendarIcon className='absolute right-3 top-2.5 h-5 w-5 text-gray-400' />
              </div>
              <p className='mt-1 text-xs text-gray-500'>
                Original creation date (cannot be modified)
              </p>
            </div>

            {/* Start Date */}
            <div>
              <label
                htmlFor='startDate'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Start Date*
              </label>
              <div className='relative'>
                <input
                  type='date'
                  id='startDate'
                  name='startDate'
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.startDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <CalendarIcon className='absolute right-3 top-2.5 h-5 w-5 text-gray-400' />
              </div>
              {errors.startDate && (
                <p className='mt-1 text-sm text-red-500'>{errors.startDate}</p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label
                htmlFor='endDate'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                End Date*
              </label>
              <div className='relative'>
                <input
                  type='date'
                  id='endDate'
                  name='endDate'
                  value={formData.endDate}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.endDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <CalendarIcon className='absolute right-3 top-2.5 h-5 w-5 text-gray-400' />
              </div>
              {errors.endDate && (
                <p className='mt-1 text-sm text-red-500'>{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className='mt-6'>
            <label
              htmlFor='contractDescription'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Description
            </label>
            <textarea
              id='contractDescription'
              name='contractDescription'
              value={formData.contractDescription}
              onChange={handleChange}
              rows={4}
              placeholder='Enter contract description'
              className='w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            ></textarea>
            <p className='mt-1 text-xs text-gray-500'>
              {wordCount} / 30 words {wordCount > 30 ? "(Exceeds limit)" : ""}
              <br />
              Please keep the description concise within 30 words
            </p>
          </div>

          {/* Custom Fields */}
          <div className='mt-6'>
            <div className='flex justify-between items-center mb-2'>
              <h3 className='text-lg font-medium text-gray-800'>
                Custom Fields
              </h3>
              <button
                type='button'
                onClick={addCustomField}
                className='inline-flex items-center justify-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <PlusIcon className='h-4 w-4' />
                Add Field
              </button>
            </div>

            {customFields.length === 0 && (
              <p className='text-sm text-gray-500 italic'>
                No custom fields added yet
              </p>
            )}

            <div className='space-y-3 mt-3'>
              {customFields.map((field, index) => (
                <div key={index} className='flex items-center gap-3'>
                  <div className='flex-1'>
                    <input
                      type='text'
                      value={field.field}
                      onChange={(e) =>
                        updateCustomField(index, "field", e.target.value)
                      }
                      placeholder='Field name'
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                  <div className='flex-1'>
                    <input
                      type='text'
                      value={field.value}
                      onChange={(e) =>
                        updateCustomField(index, "value", e.target.value)
                      }
                      placeholder='Field value'
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                  <button
                    type='button'
                    onClick={() => removeCustomField(index)}
                    className='p-2 text-gray-400 hover:text-red-500 focus:outline-none'
                  >
                    <XIcon className='h-5 w-5' />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Signature Section */}
          <div className='mt-6'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Your Signature*
            </label>
            <div className='border rounded-lg border-gray-300 p-4'>
              {formData.contractorSignature.digital ||
              formData.contractorSignature.photo ? (
                <div className='flex items-center justify-between'>
                  <div>
                    <img
                      src={
                        formData.contractorSignature.digital ||
                        formData.contractorSignature.photo
                      }
                      alt='Your signature'
                      className='h-16 border rounded p-1'
                    />
                  </div>
                  <button
                    type='button'
                    onClick={() => setShowSignatureModal(true)}
                    className='text-sm text-blue-600 hover:text-blue-800'
                  >
                    Change Signature
                  </button>
                </div>
              ) : (
                <button
                  type='button'
                  onClick={() => setShowSignatureModal(true)}
                  className='flex items-center gap-2 text-blue-600 hover:text-blue-800 py-2 px-3 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors'
                >
                  <FileSignature className='h-5 w-5' />
                  Add Signature
                </button>
              )}
              {errors.signature && (
                <p className='mt-1 text-sm text-red-500'>{errors.signature}</p>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className='mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4'>
            <button
              type='submit'
              disabled={loading}
              className={`flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md flex items-center justify-center gap-2 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <svg
                  className='animate-spin h-5 w-5 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8v4l3-3m-3 3l-3-3'
                  ></path>
                </svg>
              ) : (
                <>
                  <SaveIcon className='h-5 w-5' />
                  Update Contract
                </>
              )}
            </button>

            <button
              type='button'
              onClick={() => router.push("/dashboard")}
              className='flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center gap-2'
            >
              Cancel
            </button>
          </div>

          {/* Signature Modal */}
          <SignatureModal
            isOpen={showSignatureModal}
            onClose={() => setShowSignatureModal(false)}
            onSave={saveSignature}
          />
        </form>
      </main>
    </div>
  );
};
