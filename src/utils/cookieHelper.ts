'use client'

import Cookies from 'js-cookie'
import { fetchMemes } from './api'
import { initialMemeData } from './memeData'
import { Meme } from './types'

const MEME_DATA_KEY = 'meme_data'

export async function getMemeDataFromCookies(): Promise<Meme[]> {
	const data = Cookies.get(MEME_DATA_KEY)

	if (!data) {
		try {
			// If no data in cookies, fetch from API
			const apiMemes = await fetchMemes()

			if (apiMemes.length > 0) {
				// Save the fetched memes to cookies
				saveMemeDataToCookies(apiMemes)
				return apiMemes
			} else {
				// If API fails, fallback to initial data
				saveMemeDataToCookies(initialMemeData)
				return initialMemeData
			}
		} catch (error) {
			console.error('Error fetching memes from API:', error)
			// Fallback to initial data
			saveMemeDataToCookies(initialMemeData)
			return initialMemeData
		}
	}

	try {
		return JSON.parse(data)
	} catch (error) {
		console.error('Error parsing meme data from cookies:', error)
		return initialMemeData
	}
}

export function saveMemeDataToCookies(data: Meme[]): void {
	Cookies.set(MEME_DATA_KEY, JSON.stringify(data), { expires: 30 })
}

export function updateMeme(updatedMeme: Meme): void {
	const memes = JSON.parse(Cookies.get(MEME_DATA_KEY) || '[]')
	const updatedMemes = memes.map((meme: Meme) =>
		meme.id === updatedMeme.id ? updatedMeme : meme
	)
	saveMemeDataToCookies(updatedMemes)
} 