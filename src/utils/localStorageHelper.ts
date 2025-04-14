'use client'

import { fetchMemes } from './api'
import { Meme } from './types'

const MEME_DATA_KEY = 'meme_data'

export async function getMemeDataFromLocalStorage(): Promise<Meme[]> {
	// Get data from localStorage
	const data = localStorage.getItem(MEME_DATA_KEY)

	if (!data) {
		try {
			// If no data in localStorage, fetch from API
			const apiMemes = await fetchMemes()

			if (apiMemes.length > 0) {
				// Save the fetched memes to localStorage
				saveMemeDataToLocalStorage(apiMemes)
				return apiMemes
			} else {
				// If API fails, return empty array
				return []
			}
		} catch (error) {
			console.error('Error fetching memes from API:', error)
			// Return empty array
			return []
		}
	}

	try {
		return JSON.parse(data)
	} catch (error) {
		console.error('Error parsing meme data from localStorage:', error)
		return []
	}
}

export function saveMemeDataToLocalStorage(data: Meme[]): void {
	localStorage.setItem(MEME_DATA_KEY, JSON.stringify(data))
}

export function updateMeme(updatedMeme: Meme): void {
	const memes = JSON.parse(localStorage.getItem(MEME_DATA_KEY) || '[]')
	const updatedMemes = memes.map((meme: Meme) =>
		meme.id === updatedMeme.id ? updatedMeme : meme
	)
	saveMemeDataToLocalStorage(updatedMemes)
} 