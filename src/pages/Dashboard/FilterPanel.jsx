// src/pages/Dashboard/FilterPanel.jsx
import { useFilters } from "../../hooks/useFilters";
import { useUserContext } from "../../context/UserContext";
import {
  TICKET_STATUS,
  TICKET_PRIORITY,
  TICKET_CATEGORY,
} from "../../constants/ticket.constants";
import styles from "./FilterPanel.module.css";

export function FilterPanel() {
  const { filters, sortBy, setFilter, setSort, resetFilters, activeFilterCount } = useFilters();
  const { allUsers } = useUserContext();
  const agents = allUsers.filter(u => u.role === "agent" || u.role === "admin");

  return (
    <div className={styles.panel}>

      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>Filters</span>
        {activeFilterCount > 0 && (
          <button className={styles.resetBtn} onClick={resetFilters}>
            Reset ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Search */}
      <div className={styles.group}>
        <label className={styles.label}>Search</label>
        <input
          className={styles.input}
          type="text"
          placeholder="Title, ID, description..."
          value={filters.search}
          onChange={(e) => setFilter("search", e.target.value)}
        />
      </div>

      {/* Status */}
      <FilterSelect
        label="Status"
        value={filters.status}
        onChange={(v) => setFilter("status", v)}
        options={[
          { value: "all", label: "All Statuses" },
          { value: TICKET_STATUS.OPEN,        label: "Open"        },
          { value: TICKET_STATUS.IN_PROGRESS, label: "In Progress" },
          { value: TICKET_STATUS.RESOLVED,    label: "Resolved"    },
          { value: TICKET_STATUS.CLOSED,      label: "Closed"      },
        ]}
      />

      {/* Priority */}
      <FilterSelect
        label="Priority"
        value={filters.priority}
        onChange={(v) => setFilter("priority", v)}
        options={[
          { value: "all", label: "All Priorities" },
          { value: TICKET_PRIORITY.CRITICAL, label: "Critical" },
          { value: TICKET_PRIORITY.HIGH,     label: "High"     },
          { value: TICKET_PRIORITY.MEDIUM,   label: "Medium"   },
          { value: TICKET_PRIORITY.LOW,      label: "Low"      },
        ]}
      />

      {/* Category */}
      <FilterSelect
        label="Category"
        value={filters.category}
        onChange={(v) => setFilter("category", v)}
        options={[
          { value: "all",                       label: "All Categories" },
          { value: TICKET_CATEGORY.BILLING,     label: "Billing"        },
          { value: TICKET_CATEGORY.TECHNICAL,   label: "Technical"      },
          { value: TICKET_CATEGORY.ACCOUNT,     label: "Account"        },
          { value: TICKET_CATEGORY.ONBOARDING,  label: "Onboarding"     },
          { value: TICKET_CATEGORY.OTHER,       label: "Other"          },
        ]}
      />

      {/* Assigned To */}
      <FilterSelect
        label="Assigned To"
        value={filters.assignedTo}
        onChange={(v) => setFilter("assignedTo", v)}
        options={[
          { value: "all", label: "Anyone" },
          { value: "unassigned", label: "Unassigned" },
          ...agents.map(a => ({ value: a.id, label: a.name })),
        ]}
      />

      {/* Sort */}
      <FilterSelect
        label="Sort By"
        value={sortBy}
        onChange={setSort}
        options={[
          { value: "newest",   label: "Newest First"  },
          { value: "oldest",   label: "Oldest First"  },
          { value: "priority", label: "By Priority"   },
        ]}
      />

    </div>
  );
}

// Reusable select — extracted to avoid repetition
function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className={styles.group}>
      <label className={styles.label}>{label}</label>
      <select
        className={styles.select}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}