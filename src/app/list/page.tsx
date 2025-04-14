'use client'

import { getMemeDataFromLocalStorage } from '@/utils/localStorageHelper'
import { Meme } from '@/utils/types'
import {
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Image,
	Spinner,
} from '@heroui/react'
import { Heart } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ListPage() {
	const [memes, setMemes] = useState<Meme[]>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		// Load meme data from localStorage or API
		const fetchData = async () => {
			setIsLoading(true)
			try {
				const data = await getMemeDataFromLocalStorage()
				setMemes(data)
			} catch (error) {
				console.error('Error loading memes:', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchData()
	}, [])

	return (
		<div className='space-y-4 px-1 sm:px-4 max-w-full'>
			<h1 className='text-2xl sm:text-3xl font-bold text-center mb-3 sm:mb-6 text-white drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]'>
				Meme List
			</h1>

			{isLoading ? (
				<div className='flex justify-center items-center py-10 sm:py-20'>
					<Spinner size='lg' color='primary' />
				</div>
			) : (
				<div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4 w-full mx-auto'>
					{memes.map(meme => (
						<Card
							key={meme.id}
							className='bg-gray-900 border border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] hover:shadow-[0_0_15px_rgba(59,130,246,0.8)] hover:scale-105 transition-all duration-300 h-full flex flex-col min-w-0 w-full'
							isPressable
							onPress={() => window.open(meme.imageUrl, '_blank')}
						>
							<CardHeader className='p-0 overflow-hidden'>
								<div className='aspect-square sm:aspect-[4/3]'>
									<Image
										src={meme.imageUrl}
										alt={meme.name}
										className='w-full h-full object-cover object-center'
										radius='none'
										fallbackSrc='https://placehold.co/400x300/0f172a/3b82f6?text=Image+Not+Available'
									/>
								</div>
							</CardHeader>
							<CardBody className='p-2 sm:p-3 lg:p-4 flex-grow'>
								<h2 className='text-sm sm:text-base lg:text-lg font-bold text-white mb-1 sm:mb-2 line-clamp-1 overflow-hidden text-ellipsis'>
									{meme.name}
								</h2>
								<div className='flex items-center'>
									<Heart className='h-3 w-3 sm:h-4 sm:w-4 text-red-500 mr-1 flex-shrink-0' />
									<span className='text-xs sm:text-sm text-gray-300'>
										{meme.likes} likes
									</span>
								</div>
							</CardBody>
							<CardFooter className='pt-0 pb-2 sm:pb-3 px-2 sm:px-3 lg:px-4 mt-auto'>
								<a
									href={meme.imageUrl}
									target='_blank'
									rel='noopener noreferrer'
									className='text-xs sm:text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors'
									onClick={e => e.stopPropagation()}
								>
									View Original
								</a>
							</CardFooter>
						</Card>
					))}
				</div>
			)}
		</div>
	)
}
