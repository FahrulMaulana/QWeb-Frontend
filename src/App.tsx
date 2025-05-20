import axios from "axios"
import { useState } from "react"
import { LogoCarouselDemo } from "./component/Logocareousel"
import Lottie1 from "./component/lottie"
import { ShineBorder } from "./components/magicui/shine-border"
import { Button } from "./components/ui/button"

function App() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [audioData, setAudioData] = useState<ArrayBuffer | null>(null)
  
  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url) {
      setError("Please enter a YouTube URL")

      return
    }
    
    setLoading(true)
    setError(null)
    setSuccess(null)
    setAudioData(null)
    
    try {
      // Use responseType: 'arraybuffer' to handle binary data
      const response = await axios.get(`/api/hello/convert-mp3?link=${encodeURIComponent(url)}`, {
        responseType: 'arraybuffer'
      })
      
      console.log("Conversion successful!")
      setSuccess("Conversion successful! Click the Download button below.")
      setAudioData(response.data)
      
    } catch (err) {
      console.error("Conversion error:", err)
      setError("Failed to convert video. Please check the URL and try again.")
    } finally {
      setLoading(false)
    }
  }
  
  const handleDownload = () => {
    if (!audioData) return
    
    // Extract video ID or title from URL for filename
    const videoId = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/) 
      ? url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/)?.[1]
      : 'audio'
      
    // Create blob from buffer
    const blob = new Blob([audioData], { type: 'audio/mpeg' })
    
    // Create download link
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.setAttribute('download', `${videoId}.mp3`)
    
    // Trigger download
    document.body.appendChild(link)
    link.click()
    
    // Clean up
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  }

  return (
    <div className="bg-black dark:bg-gray-800 min-h-screen flex items-center justify-center">
      {/* <SplashCursor /> */}
      <div className="grid grid-cols-2 gap-4 w-9/12 rounded-lg p-4 space-x-2 relative overflow-hidden">
      <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} borderWidth={5} duration={10}/>
      <div className="flex flex-col items-start justify-center pl-10 pt-20">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">QWeb Convert MP3 </h1>
            <p className="text-gray-300 mb-4">Easily Convert YouTube Videos to MP3 Audio!.</p>
          </div>
          <form onSubmit={handleConvert} className="w-full">
            <div className="flex max-w-lg items-center mt-10 space-x-2 relative h-[70px] overflow-hidden">
              <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=_a8N2hnf2O0"
                className="flex-1 p-2 border border-gray-300 rounded-md"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Converting..." : "Convert"}
              </Button>
            </div>
          </form>
          
          {/* Error and success messages */}
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {success && <p className="text-green-500 mt-2">{success}</p>}
          {loading && <div className="loader"></div>}

          {success && <Button 
            onClick={handleDownload} 
            disabled={loading || !audioData} 
            className="mt-4 bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 transition duration-200"
          >
            Download MP3
          </Button>}
          
      <div className={`w-full pl-0 ${success ? "" : "pt-8"}`}>
        <LogoCarouselDemo/>
      </div>
      </div>
        <div>
          <Lottie1 />
        </div>
      </div>
    </div>
  )
}

export default App