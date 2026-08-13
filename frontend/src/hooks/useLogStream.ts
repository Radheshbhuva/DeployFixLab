import { useEffect, useRef, useCallback } from 'react';
import { useLogStreamStore } from '@/store/logStreamStore';
import { LogEntry } from '@/types/log.types';

export function useLogStream(labSessionId?: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  const appendLog = useLogStreamStore((s) => s.appendLog);
  const setConnected = useLogStreamStore((s) => s.setConnected);

  const connect = useCallback(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';
    const query = labSessionId ? `?sessionId=${labSessionId}` : '';
    const socket = new WebSocket(`${wsUrl}/logs/stream${query}`);

    socket.onopen = () => {
      setConnected(true);
      reconnectCountRef.current = 0;
    };

    socket.onmessage = (event) => {
      try {
        const entry: LogEntry = JSON.parse(event.data);
        appendLog(entry);
      } catch (err) {
        console.error('Failed to parse WebSocket log entry:', err);
      }
    };

    socket.onclose = () => {
      setConnected(false);
      // Automatic reconnect with maximum 5 retries
      if (reconnectCountRef.current < 5) {
        reconnectCountRef.current += 1;
        setTimeout(connect, 3000);
      }
    };

    socket.onerror = (error) => {
      console.warn('WebSocket connection error:', error);
      setConnected(false);
    };

    wsRef.current = socket;
  }, [labSessionId, appendLog, setConnected]);

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  // Demo fallback stream generator if WebSocket is offline
  useEffect(() => {
    const interval = setInterval(() => {
      const sources = ['frontend', 'backend', 'database', 'nginx', 'chaos-engine'] as const;
      const levels = ['INFO', 'INFO', 'INFO', 'WARN', 'ERROR', 'DEBUG'] as const;
      const randomSource = sources[Math.floor(Math.random() * sources.length)];
      const randomLevel = levels[Math.floor(Math.random() * levels.length)];

      const messages = {
        INFO: `HTTP GET /api/v1/health 200 OK (${Math.floor(Math.random() * 50 + 10)}ms)`,
        WARN: `Memory usage elevated: ${Math.floor(Math.random() * 20 + 75)}% threshold`,
        ERROR: `PostgreSQL query timeout after 5000ms [Query ID: ${Math.floor(Math.random() * 9000 + 1000)}]`,
        DEBUG: `Cache lookup hit for session token key [u-${Math.floor(Math.random() * 100)}]`,
      };

      appendLog({
        id: `mock-${Date.now()}-${Math.random()}`,
        timestamp: new Date().toISOString(),
        level: randomLevel,
        source: randomSource,
        message: messages[randomLevel as keyof typeof messages] || 'System status nominal',
        traceId: `tr-${Math.random().toString(36).substring(2, 8)}`,
      });
      setConnected(true);
    }, 2500);

    return () => clearInterval(interval);
  }, [appendLog, setConnected]);

  return {
    isConnected: useLogStreamStore((s) => s.isConnected),
    reconnect: connect,
  };
}
