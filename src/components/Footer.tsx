import { ModeToggle } from "./Mode-Toggle";

export default function Footer() {
  return (
    <footer className="w-full bg-muted text-muted-foreground py-6 mt-10 border-t">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-sm px-4">
        <p className="text-center md:text-left">
          © {new Date().getFullYear()} Created by{" "}
          <span className="font-semibold">Renzi Febriandika</span>
        </p>
        <ModeToggle />
      </div>
    </footer>
  );
}
