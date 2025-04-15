'use client'

import { Meme } from '@/utils/types'
import {
	validateImageUrl,
	validateLikes,
	validateName,
} from '@/utils/validators'
import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@heroui/react'
import { AlertCircle } from 'lucide-react'
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

	const [previewUrl, setPreviewUrl] = useState<string>('')
	const [isPreviewError, setIsPreviewError] = useState<boolean>(false)

	useEffect(() => {
		if (meme) {
			setFormData({
				name: meme.name,
				imageUrl: meme.imageUrl,
				likes: meme.likes,
			})
			setPreviewUrl(meme.imageUrl)
		}
	}, [meme])

	// Проверка URL и загрузка превью при изменении URL
	useEffect(() => {
		const validateUrl = async () => {
			const error = validateImageUrl(formData.imageUrl)
			setErrors(prev => ({ ...prev, imageUrl: error }))

			// Если URL валиден, обновляем предпросмотр
			if (!error && formData.imageUrl) {
				setPreviewUrl(formData.imageUrl)
				setIsPreviewError(false)
			}
		}

		validateUrl()
	}, [formData.imageUrl])

	const validateForm = (): boolean => {
		const newErrors = {
			name: validateName(formData.name),
			imageUrl: validateImageUrl(formData.imageUrl),
			likes: validateLikes(formData.likes),
		}

		setErrors(newErrors)

		return (
			!newErrors.name &&
			!newErrors.imageUrl &&
			!newErrors.likes &&
			!isPreviewError
		)
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

		// Валидация при изменении
		if (field === 'name') {
			setErrors(prev => ({ ...prev, name: validateName(value as string) }))
		} else if (field === 'likes') {
			setErrors(prev => ({ ...prev, likes: validateLikes(value as number) }))
		}
	}

	// Проверка возможности сохранения формы
	const canSave =
		!errors.name && !errors.imageUrl && !errors.likes && !isPreviewError

	if (!meme) return null

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			backdrop='blur'
			size='sm'
			placement='center'
			scrollBehavior='inside'
			classNames={{
				base: 'bg-gray-800 shadow-[0_0_15px_rgba(59,130,246,0.7)] border border-blue-500 max-w-md mx-auto my-auto rounded-xl',
				header: 'border-b border-gray-700',
				footer: 'border-t border-gray-700',
				closeButton:
					'hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 absolute top-3 right-3 text-gray-400 hover:bg-gray-700 focus:outline-none',
			}}
		>
			<ModalContent>
				<ModalHeader className='flex justify-between items-center py-3 sm:py-4'>
					<h3 className='text-lg sm:text-xl font-bold text-blue-400'>
						Edit Meme
					</h3>
				</ModalHeader>

				<ModalBody className='py-3 sm:py-4'>
					<form id='edit-meme-form' onSubmit={handleSubmit}>
						<div className='space-y-3 sm:space-y-4'>
							<div>
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
									classNames={{
										inputWrapper:
											'bg-gray-700 border border-gray-600 rounded px-2 py-1',
										input:
											'text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-500',
									}}
									variant='bordered'
								/>
								{errors.name && (
									<p className='mt-1 text-sm text-red-500'>{errors.name}</p>
								)}
							</div>

							<div>
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
									classNames={{
										inputWrapper:
											'bg-gray-700 border border-gray-600 rounded px-2 py-1',
										input:
											'text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-500',
									}}
									variant='bordered'
									color={errors.imageUrl ? 'danger' : 'default'}
									description={
										errors.imageUrl ||
										'Поддерживается: JPG, JPEG, PNG, GIF, WEBP'
									}
								/>
							</div>

							{/* Предпросмотр изображения */}
							{formData.imageUrl && !errors.imageUrl && (
								<div className='mt-2'>
									<label className='block text-sm font-medium text-gray-300 mb-2'>
										Предпросмотр
									</label>
									<div className='relative w-full aspect-[4/3] bg-gray-700 rounded overflow-hidden'>
										{previewUrl ? (
											<img
												src={previewUrl}
												alt='Preview'
												className='object-contain w-full h-full'
												onError={() => setIsPreviewError(true)}
												onLoad={() => setIsPreviewError(false)}
											/>
										) : null}

										{isPreviewError && (
											<div className='absolute inset-0 flex flex-col items-center justify-center text-red-400 p-4'>
												<AlertCircle size={40} />
												<p className='text-center mt-2'>
													Невозможно загрузить изображение по указанной ссылке
												</p>
											</div>
										)}
									</div>
								</div>
							)}

							<div>
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
									classNames={{
										inputWrapper:
											'bg-gray-700 border border-gray-600 rounded px-2 py-1',
										input:
											'text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-500',
									}}
									variant='bordered'
								/>
								{errors.likes && (
									<p className='mt-1 text-sm text-red-500'>{errors.likes}</p>
								)}
							</div>
						</div>
					</form>
				</ModalBody>

				<ModalFooter className='py-3 sm:py-4'>
					<Button
						color='default'
						variant='flat'
						onPress={onClose}
						className='bg-gray-600 text-white hover:bg-gray-700 cursor-pointer rounded'
					>
						Cancel
					</Button>
					<Button
						color='primary'
						type='submit'
						form='edit-meme-form'
						isDisabled={!canSave}
						className='bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded px-2 py-1'
					>
						Save Changes
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}
