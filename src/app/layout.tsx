import MainNavbar from '@/components/Navbar'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Meme Directory',
	description: 'A collection of popular memes',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-gray-950`}
			>
				<MainNavbar />
				<main className='flex-grow container mx-auto px-4 py-8'>
					{children}
				</main>
				<footer className='py-4 border-t border-blue-800 bg-gray-900 text-gray-400 text-center text-sm'>
					<div className='container mx-auto'>
						<p>
							© {new Date().getFullYear()} Meme Directory - All rights reserved
						</p>
					</div>
				</footer>
			</body>
		</html>
	)
}
