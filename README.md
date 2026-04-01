# Support Ticket System
### Built with Noplin UIs by Meeedly

A scalable, production-grade support ticket management system built for the Meeedly internship assignment.

---

## 🚀 Live Demo

> Run locally — see setup instructions below

---

## 📋 Features

### User Features
- Submit support tickets with title, description, category, and priority
- Assign a support agent directly at ticket creation
- View conversation threads on each ticket
- Real-time similar ticket suggestions while typing (prevents duplicate tickets)
- Reply to tickets with instant optimistic updates

### Agent Features
- Full ticket management dashboard with filtering and sorting
- Filter by status, priority, category, assigned agent
- Live search across ticket titles, descriptions, and IDs
- Change ticket status, priority, and assignee directly from the detail page
- Write internal notes invisible to the end user
- Reopen resolved or closed tickets

### System Design
- Role-based views — users and agents see different UI for the same ticket
- Normalized data model — messages stored separately from tickets for scalability
- Denormalized message count on tickets for O(1) dashboard queries
- Context split by domain — TicketContext and UserContext prevent unnecessary re-renders
- All business logic in custom hooks — components stay clean and presentational

---

## 🏗️ Architecture
```
src/
├── constants/        # Enums: status, priority, category, roles
├── utils/            # generateId, dateUtils (no external libs)
├── data/             # Mock data: users, tickets, messages + query helpers
├── context/          # TicketContext (useReducer) + UserContext
├── hooks/            # useTickets, useFilters, useTicketForm, useSimilarTickets
├── components/
│   ├── common/       # StatusBadge, PriorityBadge, Avatar, EmptyState, Footer
│   └── conversation/ # MessageBubble, ReplyBox
└── pages/
    ├── Dashboard/    # Stats, FilterPanel, TicketTable
    ├── CreateTicket/ # Form with validation + similar ticket detection
    └── TicketDetail/ # Conversation thread + agent action sidebar
```

---

## 🧠 Key Engineering Decisions

**Why useReducer over multiple useState?**
One dispatch handles atomic state updates across tickets, messages, and counts simultaneously — preventing race conditions and inconsistent UI states.

**Why separate TicketContext and UserContext?**
User identity changes almost never. Separating it prevents the entire ticket tree from re-rendering on unrelated user state changes.

**Why normalize messages away from tickets?**
In a real system with thousands of tickets and long conversations, storing messages inside ticket documents causes unbounded document growth and kills query performance. Keeping them separate means messages can be paginated independently.

**Why denormalize messageCount on tickets?**
The dashboard needs to display message counts for every ticket without loading all messages. Denormalizing this field gives O(1) access at the cost of a small sync overhead — the same pattern used by Twitter, Reddit, and most feed systems at scale.

**Why similar ticket detection?**
Real enterprise support tools (Zendesk, Linear, Jira) surface similar existing issues before allowing ticket creation. This reduces duplicate tickets, a major operational cost at scale.

---

## 🎨 UI Components

Built using **Noplin UIs by Meeedly** (`noplin-uis@1.0.85`) for:
- Buttons, Switch toggles
- Success and error notifications
- Empty/no results states
- Spinner/loading indicators

Custom components for domain-specific UI:
- StatusBadge, PriorityBadge (no Noplin equivalent)
- MessageBubble with role-based alignment
- ConversationThread with internal note support

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+
- npm 9+

### Installation
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/support-ticket-system.git

# Navigate into the project
cd support-ticket-system

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Demo Users

Use the **DEV: Switch User** panel (bottom-right corner) to switch between roles:

| Name | Role | What you can see |
|---|---|---|
| John Admin | Admin | Full dashboard, all actions, internal notes |
| Sarah Agent | Agent | Agent dashboard, internal notes, status changes |
| Mike Agent | Agent | Agent view |
| Emma Agent | Agent | Agent view |
| Alex Johnson | Customer | User view, no internal notes, no agent actions |

---

## 🔮 Future Improvements

**For real-world scale:**
- Replace mock data with a REST or GraphQL API
- Add WebSocket support for real-time message updates
- Implement pagination on the ticket table (virtual scrolling for 10,000+ tickets)
- Add full-text search with Elasticsearch or Algolia
- Email notifications on ticket updates
- SLA tracking and escalation rules
- Attachment support on messages
- Ticket merging for duplicate detection

**Technical debt to address:**
- Add unit tests for reducers and custom hooks
- Add E2E tests with Playwright for critical user flows
- Implement proper error boundaries
- Add proper authentication (currently simulated)

---

## 📄 License

Built for the Meeedly Software Engineering Internship Assignment.
UI components by [Meeedly](https://meeedly.com).
