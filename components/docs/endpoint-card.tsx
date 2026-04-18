import { cn } from "@/lib/utils";

type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

const METHOD_STYLES: Record<Method, string> = {
  GET:    "text-blue-500 bg-blue-500/10",
  POST:   "text-green-500 bg-green-500/10",
  PATCH:  "text-amber-500 bg-amber-500/10",
  PUT:    "text-cyan-500 bg-cyan-500/10",
  DELETE: "text-red-500 bg-red-500/10",
};

export function EndpointCard({ method, path, auth = "required" }: {
  method: Method;
  path: string;
  auth?: "required" | "optional" | "public";
}) {
  const AUTH_LABEL: Record<string, string> = {
    required: "API key required",
    optional: "API key optional",
    public: "No auth needed",
  };
  const AUTH_STYLE: Record<string, string> = {
    required: "text-amber-500",
    optional: "text-muted-foreground",
    public: "text-green-500",
  };

  return (
    <div className="rounded-xl border border-border overflow-hidden mb-6">
      <div className="px-4 py-3 flex items-center gap-3">
        <span className={cn("text-xs font-mono font-bold px-2 py-1 rounded shrink-0", METHOD_STYLES[method])}>
          {method}
        </span>
        <code className="text-sm font-mono flex-1">{path}</code>
        <span className={cn("text-xs shrink-0", AUTH_STYLE[auth])}>{AUTH_LABEL[auth]}</span>
      </div>
    </div>
  );
}
