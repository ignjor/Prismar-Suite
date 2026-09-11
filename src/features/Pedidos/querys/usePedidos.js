import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query"; 
import { PEDIDOS_QUERY_KEY, IniciarsuscribirseAPedidos, DetenersuscribirseAPedidos } from "./pedidos.query";

export const usePedidos = () => {
    const queryClient = useQueryClient();
    const query = useQuery({
        queryKey: PEDIDOS_QUERY_KEY,
        queryFn: () => {
            return queryClient.getQueryData(PEDIDOS_QUERY_KEY) ?? [];
        },
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
    useEffect(() => {
        IniciarsuscribirseAPedidos(queryClient);

        return () => {DetenersuscribirseAPedidos();
        };
    }, [queryClient]);

    return query;
    };