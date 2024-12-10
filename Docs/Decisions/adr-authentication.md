---
status: proposed
date: 2024-12-10
decision-makers: {Michael Ogunrinde, James Bateman, Cory-Newman}
---

# Authentication and Authorisation Mechanisms for AML System

## Context and Problem Statement

The AML system requires a secure and user-friendly authentication and authorisation system to manage different types of users (members, staff, administrators, accountants, purchase managers) with varying access levels. The system must handle separate authentication flows for regular users and staff members, manage sessions securely, and implement role-based access control while maintaining security best practices.

## Decision Drivers

* Must support separate authentication flows for regular users and staff members
* Need to protect sensitive user and payment data through proper access control
* Must integrate seamlessly with the existing membership management system
* Must implement role-based access control for different staff roles (admin, accountant, purchase manager)
* Must maintain secure session management with appropriate timeouts
* Must handle JWT tokens securely for API authentication
* Should provide a clear separation between member and staff access

## Considered Options

* Custom authentication implementation
* NextAuth.js with dual credential providers
* Auth0 or similar third-party authentication service
* Passport.js with custom providers
* Firebase Authentication

## Decision Outcome

Chosen option: "NextAuth.js with dual credential providers", because:

1. Implements separate authentication flows for members and staff using distinct credential providers
2. Provides secure JWT-based session management with configurable timeouts
3. Supports role-based access control through custom callbacks
4. Integrates cleanly with the backend API authentication
5. Maintains session security with 30-minute timeout periods
6. Allows for custom login pages and error handling
7. Provides debug mode for development and troubleshooting

### Specific Implementation Details

1. Two separate credential providers:
   * User Credentials: Handles regular member authentication
   * Staff Credentials: Handles staff authentication with role verification

2. Role-based authorisation:
   * Member: Regular user access
   * Staff: Base staff access
   * Admin: Full administrative access (AM email prefix)
   * Accountant: Financial access (AC email prefix)
   * Purchase Manager: Purchasing access (PM email prefix)

3. Security measures:
   * JWT-based session management
   * 30-minute session timeout
   * Secure token handling
   * Custom error logging
   * Environment-based secrets

### Consequences

* Good, because it provides separate, secure authentication flows for different user types
* Good, because it implements role-based access control through email prefixes
* Good, because it maintains secure session management with appropriate timeouts
* Good, because it integrates smoothly with the backend API
* Bad, because it relies on email prefixes for role determination, which might be inflexible
* Bad, because it requires careful management of JWT secrets and timeouts

### Confirmation

The decision will be validated through:

1. Testing of both user and staff authentication flows.
2. Verification of role-based access control
3. Session timeout testing
4. Security audit of JWT handling
5. Performance testing under load

## Pros and Cons of the Options

### NextAuth.js with dual credential providers

* Good, because it allows separate handling of member and staff authentication
* Good, because it provides built-in JWT session management
* Good, because it enables custom callback functions for role management
* Bad, because it requires careful implementation of role-based access
* Neutral, because it needs custom error handling for different authentication flows

### Custom authentication implementation

* Good, because it would allow complete control over authentication flows
* Good, because it could be optimized for specific role management
* Bad, because it would require significant security implementation
* Bad, because it would need custom session management
* Bad, because it would increase development and maintenance time

### Auth0 or similar third-party service

* Good, because it provides enterprise-level security
* Good, because it includes built-in role management
* Bad, because it would require significant changes to current implementation
* Bad, because it introduces additional costs
* Bad, because it might not support the current dual-authentication approach

## More Information

Implementation requirements:

1. Environment variables:
   * NEXTAUTH_SECRET for JWT signing
   * API endpoint configurations
2. Backend API endpoints:
   * /auth/login for member authentication
   * /auth/staff/login for staff authentication
3. Session configuration:
   * JWT strategy
   * 30-minute timeout
   * Custom session data structure
4. Role-based access control implementation
5. Error handling and logging strategy

The system will need ongoing monitoring of:

1. Authentication success/failure rates
2. Session timeout effectiveness
3. Role-based access control accuracy
4. JWT token security
5. API integration stability
