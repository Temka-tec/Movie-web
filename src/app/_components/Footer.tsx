import { Film } from "lucide-react";
import { Mail } from "lucide-react";
import { Phone } from "lucide-react";
export const Footer = () => {
  return (
    <footer className="w-full bg-[#4338CA] text-white py-10 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="w-[200px]">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Film /> Movie Z
          </h1>
          <p className="mt-3 text-sm">© 2024 Movie Z. All Rights Reserved.</p>
        </div>

        <div className="w-[913px] h-50 flex flex-wrap gap-10 justify-end">
          <div>
            <h2 className="text-lg font-medium mb-4">Contact Information</h2>
            <div className="space-y-3 text-sm">
              <p className="flex gap-2 items-center">
                <Mail />
                <span>Email: support@movieZ.com</span>
              </p>
              <p className="flex gap-2 items-center">
                <Phone /> <span>Phone: +976 (11) 123-4567</span>
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-4">Follow us</h2>
            <div className="flex gap-4 text-sm">
              <a href="#" className="hover:underline">
                Facebook
              </a>
              <a href="#" className="hover:underline">
                Instagram
              </a>
              <a href="#" className="hover:underline">
                Twitter
              </a>
              <a href="#" className="hover:underline">
                Youtube
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
