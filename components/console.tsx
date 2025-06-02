import { TerminalWindowIcon, LoaderIcon, CrossSmallIcon } from "./icons";
import { Button } from "./ui/button";
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { useArtifactSelector } from "@/hooks/use-artifact";

export interface ConsoleOutputContent {
  type: "text" | "image";
  value: string;
}

export interface ConsoleOutput {
  id: string;
  status: "in_progress" | "loading_packages" | "completed" | "failed";
  contents: Array<ConsoleOutputContent>;
}

interface ConsoleProps {
  consoleOutputs: Array<ConsoleOutput>;
  setConsoleOutputs: Dispatch<SetStateAction<Array<ConsoleOutput>>>;
}

export function Console({ consoleOutputs, setConsoleOutputs }: ConsoleProps) {
  const [height, setHeight] = useState<number>(300);
  const [isResizing, setIsResizing] = useState(false);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  const isArtifactVisible = useArtifactSelector((state) => state.isVisible);

  const minHeight = 100;
  const maxHeight = 800;

  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e: MouseEvent) => {
      if (isResizing) {
        const newHeight = window.innerHeight - e.clientY;
        if (newHeight >= minHeight && newHeight <= maxHeight) {
          setHeight(newHeight);
        }
      }
    },
    [isResizing]
  );

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [consoleOutputs]);

  useEffect(() => {
    if (!isArtifactVisible) {
      setConsoleOutputs([]);
    }
  }, [isArtifactVisible, setConsoleOutputs]);

  return consoleOutputs.length > 0 ? (
    <>
      <div
        className="z-50 fixed w-full h-2 cursor-ns-resize"
        onMouseDown={startResizing}
        style={{ bottom: height - 4 }}
        role="slider"
        aria-valuenow={minHeight}
      />

      <div
        className={cn(
          "fixed flex flex-col bottom-0 dark:bg-zinc-900 bg-zinc-50 w-full border-t z-40 overflow-y-scroll overflow-x-hidden dark:border-zinc-700 border-zinc-200",
          {
            "select-none": isResizing,
          }
        )}
        style={{ height }}
      >
        <div className="top-0 z-50 sticky flex flex-row justify-between items-center bg-muted px-2 py-1 border-zinc-200 dark:border-zinc-700 border-b w-full h-fit">
          <div className="flex flex-row items-center gap-3 pl-2 text-zinc-800 dark:text-zinc-50 text-sm">
            <div className="text-muted-foreground">
              <TerminalWindowIcon />
            </div>
            <div>Console</div>
          </div>
          <Button
            variant="ghost"
            className="hover:bg-zinc-200 hover:dark:bg-zinc-700 p-1 size-fit"
            size="icon"
            onClick={() => setConsoleOutputs([])}
          >
            <CrossSmallIcon />
          </Button>
        </div>

        <div>
          {consoleOutputs.map((consoleOutput, index) => (
            <div
              key={consoleOutput.id}
              className="flex flex-row bg-zinc-50 dark:bg-zinc-900 px-4 py-2 border-zinc-200 dark:border-zinc-700 border-b font-mono text-sm"
            >
              <div
                className={cn("w-12 shrink-0", {
                  "text-muted-foreground": [
                    "in_progress",
                    "loading_packages",
                  ].includes(consoleOutput.status),
                  "text-emerald-500": consoleOutput.status === "completed",
                  "text-red-400": consoleOutput.status === "failed",
                })}
              >
                [{index + 1}]
              </div>
              {["in_progress", "loading_packages"].includes(
                consoleOutput.status
              ) ? (
                <div className="flex flex-row gap-2">
                  <div className="self-center mt-0.5 mb-auto size-fit animate-spin">
                    <LoaderIcon />
                  </div>
                  <div className="text-muted-foreground">
                    {consoleOutput.status === "in_progress"
                      ? "Initializing..."
                      : consoleOutput.status === "loading_packages"
                      ? consoleOutput.contents.map((content) =>
                          content.type === "text" ? content.value : null
                        )
                      : null}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2 w-full overflow-x-scroll text-zinc-900 dark:text-zinc-50">
                  {consoleOutput.contents.map((content, index) =>
                    content.type === "image" ? (
                      <picture key={`${consoleOutput.id}-${index}`}>
                        <img
                          src={content.value}
                          alt="output"
                          className="rounded-md w-full max-w-screen-toast-mobile"
                        />
                      </picture>
                    ) : (
                      <div
                        key={`${consoleOutput.id}-${index}`}
                        className="w-full break-words whitespace-pre-line"
                      >
                        {content.value}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
          <div ref={consoleEndRef} />
        </div>
      </div>
    </>
  ) : null;
}
