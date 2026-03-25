
const TimeInvalid = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Error de Hora</h1>
                <p className="text-lg text-gray-700 mb-4">
                    La hora del dispositivo está desajustada. Ajusta la hora para continuar.
                </p>
            </div>
        </div>
    );
}

export default TimeInvalid