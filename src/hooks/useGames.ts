import { useQuery } from "@tanstack/react-query";
import { fetchGames, fetchGamesCount } from "@/lib/igdb";
import { Game } from "@/types/game";

const PAGE_SIZE = 12;

interface useGamesResult {
  games: Game[] | undefined;
  isLoading: boolean;
  error: Error | null;
  totalPages: number;
  currentPage: number;
}

export const useGames = (page: number = 1): useGamesResult => {
  const offset = (page - 1) * PAGE_SIZE;

  const gamesQuery = useQuery<Game[], Error>({
    queryKey: ["games", page],
    queryFn: () => fetchGames(offset, PAGE_SIZE),
  });

  const countQuery = useQuery<number, Error>({
    queryKey: ["games-count"],
    queryFn: fetchGamesCount,
  });

  const totalCount = countQuery.data ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return {
    games: gamesQuery.data,
    isLoading: gamesQuery.isLoading || countQuery.isLoading,
    error: gamesQuery.error || countQuery.error,
    totalPages,
    currentPage: page,
  };
};
