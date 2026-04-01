import { useTicketContext, TICKET_ACTIONS } from "../context/TicketContext";
import { generateTicketId, generateMessageId } from "../utils/generateId";


export function useTickets() {
  const { state, dispatch, filteredTickets } = useTicketContext();

  const addTicket = (ticketData) => {
    const newTicket = {
      id: generateTicketId(),
      ...ticketData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: 1,
    };

    // Also create the first message from the description
    const firstMessage = {
      id: generateMessageId(),
      ticketId: newTicket.id,
      authorId: ticketData.createdBy,
      authorRole: "user",
      body: ticketData.description,
      createdAt: new Date().toISOString(),
      isInternal: false,
    };

    dispatch({ type: TICKET_ACTIONS.ADD_TICKET, payload: newTicket });
    dispatch({ type: TICKET_ACTIONS.ADD_MESSAGE, payload: { message: firstMessage } });

    return newTicket.id; // Return ID so the form can redirect to it
  };

  const updateTicket = (id, updates) => {
    dispatch({ type: TICKET_ACTIONS.UPDATE_TICKET, payload: { id, updates } });
  };

  const addMessage = (ticketId, messageData) => {
    const newMessage = {
      id: generateMessageId(),
      ticketId,
      ...messageData,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: TICKET_ACTIONS.ADD_MESSAGE, payload: { message: newMessage } });
  };

  const getTicketById = (id) =>
    state.tickets.find((t) => t.id === id) ?? null;

  const getMessagesForTicket = (ticketId) =>
    state.messages
      .filter((m) => m.ticketId === ticketId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return {
    tickets: filteredTickets,
    allTickets: state.tickets,
    filters: state.filters,
    sortBy: state.sortBy,
    loading: state.loading,
    error: state.error,
    addTicket,
    updateTicket,
    addMessage,
    getTicketById,
    getMessagesForTicket,
  };
}