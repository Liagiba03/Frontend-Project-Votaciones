export interface PropuestaProps{
    _id: string,
    __v: any,
    title: string,
    status: boolean,
    start_date: string,
    options: Array<{
        id: number; // ID de la opción
        texto: string; // Texto de la opción
        votos: number; // Número de votos para la opción
    }>,
    end_date: string,
    description: string,
    creator_id: string,

}

export interface Propuesta {
    _id: string;
    propuesta: PropuestaProps;
    member: string;
    creator: boolean;
    __v: number;
}