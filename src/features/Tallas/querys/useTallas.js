import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query"; 
import { TALLAS_QUERY_KEY, IniciarsuscribirseATallas, DetenersuscribirseATallas } from "./tallas.query";

export const useTallas = () => {
    const queryClient = useQueryClient();
    const query = useQuery({
        queryKey: TALLAS_QUERY_KEY,
        queryFn: () => {
            return queryClient.getQueryData(TALLAS_QUERY_KEY) ?? [];
        },
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
    useEffect(() => {
        IniciarsuscribirseATallas(queryClient);

        return () => {DetenersuscribirseATallas();
        };
    }, [queryClient]);

    return query;
    };