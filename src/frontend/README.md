# VPN Time Unlock - Web Prototype

A web-based prototype demonstrating a VPN access control system with rewarded ad gating. Users watch a simulated 40-second ad to unlock 2 hours of VPN access.

## ⚠️ Important Notice

**This is a web prototype built on the Internet Computer blockchain.** It demonstrates the UI/UX and session management logic for a VPN time-unlock system.

### What This Prototype Includes:
- ✅ Professional UI with Connect button and countdown timer
- ✅ Simulated 40-second rewarded ad flow
- ✅ Backend session tracking (2-hour unlock periods)
- ✅ Auto-disconnect when time expires
- ✅ Manual disconnect functionality
- ✅ User authentication via Internet Identity
- ✅ Admin panel for user and session management
- ✅ AdMob configuration placeholders

### What This Prototype Does NOT Include:
- ❌ Real Google AdMob SDK integration (requires native Android)
- ❌ Actual VPN networking/tunneling (OpenVPN, WireGuard, etc.)
- ❌ Real ad serving or revenue generation
- ❌ Native Android application code
- ❌ Network traffic routing or encryption

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- pnpm package manager
- DFX (Internet Computer SDK)

### Installation

1. **Clone the repository**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the local Internet Computer replica**
   ```bash
   dfx start --clean --background
   ```

4. **Deploy the backend canister**
   ```bash
   dfx deploy backend
   ```

5. **Generate TypeScript bindings**
   ```bash
   dfx generate backend
   ```

6. **Start the frontend development server**
   ```bash
   pnpm start
   ```

7. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔐 Admin Access

### Admin Panel URL
The admin panel is accessible at: `http://localhost:3000/#/admin`

### How to Become an Administrator

1. **Log in with Internet Identity**
   - Click the "Login" button in the header
   - Complete the Internet Identity authentication flow

2. **Grant Admin Access Using the Secret Token**
   - The backend uses a secure initialization flow to grant admin privileges
   - Add the `caffeineAdminToken` parameter to your URL:
     ```
     http://localhost:3000/#caffeineAdminToken=YOUR_SECRET_TOKEN
     ```
   - The token is automatically extracted from the URL and used during actor initialization
   - The token is immediately cleared from the URL for security
   - Your principal will be granted admin role on the backend

3. **Access the Admin Panel**
   - Once you're an admin, an "Admin Panel" button will appear in the header
   - Click it to navigate to the admin panel
   - Or directly visit: `http://localhost:3000/#/admin`

### Admin Panel Features

The admin panel displays:
- **Your Principal ID**: Your unique Internet Identity principal
- **Admin Status**: Confirmation that you have administrator privileges
- **Users & Sessions Overview**: A table showing:
  - All registered user principals
  - User profile names (if set)
  - Session status (Active, Expired, or No Session)
  - Session expiration timestamps

### Security Notes

- The admin token is passed via URL hash fragment (`#caffeineAdminToken=...`) for security
- Hash fragments are not sent to servers or logged in access logs
- The token is automatically cleared from the URL after extraction
- The token is stored in sessionStorage for the duration of your browser session
- Only authenticated users with admin privileges can access the admin panel
- Non-admin users attempting to access the admin panel will see an access-denied message

### Building for Production

When deploying to production:
1. Ensure the `caffeineAdminToken` is kept secure and not shared publicly
2. The first user to log in with the correct token becomes an admin
3. Additional admins can be granted access through the backend's role management system
