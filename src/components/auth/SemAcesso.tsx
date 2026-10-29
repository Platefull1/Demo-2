export function SemAcesso({ toolName }: { toolName: string }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-6 py-20">
      <div className="max-w-md space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">Sem acesso</h1>
        <p className="text-sm text-muted-foreground">
          Você não tem permissão para acessar {toolName}.
        </p>
      </div>
    </div>
  );
}
