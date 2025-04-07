# contractify


## 📄 Contractify

**Contractify** is a decentralized platform for storing, verifying, and managing contracts securely using **IPFS** and **Ethereum blockchain**. It empowers contractors and contractees to handle legal agreements transparently and immutably.

---

### 🚀 Features

- 🔐 Upload and store contracts (PDF) securely on **IPFS** (via Pinata)
- 🧾 Generate unique IPFS CID for each contract
- ⛓ Store CID on a **smart contract** for tamper-proof verification
- 📧 Login/signup with email for both parties (contractor & contractee)
- 🔑 Use your own private key to deploy and interact with smart contracts
- 🧠 Easy UI to track and verify contract ownership
- 💬 Potential to include e-signature and timestamping in future versions

---

### 🛠 Tech Stack

- **Frontend**: Next.js
- **Backend/Auth**: OAUTH (for email login)
- **Blockchain**: Ethereum, Solidity, Web3.js
- **IPFS**: Pinata for decentralized file storage
- **Dev Tools**: Truffle, Ganache, Alchemy

---

### ⚙️ How It Works

1. **Upload** a contract (PDF) via the Contractify interface.
2. The PDF is uploaded to **IPFS** using **Pinata**, returning a **CID**.
3. That CID is stored on a smart contract deployed to the Ethereum network.
4. Both contractor and contractee can **verify** the contract later by comparing the CID on-chain with the one from IPFS.
5. Users authenticate using **email login** but still interact with the blockchain using their **own wallet/private key**.

---

### 📌 Use Cases

- Freelancers & clients creating and storing work agreements
- NDAs and service agreements
- Small businesses looking for verifiable contract history

---

Let me know if you'd like badges (e.g., GitHub, license, deployment) or if this is going on GitHub Pages and needs demo link instructions too.
