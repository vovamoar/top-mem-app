'use client'

import { Meme } from '@/utils/types'
import {
	validateImageUrl,
	validateLikes,
	validateName,
} from '@/utils/validators'
import { Button, Input } from '@heroui/react'
import { X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

interface EditMemeModalProps {
	isOpen: boolean
	onClose: () => void
	meme: Meme | null
	onSave: (updatedMeme: Meme) => void
}

export default function EditMemeModal({
	isOpen,
	onClose,
	meme,
	onSave,
}: EditMemeModalProps) {
	const [formData, setFormData] = useState<Omit<Meme, 'id'>>({
		name: '',
		imageUrl: '',
		likes: 0,
	})

	const [errors, setErrors] = useState<{
		name: string | null
		imageUrl: string | null
		likes: string | null
	}>({
		name: null,
		imageUrl: null,
		likes: null,
	})

	useEffect(() => {
		if (meme) {
			setFormData({
				name: meme.name,
				imageUrl: meme.imageUrl,
				likes: meme.likes,
			})
		}
	}, [meme])

	const validateForm = (): boolean => {
		const newErrors = {
			name: validateName(formData.name),
			imageUrl: validateImageUrl(formData.imageUrl),
			likes: validateLikes(formData.likes),
		}

		setErrors(newErrors)

		return !newErrors.name && !newErrors.imageUrl && !newErrors.likes
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (validateForm() && meme) {
			onSave({
				...formData,
				id: meme.id,
			})
			onClose()
		}
	}

	const handleChange = <K extends keyof typeof formData>(
		field: K,
		value: (typeof formData)[K]
	) => {
		setFormData(prev => ({
			...prev,
			[field]: value,
		}))
	}

	if (!meme) return null

	return (
		<div
			className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto ${
				isOpen ? 'block' : 'hidden'
			}`}
		>
			<div
				className='fixed inset-0 bg-black bg-opacity-70 transition-opacity'
				onClick={onClose}
			></div>

			<div className='relative bg-gray-800 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.7)] border border-blue-500 max-w-md w-full mx-4 sm:mx-auto z-50'>
				<div className='flex items-center justify-between p-4 border-b border-gray-700'>
					<h3 className='text-xl font-bold text-blue-400'>Edit Meme</h3>
					<Button
						isIconOnly
						variant='light'
						color='default'
						onClick={onClose}
						className='bg-gray-800'
					>
						<X size={20} className='text-gray-400' />
					</Button>
				</div>
				<form onSubmit={handleSubmit}>
					<div className='p-6'>
						<div className='mb-4'>
							<label
								htmlFor='meme-name'
								className='block text-sm font-medium text-gray-300 mb-1'
							>
								Name <span className='text-red-500'>*</span>
							</label>
							<Input
								id='meme-name'
								type='text'
								value={formData.name}
								onChange={e => handleChange('name', e.target.value)}
								placeholder='Enter meme name'
								className='bg-gray-700 text-white border-gray-600'
								variant='bordered'
							/>
							{errors.name && (
								<p className='mt-1 text-sm text-red-500'>{errors.name}</p>
							)}
						</div>

						<div className='mb-4'>
							<label
								htmlFor='meme-image'
								className='block text-sm font-medium text-gray-300 mb-1'
							>
								Image URL (JPG format) <span className='text-red-500'>*</span>
							</label>
							<Input
								id='meme-image'
								type='text'
								value={formData.imageUrl}
								onChange={e => handleChange('imageUrl', e.target.value)}
								placeholder='https://example.com/image.jpg'
								className='bg-gray-700 text-white border-gray-600'
								variant='bordered'
							/>
							{errors.imageUrl && (
								<p className='mt-1 text-sm text-red-500'>{errors.imageUrl}</p>
							)}
						</div>

						<div className='mb-4'>
							<label
								htmlFor='meme-likes'
								className='block text-sm font-medium text-gray-300 mb-1'
							>
								Likes (0-99) <span className='text-red-500'>*</span>
							</label>
							<Input
								id='meme-likes'
								type='number'
								value={formData.likes.toString()}
								onChange={e =>
									handleChange('likes', parseInt(e.target.value) || 0)
								}
								className='bg-gray-700 text-white border-gray-600'
								variant='bordered'
							/>
							{errors.likes && (
								<p className='mt-1 text-sm text-red-500'>{errors.likes}</p>
							)}
						</div>
					</div>

					<div className='flex justify-end space-x-2 mx-6 mb-6'>
						<Button
							color='default'
							variant='flat'
							onClick={onClose}
							className='bg-gray-600 text-white hover:bg-gray-700'
						>
							Cancel
						</Button>
						<Button
							color='primary'
							type='submit'
							className='bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]'
						>
							Save Changes
						</Button>
					</div>
				</form>
			</div>
		</div>
	)
}
