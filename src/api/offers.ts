import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/gsm_hurt_axios';

import { TOfferType } from 'src/types/offers';

// ----------------------------------------------------------------------

export function useGetOffers({ status, minSold, available }: { status: string; minSold: number; available: number }) {
    const URL = endpoints.allegro.offers;

    const { data, isLoading, error, isValidating } = useSWR(
        `${URL}?status=${status}&minSold=${minSold}&available=${available}`,
        fetcher
    );

    const memoizedValue = useMemo(
        () => ({
            offers: (data?.offers as TOfferType[]) || [],
            offersLoading: isLoading,
            offersError: error,
            offersValidating: isValidating,
            offersEmpty: !isLoading && !data?.offers.length,
        }),
        [data?.offers, error, isLoading, isValidating]
    );

    return memoizedValue;
}
