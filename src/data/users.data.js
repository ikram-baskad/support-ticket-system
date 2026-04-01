export const MOCK_USERS = [
  {
    id: "user-1",
    name: "John Admin",
    email: "john@support.com",
    role: "admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    avatarInitials: "JA",
  },
  {
    id: "user-2",
    name: "Sarah Agent",
    email: "sarah@support.com",
    role: "agent",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    avatarInitials: "SA",
  },
  {
    id: "user-3",
    name: "Mike Agent",
    email: "mike@support.com",
    role: "agent",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    avatarInitials: "MA",
  },
  {
    id: "user-4",
    name: "Emma Agent",
    email: "emma@support.com",
    role: "agent",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    avatarInitials: "EA",
  },
  {
    id: "customer-1",
    name: "Alex Johnson",
    email: "alex@customer.com",
    role: "customer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    avatarInitials: "AJ",
  },
];

export function getUserById(userId) {
  return MOCK_USERS.find((user) => user.id === userId) ?? null;
}

export function getAgents() {
  return MOCK_USERS.filter((user) => user.role === "agent" || user.role === "admin");
}
