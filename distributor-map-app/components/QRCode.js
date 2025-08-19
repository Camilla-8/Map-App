import dynamic from "next/dynamic";
// qrcode.react@4 exports named components (no default). Use QRCodeCanvas for a bitmap QR code.
const QRCode = dynamic(() => import("qrcode.react").then((m) => m.QRCodeCanvas), { ssr: false });

export default function QRCodePanel({ text, size = 72 }) {
  if (!text) return null;
  return (
    <div className="flex items-center gap-2">
      <QRCode value={text} size={size} includeMargin />
    </div>
  );
}


