/**
 * Header Component
 * Displays the DreamCap Financial logo prominently at the top of every page.
 * Logo is displayed as-is with no color or style modifications — large and visible.
 * Uses cropped version of logo (whitespace removed) for proper rendering.
 */

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663422524482/kJxKWRTnM5eN3s3bdiVG2o/DreamCapLogo_cropped_6b64634e.png";

export default function Header() {
  return (
    <header className="w-full py-4 px-6 bg-white shadow-sm z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-center">
        <a href="/" className="inline-block">
          <img
            src={LOGO_URL}
            alt="DreamCap Financial"
            className="h-12 sm:h-14 md:h-16 w-auto object-contain"
          />
        </a>
      </div>
    </header>
  );
}
