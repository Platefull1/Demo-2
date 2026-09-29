'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft, Shield, CheckCircle, XCircle, Loader2, User, ToggleRight, ToggleLeft,
} from 'lucide-react';
import {
  PERMISSION_LABELS,
  RH_PERMISSION_PRESETS,
  RH_STORE_SLUGS,
  RH_STORE_LABELS,
  RH_PERFIL_LABELS,
  type RhMemberPerfil,
  type RhStoreSlug,
} from '@/lib/rh-permissions';

interface PermissionItem {
  permission: string;
  active: boolean;
}

interface PermissionGroup {
  label: string;
  permissions: PermissionItem[];
}

interface MemberData {
  memberId: string;
  email: string;
  displayName: string | null;
  lojas: string[];
  perfil: string | null;
  groups: PermissionGroup[];
}

export default function PermissoesPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<Record<string, 'loading' | 'ok' | 'error'>>({});
  const [presetLoading, setPresetLoading] = useState(false);
  const [lojasSaving, setLojasSaving] = useState(false);
  const [gerenteLojas, setGerenteLojas] = useState<RhStoreSlug[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/rh/usuarios/${params.id}/permissoes`);
      if (res.ok) {
        const json = (await res.json()) as MemberData;
        setData(json);
        setGerenteLojas((json.lojas ?? []).filter((s): s is RhStoreSlug =>
          (RH_STORE_SLUGS as readonly string[]).includes(s),
        ));
      }
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    load();
  }, [load]);

  const allPermissions = data?.groups.flatMap((g) => g.permissions) ?? [];
  const allActive = allPermissions.length > 0 && allPermissions.every((p) => p.active);
  const anyActive = allPermissions.some((p) => p.active);
  const [bulkLoading, setBulkLoading] = useState(false);

  const bulkToggle = async (active: boolean) => {
    if (!data) return;
    setBulkLoading(true);
    const all = data.groups.flatMap((g) => g.permissions);
    const toChange = all.filter((p) => p.active !== active);
    for (const item of toChange) {
      await fetch(`/api/rh/usuarios/${params.id}/permissoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permission: item.permission, active }),
      });
    }
    setBulkLoading(false);
    load();
  };

  const toggle = async (permission: string, currentActive: boolean) => {
    setToggling((t) => ({ ...t, [permission]: 'loading' }));
    try {
      const res = await fetch(`/api/rh/usuarios/${params.id}/permissoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permission, active: !currentActive }),
      });
      const status = res.ok ? 'ok' : 'error';
      setToggling((t) => ({ ...t, [permission]: status }));
      if (res.ok) {
        setData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            groups: prev.groups.map((g) => ({
              ...g,
              permissions: g.permissions.map((p) =>
                p.permission === permission ? { ...p, active: !currentActive } : p,
              ),
            })),
          };
        });
      }
      setTimeout(() => {
        setToggling((t) => {
          const n = { ...t };
          delete n[permission];
          return n;
        });
      }, 1500);
    } catch {
      setToggling((t) => ({ ...t, [permission]: 'error' }));
    }
  };

  const applyPreset = async (preset: RhMemberPerfil) => {
    if (preset === 'gerente_loja' && gerenteLojas.length === 0) {
      alert('Selecione ao menos uma loja para o perfil Gerente.');
      return;
    }
    setPresetLoading(true);
    try {
      const res = await fetch(`/api/rh/usuarios/${params.id}/permissoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'apply_preset',
          preset,
          lojas: preset === 'gerente_loja' ? gerenteLojas : [],
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error ?? 'Erro ao aplicar preset');
        return;
      }
      await load();
    } finally {
      setPresetLoading(false);
    }
  };

  const saveLojas = async (next: RhStoreSlug[]) => {
    setGerenteLojas(next);
    setLojasSaving(true);
    try {
      const res = await fetch(`/api/rh/usuarios/${params.id}/permissoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'set_lojas', lojas: next }),
      });
      if (res.ok) {
        const json = await res.json();
        setData((prev) => (prev ? { ...prev, lojas: json.lojas } : prev));
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error ?? 'Erro ao salvar lojas');
        await load();
      }
    } finally {
      setLojasSaving(false);
    }
  };

  const toggleLoja = (slug: RhStoreSlug) => {
    const next = gerenteLojas.includes(slug)
      ? gerenteLojas.filter((s) => s !== slug)
      : [...gerenteLojas, slug];
    saveLojas(next);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <p className="text-gray-400">Usuário não encontrado</p>
      </div>
    );
  }

  const perfilLabel =
    data.perfil && data.perfil in RH_PERFIL_LABELS
      ? RH_PERFIL_LABELS[data.perfil as RhMemberPerfil]
      : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/rh/usuarios')}
            className="w-9 h-9 rounded-xl bg-[#1c1c1e] border border-[#2a2a2e] flex items-center justify-center hover:bg-[#2a2a2e] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Shield className="w-6 h-6 text-amber-400" />
              Permissões
            </h1>
            <p className="text-sm text-gray-400">Cada toggle salva imediatamente</p>
          </div>
        </div>

        <div className="bg-[#1c1c1e] border border-[#2a2a2e] rounded-2xl px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2a2a2e] flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white">{data.displayName ?? '—'}</p>
            <p className="text-xs text-gray-500">{data.email}</p>
          </div>
          {perfilLabel && (
            <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
              {perfilLabel}
            </span>
          )}
        </div>

        {/* Presets CMV Real */}
        <div className="bg-[#1c1c1e] border border-[#2a2a2e] rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2a2a2e]">
            <h2 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Perfis CMV Real
            </h2>
            <p className="text-[11px] text-gray-500 mt-1">
              Aplicar marca as permissões de uma vez; depois você pode ajustar os toggles.
              O perfil fica só como referência (não é reaplicado ao mudar um toggle).
            </p>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              {RH_PERMISSION_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  disabled={presetLoading}
                  onClick={() => applyPreset(p.id)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium border transition-colors ${
                    data.perfil === p.id
                      ? 'bg-amber-500 text-black border-amber-500'
                      : 'bg-[#252528] text-gray-300 border-[#2a2a2e] hover:border-amber-500/40'
                  }`}
                >
                  {presetLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin inline" />
                  ) : (
                    p.label
                  )}
                </button>
              ))}
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-2">
                Lojas {lojasSaving && <Loader2 className="w-3 h-3 animate-spin inline ml-1" />}
                <span className="text-gray-600"> (vazio = todas, exceto Gerente)</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {RH_STORE_SLUGS.map((slug) => (
                  <button
                    key={slug}
                    type="button"
                    onClick={() => toggleLoja(slug)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      gerenteLojas.includes(slug)
                        ? 'bg-amber-500 text-black border-amber-500'
                        : 'bg-[#252528] text-gray-400 border-[#2a2a2e] hover:border-amber-500/40'
                    }`}
                  >
                    {RH_STORE_LABELS[slug]}
                  </button>
                ))}
              </div>
              {data.perfil === 'gerente_loja' && gerenteLojas.length === 0 && (
                <p className="text-xs text-red-400 mt-2">
                  Loja não configurada — o gerente ficará bloqueado no CMV Real.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => bulkToggle(true)}
            disabled={bulkLoading || allActive}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {bulkLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ToggleRight className="w-4 h-4" />}
            Conceder todos
          </button>
          <button
            onClick={() => bulkToggle(false)}
            disabled={bulkLoading || !anyActive}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {bulkLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ToggleLeft className="w-4 h-4" />}
            Revogar todos
          </button>
        </div>

        {data.groups.map((group) => (
          <div key={group.label} className="bg-[#1c1c1e] border border-[#2a2a2e] rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#2a2a2e]">
              <h2 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                {group.label}
              </h2>
            </div>
            <div className="divide-y divide-[#2a2a2e]">
              {group.permissions.map((item) => {
                const state = toggling[item.permission];
                const isLoading = state === 'loading' || bulkLoading;
                return (
                  <div
                    key={item.permission}
                    className="px-4 py-3.5 flex items-center justify-between gap-4"
                  >
                    <p className={`text-sm ${item.active ? 'text-white' : 'text-gray-500'}`}>
                      {PERMISSION_LABELS[item.permission] ?? item.permission}
                    </p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {state === 'ok' && <CheckCircle className="w-3.5 h-3.5 text-green-400" />}
                      {state === 'error' && <XCircle className="w-3.5 h-3.5 text-red-400" />}
                      <button
                        onClick={() => !isLoading && toggle(item.permission, item.active)}
                        disabled={isLoading}
                        aria-label={item.active ? 'Revogar permissão' : 'Conceder permissão'}
                        className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                          isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        } ${item.active ? 'bg-amber-500' : 'bg-[#3a3a3e]'}`}
                      >
                        {isLoading ? (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="w-3 h-3 text-white animate-spin" />
                          </span>
                        ) : (
                          <span
                            className={`absolute top-0.5 left-0.5 block w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                              item.active ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="bg-[#1c1c1e] border border-[#2a2a2e] rounded-xl px-4 py-3 text-xs text-gray-500">
          Convite padrão: permissões RH sem <strong className="text-gray-400">cmv_real.*</strong>.
          CMV Real só via perfil ou toggle. Alterações entram em vigor imediatamente.
        </div>
      </div>
    </div>
  );
}
