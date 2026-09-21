import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query"; 
import { CUENTAS_QUERY_KEY, IniciarsuscribirseACuentas, DetenersuscribirseACuentas } from "./cuentas.query";

export const useCuentas = () => {
    const queryClient = useQueryClient();
    const query = useQuery({
        queryKey: CUENTAS_QUERY_KEY,
        queryFn: () => {
            return queryClient.getQueryData(CUENTAS_QUERY_KEY) ?? [];
        },
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
    useEffect(() => {
        IniciarsuscribirseACuentas(queryClient);

        return () => {DetenersuscribirseACuentas();
        };
    }, [queryClient]);

    return query;
    };