import { Footer } from "@/components/ui/Footer";
import { Nav } from "@/components/ui/Nav";
import { PickProvider } from "@/components/ui/PickContext";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <PickProvider>
      <div className="env" aria-hidden="true">
        <div className="env-grain" />
      </div>
      <a className="skip" href="#main">
        Skip to the content
      </a>
      <Nav />
      {children}
      <Footer />
    </PickProvider>
  );
}
