import { useState, useRef, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import './css/qr.css'
import QrScanner from "qr-scanner"
import QrFrame from "./assets/qr-frame.svg"

function App() {
  const [message, setMessage] = useState('Premi qui per ottenere la tua posizione');

  const scanner = useRef<QrScanner>();
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);
  const [qrOn, setQrOn] = useState<boolean>(true);

  function geolocationSuccess(position: GeolocationPosition) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const message = `Latitude: ${latitude}, Longitude: ${longitude}`;
    setMessage(message);
  }

  function geolocationError() {
    console.log("Non ho trovato la tua posizione");
  }

  // Result
  const [scannedResult, setScannedResult] = useState<string | undefined>("");

  // Success
  const onScanSuccess = (result: QrScanner.ScanResult) => {
    // 🖨 Print the "result" to browser console.
    console.log(result);
    // ✅ Handle success.
    // 😎 You can do whatever you want with the scanned result.
    setScannedResult(result?.data);
  };

  // Fail
  const onScanFail = (err: string | Error) => {
    // 🖨 Print the "err" to browser console.
    console.log(err);
  };

  useEffect(() => {
    if (videoEl?.current && !scanner.current) {
      // 👉 Instantiate the QR Scanner
      scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        // 📷 This is the camera facing mode. In mobile devices, "environment" means back camera and "user" means front camera.
        preferredCamera: "environment",
        // 🖼 This will help us position our "QrFrame.svg" so that user can only scan when qr code is put in between our QrFrame.svg.
        highlightScanRegion: true,
        // 🔥 This will produce a yellow (default color) outline around the qr code that we scan, showing a proof that our qr-scanner is scanning that qr code.
        highlightCodeOutline: true,
        // 📦 A custom div which will pair with "highlightScanRegion" option above 👆. This gives us full control over our scan region.
        overlay: qrBoxEl?.current || undefined,
      });
    }

    setQrOn(false);

    // 🧹 Clean up on unmount.
    // 🚨 This removes the QR Scanner from rendering and using camera when it is closed or removed from the UI.
    return () => {
      if (!videoEl?.current) {
        scanner?.current?.stop();
      }
    };
  }, []);

  function scan() {
    if (!qrOn) {
      console.log("scan on");
      // 🚀 Start QR Scanner
      scanner?.current
      ?.start()
      .then(() => setQrOn(true))
      .catch((err) => {
        if (err) setQrOn(false);
      });
    } else {
      scanner?.current?.stop();
      setQrOn(false);
    }
  }

  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Demo app</h1>
      <h2>Geolocalizzazione e scansione QR</h2>
      <div className="card">
        <button onClick={() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
          } else {
            setMessage("Non ho il permesso di accedere alla geolocalizzazione");
          }
        }}>
          {message}
        </button>
      </div>
      <div className="card">
        <button onClick={() => scan()}>
          {qrOn ? "Stop Scan" : "Start Scan"}
        </button>
        {scannedResult && (
          <p>Ultimo QR letto: {scannedResult}</p>
        )}
      </div>
      <div className="qr-reader">
        <video ref={videoEl}></video>
        <div ref={qrBoxEl} className="qr-box">
          <img
            src={QrFrame}
            alt="Qr Frame"
            width={256}
            height={256}
            className="qr-frame"
          />
        </div>
      </div>
    </>
  )
}

export default App
