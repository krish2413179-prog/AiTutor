import { supabase } from './supabaseClient.js';
import { generateEmbedding } from './rag.js';

// Comprehensive learning content for LearnLedger
const learningContent = [
  {
    title: "What is Blockchain?",
    topic: "Blockchain Fundamentals",
    content: `Blockchain is a distributed ledger technology that maintains a continuously growing list of records called blocks. Each block contains a cryptographic hash of the previous block, a timestamp, and transaction data. This creates an immutable chain of records that is resistant to modification. The decentralized nature of blockchain means that no single entity controls the entire network, making it transparent and secure. Blockchain technology forms the foundation of cryptocurrencies like Bitcoin and Ethereum, but its applications extend far beyond digital currencies to supply chain management, healthcare records, voting systems, and more.`
  },
  {
    title: "Understanding Smart Contracts",
    topic: "Smart Contracts",
    content: `Smart contracts are self-executing contracts with the terms of the agreement directly written into code. They automatically execute when predetermined conditions are met, eliminating the need for intermediaries. Smart contracts run on blockchain networks like Ethereum and Solana, ensuring transparency, security, and immutability. Once deployed, they cannot be altered, which guarantees that all parties will follow the agreed-upon rules. Common use cases include decentralized finance (DeFi) protocols, NFT marketplaces, automated insurance claims, and supply chain tracking. Smart contracts are typically written in languages like Solidity (Ethereum) or Rust (Solana).`
  },
  {
    title: "Introduction to Solana Blockchain",
    topic: "Solana",
    content: `Solana is a high-performance blockchain platform designed for decentralized applications and crypto-currencies. It uses a unique consensus mechanism called Proof of History (PoH) combined with Proof of Stake (PoS) to achieve exceptional transaction speeds of up to 65,000 transactions per second. Solana's architecture includes features like Tower BFT, Turbine block propagation, and Gulf Stream mempool management. The platform uses SOL as its native cryptocurrency for transaction fees and staking. Solana has become popular for NFT projects, DeFi applications, and Web3 gaming due to its low fees and fast confirmation times. Programs on Solana are written in Rust or C.`
  },
  {
    title: "Web3 Fundamentals",
    topic: "Web3 Concepts",
    content: `Web3 represents the next evolution of the internet, built on blockchain technology and emphasizing decentralization, user ownership, and token-based economics. Unlike Web2 where large corporations control user data and platforms, Web3 gives users control over their digital identity, data, and assets. Key components include decentralized applications (dApps), cryptocurrency wallets, smart contracts, and decentralized autonomous organizations (DAOs). Web3 enables peer-to-peer interactions without intermediaries, creating new economic models and governance structures. Users can own digital assets as NFTs, participate in protocol governance through tokens, and earn rewards for contributing to networks.`
  },
  {
    title: "Decentralized Finance (DeFi) Basics",
    topic: "DeFi",
    content: `Decentralized Finance (DeFi) refers to financial services built on blockchain technology that operate without traditional intermediaries like banks or brokerages. DeFi protocols use smart contracts to create permissionless, transparent financial applications including lending platforms, decentralized exchanges (DEXs), yield farming, liquidity pools, and stablecoins. Users maintain custody of their assets through cryptocurrency wallets and can access services globally without geographic restrictions or credit checks. Popular DeFi protocols include Uniswap for token swapping, Aave for lending and borrowing, and Compound for earning interest. DeFi has grown to manage billions of dollars in total value locked (TVL) across various protocols.`
  },
  {
    title: "Non-Fungible Tokens (NFTs) Explained",
    topic: "NFTs",
    content: `Non-Fungible Tokens (NFTs) are unique digital assets stored on a blockchain that represent ownership of specific items or content. Unlike cryptocurrencies which are fungible (interchangeable), each NFT has distinct properties and cannot be exchanged on a one-to-one basis. NFTs use smart contracts to verify authenticity and ownership, creating digital scarcity. Common use cases include digital art, collectibles, gaming items, virtual real estate, music rights, and event tickets. NFTs are typically created using standards like ERC-721 or ERC-1155 on Ethereum, or Metaplex on Solana. The metadata and sometimes the actual content are stored on-chain or via decentralized storage solutions like IPFS.`
  },
  {
    title: "Blockchain Consensus Mechanisms",
    topic: "Consensus Mechanisms",
    content: `Consensus mechanisms are protocols that allow distributed networks to agree on the current state of the blockchain. Proof of Work (PoW), used by Bitcoin, requires miners to solve complex mathematical puzzles to validate transactions and create new blocks. Proof of Stake (PoS), used by Ethereum 2.0, selects validators based on the amount of cryptocurrency they stake. Other mechanisms include Delegated Proof of Stake (DPoS), Proof of Authority (PoA), and Proof of History (PoH). Each mechanism balances security, decentralization, and scalability differently. The choice of consensus mechanism affects transaction speed, energy consumption, and network security.`
  },
  {
    title: "Cryptocurrency Wallets Guide",
    topic: "Wallets",
    content: `Cryptocurrency wallets are digital tools that store private keys needed to access and manage blockchain assets. Hot wallets are connected to the internet and include browser extensions like MetaMask and Phantom, mobile apps, and web wallets. They offer convenience but are more vulnerable to hacking. Cold wallets are offline storage solutions like hardware wallets (Ledger, Trezor) and paper wallets, providing maximum security for long-term storage. Wallets don't actually store cryptocurrency; they store the private keys that prove ownership of assets on the blockchain. Users must protect their seed phrase (recovery phrase) as it provides complete access to wallet contents.`
  },
  {
    title: "Ethereum and EVM Basics",
    topic: "Ethereum",
    content: `Ethereum is a decentralized blockchain platform that enables smart contracts and decentralized applications (dApps). The Ethereum Virtual Machine (EVM) is a computation engine that executes smart contracts written in Solidity or Vyper. Ethereum introduced the concept of programmable blockchain, allowing developers to create complex applications beyond simple transactions. The platform uses Ether (ETH) as its native cryptocurrency for transaction fees (gas) and as a store of value. Ethereum transitioned from Proof of Work to Proof of Stake in "The Merge" upgrade, significantly reducing energy consumption. The EVM has become a standard, with many other blockchains offering EVM compatibility.`
  },
  {
    title: "Tokenomics and Crypto Economics",
    topic: "Tokenomics",
    content: `Tokenomics refers to the economic model and incentive structure of a cryptocurrency or blockchain project. It encompasses token supply (fixed, inflationary, or deflationary), distribution mechanisms, utility within the ecosystem, and governance rights. Key concepts include total supply, circulating supply, market capitalization, token burns, staking rewards, and vesting schedules. Well-designed tokenomics aligns incentives between users, developers, and investors to create sustainable growth. Tokens can serve multiple purposes: payment for services, governance voting, staking for network security, or representing ownership. Understanding tokenomics is crucial for evaluating the long-term viability of blockchain projects.`
  },
  {
    title: "Decentralized Autonomous Organizations (DAOs)",
    topic: "DAOs",
    content: `Decentralized Autonomous Organizations (DAOs) are blockchain-based entities governed by smart contracts and community voting rather than centralized leadership. Members hold governance tokens that grant voting rights on proposals affecting the organization's direction, treasury allocation, and protocol changes. DAOs operate transparently with all decisions and transactions recorded on-chain. They enable global coordination without traditional corporate structures, allowing communities to collectively manage resources and make decisions. Popular DAO frameworks include Aragon, DAOstack, and Snapshot. DAOs are used for investment clubs, protocol governance, grant distribution, and collective ownership of assets like NFTs or real estate.`
  },
  {
    title: "Layer 2 Scaling Solutions",
    topic: "Blockchain Scalability",
    content: `Layer 2 solutions are protocols built on top of base blockchains (Layer 1) to improve scalability and reduce transaction costs. They process transactions off the main chain while inheriting its security guarantees. Types include rollups (Optimistic and Zero-Knowledge), state channels, sidechains, and plasma chains. Optimistic Rollups like Arbitrum and Optimism assume transactions are valid by default and use fraud proofs. ZK-Rollups like zkSync and StarkNet use zero-knowledge proofs to verify transaction validity. Layer 2 solutions can increase throughput from 15-30 transactions per second to thousands while reducing fees by 10-100x, making blockchain applications more practical for everyday use.`
  },
  {
    title: "Cryptographic Fundamentals in Blockchain",
    topic: "Cryptography",
    content: `Blockchain technology relies heavily on cryptographic principles to ensure security and integrity. Public-key cryptography uses pairs of keys: a public key (like an address) and a private key (for signing transactions). Hash functions like SHA-256 create fixed-size outputs from any input, making it computationally infeasible to reverse or find collisions. Digital signatures prove ownership and authorize transactions without revealing private keys. Merkle trees efficiently verify data integrity by organizing hashes hierarchically. Zero-knowledge proofs allow proving knowledge of information without revealing the information itself. These cryptographic tools enable trustless systems where participants can verify transactions without trusting intermediaries.`
  },
  {
    title: "Blockchain Interoperability and Cross-Chain",
    topic: "Interoperability",
    content: `Blockchain interoperability refers to the ability of different blockchain networks to communicate and share data. Cross-chain bridges enable asset transfers between blockchains by locking tokens on one chain and minting equivalent tokens on another. Protocols like Polkadot and Cosmos are designed specifically for interoperability, allowing independent blockchains to exchange information securely. Wrapped tokens (like WBTC) represent assets from one blockchain on another. Interoperability solutions face challenges including security risks, centralization concerns, and technical complexity. As the blockchain ecosystem grows, interoperability becomes crucial for creating a connected Web3 infrastructure where users can seamlessly move assets and data across different networks.`
  },
  {
    title: "Blockchain Security and Best Practices",
    topic: "Security",
    content: `Blockchain security involves protecting networks, smart contracts, and user assets from various threats. Common vulnerabilities include reentrancy attacks, integer overflow, front-running, and phishing. Best practices include using hardware wallets for significant holdings, verifying contract addresses, never sharing private keys or seed phrases, and being cautious of too-good-to-be-true offers. Smart contract audits by firms like CertiK and OpenZeppelin help identify vulnerabilities before deployment. Multi-signature wallets require multiple approvals for transactions, adding security layers. Users should enable two-factor authentication, use strong passwords, and keep software updated. Understanding common scams and attack vectors is essential for safely navigating the blockchain ecosystem.`
  }
];

