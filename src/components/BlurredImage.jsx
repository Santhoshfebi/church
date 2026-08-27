import { ImageIcon } from "lucide-react";

export default function BlurredImage({
  src,
  alt = "",
  className = "",
  emptyText = "No image",
}) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center overflow-hidden bg-zinc-100 ${className}`}
      >
        <div className="text-center text-zinc-400">
          <ImageIcon size={30} className="mx-auto" />

          <p className="mt-2 text-xs">{emptyText}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative isolate overflow-hidden bg-zinc-950 ${className}`}
    >
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl brightness-75"
      />

      <div className="absolute inset-0 bg-black/10" />

      <img
        src={src}
        alt={alt}
        className="relative z-10 h-full w-full object-contain"
      />
    </div>
  );
}
