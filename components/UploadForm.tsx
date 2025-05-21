"use client";

import { useRef, useState } from "react";

/** Shape of the object Dashboard expects back */
interface CandidateScored {
  id: string;
  name: string;
  role: string;
  score: number;
}

export default function UploadForm({
  onScored,
}: {
  onScored: (cand: CandidateScored) => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Convert File → either { pdfBase64 } or { resumeText }  */
  async function fileToPayload(file: File) {
    if (file.type === "application/pdf") {
      const buf = await file.arrayBuffer();
      const bytes = new Uint8Array(buf);

      // Convert to binary string without using spread operator
      let binary = "";
      bytes.forEach((b) => (binary += String.fromCharCode(b)));

      const b64 = btoa(binary);
      return { pdfBase64: b64 };
    }

    // Fallback: treat anything else as plain text
    const text = await file.text();
    return { resumeText: text };
  }

  async function handleUpload() {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    try {
      const basePayload = await fileToPayload(selectedFile);

      const payload = {
        ...basePayload,
        jobDescription:
          "Senior Full-Stack Engineer (React / Node)\n• 5+ yrs TypeScript\n• AWS experience",
      };

      const res = await fetch("/api/rank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "API error");

      onScored({
        id: crypto.randomUUID(),
        name: selectedFile.name,
        role: "Uploaded résumé",
        score: data.score,
      });

      // reset
      setSelectedFile(null);
      if (fileInput.current) fileInput.current.value = "";
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 max-w-lg">
      {error && <p className="text-red-600 text-sm">Error: {error}</p>}

      <div className="flex items-center gap-4">
        <input
          type="file"
          accept=".txt,.pdf"
          ref={fileInput}
          onChange={(e) => {
            setError(null);
            setSelectedFile(e.target.files?.[0] || null);
          }}
          className="border rounded p-2 flex-1"
        />
        <button
          onClick={handleUpload}
          disabled={loading || !selectedFile}
          className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          {loading ? "Scoring…" : "Upload & Score"}
        </button>
      </div>
    </div>
  );
}
