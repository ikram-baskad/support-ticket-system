// src/pages/Dashboard/Dashboard.jsx
import { useState } from "react";
import { Button, NoResults } from "noplin-uis";
import { useTickets } from "../../hooks/useTickets";
import { useFilters } from "../../hooks/useFilters";
import { useUserContext } from "../../context/UserContext";
import { DashboardStats } from "./DashboardStats";
import { FilterPanel } from "./FilterPanel";
import { TicketTable } from "./TicketTable";
import { TICKET_STATUS } from "../../constants/ticket.constants";
import styles from "./Dashboard.module.css";

export function Dashboard({ onNavigate }) {
  const { tickets, allTickets } = useTickets();
  const { currentUser } = useUserContext();

  // Stats are derived from ALL tickets, not filtered ones
  const stats = {
    open:       allTickets.filter(t => t.status === TICKET_STATUS.OPEN).length,
    inProgress: allTickets.filter(t => t.status === TICKET_STATUS.IN_PROGRESS).length,
    resolved:   allTickets.filter(t => t.status === TICKET_STATUS.RESOLVED).length,
    closed:     allTickets.filter(t => t.status === TICKET_STATUS.CLOSED).length,
  };

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Support Dashboard</h1>
          <p className={styles.subtitle}>
            {allTickets.length} total tickets · Welcome, {currentUser.name}
          </p>
        </div>
        <Button onClick={() => onNavigate("create")}>
          + New Ticket
        </Button>
      </div>

      <DashboardStats stats={stats} />

      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <FilterPanel />
        </aside>

        <main className={styles.main}>
          {tickets.length === 0 ? (
            <NoResults
              title={{ content: "No tickets match your filters" }}
              description={{ content: "Try adjusting or clearing your filters to see more results." }}
            />
          ) : (
            <TicketTable
              tickets={tickets}
              onTicketClick={(id) => onNavigate("detail", id)}
            />
          )}
        </main>
      </div>

    </div>
  );
}

// Small inline component — too small to deserve its own file
function ResetButton() {
  const { resetFilters } = useFilters();
  return <Button onClick={resetFilters}>Reset Filters</Button>;
}