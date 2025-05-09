import React from "react";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="bg-background border-b">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          {/* 로고 및 타이틀 */}
          <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-lg font-bold">
            S
          </div>
          <h1 className="text-xl font-bold tracking-tight">SpinJoy</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* 깃허브 링크 (향후 추가 예정) */}
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://github.com/your-repo/spinjoy"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <GithubIcon className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
