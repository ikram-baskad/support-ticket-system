import { createContext, useContext, useReducer, useCallback } from "react";
import { MOCK_TICKETS } from "../data/tickets.data";
import { MOCK_MESSAGES } from "../data/messages.data";
import { TICKET_STATUS } from "../constants/ticket.constants";

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState = {
  tickets: MOCK_TICKETS,
  messages: MOCK_MESSAGES,
  loading: false,
  error: null,
  filters: {
    status: "all",
    priority: "all",
    category: "all",
    assignedTo: "all",
    search: "",
  },
  sortBy: "newest", // newest | oldest | priority
};

// ─── Action Types ─────────────────────────────────────────────────────────────
// Defined as constants — same reason as ticket constants: no magic strings

export const TICKET_ACTIONS = {
  ADD_TICKET:       "ADD_TICKET",
  UPDATE_TICKET:    "UPDATE_TICKET",
  ADD_MESSAGE:      "ADD_MESSAGE",
  SET_FILTERS:      "SET_FILTERS",
  SET_SORT:         "SET_SORT",
  RESET_FILTERS:    "RESET_FILTERS",
  SET_LOADING:      "SET_LOADING",
  SET_ERROR:        "SET_ERROR",
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
// A pure function: same inputs ALWAYS produce same output. No side effects.

function ticketReducer(state, action) {
  switch (action.type) {

    case TICKET_ACTIONS.ADD_TICKET:
      return {
        ...state,
        tickets: [action.payload, ...state.tickets], // newest first
        loading: false,
        error: null,
      };

    case TICKET_ACTIONS.UPDATE_TICKET:
      return {
        ...state,
        tickets: state.tickets.map((ticket) =>
          ticket.id === action.payload.id
            ? { ...ticket, ...action.payload.updates, updatedAt: new Date().toISOString() }
            : ticket
        ),
      };

    case TICKET_ACTIONS.ADD_MESSAGE: {
      const { message } = action.payload;
      return {
        ...state,
        messages: [...state.messages, message],
        // Keep messageCount in sync — denormalized for performance
        tickets: state.tickets.map((ticket) =>
          ticket.id === message.ticketId
            ? {
                ...ticket,
                messageCount: ticket.messageCount + 1,
                updatedAt: new Date().toISOString(),
              }
            : ticket
        ),
      };
    }

    case TICKET_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case TICKET_ACTIONS.SET_SORT:
      return { ...state, sortBy: action.payload };

    case TICKET_ACTIONS.RESET_FILTERS:
      return { ...state, filters: initialState.filters, sortBy: "newest" };

    case TICKET_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case TICKET_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    default:
      // This should never happen — if it does, you have a bug
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

// ─── Context + Provider ───────────────────────────────────────────────────────

const TicketContext = createContext(null);

export function TicketProvider({ children }) {
  const [state, dispatch] = useReducer(ticketReducer, initialState);

  // Derived data: filtered + sorted tickets
  // This is computed on every render but only when state changes
  // For thousands of tickets you'd memoize this with useMemo
  const filteredTickets = getFilteredTickets(state.tickets, state.filters, state.sortBy);

  return (
    <TicketContext.Provider value={{ state, dispatch, filteredTickets }}>
      {children}
    </TicketContext.Provider>
  );
}

// ─── Custom Hook ──────────────────────────────────────────────────────────────
// Components never import TicketContext directly — they use this hook.
// This is a critical pattern: it centralizes the context dependency.

export function useTicketContext() {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error("useTicketContext must be used inside a <TicketProvider>");
  }
  return context;
}

// ─── Derived Data Helper ──────────────────────────────────────────────────────
// Pure function — lives outside the component so it never causes re-renders

function getFilteredTickets(tickets, filters, sortBy) {
  let result = [...tickets];

  // Filter
  if (filters.status !== "all")
    result = result.filter((t) => t.status === filters.status);

  if (filters.priority !== "all")
    result = result.filter((t) => t.priority === filters.priority);

  if (filters.category !== "all")
    result = result.filter((t) => t.category === filters.category);

  if (filters.assignedTo !== "all")
    result = result.filter((t) => t.assignedTo === filters.assignedTo);

  if (filters.search.trim()) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q)
    );
  }

  // Sort
  const sortFns = {
    newest:   (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    oldest:   (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    priority: (a, b) => PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority],
  };

  result.sort(sortFns[sortBy] ?? sortFns.newest);
  return result;
}

const PRIORITY_ORDER = { low: 1, medium: 2, high: 3, critical: 4 };