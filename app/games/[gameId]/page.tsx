import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GameExperience } from "@/components/game/GameExperience";
import { learningGames } from "@/data/games";
import type { GameId } from "@/types";

interface GamePageProps {
  params: Promise<{ gameId: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(learningGames).map((gameId) => ({ gameId }));
}

export async function generateMetadata({
  params
}: GamePageProps): Promise<Metadata> {
  const { gameId } = await params;
  const game = learningGames[gameId as GameId];

  return game
    ? {
        title: game.title,
        description: `${game.intro} Belajar bersama Pandi di ${game.kicker}.`
      }
    : {};
}

export default async function GamePage({ params }: GamePageProps) {
  const { gameId } = await params;

  if (!(gameId in learningGames)) notFound();

  return <GameExperience gameId={gameId as GameId} />;
}
