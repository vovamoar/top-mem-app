import { Meme } from './types'

export async function fetchMemes(): Promise<Meme[]> {
	try {
		const response = await fetch('https://api.imgflip.com/get_memes')
		const data = await response.json()

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

// Alternative implementation that directly manages meme data
export class MemeService {
	private static STORAGE_KEY = 'meme_data_api'

	// Get memes - first try localStorage, then API
	static async getMemes(): Promise<Meme[]> {
		// Check localStorage first
		const storedData = localStorage.getItem(this.STORAGE_KEY)

		if (storedData) {
			try {
				return JSON.parse(storedData)
			} catch (error) {
				console.error('Error parsing stored meme data:', error)
			}
		}

		// If no stored data or error parsing, fetch from API
		try {
			const memes = await fetchMemes()
			if (memes.length > 0) {
				// Store in localStorage for future use
				localStorage.setItem(this.STORAGE_KEY, JSON.stringify(memes))
				return memes
			}
		} catch (error) {
			console.error('Error fetching memes from API:', error)
		}

		// Return empty array if all else fails
		return []
	}

	// Update a meme
	static async updateMeme(updatedMeme: Meme): Promise<Meme[]> {
		const memes = await this.getMemes()
		const updatedMemes = memes.map(meme =>
			meme.id === updatedMeme.id ? updatedMeme : meme
		)

		// Save back to localStorage
		localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedMemes))

		return updatedMemes
	}

	// Clear stored memes (useful for testing)
	static clearMemes(): void {
		localStorage.removeItem(this.STORAGE_KEY)
	}
} 