# PSD2 Integration Setup Guide

## Overview

This guide explains how to set up PSD2 (Payment Services Directive 2) integration with Tink for the SLIM MINDER application.

## What is PSD2?

PSD2 is a European regulation that allows third-party providers to access bank account information and initiate payments on behalf of customers. This enables:

- **Account Information Services (AIS)**: Access to account balances and transaction history
- **Payment Initiation Services (PIS)**: Initiate payments from customer accounts
- **Open Banking**: Secure, standardized access to financial data

## Tink Integration

We use **Tink** as our PSD2 provider because:
- ✅ Excellent documentation and developer experience
- ✅ Good coverage of Dutch banks (ING, Rabobank, ABN AMRO, etc.)
- ✅ Stable API with good error handling
- ✅ Free sandbox for development
- ✅ Well-documented OAuth2 flow

## Setup Steps

### 1. Create Tink Account

1. Go to [Tink Console](https://console.tink.com/)
2. Sign up for a developer account
3. Create a new project
4. Note your **Client ID** and **Client Secret**

### 2. Configure Environment Variables

Create a `.env` file in `apps/api/` with the following variables:

```env
# PSD2/Tink Configuration
TINK_CLIENT_ID=your-tink-client-id
TINK_CLIENT_SECRET=your-tink-client-secret
TINK_REDIRECT_URI=http://localhost:3000/api/bank/callback
TINK_ENVIRONMENT=sandbox
```

### 3. Configure Redirect URI

In your Tink Console:
1. Go to your project settings
2. Add `http://localhost:3000/api/bank/callback` to the allowed redirect URIs
3. For production, add your production callback URL

### 4. Test the Integration

1. Start the API server: `npm run dev`
2. Test the bank connection flow:
   ```bash
   curl -X POST http://localhost:4000/api/bank/connect \
     -H "Content-Type: application/json" \
     -H "x-sm-user-id: test-user" \
     -d '{
       "provider": "tink",
       "redirectUrl": "http://localhost:3000/api/bank/callback",
       "permissions": ["accounts", "transactions"]
     }'
   ```

## OAuth2 Flow

The PSD2 integration uses OAuth2 for secure bank authentication:

1. **Authorization Request**: User initiates bank connection
2. **Bank Authentication**: User authenticates with their bank
3. **Authorization Code**: Bank returns authorization code
4. **Token Exchange**: We exchange code for access token
5. **Data Access**: Use access token to fetch account data

## API Endpoints

### POST /api/bank/connect
Initiates PSD2 bank connection.

**Request:**
```json
{
  "provider": "tink",
  "redirectUrl": "http://localhost:3000/api/bank/callback",
  "permissions": ["accounts", "transactions"]
}
```

**Response:**
```json
{
  "connectionId": "user-123-456789-abc123",
  "authUrl": "https://link.tink.com/...",
  "status": "pending"
}
```

### GET /api/bank/callback
Handles OAuth2 callback from bank.

**Query Parameters:**
- `code`: Authorization code from bank
- `state`: State parameter for security
- `error`: Error code if authentication failed

### GET /api/bank/accounts
Retrieves user's bank accounts.

**Response:**
```json
{
  "data": [
    {
      "id": "account-123",
      "name": "ING Bank - Hoofdrekening",
      "type": "checking",
      "currency": "EUR",
      "balance": 1250.50,
      "iban": "NL91ABNA0417164300",
      "status": "active"
    }
  ]
}
```

### POST /api/bank/sync
Syncs transactions from connected accounts.

**Request:**
```json
{
  "accountId": "account-123",
  "fromDate": "2024-01-01T00:00:00Z",
  "toDate": "2024-01-31T23:59:59Z"
}
```

### DELETE /api/bank/accounts/:id
Disconnects bank account and revokes access.

## Security Considerations

### Data Protection
- All access tokens are encrypted before storage
- Tokens are automatically refreshed before expiration
- Failed connections are logged for security monitoring

### Error Handling
- Network errors are handled gracefully
- Invalid tokens trigger automatic refresh
- Failed syncs are retried with exponential backoff

### Audit Logging
- All PSD2 operations are logged for compliance
- Security events are tracked (connection attempts, failures)
- User consent is recorded and maintained

## Development vs Production

### Development (Sandbox)
- Use Tink sandbox environment
- Test with mock bank data
- No real financial data involved

### Production
- Use Tink production environment
- Real bank connections and data
- Full compliance with PSD2 regulations

## Troubleshooting

### Common Issues

1. **Invalid Redirect URI**
   - Ensure redirect URI matches exactly in Tink Console
   - Check for trailing slashes or protocol mismatches

2. **Authorization Code Expired**
   - Authorization codes expire after 10 minutes
   - Implement proper error handling for expired codes

3. **Token Refresh Failed**
   - Refresh tokens can expire or be revoked
   - Prompt user to reconnect their bank account

4. **Bank Not Supported**
   - Not all banks support PSD2
   - Check Tink's bank coverage for your region

### Debug Mode

Enable debug logging by setting:
```env
LOG_LEVEL=debug
```

This will show detailed PSD2 API requests and responses.

## Next Steps

1. **Complete Integration**: Implement full transaction sync
2. **Mobile Integration**: Add PSD2 support to mobile app
3. **Payment Initiation**: Add PIS (Payment Initiation Services)
4. **Multi-Provider**: Support additional PSD2 providers
5. **Analytics**: Track connection success rates and user behavior

## Resources

- [Tink Documentation](https://docs.tink.com/)
- [PSD2 Regulation](https://ec.europa.eu/info/law/payment-services-psd-2-directive-eu-2015-2366_en)
- [Open Banking Standards](https://www.openbanking.org.uk/)
- [Dutch PSD2 Implementation](https://www.dnb.nl/psd2/)
