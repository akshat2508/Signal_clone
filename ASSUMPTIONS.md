# Assumptions, Mocked Data, & Notes

This document outlines the technical assumptions made, data that was mocked, and specific notes regarding the implementation boundaries of this Signal Clone assignment.

## 1. End-to-End (E2E) Encryption
- **Assumption / Note:** Real Signal uses the Double Ratchet Algorithm (Signal Protocol) for true End-to-End Encryption. Implementing this requires heavy cryptographic libraries (often WebAssembly in the browser) and complex key-exchange mechanisms (identity keys, signed pre-keys, one-time pre-keys).
- **Implementation:** As per the assignment guidelines ("encryption can be mocked or simulated"), **true E2E encryption was bypassed**. Messages are sent securely over HTTPS/WSS (in transit encryption) and stored in the PostgreSQL database, but they are not encrypted at rest by the clients. The focus was instead placed heavily on replicating the core real-time delivery workflows and the UI/UX.

## 2. Phone Number / OTP Verification
- **Assumption / Note:** A real messaging app requires a telecom provider (like Twilio or MessageBird) to send SMS OTPs for account verification.
- **Implementation (Mocked):** The OTP system is mocked to save costs and simplify testing. When registering, you can input any phone number. If prompted for an OTP, the system expects the hardcoded mock value: `123456`.

## 3. Media & File Uploads
- **Assumption / Note:** Signal allows sending images, videos, and voice notes which require a CDN or an S3 bucket for storage.
- **Implementation:** The database schema (`message_type`, `avatar_url`) supports rich media, but actual file uploading to a cloud bucket is out of scope. Avatars and media are currently handled via external URL strings or mock placeholders.

## 4. Voice and Video Calling
- **Assumption / Note:** The Signal desktop/web experience includes WebRTC-based calling.
- **Implementation:** While the UI may contain visual icons or placeholders for calling to accurately replicate the Signal aesthetic, WebRTC signaling and peer-to-peer connection logic were not implemented. The focus remained strictly on the core text messaging workflows.

## 5. Contact Discovery
- **Assumption / Note:** Mobile messaging apps typically upload the user's phone address book to discover contacts securely.
- **Implementation:** Since this is a web application, we implemented a global User Search system. Users can search for other registered users by their exact username/display name to add them as contacts and initiate conversations.

## 6. Presence & Read Receipts
- **Assumption / Note:** Tracking exact read receipts (Sent, Delivered, Read) across multiple devices is highly complex.
- **Implementation:** The schema (`message_receipts`) and WebSocket architecture are built to support these, but the frontend currently simulates or simplifies some of the receipt statuses for the sake of the MVP timeline. Typing indicators (the 3-dot typing bubble), however, are fully functional and real-time.
