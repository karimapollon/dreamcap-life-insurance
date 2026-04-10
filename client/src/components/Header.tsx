/**
 * Header Component
 * Displays the DreamCap Financial logo at the top of every page.
 * Logo is displayed as-is with no color or style modifications.
 */

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663422524482/kJxKWRTnM5eN3s3bdiVG2o/ColorLogo_915bc48b.png";

export default function Header() {
  return (
    <header className="w-full py-4 px-6 bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-6xl mx-auto flex items-center">
        <a href="/" className="inline-block">
          <img
            src={LOGO_URL}
            alt="DreamCap Financial"
            className="h-10 sm:h-12 w-auto object-contain"
          />
        </a>
      </div>
    </header>
  );
}
