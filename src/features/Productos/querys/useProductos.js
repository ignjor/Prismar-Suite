import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query"; 
import { PRODUCTOS_QUERY_KEY, IniciarsuscribirseAProductos, DetenersuscribirseAProductos } from "./productos.query";

export const useProductos = () => {
    const queryClient = useQueryClient();
    const query = useQuery({
        queryKey: PRODUCTOS_QUERY_KEY,
        queryFn: () => {
            return queryClient.getQueryData(PRODUCTOS_QUERY_KEY) ?? [];
        },
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
    useEffect(() => {
        IniciarsuscribirseAProductos(queryClient);

        return () => {DetenersuscribirseAProductos();
        };
    }, [queryClient]);

    return query;
    };