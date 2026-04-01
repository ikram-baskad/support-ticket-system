// src/hooks/useTicketForm.js
import { useState } from "react";
import { TICKET_PRIORITY, TICKET_CATEGORY } from "../constants/ticket.constants";

const INITIAL_FORM = {
  title:       "",
  description: "",
  category:    TICKET_CATEGORY.TECHNICAL,
  priority:    TICKET_PRIORITY.MEDIUM,
  assignedTo:  "",
};

const INITIAL_ERRORS = {
  title:       "",
  description: "",
  category:    "",
};

// Validation rules — pure functions, easy to test
const validators = {
  title: (value) => {
    if (!value.trim())           return "Title is required.";
    if (value.trim().length < 5) return "Title must be at least 5 characters.";
    if (value.length > 120)      return "Title must be under 120 characters.";
    return "";
  },
  description: (value) => {
    if (!value.trim())            return "Description is required.";
    if (value.trim().length < 20) return "Please describe your issue in more detail (min 20 characters).";
    if (value.length > 1000)      return "Description must be under 1000 characters.";
    return "";
  },
  category: (value) => {
    if (!value) return "Please select a category.";
    return "";
  },
};

export function useTicketForm() {
  const [form, setForm]     = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [touched, setTouched] = useState({});

  // Update a single field
  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // If field was already touched, re-validate live as they type
    if (touched[field]) {
      const error = validators[field]?.(value) ?? "";
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  // Validate on blur
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validators[field]?.(form[field]) ?? "";
    setErrors((prev) => ({ ...prev, [field]: error }));
  };



  // Validate all fields before submit
  const validateAll = () => {
    const newErrors = {
      title:       validators.title(form.title),
      description: validators.description(form.description),
      category:    validators.category(form.category),
    };
    setErrors(newErrors);
    setTouched({ title: true, description: true, category: true });
    return !Object.values(newErrors).some(Boolean); // true = valid
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setErrors(INITIAL_ERRORS);
    setTouched({});
  };

  return {
    form,
    errors,
    touched,
    setField,
    handleBlur,
    validateAll,
    resetForm,
    descriptionLength: form.description.length,
  };
}