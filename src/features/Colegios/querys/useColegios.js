import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query"; 
import { COLEGIOS_QUERY_KEY, IniciarsuscribirseAColegios, DetenersuscribirseAColegios } from "./colegios.query";
import { EggFried } from "lucide-react";

export const useColegios = () => {
    const queryClient = useQueryClient();
    const query = useQuery({
        queryKey: COLEGIOS_QUERY_KEY,
        queryFn: () => {
            return queryClient.getQueryData(COLEGIOS_QUERY_KEY) ?? [];
        },
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
    useEffect(() => {
        IniciarsuscribirseAColegios(queryClient);
        return () => {
            DetenersuscribirseAColegios();
        };
    }, [queryClient]);
    return query;
    };