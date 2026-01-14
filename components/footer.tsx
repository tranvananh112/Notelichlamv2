"use client"

export default function Footer() {
    return (
        <footer className="sticky bottom-0 z-40 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 dark:from-red-700 dark:via-yellow-600 dark:to-red-700 shadow-lg">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-center">
                    <div className="relative w-full max-w-md">
                        <img
                            src="/animations/gif tết.gif"
                            alt="Tết Animation"
                            className="w-full h-auto object-contain rounded-lg shadow-xl"
                            style={{ maxHeight: "120px" }}
                        />
                    </div>
                </div>
            </div>
        </footer>
    )
}
