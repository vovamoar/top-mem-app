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
		<div className='space-y-6 px-2 sm:px-4'>
			<h1 className='text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-8 text-white drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]'>
				Meme List
			</h1>

			{isLoading ? (
				<div className='flex justify-center items-center py-10 sm:py-20'>
					<Spinner size='lg' color='primary' />
				</div>
			) : (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
					{memes.map(meme => (
						<Card
							key={meme.id}
							className='bg-gray-900 border border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] hover:shadow-[0_0_15px_rgba(59,130,246,0.8)] hover:scale-105 transition-all duration-300 h-full flex flex-col'
							isPressable
							onPress={() => window.open(meme.imageUrl, '_blank')}
						>
							<CardHeader className='p-0'>
								<Image
									src={meme.imageUrl}
									alt={meme.name}
									className='w-full h-36 sm:h-48 object-cover object-center'
									radius='none'
									fallbackSrc='https://placehold.co/400x300/0f172a/3b82f6?text=Image+Not+Available'
								/>
							</CardHeader>
							<CardBody className='p-4 sm:p-5 flex-grow'>
								<h2 className='text-lg sm:text-xl font-bold text-white mb-2 line-clamp-1'>
									{meme.name}
								</h2>
								<div className='flex items-center'>
									<Heart className='h-4 w-4 sm:h-5 sm:w-5 text-red-500 mr-1' />
									<span className='text-sm sm:text-base text-gray-300'>
										{meme.likes} likes
									</span>
								</div>
							</CardBody>
							<CardFooter className='pt-0 pb-4 px-4 sm:px-5 mt-auto'>
								<a
									href={meme.imageUrl}
									target='_blank'
									rel='noopener noreferrer'
									className='text-blue-400 hover:text-blue-300 hover:underline transition-colors text-sm sm:text-base'
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
