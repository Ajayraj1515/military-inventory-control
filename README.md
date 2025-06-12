# 🛡️ Military Asset Management System

A robust, secure, and role-based web application for managing military assets like vehicles, weapons, and ammunition across multiple bases. Designed to empower commanders and logistics personnel with tools to efficiently **track**, **assign**, **transfer**, and **audit** all critical military assets.

---

## 🚀 Live Demo

🔗 **Deployed App**: [Military Inventory Control](https://military-inventory-controlajay.netlify.app/login)  
🔗 **GitHub Repository**: [View on GitHub](https://github.com/Ajayraj1515/military-inventory-control)

---

## 🛠️ Tech Stack

### Frontend
- **React.js (with Vite)** – Fast bundling and performance-optimized development
- **Tailwind CSS** – Utility-first CSS framework for responsive, clean UI
- **React Router** – For SPA navigation
- **Axios** – API requests
- **React Context / State Management** – For global state and user role management

### Backend ( you guys need to implement as Iam good with frontned a suggestion for backend)
- **Node.js + Express.js** – RESTful API server
- **JWT (JSON Web Tokens)** – Secure role-based authentication
- **Express Middleware** – Role-based access control (RBAC) layer
- **Winston/Morgan** – For logging and auditing API transactions

### Database
- **MySQL** – Relational database for structured data integrity  
- **Sequelize ORM** – Simplified query handling and schema management

---

## 🧩 System Features

### 📊 Dashboard
- View summarized metrics for:
  - Opening & Closing Balances
  - Net Movements = Purchases + Transfers In − Transfers Out
  - Assigned & Expended Assets
- Filter data by:
  - **Date**
  - **Base**
  - **Equipment Type**
- 💡 Clicking "Net Movement" shows detailed breakdown (Bonus Feature)

### 🛒 Purchases Page
- Add new asset purchases per base and equipment type
- Filter/view historical purchases by date and equipment type

### 🔄 Transfers Page
- Transfer assets between bases
- Maintains a clear **Transfer History Log** with timestamps

### 🎖️ Assignments & Expenditures
- Assign assets to personnel
- Record and view **expenditures** of assets
- Audit history of assignments and usage

---

## 🔐 Role-Based Access Control (RBAC)

| Role             | Access                                                                 |
|------------------|------------------------------------------------------------------------|
| **Admin**        | Full access to all data and modules                                    |
| **Base Commander** | Access limited to their assigned base data                           |
| **Logistics Officer** | Access to only purchase and transfer modules                      |

RBAC is securely implemented via Express middleware to protect each route.

---


---

## 🗃️ Why MySQL?

- **Relational structure** is ideal for tracking balances, assets, and transaction logs between related tables such as `bases`, `assets`, `transfers`, `purchases`, `assignments`, and `users`.
- Ensures **data consistency** and **ACID compliance**, crucial for auditability and tracking military inventory.
- Easy to define foreign key relationships (e.g., Base ID → Transfer → Purchase → Assignments)

---

## 🔐 Security & Logging

- All sensitive operations are **authenticated and authorized** using JWT tokens.
- Middleware ensures only authorized roles access protected routes.
- **Audit logs** of every action (purchases, transfers, assignments) are maintained using Winston or Morgan logger.

---

## 📈 Future Enhancements

- Notification system for low stock levels
- Export reports as CSV/PDF
- QR code scanning for physical inventory mapping
- Real-time updates using WebSockets

---



---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---