/**
 * Populate the Supabase database with learning content
 */
async function populateDatabase() {
  console.log('🚀 Starting database population...\n');
  
  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  for (let i = 0; i < learningContent.length; i++) {
    const item = learningContent[i];
    
    try {
      console.log(`[${i + 1}/${learningContent.length}] Processing: "${item.title}"`);
      
      // Generate embedding for the content
      console.log('  → Generating embedding...');
      const embedding = await generateEmbedding(item.content);
      
      // Insert into Supabase
      console.log('  → Inserting into database...');
      const { data, error } = await supabase
        .from('documents')
        .insert({
          content: item.content,
          metadata: {
            title: item.title,
            topic: item.topic,
            created_at: new Date().toISOString()
          },
          embedding: embedding
        })
        .select();

      if (error) {
        throw error;
      }

      console.log('  ✅ Success!\n');
      successCount++;
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`  ❌ Error: ${error.message}\n`);
      errorCount++;
      errors.push({
        title: item.title,
        error: error.message
      });
    }
  }

  // Summary
  console.log('═══════════════════════════════════════════════════');
  console.log('📊 POPULATION SUMMARY');
  console.log('═══════════════════════════════════════════════════');
  console.log(`✅ Successfully inserted: ${successCount} documents`);
  console.log(`❌ Failed: ${errorCount} documents`);
  console.log(`📚 Total processed: ${learningContent.length} documents`);
  
  if (errors.length > 0) {
    console.log('\n⚠️  Errors encountered:');
    errors.forEach(err => {
      console.log(`  - ${err.title}: ${err.error}`);
    });
  }
  
  if (successCount > 0) {
    console.log('\n🎉 Database population completed!');
    console.log('You can now use the RAG system to query this content.');
  } else {
    console.log('\n⚠️  No documents were inserted. Please check the errors above.');
  }
}

// Run the population script
populateDatabase()
  .then(() => {
    console.log('\n✨ Script finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
