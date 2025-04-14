'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
	const router = useRouter()

	useEffect(() => {
		const timer = setTimeout(() => {
			router.replace('/table')
		}, 1500)

		return () => clearTimeout(timer)
	}, [router])

	return (
		<div className='flex min-h-screen flex-col items-center justify-center'>
			<div className='text-center'>
				<h1 className='text-4xl font-bold mb-4 text-blue-400 neon-text'>
					Meme Directory
				</h1>
				<p className='text-gray-300 mb-8'>Loading the dankest memes...</p>
				<div className='relative w-24 h-24 mx-auto'>
					<div className='absolute w-full h-full border-4 border-t-blue-500 border-r-transparent border-b-blue-300 border-l-transparent rounded-full animate-spin'></div>
					<div className='absolute w-full h-full border-4 border-t-transparent border-r-blue-400 border-b-transparent border-l-blue-400 rounded-full animate-ping opacity-30'></div>
				</div>
			</div>
		</div>
	)
}
