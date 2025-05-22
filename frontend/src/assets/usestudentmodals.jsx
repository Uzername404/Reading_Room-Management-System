import { useState } from "react";

const useStudentModals = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    gradeLevel: "",
    section: "",
    status: "Active",
  });
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Open the Add Student modal
  const handleAddStudentModal = () => {
    setFormData({ 
      name: "",
      gradeLevel: "",
      section: "",
      status: "Active",
    });
    setShowAddModal(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setShowAddModal(false);
    setSelectedStudent(null);
  };

  // Save the student data
  const handleSaveStudent = () => {
    const { name, gradeLevel, section, status } = formData;

    // Validate form data
    if (!name || !gradeLevel || !section || !status) {
      alert("Please fill out all fields.");
      return;
    }

    console.log("Saving student:", formData);

    // Close the modal after saving
    handleCloseModal();
  };

  return {
    showAddModal,
    formData,
    setFormData,
    handleAddStudentModal,
    handleCloseModal,
    handleSaveStudent,
  };
};

export default useStudentModals;
