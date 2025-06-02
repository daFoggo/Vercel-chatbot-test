"use client";

import type { ArtifactKind } from "./artifact";

export const DocumentSkeleton = ({
  artifactKind,
}: {
  artifactKind: ArtifactKind;
}) => {
  return artifactKind === "image" ? (
    <div className="flex flex-col justify-center items-center gap-4 w-full h-[calc(100dvh-60px)]">
      <div className="bg-muted-foreground/20 rounded-lg size-96 animate-pulse" />
    </div>
  ) : (
    <div className="flex flex-col gap-4 w-full">
      <div className="bg-muted-foreground/20 rounded-lg w-1/2 h-12 animate-pulse" />
      <div className="bg-muted-foreground/20 rounded-lg w-full h-5 animate-pulse" />
      <div className="bg-muted-foreground/20 rounded-lg w-full h-5 animate-pulse" />
      <div className="bg-muted-foreground/20 rounded-lg w-1/3 h-5 animate-pulse" />
      <div className="bg-transparent rounded-lg w-52 h-5 animate-pulse" />
      <div className="bg-muted-foreground/20 rounded-lg w-52 h-8 animate-pulse" />
      <div className="bg-muted-foreground/20 rounded-lg w-2/3 h-5 animate-pulse" />
    </div>
  );
};

export const InlineDocumentSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="bg-muted-foreground/20 rounded-lg w-48 h-4 animate-pulse" />
      <div className="bg-muted-foreground/20 rounded-lg w-3/4 h-4 animate-pulse" />
      <div className="bg-muted-foreground/20 rounded-lg w-1/2 h-4 animate-pulse" />
      <div className="bg-muted-foreground/20 rounded-lg w-64 h-4 animate-pulse" />
      <div className="bg-muted-foreground/20 rounded-lg w-40 h-4 animate-pulse" />
      <div className="bg-muted-foreground/20 rounded-lg w-36 h-4 animate-pulse" />
      <div className="bg-muted-foreground/20 rounded-lg w-64 h-4 animate-pulse" />
    </div>
  );
};
