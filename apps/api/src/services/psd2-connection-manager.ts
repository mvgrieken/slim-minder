import { logger } from '../utils/logger';
import { psd2Service } from './psd2';

// PSD2 Connection state
interface PSD2Connection {
  id: string;
  userId: string;
  provider: 'tink' | 'budget-insight' | 'nordigen';
  status: 'pending' | 'linked' | 'failed' | 'expired';
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage for connections (in production, use database)
const connections = new Map<string, PSD2Connection>();

class PSD2ConnectionManager {
  /**
   * Create a new PSD2 connection
   */
  async createConnection(userId: string, provider: string, state: string): Promise<PSD2Connection> {
    const connection: PSD2Connection = {
      id: state,
      userId,
      provider: provider as any,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    connections.set(state, connection);
    
    logger.info('PSD2 connection created', {
      connectionId: state,
      userId,
      provider
    });

    return connection;
  }

  /**
   * Get connection by ID
   */
  async getConnection(connectionId: string): Promise<PSD2Connection | null> {
    return connections.get(connectionId) || null;
  }

  /**
   * Get connection by user ID
   */
  async getConnectionByUserId(userId: string): Promise<PSD2Connection | null> {
    for (const connection of connections.values()) {
      if (connection.userId === userId && connection.status === 'linked') {
        return connection;
      }
    }
    return null;
  }

  /**
   * Update connection with tokens
   */
  async updateConnectionWithTokens(
    connectionId: string, 
    accessToken: string, 
    refreshToken: string, 
    expiresIn: number
  ): Promise<PSD2Connection | null> {
    const connection = connections.get(connectionId);
    if (!connection) {
      return null;
    }

    connection.accessToken = accessToken;
    connection.refreshToken = refreshToken;
    connection.expiresAt = new Date(Date.now() + expiresIn * 1000);
    connection.status = 'linked';
    connection.updatedAt = new Date();

    connections.set(connectionId, connection);

    logger.info('PSD2 connection updated with tokens', {
      connectionId,
      userId: connection.userId,
      expiresAt: connection.expiresAt
    });

    return connection;
  }

  /**
   * Refresh access token
   */
  async refreshConnectionToken(connectionId: string): Promise<PSD2Connection | null> {
    const connection = connections.get(connectionId);
    if (!connection || !connection.refreshToken) {
      return null;
    }

    try {
      const { accessToken, expiresIn } = await psd2Service.refreshToken(connection.refreshToken);
      
      connection.accessToken = accessToken;
      connection.expiresAt = new Date(Date.now() + expiresIn * 1000);
      connection.updatedAt = new Date();

      connections.set(connectionId, connection);

      logger.info('PSD2 connection token refreshed', {
        connectionId,
        userId: connection.userId
      });

      return connection;
    } catch (error) {
      logger.error('Failed to refresh PSD2 connection token', {
        connectionId,
        error: error instanceof Error ? error.message : String(error)
      });
      
      // Mark connection as expired
      connection.status = 'expired';
      connection.updatedAt = new Date();
      connections.set(connectionId, connection);

      return null;
    }
  }

  /**
   * Get valid access token (refresh if needed)
   */
  async getValidAccessToken(connectionId: string): Promise<string | null> {
    const connection = connections.get(connectionId);
    if (!connection) {
      return null;
    }

    // Check if token is expired or will expire soon (within 5 minutes)
    const now = new Date();
    const expiresAt = connection.expiresAt;
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

    if (!expiresAt || expiresAt <= fiveMinutesFromNow) {
      // Token is expired or will expire soon, refresh it
      const refreshedConnection = await this.refreshConnectionToken(connectionId);
      return refreshedConnection?.accessToken || null;
    }

    return connection.accessToken || null;
  }

  /**
   * Revoke connection
   */
  async revokeConnection(connectionId: string): Promise<boolean> {
    const connection = connections.get(connectionId);
    if (!connection) {
      return false;
    }

    try {
      if (connection.accessToken) {
        await psd2Service.revokeToken(connection.accessToken);
      }

      connections.delete(connectionId);

      logger.info('PSD2 connection revoked', {
        connectionId,
        userId: connection.userId
      });

      return true;
    } catch (error) {
      logger.error('Failed to revoke PSD2 connection', {
        connectionId,
        error: error instanceof Error ? error.message : String(error)
      });
      return false;
    }
  }

  /**
   * List all connections for a user
   */
  async listUserConnections(userId: string): Promise<PSD2Connection[]> {
    const userConnections: PSD2Connection[] = [];
    
    for (const connection of connections.values()) {
      if (connection.userId === userId) {
        userConnections.push(connection);
      }
    }

    return userConnections;
  }

  /**
   * Clean up expired connections
   */
  async cleanupExpiredConnections(): Promise<number> {
    const now = new Date();
    let cleanedCount = 0;

    for (const [connectionId, connection] of connections.entries()) {
      if (connection.expiresAt && connection.expiresAt < now) {
        connections.delete(connectionId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      logger.info('Cleaned up expired PSD2 connections', { cleanedCount });
    }

    return cleanedCount;
  }
}

// Create singleton instance
const psd2ConnectionManager = new PSD2ConnectionManager();

export { PSD2ConnectionManager, psd2ConnectionManager };
export type { PSD2Connection };
