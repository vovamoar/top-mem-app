export function validateName(name: string): string | null {
	if (!name.trim()) {
		return 'Name is required'
	}

	if (name.trim().length < 3) {
		return 'Name must be at least 3 characters'
	}

	if (name.trim().length > 100) {
		return 'Name must be less than 100 characters'
	}

	return null
}

export function validateImageUrl(url: string): string | null {
	if (!url.trim()) {
		return 'Image URL is required'
	}

	try {
		const urlObj = new URL(url)

		if (!urlObj.protocol.startsWith('http')) {
			return 'URL must start with http:// or https://'
		}

		// For image hosting services
		if (url.includes('imgflip.com') || url.includes('imgur.com')) {
			return null // These are valid image hosting services
		}

		// Check common image extensions if not from known services
		const pathname = urlObj.pathname.toLowerCase()
		const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']

		const hasValidExtension = validImageExtensions.some(ext => pathname.endsWith(ext))
		if (!hasValidExtension) {
			return 'URL must point to an image (JPG, JPEG, PNG, GIF, WEBP)'
		}
	} catch (error) {
		return 'Invalid URL format'
	}

	return null
}

export function validateLikes(likes: number): string | null {
	if (isNaN(likes)) {
		return 'Likes must be a number'
	}

	if (!Number.isInteger(likes)) {
		return 'Likes must be an integer'
	}

	if (likes < 0) {
		return 'Likes cannot be negative'
	}

	if (likes > 99) {
		return 'Likes cannot exceed 99'
	}

	return null
} 