'use client';

import { authService } from './auth';

export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: Date;
}

export interface NotificationData {
  id: string;
  type: 'submission' | 'bounty_update' | 'payment' | 'system';
  title: string;
  message: string;
  userId: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectInterval: number = 5000; // 5 seconds
  private maxReconnectAttempts: number = 5;
  private reconnectAttempts: number = 0;
  private listeners: Map<string, ((data: any) => void)[]> = new Map();
  private isConnecting: boolean = false;

  // Connect to WebSocket server
  connect(): void {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    const authState = authService.getState();
    if (!authState.user || !authState.token) {
      console.warn('Cannot connect to WebSocket: User not authenticated');
      return;
    }

    this.isConnecting = true;
    // Fixed for Vite environment variables
    const wsUrl = `${import.meta.env.VITE_WS_URL}/ws/${authState.user.id}?token=${authState.token}`;

    try {
      this.ws = new WebSocket(wsUrl);
      this.setupEventListeners();
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  // Disconnect from WebSocket
  disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, 'User disconnected');
      this.ws = null;
    }
    this.isConnecting = false;
    this.reconnectAttempts = 0;
  }

  // Set up WebSocket event listeners
  private setupEventListeners(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      
      // Send heartbeat to keep connection alive
      this.startHeartbeat();
      
      this.emit('connected', { timestamp: new Date() });
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        message.timestamp = new Date(message.timestamp);
        
        // Emit to specific type listeners
        this.emit(message.type, message.payload);
        
        // Emit to general message listeners
        this.emit('message', message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      this.ws = null;
      this.isConnecting = false;
      
      this.emit('disconnected', { code: event.code, reason: event.reason });
      
      // Only reconnect if it wasn't a clean close
      if (event.code !== 1000) {
        this.scheduleReconnect();
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    };
  }

  // Send message through WebSocket
  send(type: string, payload: any): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected, cannot send message');
      return false;
    }

    try {
      const message: WebSocketMessage = {
        type,
        payload,
        timestamp: new Date()
      };
      this.ws.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Failed to send WebSocket message:', error);
      return false;
    }
  }

  // Subscribe to specific message types
  on(type: string, listener: (data: any) => void): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type)!.push(listener);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(type);
      if (listeners) {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  // Remove all listeners for a type
  off(type: string): void {
    this.listeners.delete(type);
  }

  // Emit message to listeners
  private emit(type: string, data: any): void {
    const listeners = this.listeners.get(type);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error(`Error in WebSocket listener for ${type}:`, error);
        }
      });
    }
  }

  // Schedule reconnection attempt
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max WebSocket reconnection attempts reached');
      this.emit('max_reconnect_attempts', { attempts: this.reconnectAttempts });
      return;
    }

    const delay = this.reconnectInterval * Math.pow(2, this.reconnectAttempts);
    console.log(`Scheduling WebSocket reconnect in ${delay}ms (attempt ${this.reconnectAttempts + 1})`);
    
    setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }

  // Send periodic heartbeat to keep connection alive
  private startHeartbeat(): void {
    setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send('heartbeat', { timestamp: Date.now() });
      }
    }, 30000); // Every 30 seconds
  }

  // Get connection status
  getStatus(): 'connecting' | 'connected' | 'disconnected' {
    if (this.isConnecting) return 'connecting';
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return 'connected';
    return 'disconnected';
  }
}

// Export singleton instance
export const wsService = new WebSocketService();

// React hook for using WebSocket service
import { useState, useEffect } from 'react';

export function useWebSocket(): {
  status: 'connecting' | 'connected' | 'disconnected';
  send: (type: string, payload: any) => boolean;
  subscribe: (type: string, listener: (data: any) => void) => () => void;
} {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');

  useEffect(() => {
    // Connect when component mounts
    wsService.connect();

    // Subscribe to connection status changes
    const unsubscribeConnected = wsService.on('connected', () => setStatus('connected'));
    const unsubscribeDisconnected = wsService.on('disconnected', () => setStatus('disconnected'));

    // Set initial status
    setStatus(wsService.getStatus());

    // Cleanup on unmount
    return () => {
      unsubscribeConnected();
      unsubscribeDisconnected();
    };
  }, []);

  return {
    status,
    send: wsService.send.bind(wsService),
    subscribe: wsService.on.bind(wsService)
  };
}

// Real-time notifications hook
export function useNotifications(): {
  notifications: NotificationData[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  clearAll: () => void;
} {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  
  useEffect(() => {
    const unsubscribe = wsService.on('notification', (notification: NotificationData) => {
      setNotifications(prev => [notification, ...prev]);
    });

    return unsubscribe;
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
    
    // Send read status to server
    wsService.send('mark_notification_read', { notificationId: id });
  };

  const clearAll = () => {
    setNotifications([]);
    wsService.send('clear_notifications', {});
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    clearAll
  };
}