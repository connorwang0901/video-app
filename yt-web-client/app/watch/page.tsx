'use client'

import {useSearchParams} from 'next/navigation';

export default function Watch() {
    const videoSrc = useSearchParams().get('v');
    const videoPrefix = 'https://storage.googleapis.com/cn-yt-processed-videos/';
    return(
        <div>
            <h1>Watch Page</h1>
            <video controls src = {videoPrefix + videoSrc}/>
        </div>
    );
}