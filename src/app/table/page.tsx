'use client'

import EditMemeModal from '@/components/EditMemeModal'
import {
	getMemeDataFromLocalStorage,
	updateMeme,
} from '@/utils/localStorageHelper'
import { Meme } from '@/utils/types'
import {
	Button,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from '@heroui/react'
import { Edit } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function TablePage() {
	const [memes, setMemes] = useState<Meme[]>([])
	const [selectedMeme, setSelectedMeme] = useState<Meme | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		// Check if we're on mobile
		setIsMobile(window.innerWidth < 640)

		// Add resize listener
		const handleResize = () => {
			setIsMobile(window.innerWidth < 640)
		}

		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

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

	const handleEditClick = (meme: Meme) => {
		setSelectedMeme(meme)
		setIsModalOpen(true)
	}

	const handleSaveMeme = (updatedMeme: Meme) => {
		// Update in local state
		const updatedMemes = memes.map(meme =>
			meme.id === updatedMeme.id ? updatedMeme : meme
		)
		setMemes(updatedMemes)

		// Save to localStorage
		updateMeme(updatedMeme)

		// Close modal
		setIsModalOpen(false)
		setSelectedMeme(null)
	}

	return (
		<div className='space-y-6 px-2 sm:px-4'>
			<h1 className='text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-8 text-white drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]'>
				Meme Table
			</h1>

			{isLoading ? (
				<div className='flex justify-center items-center py-10 sm:py-20'>
					<Spinner size='lg' color='primary' />
				</div>
			) : (
				<div className='rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.6)] border border-blue-500 overflow-x-auto'>
					<Table
						aria-label='Meme table'
						removeWrapper
						hideHeader={isMobile}
						classNames={{
							base: 'min-w-full',
							thead: 'bg-gray-800',
							tbody: 'bg-gray-900 divide-y divide-gray-700',
							tr: 'divide-x divide-gray-700',
							th: 'text-left text-xs font-medium text-blue-400 uppercase tracking-wider py-3 px-3 sm:px-6',
							td: 'px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-300',
							table: 'w-full',
						}}
					>
						<TableHeader>
							<TableColumn className='hidden sm:table-cell'>ID</TableColumn>
							<TableColumn>Name</TableColumn>
							<TableColumn className='hidden md:table-cell'>
								Image URL
							</TableColumn>
							<TableColumn>Likes</TableColumn>
							<TableColumn>Actions</TableColumn>
						</TableHeader>
						<TableBody>
							{memes.map((meme, index) => (
								<TableRow
									key={meme.id}
									className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}
								>
									<TableCell className='hidden sm:table-cell'>
										{meme.id}
									</TableCell>
									<TableCell className='max-w-[120px] sm:max-w-none truncate'>
										{meme.name}
									</TableCell>
									<TableCell className='hidden md:table-cell truncate'>
										{meme.imageUrl}
									</TableCell>
									<TableCell>{meme.likes}</TableCell>
									<TableCell>
										<Button
											color='primary'
											size='sm'
											startContent={<Edit size={16} className='mr-1' />}
											onPress={() => handleEditClick(meme)}
											className='bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 
												text-white font-medium rounded-md px-3 sm:px-4 py-1 sm:py-2
												shadow-[0_0_12px_rgba(59,130,246,0.6)] hover:shadow-[0_0_18px_rgba(59,130,246,0.8)]
												border border-blue-400 
												transition-all duration-300 ease-in-out
												hover:scale-105 active:scale-95
												cursor-pointer'
										>
											Edit
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}

			<EditMemeModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				meme={selectedMeme}
				onSave={handleSaveMeme}
			/>
		</div>
	)
}
