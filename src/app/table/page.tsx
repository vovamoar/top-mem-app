'use client'

import EditMemeModal from '@/components/EditMemeModal'
import {
	getMemeDataFromLocalStorage,
	updateMeme,
} from '@/utils/localStorageHelper'
import { Meme } from '@/utils/types'
import { Button, Spinner } from '@heroui/react'
import { Edit } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function TablePage() {
	const [memes, setMemes] = useState<Meme[]>([])
	const [selectedMeme, setSelectedMeme] = useState<Meme | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
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
		<div className='space-y-6'>
			<h1 className='text-3xl font-bold text-center mb-8 text-white drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]'>
				Meme Table
			</h1>

			{isLoading ? (
				<div className='flex justify-center items-center py-20'>
					<Spinner size='lg' color='primary' />
				</div>
			) : (
				<div className='overflow-x-auto rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.6)] border border-blue-500'>
					<table className='min-w-full divide-y divide-gray-200'>
						<thead className='bg-gray-800'>
							<tr>
								<th className='px-6 py-3 text-left text-xs font-medium text-blue-400 uppercase tracking-wider'>
									ID
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-blue-400 uppercase tracking-wider'>
									Name
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-blue-400 uppercase tracking-wider'>
									Image URL
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-blue-400 uppercase tracking-wider'>
									Likes
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-blue-400 uppercase tracking-wider'>
									Actions
								</th>
							</tr>
						</thead>
						<tbody className='bg-gray-900 divide-y divide-gray-700'>
							{memes.map((meme, index) => (
								<tr
									key={meme.id}
									className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}
								>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
										{meme.id}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
										{meme.name}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
										{meme.imageUrl}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
										{meme.likes}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
										<Button
											color='primary'
											size='sm'
											startContent={<Edit size={16} />}
											onClick={() => handleEditClick(meme)}
											className='shadow-[0_0_5px_rgba(59,130,246,0.5)]'
										>
											Edit
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
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
