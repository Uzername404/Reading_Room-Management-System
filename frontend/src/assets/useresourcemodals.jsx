
import { useState } from "react";

const useResourceModals = (updateResources) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    type: "",
    year: "",
    status: "Available",
  });
  const [selectedResource, setSelectedResource] = useState(null);

  const handleAddResourceModal = () => {
    setShowAddModal(true);
    setFormData({
      title: "",
      author: "",
      type: "",
      year: "",
      status: "Available",
    });
  };

  const handleEditResourceModal = (resource) => {
    setSelectedResource(resource);
    setFormData({
      title: resource.title,
      author: resource.author,
      type: resource.type,
      year: resource.year,
      status: resource.status,
    });
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
  };

  const handleSaveResource = () => {
    const { title, author, type, year, status } = formData;
  
    if (!title || !author || !type || !year || !status) {
      alert("Please fill out all required fields.");
      return;
    }
  
    if (showAddModal) {
      console.log("Saving new resource:", formData);
      // Save logic here (You can add new resource to resources)
    } else if (showEditModal) {
      console.log("Updating resource:", selectedResource?.id, formData);
      updateResources(selectedResource?.id, formData); // Update the resource using callback
    }
  
    handleCloseModal();
  };
  
  return {
    showAddModal,
    showEditModal,
    formData,
    setFormData,
    handleAddResourceModal,
    handleEditResourceModal,
    handleCloseModal,
    handleSaveResource,
  };
};

export default useResourceModals;
