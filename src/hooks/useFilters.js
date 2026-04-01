import { useTicketContext, TICKET_ACTIONS } from "../context/TicketContext";

export function useFilters() {
  const { state, dispatch } = useTicketContext();

  const setFilter = (key, value) => {
    dispatch({ type: TICKET_ACTIONS.SET_FILTERS, payload: { [key]: value } });
  };

  const setSort = (value) => {
    dispatch({ type: TICKET_ACTIONS.SET_SORT, payload: value });
  };

  const resetFilters = () => {
    dispatch({ type: TICKET_ACTIONS.RESET_FILTERS });
  };

  const activeFilterCount = Object.entries(state.filters).filter(
    ([key, val]) => key !== "search" && val !== "all"
  ).length + (state.filters.search ? 1 : 0);

  return {
    filters: state.filters,
    sortBy: state.sortBy,
    setFilter,
    setSort,
    resetFilters,
    activeFilterCount, // useful for showing a badge "3 filters active"
  };
}