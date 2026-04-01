// src/utils/generateId.js

let ticketCounter = 1;
let messageCounter = 1;
let userCounter = 1;

export const generateTicketId = () => {
  const id = `TKT-${String(ticketCounter).padStart(4, "0")}`;
  ticketCounter++;
  return id;
};

export const generateMessageId = () => {
  const id = `MSG-${String(messageCounter).padStart(4, "0")}`;
  messageCounter++;
  return id;
};

export const generateUserId = () => {
  const id = `USR-${String(userCounter).padStart(4, "0")}`;
  userCounter++;
  return id;
};