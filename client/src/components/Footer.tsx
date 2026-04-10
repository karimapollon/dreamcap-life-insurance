/**
 * Footer Component
 * Displays compliance regulation disclaimers at the bottom of every page.
 * Includes insurance licensing, privacy, and regulatory disclosures.
 */

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663422524482/kJxKWRTnM5eN3s3bdiVG2o/ColorLogo_915bc48b.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200">
      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <a href="/" className="inline-block">
            <img
              src={LOGO_URL}
              alt="DreamCap Financial"
              className="h-8 w-auto object-contain opacity-80"
            />
          </a>

          {/* Copyright */}
          <p className="text-xs text-gray-500 text-center">
            &copy; {currentYear} DreamCap Financial&reg;. All rights reserved.
          </p>
        </div>
      </div>

      {/* Compliance Disclaimers */}
      <div className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="space-y-4 text-[11px] leading-relaxed text-gray-500">

            <p>
              <strong className="text-gray-600">Important Disclosures:</strong> DreamCap Financial&reg; is a licensed insurance agency. 
              All quotes provided on this website are estimates based on the information you provide and current industry averages. 
              Actual premiums may vary based on your health history, medical exam results, lifestyle factors, geographic location, 
              and the underwriting guidelines of the issuing insurance carrier. Quotes are not a guarantee of coverage or pricing.
            </p>

            <p>
              <strong className="text-gray-600">Licensing:</strong> Insurance products and services are offered through DreamCap Financial&reg;, 
              a licensed insurance agency. Availability of products and features may vary by state. Not all products are available 
              in all states. Please consult with a licensed agent to determine product availability in your state.
            </p>

            <p>
              <strong className="text-gray-600">Not Financial Advice:</strong> The information provided on this website is for 
              informational and educational purposes only and should not be construed as financial, tax, legal, or investment advice. 
              You should consult with qualified professionals regarding your specific situation before making any financial decisions.
            </p>

            <p>
              <strong className="text-gray-600">Privacy &amp; Data Protection:</strong> We are committed to protecting your personal 
              information. Any data collected through this website is handled in accordance with our Privacy Policy and applicable 
              federal and state privacy laws, including but not limited to the Gramm-Leach-Bliley Act (GLBA) and state insurance 
              information privacy regulations. Your information will not be sold to third parties. By submitting your information, 
              you consent to being contacted by a licensed insurance agent regarding your quote request.
            </p>

            <p>
              <strong className="text-gray-600">Regulatory Compliance:</strong> Life insurance policies are issued by third-party 
              insurance carriers and are subject to the terms, conditions, limitations, and exclusions of the specific policy issued. 
              Policy benefits, features, and riders may vary by carrier and state. All guarantees are based on the claims-paying 
              ability of the issuing insurance company. DreamCap Financial&reg; does not guarantee the financial strength or 
              claims-paying ability of any insurance carrier.
            </p>

            <p className="text-center pt-2 border-t border-gray-200 text-gray-400">
              NAIC Consumer Information &bull; Equal Opportunity Provider &bull; 
              Complaints may be directed to your state's Department of Insurance
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
