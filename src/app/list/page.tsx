'use client'

import { getMemeDataFromLocalStorage } from '@/utils/localStorageHelper'
import { Meme } from '@/utils/types'
import { Spinner } from '@heroui/react'
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
		<div className='space-y-6'>
			<h1 className='text-3xl font-bold text-center mb-8 text-white drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]'>
				Meme List
			</h1>

			{isLoading ? (
				<div className='flex justify-center items-center py-20'>
					<Spinner size='lg' color='primary' />
				</div>
			) : (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
					{memes.map(meme => (
						<div
							key={meme.id}
							className='bg-gray-900 rounded-lg overflow-hidden border border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all hover:shadow-[0_0_15px_rgba(59,130,246,0.8)] hover:scale-105 flex flex-col h-full'
						>
							<div className='relative h-48 w-full overflow-hidden bg-gray-800'>
								<img
									src={meme.imageUrl}
									alt={meme.name}
									className='w-full h-full object-cover object-center'
									onError={e => {
										const target = e.target as HTMLImageElement
										target.src =
											'https://via.placeholder.com/400x300/0f172a/3b82f6?text=Image+Not+Available'
									}}
								/>
							</div>
							<div className='p-5 flex flex-col flex-grow'>
								<h2 className='text-xl font-bold text-white mb-2'>
									{meme.name}
								</h2>
								<div className='flex items-center mb-4'>
									<Heart className='h-5 w-5 text-red-500 mr-1' />
									<span className='text-gray-300'>{meme.likes} likes</span>
								</div>
								<div className='mt-auto'>
									<a
										href={meme.imageUrl}
										target='_blank'
										rel='noopener noreferrer'
										className='text-blue-400 hover:text-blue-300 hover:underline transition-colors'
									>
										View Original
									</a>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
