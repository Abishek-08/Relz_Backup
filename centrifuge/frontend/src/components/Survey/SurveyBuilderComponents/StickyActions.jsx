import { Eye, Rocket } from "lucide-react";

export default function StickyActions({ onPreview, onLaunch, launching }) {
  return (
    <div className="sticky z-[40] p-4">
      <div className="lg:max-w-sm sm:max-w-lg md:max-w-sm mx-auto px-4">
        <div className="bg-white/80 flex-shrink-0 min-w-0 backdrop-blur rounded-2xl shadow-lg px-3 py-2 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={onPreview}
            className=" flex-shrink-0 min-w-0 cursor-pointer px-4 py-2 rounded-xl hover:bg-gray-200 text-gray-800 inline-flex items-center gap-2"
          >
            <Eye size={16} /> Live Preview
          </button>
          <button
            type="button"
            onClick={onLaunch}
            disabled={launching}
            className={`flex-shrink-0 min-w-0 cursor-pointer px-5 py-2 rounded-xl inline-flex items-center gap-2 ${launching ? "bg-[#1f3e63] text-white opacity-80" : "bg-[#27235c] text-white hover:bg-[#1f3e63]"}`}
          >
            {launching ? (
              <>
                <span className="inline-block w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                Launching…
              </>
            ) : (
              <>
                <Rocket size={16} /> Launch Survey
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
