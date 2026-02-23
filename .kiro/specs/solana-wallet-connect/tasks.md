# Implementation Plan: Solana Wallet Connect

## Overview

This implementation plan breaks down the Solana wallet connection feature into discrete coding tasks. The feature integrates the official Solana Wallet Adapter libraries into the LearnLedger landing page, enabling users to connect their Solana wallets (Phantom, Solflare, and other standard wallets) with connection persistence, error handling, and responsive UI integration.

The implementation follows a bottom-up approach: first establishing configuration and utilities, then building core provider infrastructure, followed by UI components, and finally integration with the existing application.

## Tasks

- [ ] 1. Install dependencies and setup configuration
  - Install @solana/wallet-adapter-react, @solana/wallet-adapter-react-ui, @solana/wallet-adapter-wallets, @solana/web3.js
  - Install wallet-specific adapters (@solana/wallet-adapter-phantom, @solana/wallet-adapter-solflare)
  - Install testing dependencies: fast-check for property-based testing
  - Create src/app/config/solana.ts with network configuration (devnet)
  - Export SOLANA_NETWORK and SOLANA_RPC_ENDPOINT constants
  - _Requirements: 4.1, 4.2, 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 2. Implement utility functions
  - [ ] 2.1 Create public key truncation utility
    - Create src/app/utils/wallet.ts
    - Implement truncatePublicKey function that takes PublicKey and returns formatted string
    - Format: first 4 characters + "..." + last 4 characters of base58 address
    - _Requirements: 2.3_
  
  - [ ]* 2.2 Write property test for public key truncation
    - **Property 1: Public Key Truncation Format**
    - **Validates: Requirements 2.3**
    - Generate random valid Solana public keys
    - Verify output always matches pattern: 4 chars + "..." + 4 chars
    - Verify first 4 chars match start of base58 address
    - Verify last 4 chars match end of base58 address

- [ ] 3. Create WalletContextProvider component
  - [ ] 3.1 Implement WalletContextProvider
    - Create src/app/providers/WalletProvider.tsx
    - Import required adapters: PhantomWalletAdapter, SolflareWalletAdapter
    - Configure ConnectionProvider with SOLANA_RPC_ENDPOINT
    - Configure WalletProvider with wallets array (Phantom, Solflare)
    - Wrap with WalletModalProvider for UI
    - Enable autoConnect for connection persistence
    - Accept children prop and render wrapped providers
    - _Requirements: 1.1, 4.1, 4.3, 5.1, 5.2_
  
  - [ ]* 3.2 Write property test for connection state transitions
    - **Property 3: Connection State Transitions**
    - **Validates: Requirements 1.4, 3.3, 5.3, 5.4**
    - Generate random connection events (authorize, deny, disconnect, restore)
    - Verify state transitions correctly to Connected_State or Disconnected_State
  
  - [ ]* 3.3 Write property test for network configuration consistency
    - **Property 6: Network Configuration Consistency**
    - **Validates: Requirements 4.2, 4.3**
    - Generate random network configurations
    - Verify all adapter interactions use the configured network

- [ ] 4. Implement WalletButton component
  - [ ] 4.1 Create WalletButton component
    - Create src/app/components/WalletButton.tsx
    - Use useWallet hook to access wallet state (publicKey, connected, connecting)
    - Implement conditional rendering based on connection state
    - Show "Connect Wallet" when disconnected
    - Show truncated public key when connected using truncatePublicKey utility
    - Show loading state when connecting
    - Accept className and variant props for styling flexibility
    - Use wallet icon from lucide-react
    - Style with #14F195 accent color and #0f0f0f background
    - _Requirements: 1.2, 2.1, 2.2, 2.3, 2.4, 8.3, 8.4_
  
  - [ ]* 4.2 Write property test for UI state consistency
    - **Property 2: UI State Consistency**
    - **Validates: Requirements 2.1, 2.2, 3.4**
    - Generate random wallet states (connected/disconnected)
    - Verify button displays "Connect Wallet" when disconnected
    - Verify button displays truncated public key when connected
  
  - [ ]* 4.3 Write unit tests for WalletButton component
    - Test rendering in disconnected state
    - Test rendering in connected state with mock public key
    - Test rendering in connecting state
    - Test mobile variant rendering
    - Test desktop variant rendering
    - _Requirements: 2.1, 2.2, 2.4, 8.1, 8.2_

- [ ] 5. Implement error handling
  - [ ] 5.1 Add error handling to WalletContextProvider
    - Wrap WalletProvider with error boundary
    - Implement error state management in context
    - Add error detection for: wallet not detected, timeout, authorization denied, network errors
    - Integrate toast notifications using sonner library
    - Display appropriate error messages for each error type
    - Clear error state on new connection attempts
    - _Requirements: 1.5, 6.1, 6.2, 6.3, 6.4_
  
  - [ ]* 5.2 Write property test for error state consistency
    - **Property 5: Error State Consistency**
    - **Validates: Requirements 1.5, 6.3, 6.4**
    - Generate random error conditions (denied, timeout, network failure)
    - Verify provider remains in Disconnected_State
    - Verify error message is displayed
  
  - [ ]* 5.3 Write unit tests for error scenarios
    - Test wallet not detected error
    - Test connection timeout error
    - Test authorization denied error
    - Test network error handling
    - Test invalid stored connection handling
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 5.4_

