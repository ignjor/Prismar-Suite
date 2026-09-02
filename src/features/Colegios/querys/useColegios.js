import { useQuery, useQueryClient } from "@tanstack/react-query"; 
import { COLEGIOS_QUERY_KEY, suscribirseAColegios } from "./colegios.query";

export const useColegios = () => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: COLEGIOS_QUERY_KEY,

        queryFn: async () => {
            return new Promise((resolve, reject) => {
                let primeraRespuesta = true;

                const unsubscribe = suscribirseAColegios(
                    (colegios) => {
                        if (primeraRespuesta) {
                            primeraRespuesta = false;
                            resolve(colegios);
                            return;
                        }
                        queryClient.setQueryData(
                            COLEGIOS_QUERY_KEY,
                            colegios
                        );
                    },
                    (error) => {
                        reject(error);
                    }
                );
                return unsubscribe;
            });
        },
        staleTime: Infinity,
    });
    return query;
};
