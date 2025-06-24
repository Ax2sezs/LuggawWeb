export default function Footer() {
  return (
    <footer className="w-full bg-white text-main-brown py-4 px-6 text-sm mt-auto">
      <div className="flex flex-col items-center gap-2 text-center">
        <p>
          If you have any problem, contact our staff via{" "}
          <a href="mailto:support@aaaa.com" className="underline hover:text-white">
            support@luggaw.com
          </a>
        </p>
        <p className="max-w-md">
          โปรดอ่าน{" "}
            นโยบายความเป็นส่วนตัวของเรา
          เพื่อรับทราบและทำความเข้าใจ ก่อนส่งข้อมูลทุกครั้ง
        </p>
        <p>
          <a href="https://member.luggaw.com/doc/TermsofService.pdf" className="underline hover:text-white">
            ข้อกำหนดเงื่อนไข
          </a>{" "}
          และ{" "}
          <a href="https://member.luggaw.com/doc/PrivacyPolicy.pdf" className="underline hover:text-white">
            นโยบายความเป็นส่วนตัว
          </a>
        </p>
      </div>
    </footer>
  );
}
