import { useState, useRef, useEffect, useCallback } from 'react';

export interface RecordedVideoResult {
  url: string;
  blob: Blob;
  durationSeconds: number;
  fileSizeMb: number;
  fileName: string;
}

export function useScreenRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [recordedResult, setRecordedResult] = useState<RecordedVideoResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Check support on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasMediaDevices = !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia);
      setIsSupported(hasMediaDevices);
    }
  }, []);

  // Format seconds to mm:ss
  const formatDuration = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setIsRecording(false);
  }, []);

  const startRecording = useCallback(async () => {
    setErrorMessage(null);
    setRecordedResult(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      setErrorMessage('当前浏览器环境不支持屏幕录制API');
      return;
    }

    try {
      // Prompt user for screen / tab capture
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'browser',
          frameRate: { ideal: 30 },
        },
        audio: false,
      });

      streamRef.current = stream;
      chunksRef.current = [];

      // Detect user clicking browser native "Stop sharing"
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.onended = () => {
          stopRecording();
        };
      }

      // Check supported MIME type
      const mimeTypes = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm',
        'video/mp4',
      ];
      const selectedMime = mimeTypes.find((type) => MediaRecorder.isTypeSupported(type)) || 'video/webm';

      const recorder = new MediaRecorder(stream, { mimeType: selectedMime });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: selectedMime });
        const url = URL.createObjectURL(blob);
        const duration = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
        const sizeMb = Number((blob.size / (1024 * 1024)).toFixed(2));
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

        setRecordedResult({
          url,
          blob,
          durationSeconds: duration,
          fileSizeMb: sizeMb,
          fileName: `农田建设大屏录屏_${timestamp}.webm`,
        });
      };

      recorder.start(1000); // 1s slice
      startTimeRef.current = Date.now();
      setIsRecording(true);
      setRecordSeconds(0);

      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordSeconds((prev) => {
          // Max 30 minutes (1800s) auto stop
          if (prev >= 1799) {
            stopRecording();
            return 1800;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        // User cancelled picker
        setErrorMessage(null);
      } else {
        console.error('Screen recording error:', err);
        setErrorMessage(err.message || '启动录屏失败，请检查浏览器权限');
      }
      setIsRecording(false);
    }
  }, [stopRecording]);

  const clearRecordedResult = useCallback(() => {
    if (recordedResult?.url) {
      URL.revokeObjectURL(recordedResult.url);
    }
    setRecordedResult(null);
    setRecordSeconds(0);
  }, [recordedResult]);

  return {
    isRecording,
    recordSeconds,
    recordDurationText: formatDuration(recordSeconds),
    recordedResult,
    errorMessage,
    isSupported,
    startRecording,
    stopRecording,
    clearRecordedResult,
  };
}
