import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query"; 
import { TIPOPRENDA_QUERY_KEY, IniciarsuscribirseATipoPrenda, DetenersuscribirseATipoPrenda } from "./tipoPrenda.query";

export const useTipoPrenda = () => {
    const queryClient = useQueryClient();
    const query = useQuery({
        queryKey: TIPOPRENDA_QUERY_KEY,
        queryFn: () => {
            return queryClient.getQueryData(TIPOPRENDA_QUERY_KEY) ?? [];
        },
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
    useEffect(() => {
        IniciarsuscribirseATipoPrenda(queryClient);

        return () => {DetenersuscribirseATipoPrenda();
        };
    }, [queryClient]);

    return query;
    };