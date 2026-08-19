import { useEffect, useRef, useCallback } from 'react';

export default function useRealtimeAdmin({ onNewAppointment } = {}) {
  const esRef = useRef(null);

  const connect = useCallback(() => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const es = new EventSource(`${BASE_URL}/sse/events`);
    esRef.current = es;

    es.addEventListener('new_appointment', (e) => {
      try {
        const data = JSON.parse(e.data);
        if (onNewAppointment) onNewAppointment(data);
      } catch {}
    });

    es.onerror = () => {
      es.close();
      // Reconnect after 5 seconds
      setTimeout(connect, 5000);
    };

    return es;
  }, [onNewAppointment]);

  useEffect(() => {
    const es = connect();
    return () => {
      es.close();
    };
  }, [connect]);
}
