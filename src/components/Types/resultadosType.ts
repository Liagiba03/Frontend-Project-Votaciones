export interface Resultado {
    _id: string;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    ganador: string;
    resultados: Array<{
        id: number; // ID de la opción
        texto: string; // Texto de la opción
        votos: number; // Número de votos para la opción
    }>;
    totalVotos: number; // Total de votos emitidos
}