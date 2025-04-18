import { Meme } from './types'

type ImgflipMeme = {
  id: string
  name: string
  url: string
  width: number
  height: number
  box_count: number
  captions: number
}

type ImgflipResponse = {
  success: boolean
  data: {
    memes: ImgflipMeme[]
  }
}

export async function fetchMemes(): Promise<Meme[]> {
  try {
    const response = await fetch('https://api.imgflip.com/get_memes')
    const data: ImgflipResponse = await response.json()

    console.log(data)

    if (data.success) {
      const memes = data.data.memes.map((meme, index) => ({
        id: index + 1,
        name: meme.name,
        imageUrl: meme.url,
        likes: Math.floor(Math.random() * 100),
        captions: meme.captions
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
