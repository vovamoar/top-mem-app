'use client';

import { Card, Spinner } from '@heroui/react';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { fetchMemes } from '@/utils/api';
import { Meme } from '@/utils/types';

export default function TopMemspage() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchMemes();
        setMemes(data);
      } catch {
        return new Error('Failed to fetch memes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log('TOP MEMS', memes);

  return (
    <div className="space-y-4 px-1 sm:px-4 max-w-full">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-3 sm:mb-6 text-white drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">
        Top 10 Memes
      </h1>

      {isLoading ? (
        <div className="flex justify-center items-center py-10 sm:py-20">
          <Spinner size="lg" color="primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4 w-full mx-auto">
          {memes
            .sort((a, b) => b.captions - a.captions)
            .slice(0, 10)
            .map(meme => (
              <Card
                key={meme.id}
                className="bg-gray-900 border border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] hover:shadow-[0_0_15px_rgba(59,130,246,0.8)] hover:scale-105 transition-all duration-300 flex flex-col min-w-0 w-full overflow-hidden"
                isPressable
                onPress={() => window.open(meme.imageUrl, '_blank')}
              >
                <div className="relative w-full aspect-square sm:aspect-[4/3] overflow-hidden bg-gray-800">
                  <Image
                    width={400}
                    height={300}
                    src={meme.imageUrl}
                    alt={meme.name}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    onError={e => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null; // Prevent infinite loop
                      target.src =
                        'https://placehold.co/400x300/0f172a/3b82f6?text=Image+Not+Available';
                    }}
                  />
                </div>

                <div className="flex flex-col p-2 sm:p-3 flex-grow justify-between">
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-white mb-1 sm:mb-2 line-clamp-1 overflow-hidden text-ellipsis">
                      {meme.name}
                    </h2>
                    <div className="flex items-center">
                      <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 mr-1 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-gray-300">{meme.likes} likes</span>
                    </div>
                  </div>

                  <div className="mt-2 pt-1 sm:pt-2 border-t border-gray-800 w-full">
                    <a
                      href={meme.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors block"
                      onClick={e => e.stopPropagation()}
                    >
                      View Original
                    </a>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}
