// src/pages/CreateTicket/CreateTicket.jsx
import { useState } from "react";
import { Button, GeneralSuccessNotification, GeneralDangerNotification } from "noplin-uis";
import { useTicketForm }      from "../../hooks/useTicketForm";
import { useSimilarTickets }  from "../../hooks/useSimilarTickets";
import { useTickets }         from "../../hooks/useTickets";
import { useUserContext }     from "../../context/UserContext";
import { getAgents }          from "../../data/users.data";
import { FormField }          from "../../components/common/FormField";
import { StatusBadge }        from "../../components/common/StatusBadge";
import { PriorityBadge }      from "../../components/common/PriorityBadge";
import {
  TICKET_CATEGORY,
  TICKET_PRIORITY,
  TICKET_STATUS,
} from "../../constants/ticket.constants";
import styles from "./CreateTicket.module.css";

export function CreateTicket({ onNavigate }) {
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { addTicket }      = useTickets();
  const { currentUser }    = useUserContext();
  const {
    form, errors, 
    setField, handleBlur,
    validateAll, resetForm,
    descriptionLength,
  } = useTicketForm();

  const agents = getAgents();

  const similarTickets = useSimilarTickets(form.title);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submit triggered");
    
    // Check validation
    const isValid = validateAll();
    console.log("Validation result:", isValid);
    console.log("Current form value:", form);
    console.log("Current errors:", errors);
    
    if (!isValid) {
      const errorMessages = Object.entries(errors)
        .filter(([, msg]) => msg)
        .map(([field, msg]) => `${field}: ${msg}`)
        .join(" | ");
      console.error("Validation errors:", errorMessages);
      setErrorMsg(`❌ ${errorMessages || "Please fill all required fields correctly."}`);
      return;
    }
    
    setErrorMsg("");
    console.log("Creating ticket with data:", {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      priority: form.priority,
      assignedTo: form.assignedTo || null,
      createdBy: currentUser.id,
    });

    const newId = addTicket({
      title:       form.title.trim(),
      description: form.description.trim(),
      category:    form.category,
      priority:    form.priority,
      status:      TICKET_STATUS.OPEN,
      assignedTo:  form.assignedTo || null,
      createdBy:   currentUser.id,
      tags:        [],
    });

    console.log("Ticket created with ID:", newId);

    if (newId) {
      setSuccessMsg("✓ Ticket submitted successfully! Redirecting...");
      resetForm();
      setTimeout(() => {
        console.log("Navigating to detail page for ticket:", newId);
        onNavigate("detail", newId);
      }, 1500);
    } else {
      setErrorMsg("❌ Failed to create ticket. Please try again.");
      console.error("addTicket returned null or undefined");
    }
  };

  const handleCancel = () => {
    resetForm();
    onNavigate("dashboard");
  };

  return (
    <div className={styles.page}>

      {/* Back navigation */}
      <button className={styles.backBtn} onClick={handleCancel}>
        ← Back to Dashboard
      </button>

      <div className={styles.card}>

        <div className={styles.cardHeader}>
          <h1 className={styles.title}>Submit a Support Ticket</h1>
          <p className={styles.subtitle}>
            We typically respond within 2 business hours.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className={styles.form}>

          {successMsg && (
            <GeneralSuccessNotification message={successMsg} />
          )}
          {errorMsg && (
            <GeneralDangerNotification message={errorMsg} />
          )}

          {/* Title */}
          <FormField label="Title" required error={errors.title}>
            <input
              className={`${styles.input} ${errors.title ? styles.inputError : ""}`}
              type="text"
              placeholder="Short summary of your issue"
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              onBlur={() => handleBlur("title")}
              maxLength={120}
            />
          </FormField>

          {/* Similar tickets suggestion */}
          {similarTickets.length > 0 && (
            <div className={styles.similarBox}>
              <p className={styles.similarTitle}>
                💡 Similar tickets already exist — yours may already be addressed:
              </p>
              <ul className={styles.similarList}>
                {similarTickets.map((t) => (
                  <li key={t.id} className={styles.similarItem}>
                    <button
                      type="button"
                      className={styles.similarLink}
                      onClick={() => onNavigate("detail", t.id)}
                    >
                      <span className={styles.similarId}>{t.id}</span>
                      <span className={styles.similarTicketTitle}>{t.title}</span>
                    </button>
                    <div className={styles.similarBadges}>
                      <StatusBadge status={t.status} />
                      <PriorityBadge priority={t.priority} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Description */}
          <FormField
            label="Description"
            required
            error={errors.description}
            hint="Include steps to reproduce, error messages, and your account ID if relevant."
          >
            <div className={styles.textareaWrapper}>
              <textarea
                className={`${styles.textarea} ${errors.description ? styles.inputError : ""}`}
                placeholder="Describe your issue in detail..."
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                onBlur={() => handleBlur("description")}
                rows={5}
                maxLength={1000}
              />
              <span className={`${styles.charCount} ${
                descriptionLength > 900 ? styles.charCountWarn : ""
              }`}>
                {descriptionLength} / 1000
              </span>
            </div>
          </FormField>

          {/* Category + Priority row */}
          <div className={styles.row}>

            <FormField label="Category" required error={errors.category}>
              <select
                className={styles.select}
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
                onBlur={() => handleBlur("category")}
              >
                <option value={TICKET_CATEGORY.TECHNICAL}>Technical</option>
                <option value={TICKET_CATEGORY.BILLING}>Billing</option>
                <option value={TICKET_CATEGORY.ACCOUNT}>Account</option>
                <option value={TICKET_CATEGORY.ONBOARDING}>Onboarding</option>
                <option value={TICKET_CATEGORY.OTHER}>Other</option>
              </select>
            </FormField>

            <FormField label="Priority">
              <select
                className={styles.select}
                value={form.priority}
                onChange={(e) => setField("priority", e.target.value)}
              >
                <option value={TICKET_PRIORITY.LOW}>Low</option>
                <option value={TICKET_PRIORITY.MEDIUM}>Medium</option>
                <option value={TICKET_PRIORITY.HIGH}>High</option>
                <option value={TICKET_PRIORITY.CRITICAL}>Critical</option>
              </select>
            </FormField>

          </div>

          {/* Assign to Agent */}
          <FormField
            label="Assign to Agent"
            hint="Select an agent to handle this ticket (optional)"
          >
            <select
              className={styles.select}
              value={form.assignedTo}
              onChange={(e) => setField("assignedTo", e.target.value)}
            >
              <option value="">No agent assigned yet</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </FormField>

          {/* Actions */}
          <div className={styles.actions}>
            <Button
              type="button"
              style={{ background: "#fff", color: "#6b7280", border: "1px solid #e5e7eb" }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <button
              type="submit"
              style={{
                background: "#4F6EF7",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Submit Ticket →
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}