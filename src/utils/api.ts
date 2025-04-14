import { Meme } from './types'

export async function fetchMemes(): Promise<Meme[]> {
	try {
		const response = await fetch('https://api.imgflip.com/get_memes')
		const data = await response.json()

		console.log(data)

		if (data.success) {
			// Take first 10 memes and transform them to our Meme format
			const memes = data.data.memes.slice(0, 20).map((meme: any, index: number) => ({
				id: index + 1,
				name: meme.name,
				imageUrl: meme.url,
				likes: Math.floor(Math.random() * 100)
			}))

			return memes
		} else {
			console.error('Failed to fetch memes from API')
			return []
		}
	} catch (error) {
		console.error('Error fetching memes:', error)
		return []
	}
}
