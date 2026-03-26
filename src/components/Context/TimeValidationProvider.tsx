import React, { createContext, useState, useEffect, useContext } from 'react';
import moment from 'moment';
import toast from 'react-hot-toast';

// Define la interfaz para el contexto
export interface TimeValidationContextProps {
    isTimeValid: boolean;
}

// Crea el contexto con un valor inicial
export const TimeValidationContext = createContext<TimeValidationContextProps>({
    isTimeValid: true,
});

// Define las props para el proveedor
interface TimeValidationProviderProps {
    children: React.ReactNode;
}

// Implementa el proveedor del contexto
export const TimeValidationProvider: React.FC<TimeValidationProviderProps> = ({ children }) => {
    const [isTimeValid, setIsTimeValid] = useState(true);

    useEffect(() => {
        const fetchWithTimeout = async (url: string, timeoutMs = 8000) => {
            const controller = new AbortController();
            const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

            try {
                return await fetch(url, { signal: controller.signal });
            } finally {
                window.clearTimeout(timeoutId);
            }
        };

        const getNetworkUtcTime = async () => {
            // API principal (suele ser estable) y fallback.
            const sources = [
                'https://timeapi.io/api/Time/current/zone?timeZone=UTC',
                'https://worldtimeapi.org/api/timezone/Etc/UTC',
            ];

            for (const source of sources) {
                try {
                    const response = await fetchWithTimeout(source);
                    if (!response.ok) continue;

                    const data = await response.json();
                    const utcValue = data.utcDateTime || data.utc_datetime || data.dateTime;
                    if (!utcValue) continue;

                    const parsed = moment(utcValue);
                    if (parsed.isValid()) {
                        return parsed;
                    }
                } catch {
                    // Si una API falla, intentamos la siguiente.
                }
            }

            throw new Error('No fue posible obtener la hora de red desde las APIs disponibles.');
        };

        const checkDeviceTime = async () => {
            try {
                const networkTime = await getNetworkUtcTime();
                const deviceTime = moment();

                const difference = Math.abs(networkTime.diff(deviceTime, 'minutes'));
                if (difference > 5) {
                    setIsTimeValid(false);
                    //toast.error('La hora del dispositivo está desajustada. Ajusta la hora para continuar.');
                } else {
                    setIsTimeValid(true);
                }
            } catch (error: any) {
                toast.error(error.message || 'Error al verificar la hora del dispositivo.');
            }
        };

        checkDeviceTime();

        const interval = setInterval(() => {
            checkDeviceTime();
        }, 30000); // Verifica cada 10 segundos

        return () => clearInterval(interval);
    }, []);

    return (
        <TimeValidationContext.Provider value={{ isTimeValid }}>
            {children}
        </TimeValidationContext.Provider>
    );
};

// Hook para usar el contexto
export const useTimeValidation = () => useContext(TimeValidationContext);