// src/hooks/useSimilarTickets.js
import { useState, useEffect } from "react";
import { useTickets } from "./useTickets";

export function useSimilarTickets(title) {
  const { allTickets } = useTickets();
  const [similar, setSimilar] = useState([]);

  useEffect(() => {
    const query = title.trim().toLowerCase();

    // Only search once title is meaningful
    if (query.length < 5) {
      setSimilar([]);
      return;
    }

    // Simple but effective: score by word overlap
    const words = query.split(/\s+/).filter((w) => w.length > 3);

    const scored = allTickets
      .map((ticket) => {
        const haystack = ticket.title.toLowerCase();
        const matchCount = words.filter((w) => haystack.includes(w)).length;
        return { ticket, score: matchCount };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3) // max 3 suggestions
      .map(({ ticket }) => ticket);

    setSimilar(scored);
  }, [title, allTickets]);

  return similar;
}