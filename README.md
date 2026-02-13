<div align="center">

  # 🧠 SOVEREIGN

  **Own Your Intelligence. Mint Your Mastery.**

  [![Solana](https://img.shields.io/badge/Solana-Devnet-14F195?style=for-the-badge&logo=solana&logoColor=black)](https://solana.com)
  [![React](https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
  [![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](LICENSE)

  <p align="center">
    A decentralized, model-agnostic AI tutoring platform where your learning progress is <br />
    cryptographically hashed, anchored to the blockchain, and minted as a transferable NFT identity.
  </p>

  [**View Demo**](https://ai-tutor-mu-seven.vercel.app/) · [**Report Bug**](issues) · [**Request Feature**](issues)
</div>

---

## ⚡ Introduction

**Sovereign** is not just an AI chatbot; it is a **Proof-of-Knowledge Protocol**.

In traditional education platforms, your data is locked in a centralized database. If the platform shuts down, your history is lost. Sovereign flips this model:
1.  **You Own the Data:** Your "Neural Link" is an NFT (Non-Fungible Token) on Solana.
2.  **Verifiable History:** Every chat session is hashed (`SHA-256`) and anchored to the blockchain.
3.  **Universal Tutor:** The AI acts as a "Hive Mind," orchestrating between **Gemini** and **ChatGPT** to ensure accurate, verified learning.

---

## 💎 Key Features

### 🧬 The Neural Link (Dynamic NFT)
- **Genesis Mint:** Users mint a unique "Soul" on the Solana blockchain upon registration.
- **Evolving Metadata:** As you master topics (e.g., *React*, *Physics*), your NFT metadata updates via **Metaplex**, changing your on-chain "Intelligence Level."
- **Interoperability:** Your rank is readable by any dApp, job portal, or game in the Solana ecosystem.

### ⚓ Anchored Memory
- **Cryptographic Proof:** Chat history is hashed off-chain.
- **On-Chain Checkpoints:** Users sign a transaction to "Anchor" this hash to Solana. This proves *what* you learned and *when* without exposing private conversation data.
- **Tamper-Proofing:** The app cross-references the on-chain hash with the off-chain database to detect data corruption.

### 🧠 Universal Hive Mind
- **Model Agnostic:** Seamlessly switches between **Google Gemini** and **OpenAI GPT-4**.
- **Context Injection:** If one model fails, the system injects the conversation history into a second model for a "Second Opinion."
- **Subject Awareness:** Dynamic system prompting adapts the teaching style based on the selected subject.

---

## 🏗 Architecture

### The "Anchor" Workflow
How we secure knowledge without paying high storage costs:

```mermaid
sequenceDiagram
    participant User
    participant App as React Client
    participant DB as Supabase
    participant Chain as Solana Devnet
    
    User->>App: Clicks "Anchor Memory"
    App->>App: Generates SHA-256 Hash of Chat
    App->>DB: Stores Raw Chat + Hash
    App->>User: Request Wallet Signature
    User->>Chain: Signs Transaction (Memo: Hash)
    Chain-->>App: Confirms Transaction
    App->>DB: Updates User XP & Level
    App->>User: "Memory Anchored!"