- [ ] 6. Checkpoint - Ensure core functionality works
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implement connection persistence
  - [ ] 7.1 Add localStorage integration
    - Verify autoConnect prop enables automatic persistence
    - Test connection restoration on page reload
    - Handle invalid stored connections gracefully
    - Clear localStorage on disconnect
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  
  - [ ]* 7.2 Write property test for connection persistence round trip
    - **Property 4: Connection Persistence Round Trip**
    - **Validates: Requirements 5.1, 5.2**
    - Generate random successful connections
    - Store to localStorage and restore
    - Verify same connected state and public key after restoration

- [ ] 8. Implement wallet interaction handlers
  - [ ] 8.1 Add click handlers to WalletButton
    - Implement onClick handler that opens wallet modal when disconnected
    - Implement disconnect handler when connected
    - Add loading states during connection/disconnection
    - _Requirements: 1.2, 1.3, 3.1, 3.2_
  
  - [ ]* 8.2 Write property test for click behavior
    - **Property 8: Click Behavior Based on State**
    - **Validates: Requirements 1.2, 3.1**
    - Generate random states and click events
    - Verify correct action triggered (show options vs disconnect)
  
  - [ ]* 8.3 Write property test for wallet selection
    - **Property 7: Wallet Selection Triggers Authorization**
    - **Validates: Requirements 1.3**
    - Generate random wallet selections
    - Verify authorization request is made to selected wallet
  
  - [ ]* 8.4 Write property test for disconnect behavior
    - **Property 9: Disconnect Terminates Connection**
    - **Validates: Requirements 3.2**
    - Generate random connected states
    - Verify disconnect clears connection and cached data

- [ ] 9. Add mobile wallet support
  - [ ] 9.1 Implement mobile wallet detection and deep linking
    - Add mobile device detection logic
    - Configure wallet adapters for mobile deep linking
    - Test mobile wallet connection flow
    - Ensure WalletButton works in mobile view
    - _Requirements: 7.1, 7.2, 7.3, 8.2_
  
  - [ ]* 9.2 Write property test for mobile deep linking
    - **Property 10: Mobile Wallet Deep Linking**
    - **Validates: Requirements 7.1, 7.2, 7.3**
    - Generate random mobile wallet selections on mobile device
    - Verify deep link is initiated to wallet app

- [ ] 10. Integrate with existing Navbar
  - [ ] 10.1 Update Navbar component
    - Open src/app/components/Navbar.tsx
    - Remove mock wallet connection state
    - Import and use WalletButton component
    - Place WalletButton in desktop navigation bar
    - Place WalletButton in mobile navigation menu
    - Maintain existing layout and responsive behavior
    - _Requirements: 8.1, 8.2, 8.3_
  
  - [ ]* 10.2 Write integration tests for Navbar
    - Test WalletButton appears in desktop view
    - Test WalletButton appears in mobile view
    - Test styling consistency with design system
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 11. Wrap application with WalletContextProvider
  - [ ] 11.1 Update root layout or app component
    - Identify root component (likely src/app/layout.tsx or src/app/page.tsx)
    - Import WalletContextProvider
    - Wrap application with WalletContextProvider
    - Ensure provider wraps Navbar and all components that need wallet access
    - _Requirements: 1.1, 4.1_

- [ ] 12. Implement resource cleanup
  - [ ] 12.1 Add lifecycle cleanup handlers
    - Add useEffect cleanup in WalletContextProvider for unmount
    - Clear event listeners on wallet disconnect
    - Clear cached data when switching wallets
    - Ensure proper cleanup prevents memory leaks
    - _Requirements: 10.1, 10.2, 10.3_
  
  - [ ]* 12.2 Write property test for resource cleanup
    - **Property 11: Resource Cleanup on Lifecycle Events**
    - **Validates: Requirements 10.1, 10.2, 10.3**
    - Generate random lifecycle events (unmount, disconnect, switch)
    - Verify event listeners are removed
    - Verify cached data is cleared

- [ ] 13. Final checkpoint - End-to-end verification
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. Add wallet adapter UI styles
  - [ ] 14.1 Import and configure wallet adapter styles
    - Import @solana/wallet-adapter-react-ui/styles.css in root layout
    - Customize wallet modal styles to match LearnLedger design system
    - Ensure modal uses #14F195 accent color and #0f0f0f background
    - Test modal appearance and responsiveness
    - _Requirements: 8.3, 8.4_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples, edge cases, and integration points
- The implementation uses TypeScript and React as specified in the design document
- All wallet adapter libraries follow official Solana best practices
- Connection persistence is handled automatically by the wallet adapter library
- Error handling uses toast notifications for user feedback
