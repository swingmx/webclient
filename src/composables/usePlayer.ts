// WARNING: EXPERIMENT!!!

import axios from 'axios'

export default async function usePlayer(url: string) {
    const audioContext = new AudioContext()
    const track = audioContext.createBufferSource()
    const chunkSize = 524288 // 0.5MB in bytes
    let totalSize = 0
    let downloadedSize = 0
    let playedSize = 0

    const fetchAudioChunks = async (start: number, end: number) => {
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                Range: `bytes=${start}-${end}`,
            },
            withCredentials: true,
        })

        console.log("response", response.headers)

        if (totalSize === 0) {
            const contentRange = response.headers['content-range']
            totalSize = parseInt(contentRange.split('/')[1])
        }

        console.log("total size", totalSize)
        console.log(response.data)

        const audioData = await audioContext.decodeAudioData(response.data)
        downloadedSize += audioData.length

        if (!track.buffer) {
            track.buffer = audioData
        } else {
            const newBuffer = audioContext.createBuffer(
                audioData.numberOfChannels,
                track.buffer.length + audioData.length,
                audioData.sampleRate
            )
            for (let channel = 0; channel < audioData.numberOfChannels; channel++) {
                newBuffer.copyToChannel(track.buffer.getChannelData(channel), channel, 0)
                newBuffer.copyToChannel(audioData.getChannelData(channel), channel, track.buffer.length)
            }
            track.buffer = newBuffer
        }

        if (downloadedSize < totalSize) {
            fetchAudioChunks(downloadedSize, Math.min(downloadedSize + chunkSize - 1, totalSize - 1))
        }
    }

    await fetchAudioChunks(0, chunkSize)

    track.connect(audioContext.destination)
    track.onended = () => {
        playedSize = totalSize
    }

    const updatePlayedSize = () => {
        if (track.buffer) {
            playedSize = Math.floor(track.context.currentTime * track.buffer.sampleRate)
            if (playedSize + chunkSize > downloadedSize && downloadedSize < totalSize) {
                fetchAudioChunks(downloadedSize, Math.min(downloadedSize + chunkSize - 1, totalSize - 1))
            }
        }
        requestAnimationFrame(updatePlayedSize)
    }

    return {
        track,
        play: () => {
            track.start()
            updatePlayedSize()
        },
        pause: () => track.stop(),
        getProgress: () => ({
            downloaded: downloadedSize / totalSize,
            played: playedSize / totalSize
        })
    }
}
