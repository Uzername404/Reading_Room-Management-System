import { useState } from "react";

const useReturnModals = () => {
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "",
    resourceId: "",
    title: "",
  });
  const [selectedReturnRecord, setSelectedReturnRecord] = useState(null);

  // Open the Return Resource modal
  const handleReturnModal = (record = null) => {
    if (record) {
      setFormData({
        studentId: record.studentId,
        resourceId: record.resourceId,
        title: record.title,
      });
      setSelectedReturnRecord(record);
    } else {
      setFormData({
        studentId: "",
        resourceId: "",
        title: "",
      });
      setSelectedReturnRecord(null);
    }
    setShowReturnModal(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setShowReturnModal(false);
    setSelectedReturnRecord(null);
  };

  // Save the return data
 const handleSaveReturn = async () => {
  try {
    const { borrow_record_id, condition_notes } = formData;

    // Validate that required fields are not empty
    if (!borrow_record_id || !condition_notes) {
      setError("Please fill in all required fields.");
      return;
    }

    // Send the correct data structure
    const returnData = {
      borrow_record_id, // Ensure this matches the backend's expected field name
      condition_notes,  // This should be the notes entered in the textarea
    };

    // Call the API to create the return record
    await returnService.create(returnData);

    // Close modal and reload data
    handleCloseModal();
    fetchReturns();
  } catch (err) {
    setError("Failed to save return record");
  }
};

  return {
    showReturnModal,
    formData,
    setFormData,
    handleReturnModal,
    handleCloseModal,
    handleSaveReturn,
  };
};

export default useReturnModals;
