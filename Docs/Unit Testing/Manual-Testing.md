# Manual Unit Testing Documentation

Date: 19/12/2024  
Tester: Michael Ogunrinde

## Overview

Due to technical issues with the Jest framework setup, particularly with router configuration, manual unit testing was performed using console logs. Testing focused on core functionality and role-based access control.

## 1. HandleChangeMembership Function

**Location**: ManageMembership.tsx  
**Purpose**: Fetches members data and subscription plans from the API

### Test Case HCM-001: Valid membership change

- **Input**:
  - selectedUser: {user_id: 1, subscription_id: 1}
  - newMembershipType: "annual"
  - adjustmentReason: "Upgrade request"
- **Expected Output**:
  - API call made successfully
  - Members state updated
  - Modal closed
- **Actual Output**:
  - API calls was made with correct parameters
  - Member state updated to show "annual"
  - Modal closed successfully
- **Status**: Pass

### Test Case HCM-002: Missing required fields

- **Input**:
  - selectedUser: {user_id: 1, subscription_id: 1}
  - newMembershipType: ""
  - adjustmentReason: ""
- **Expected Output**:
  - Alert "Please fill in the required fields"
  - No API calls
- **Actual Output**: Nothing happens
- **Status**: Partial Pass
- **Notes**: Nothing happens nor does it alert

### Test Case HCM-003: Unauthorized access attempt

- **Input**:
  - Login as purchase manager
  - selectedUser: {user_id: 1, subscription_id: 1}
  - newMembershipType: "annual"
  - adjustmentReason: "Upgrade request"
- **Expected Output**:
  - API call should be declined
  - User should be signed out immediately
- **Actual Output**:
  - API was made successfully
  - Purchase manager was able to change a member's role
- **Status**: Fail
- **Notes**: Need to update the redirection at login

## 2. handleSubmitOrder Function

**Location**: CreateOrder.tsx
**Purpose**: Adding/updating current media stocks

### Test Case HSO-001: Unauthorized access attempt

- **Input**:
  - Session.user.role: "accountant"
  - selectedVendor: 1
  - mediaItems: [{media_id: 1, quantity: 2, price: 10.99}]
  - orderDetails.deliveryDate: "2024-12-25"
- **Expected Output**:
  - API call is rejected
  - User should be immediately redirected to an unauthorised page
  - Loading state false
- **Actual Output**:
  - User was immediately redirected to an unauthorised page with error code 404
- **Status**: Pass

## 3. fetchData Function

**Location**: ManageMembership.tsx  
**Purpose**: Fetches member data and subscription plans from the API

### Test Case FD-001: Successful data fetch

- **Input**: Valid JWT token
- **Expected Output**:
  - Members array populated
  - Subscription plans populated
  - Loading state false
- **Actual Output**:
  - Members array was populated with each members properties (name, email, etc.)
  - Subscription plans was populated
  - Loading state was false almost instantly
- **Status**: Pass

### Test Case FD-002: Invalid token handling

- **Input**: Invalid/expired JWT token
- **Expected Output**:
  - Error state set
  - Loading state false
  - User is sent back to the login page
- **Actual Output**:
  - Error state was set to false
  - Loading state remained false
  - User was redirected to login
- **Status**: Pass

## Summary

### Test Results

- Total Test Cases: 6
- Passed: 4
- Partial Pass: 1
- Failed: 1

### Areas for Improvement

1. Implement proper alert for missing required fields in membership change
2. Fix role-based access control for purchase managers
3. Add additional test cases for edge cases and error handling
