import { faFacebook, faInstagram, faLinkedin, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function Footer() {

  return (
    <div className="flex justify-center text-center flex-col gap-6 mt-10 sm:mt-12 lg:mt-15 text-[#4A739C] px-4">
        <div className="flex flex-wrap justify-center text-center gap-10 sm:gap-20 md:gap-30 lg:gap-40 xl:gap-40">
            <Link href="/about" className="hover:text-blue-600 transition-colors duration-300 text-sm sm:text-base">About Us</Link>
            <Link href="/contact" className="hover:text-blue-600 transition-colors duration-300 text-sm sm:text-base">Contact</Link>
            <Link href="/terms" className="hover:text-blue-600 transition-colors duration-300 text-sm sm:text-base">Terms</Link>
            <Link href="/privacy" className="hover:text-blue-600 transition-colors duration-300 text-sm sm:text-base">Privacy</Link>
        </div>
        <div className="flex justify-center text-center gap-4 sm:gap-6 md:gap-8">
            <Link href="/" className="hover:text-blue-600 transition-colors duration-300">
                <FontAwesomeIcon icon={faFacebook} className="text-lg sm:text-xl md:text-2xl" />
            </Link>
            <Link href="/" className="hover:text-blue-600 transition-colors duration-300">
                <FontAwesomeIcon icon={faTwitter} className="text-lg sm:text-xl md:text-2xl" />
            </Link>
            <Link href="/" className="hover:text-blue-600 transition-colors duration-300">
                <FontAwesomeIcon icon={faLinkedin} className="text-lg sm:text-xl md:text-2xl" />
            </Link>
            <Link href="/" className="hover:text-blue-600 transition-colors duration-300">
                <FontAwesomeIcon icon={faInstagram} className="text-lg sm:text-xl md:text-2xl" />
            </Link>
        </div>
        <h2 className="copyRights">© 2025 EduFlex. All rights reserved.</h2>
    </div>
  );
}