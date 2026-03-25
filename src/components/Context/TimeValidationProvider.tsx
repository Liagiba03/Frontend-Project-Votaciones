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
        const checkDeviceTime = async () => {
            try {
                const response = await fetch('https://worldtimeapi.org/api/timezone/Etc/UTC');
                if (response.ok) {
                    const data = await response.json();
                    const networkTime = moment(data.utc_datetime);
                    const deviceTime = moment();

                    const difference = Math.abs(networkTime.diff(deviceTime, 'minutes'));
                    if (difference > 5) {
                        setIsTimeValid(false);
                        //toast.error('La hora del dispositivo está desajustada. Ajusta la hora para continuar.');
                    } else {
                        setIsTimeValid(true);
                    }
                } else {
                    toast.error('Error al obtener la hora de la red.');
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