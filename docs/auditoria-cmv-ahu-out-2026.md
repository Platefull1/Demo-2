# Auditoria CMV Real — Ahú, outubro/2026

**Só diagnóstico.** Nada foi gravado (saldo, nota, mapeamento, contagem, lançamento ou código).

## Fontes

| Fonte | Detalhe |
|---|---|
| Planilha | `D:\mods\mds sa\mods the sims\CMV_DESPERDÍCIO - AHU 2025_2026.xlsx` (modificado 06/11/2026 08:18:30), aba **OUTUBRO 2026** |
| Platefull | Fechamento Ahú/2026-10 **ABERTO**; custos da Parte 3 **já gravados** (CMV MP = R$ 186.741,93) |
| Contexto | `docs/handoff-cmv-ahu-out-2026.md` |

Totais oficiais da planilha (confirmados):

| | Valor | % s/ venda R$ 688.341,78 |
|---|---:|---:|
| Venda / mês | 688.341,78 | — |
| CMV Matéria-prima | 192.479,77 | 27,96% |
| CMV Embalagens | 24.758,99 | 3,60% |
| CMV Bebidas | 30.212,54 | 4,39% |
| CMV Total | 247.451,30 | 35,95% |

Regras aplicadas na análise: refeição não abate; custo do saldo = última compra normal (manual preservado); bonificação entra em qtd/valor sem definir custo; CFOP 1.xxx/2.xxx = compra negativa. A planilha **não** é a verdade — cada diferença diz quem está certo.

---

## 1. Ponte geral

Sinal da diferença: **planilha − Platefull** (positivo = planilha maior).

### Matéria-prima

| | Planilha | Platefull | Δ |
|---|---:|---:|---:|
| Estoque inicial (R$) | 65.024,97 | 65.025,00 | −0,03 |
| Compras | 194.898,42 | 186.402,95 | +8.495,47 |
| Transf. recebida | 0 | 0 | 0 |
| Transf. enviada | (qtd 88,42 kg) | 0 | — |
| Desperdício | 1.046,67 | 1.046,67 | 0 |
| Estoque final (R$) | 66.301,44 | 63.242,76 | +3.058,68 |
| **CMV** | **192.479,77** | **186.741,93** | **+5.737,84** |
| % s/ venda planilha | 27,96% | 27,13%* | |
| % s/ venda Platefull (R$ 696.735,14) | 27,63% | 26,80% | |

\*Se usar a venda da planilha no denominador do sistema.

### Embalagens

| | Planilha | Platefull | Δ |
|---|---:|---:|---:|
| Estoque inicial | 8.409,63 | 8.420,17 | −10,54 |
| Compras | 27.175,18 | 27.124,78 | +50,40 |
| Desperdício | 0 | 0 | 0 |
| Estoque final | 10.825,82 | 11.297,06 | −471,24 |
| **CMV** | **24.758,99** | **24.204,14** | **+554,85** |
| % s/ venda planilha | 3,60% | 3,52% | |

Desde a conferência anterior (R$ 24.917,90 na planilha): a planilha **caiu R$ 158,91** e chegou a R$ 24.758,99. O sistema permanece em R$ 24.204,14. A diferença atual planilha−sistema é **R$ 554,85** (antes era ~R$ 713).

### Bebidas

| | Planilha | Platefull | Δ |
|---|---:|---:|---:|
| Estoque inicial | 10.389,04 | 10.389,04 | 0 |
| Compras | 33.147,90 | 32.012,31 | +1.135,59 |
| Estoque final | 13.405,83 | 13.741,07 | −335,24 |
| **CMV** | **30.212,54** | **28.569,58** | **+1.642,96** |
| % s/ venda planilha | 4,39% | 4,15% | |

### Total

| | Planilha | Platefull | Δ |
|---|---:|---:|---:|
| **CMV Total** | **247.451,30** | **239.515,65** | **+7.935,65** |
| % s/ venda planilha (688.341,78) | 35,95% | 34,80% | |
| % s/ venda Platefull (696.735,14) | 35,52% | 34,38% | |

A venda maior no Platefull (**+R$ 8.393,36**) reduz todos os percentuais do sistema em ~0,4 p.p. frente à planilha, mesmo com o mesmo CMV em reais.

Refeições internas: quadro informativo (~R$ 5.156 na planilha / ~R$ 5.056 no handoff). **Não abatem** nenhum CMV no código atual.

---

## 2. Reconciliação produto a produto (cobertura 100% da Δ)

Soma das diferenças por produto = diferença da seção (centavos de arredondamento ≤ R$ 0,30).

### Matéria-prima — Δ +R$ 5.737,84

Ordenado por |Δ| (principais; o residual fecha a seção):

| Produto | Plan CMV | Sys CMV | Δ | Compras Δ | Final qtd Δ | Leitura |
|---|---:|---:|---:|---:|---:|---|
| Filé peito | 10.621,81 | 14.399,53 | −3.777,72 | −1.761,58 | +131,42 | Contagem: planilha 131,42 kg × sys 0 |
| Tomate | 5.245,88 | 1.673,64 | +3.572,24 | +3.537 | 0 | Compra S1 sem nota + preço S2 |
| Chocolate preto | 7.635,49 | 6.116,40 | +1.519,09 | +1.625,60 | 0 | Contagem dupla NF 6324 (set) |
| Carne em isca | 1.932,51 | 3.292,14 | −1.359,63 | 0 | +32,42 | Contagem: planilha 32,42 × sys 0 |
| Morango | 1.993,71 | 742,24 | +1.251,47 | +1.228 | 0 | Compra S1 sem nota + preço S2 |
| Cebola | 2.257,14 | 1.196,75 | +1.060,39 | +1.103 | 0 | Compra S1 sem nota |
| Ovos | 2.762,30 | 2.017,05 | +745,25 | +752,85 | 0 | Compra S1 sem nota |
| Manjericão | 581,15 | 122,12 | +459,03 | +370 | 0 | Compra S1 + custo manual |
| Mussarela | 60.505,84 | 60.961,26 | −455,42 | 0 | 0 | Método (custo) |
| Chocolate branco | 4.203,95 | 3.785,57 | +418,38 | +341,55 | −5,37 | Contagem + compras |
| Batata palha | 835,92 | 502,59 | +333,33 | +333 | 0 | Compra sem nota |
| Parmesão | 4.170,11 | 4.490,44 | −320,33 | 0 | +8,00 | Contagem |
| Milho | 3.113,62 | 2.794,32 | +319,30 | −131,28 | −28,35 | Contagem + fator/nota |
| Cebola crocante | 11,75 | −219,41 | +231,16 | −34 | −8,00 | Contagem impossível no sys |
| Calabresa | 16.083,16 | 15.854,71 | +228,45 | +229,08 | 0 | Preço/digitação |
| Brócolis | 308,82 | 107,59 | +201,23 | +156,20 | −1,24 | Compra S1 sem nota |
| Catupiry | 15.926,40 | 15.738,74 | +187,66 | +192,45 | 0 | Preço planilha ≠ nota |
| Costela | 1.735,95 | 1.562,46 | +173,49 | 0 | −0,88 | Método/custo |
| Farinha | 7.899,01 | 7.733,42 | +165,59 | 0 | 0 | Método |
| Rúcula | 210,23 | 69,59 | +140,64 | +123,90 | −0,28 | Compra S1 |
| Atum | 1.146,02 | 1.273,86 | −127,84 | −216,63 | 0 | Planilha abaixo da nota |
| Fermento | 1.427,33 | 1.300,81 | +126,52 | +185,92 | 0 | Compra sem nota |
| Creme Galak | 341,35 | 222,46 | +118,89 | −3,55 | 0 | Método/custo |
| Pimentão verde | 131,23 | 14,24 | +116,99 | +114 | −0,20 | Compra S1 + preço |
| Cheddar | 2.573,09 | 2.688,88 | −115,79 | 0 | −1,20 | Método + contagem |
| Banana | 246,68 | 131,31 | +115,37 | +114,20 | 0 | Compra sem nota |
| Tomate cereja | 191,13 | 88,81 | +102,32 | +96,05 | −0,42 | Compra S1 |
| Carne moída | 527,41 | 628,94 | −101,53 | 0 | +3,39 | Contagem |
| Biscoito Kit Kat | 36,46 | 132,99 | −96,53 | −7,31 | +1,14 | Contagem + preço |
| Bacon | 5.839,75 | 5.750,81 | +88,94 | −33,95 | −6,57 | Bonificação + contagem |
| Escarola | 62,98 | −22,88 | +85,86 | +59,40 | 0 | Compra S1; final sys impossível |
| Orégano | 162,28 | 93,30 | +68,98 | +60 | −0,36 | Compra |
| Cream cheese | 5.194,25 | 5.255,07 | −60,82 | −15,44 | 0 | Preço |
| Catchup sache | 0,97 | −55,95 | +56,92 | 0 | −1,33 | Contagem/custo |
| Demais \|Δ\|&lt;50 | — | — | ~+578 | — | — | Fecha a seção |

### Embalagens — Δ +R$ 554,85

| Produto | Plan | Sys | Δ | Prova |
|---|---:|---:|---:|---|
| Separador | 260,84 | 19,74 | +241,10 | Planilha S5 R$ 50,40 sem nota; final plan 1.128 vs sys 2.860 |
| Mesinha | 42,20 | −139,95 | +182,15 | Final sys 4.545 &gt; ini+compras (2.000) — **impossível** |
| Emb. 40 | 10.581,93 | 10.526,21 | +55,72 | Custo médio planilha vs última compra; qtd compras divergente |
| Emb. 20 | 455,10 | 419,49 | +35,61 | Método (custo) |
| Emb. entradas | 0 | −33,25 | +33,25 | Final sys 250 &gt; ini 60, sem compra — **impossível**; custo pendente |
| Emb. 25 | 981,08 | 968,05 | +13,03 | Método |
| Emb. 35 | 10.818,92 | 10.831,47 | −12,55 | Sys comprou R$ 120 a mais (troca de linha com 40?) |
| Calzone | 445,39 | 438,36 | +7,03 | Método |
| Emb. 30 | 1.173,53 | 1.174,02 | −0,49 | Ruído |

A linha **R$ 50,40 do separador na 5ª semana** da planilha não tem NF no sistema (só a NF 646 S1 R$ 322,50).

### Bebidas — Δ +R$ 1.642,96

| Produto | Δ | Principal causa |
|---|---:|---|
| Guaraná Antártica 2L | +521,61 | Planilha S1 R$ 778,70 sem nota; sys começa na S2 (NF 292295) |
| Suco pêssego | +373,87 | Final sys 134 &gt; ini 40, sem compra — contagem impossível |
| Pepsi 2L | +220,84 | Compra planilha &gt; sistema |
| Pepsi 2L zero | +176,74 | Compra planilha &gt; sistema |
| Coca 2L zero | +167,35 | Contagem (−11 un) + ruído de nota |
| Pepsi lata zero | +151,55 | Compra + contagem |
| Spaten lata (sys) | −132,36 | Só no sistema; planilha usa nome “SPATEN LATA LATA” |
| Guaraná lata | −108,26 | Contagem |
| Spaten lata lata (plan) | +102,11 | Só na planilha (nome duplicado/legado) |
| Pepsi lata | +81,70 | Final sys impossível (35 &gt; 12) |
| Guaraná 2L zero | +76,56 | Compra |
| Demais | ~+111 | Fecha R$ 1.642,96 |

Bonificações/devoluções Ahú de bebidas (Spal 9636376/7, 740826/7/8) estão **IGNORADA / DEVOLVIDA** e **não somam** no CMV — correto. Sprite 2L zero está no catálogo e no fechamento (CMV sys R$ 1.338,14).

---

## 3. Classificação A–F (Δ = planilha − sistema)

Buckets automáticos (com ajuste manual dos casos conhecidos). Soma ≈ Δ da seção.

### Por seção

| Seção | Δ | A Falta lançar | B Erro sistema | C Erro planilha | D Contagem | E Método | F Sem explicação |
|---|---:|---:|---:|---:|---:|---:|---:|
| MP | +5.737,84 | ~+2.964 | ~0 | ~+5.459 | ~−2.747 | ~+166 | ~−104 |
| Embalagens | +554,85 | ~+170 | ~0* | ~−120 | ~+367 | ~+105 | ~+33 |
| Bebidas | +1.642,96 | ~+1.359 | ~−132 | ~−121 | ~−38 | ~+435 | ~+141 |
| **Total** | **+7.935,65** | **~+4.493** | **~−132** | **~+5.218** | **~−2.418** | **~+706** | **~+70** |

\*Mesinha/entradas com final impossível estão em **D** (contagem) e/ou **B** se a contagem do app estiver errada — a loja precisa dizer qual número vale.

### Provas dos casos-chave

**(C) Chocolate preto — R$ 1.625,60 na 1ª semana**  
NF 6324 Diehl, entrada 30/09, competência set, status anterior ao CMV Real. Já no estoque final de setembro. Planilha relançou em out/S1. **Planilha errada.**

**(C) Tomate 40 kg S2: planilha R$ 554 × NF 8949813 R$ 394**  
Mesma quantidade; valor digitado ≠ nota. Idem morango 4 kg R$ 260 × R$ 180. **Planilha errada.**

**(C) Separador S5 R$ 50,40**  
Sem NF correspondente. **Planilha errada** (já listado no handoff).

**(A) Hortifruti 1ª semana (01–07/10)**  
Planilha: tomate 138,3 kg / R$ 1.538; cebola 118 / R$ 761; morango 16,4 / R$ 813; ovos 77,76 / R$ 738; etc.  
Busca em **todas as lojas**, qualquer status, fornecedor MJ Hortifruti / Saczk / descrição hortifruti: **nenhuma nota de hortifruti fresco do Ahú em 01–07/10.**  
Única MJ Hortifruti do Ahú no período inicial é a **8949813 em 10/10 (S2)**. NF 646 (06/10) é Saczk: mesinha, separador, champignon, chocolate — **não** é a feira.  
Conclusão: ou as NFs não foram importadas, ou a compra foi sem DANFE e precisa ser **compra manual**, ou a planilha inventou. **Perguntar à loja.**

**(D) Filé / carne em isca**  
Sys final 0 (custo pendente); planilha 131,42 kg e 32,42 kg. Fisicamente o sys 0 é possível só se tudo foi consumido; a planilha é a contagem da loja. **Recontar.** Efeito CMV: sys está R$ 3.777,72 e R$ 1.359,63 **acima** da planilha.

**(D/B) Mesinha final 4.545**  
Ini 1.000 + compra 1.000 (NF 646) = máx 2.000. Final 4.545 é **impossível**. CMV sys negativo (−R$ 139,95). **Contagem do app errada.**

**(D/B) Embalagem entradas final 250**  
Ini 60, compra 0 → máx 60. Final 250 impossível; custo pendente; CMV −R$ 33,25.

**(D/B) Suco pêssego final 134**  
Ini 40, compra 0 → máx 40. Final 134 impossível; CMV −R$ 319,87.

**(E) Mussarela, farinha, costela, emb. 20/25/40…**  
Mesma qtd final; custo planilha (médio do mês) ≠ última compra do sistema. Aceitar como método ou alinhar política.

---

## 4. Verificações obrigatórias

### 4.1 As 32 notas “Fora do CMV” (IGNORADA) — Ahú/outubro

| NF | Data | Fornecedor | Valor | Motivo / regra | Deveria entrar no CMV? |
|---|---|---|---:|---|---|
| 159496575 | 01/10 | EBAZAR | 208,98 | (sem regra) | Não — meias |
| 16280 | 06/10 | Ultragaz | 2.154,59 | gás | Não |
| 19330 | 06/10 | PW House | 320,04 | adaptador/eletrônicos | Não |
| 557478 | 06/10 | Marcenaria | 872,14 | madeira | Não |
| 1303 | 07/10 | AGM Higiene | 188,40 | higiene | Não |
| 16168 | 08/10 | Sabadin | 1.702,30 | | Não (conferir se alimento) |
| 15788 | 14/10 | Empório Deco | 1.199,80 | | Não |
| 15787 | 14/10 | Empório Deco | 599,90 | | Não |
| 164867 | 14/10 | RCS Leds | 119,50 | LED | Não |
| 151232 / 151234 | 15/10 | Juliana | 51,99×2 | | Não |
| 4532 | 15/10 | Alumicon | 7.929,00 | alumínio | Não |
| 9636377 | 16/10 | Spal | 1.343,59 | **DEVOLVIDA** | Não — devolução (já tratada) |
| 9636376 | 16/10 | Spal | 3.872,53 | **DEVOLVIDA** | Não |
| 740828 | 17/10 | Spal | 124,92 | **DEVOLVIDA** | Não |
| 740827 | 17/10 | Spal | 3.747,61 | **DEVOLVIDA** | Não |
| 740826 | 17/10 | Spal | 1.343,59 | **DEVOLVIDA** | Não |
| 5487 | 19/10 | Linha Verde | 1.209,52 | lacre (item ignorado) | Não |
| 357673 | 19/10 | Lugu Store | 95,73 | | Não |
| 1312 | 20/10 | AGM | 676,30 | fornecedor_fora_cmv | Não |
| 16456 | 20/10 | Ultragaz | 2.295,55 | fornecedor_fora_cmv | Não |
| 46791 | 21/10 | Maria Gabrielle | 119,99 | | Não |
| 5990 | 21/10 | Zozo Pet | 139,90 | pet | Não |
| 6287 | 21/10 | Ingrid | 123,47 | | Não |
| 18188 | 26/10 | Universo Ferragens | 172,38 | | Não |
| 340961/340960 | 26/10 | Leandro | 99×2 | | Não |
| 368605/604/629 | 26/10 | Ir Store | 100+50+100 | roupa | Não |
| 29609 | 26/10 | ers comercio | 299,00 | | Não |
| 41273 | 28/10 | Menegusso | 130,40 | | Não |

Nenhuma das 32 tem item de MP/embalagem/bebida que **deva** entrar no CMV, salvo se a loja reclassificar Sabadin/Empório (hoje sem mapeamento CMV). As 5 Spal DEVOLVIDA estão corretas fora.

### 4.2 Hortifruti 1ª semana

**Não existe** nota MJ Hortifruti (nem equivalente de feira) em 01–07/10 em nenhuma loja. Não há CNPJ do Ahú com essas compras lançadas noutra loja. A planilha S1 desses produtos está **sem documento no sistema**.

### 4.3 Mesma quantidade, preço diferente (planilha × nota)

| Produto | Sem | Planilha | Sistema (nota) |
|---|---|---:|---|
| Tomate | 2 | 40 kg / R$ 554 | 40 kg / R$ 394 (NF 8949813) |
| Morango | 2 | 4 kg / R$ 260 | 4 kg / R$ 180 (NF 8949813) |
| Ovos | 4 | 38,8 kg / R$ 374 | 38,8 kg / R$ 364 (NF 732) |
| Pimentão verde | 3 | 1,8 kg / R$ 30 | 1,8 kg / R$ 18 (NF 724) |
| Biscoito Kit Kat | 2 | 1,99 / R$ 161,16 | 1,99 / R$ 168,47 (NF 6250608) |
| Creme Galak | 2 | 1,01 / R$ 78,49 | 1,01 / R$ 82,04 (NF 6250608) |
| Chocolate branco | 2 | 37 kg / R$ 737,24 | 37 kg / R$ 749,77 |
| Atum | 3 | 10,92 / R$ 522,14 | 10,92 / R$ 656,55 |
| Catupiry | 2 | ~187,5 / R$ 4.656 | 184,2 / R$ 4.464 (NF 121668) |
| Cream cheese | 1–3 | vários | notas ~R$ 3–4 a mais que a planilha |
| Coca/água/guaraná | 3–5 | microdiferenças | notas Spal |

### 4.4 CMV negativo / estoque final impossível (sistema)

| Produto | Final | Máx físico (ini+compras) | CMV |
|---|---:|---:|---:|
| Mesinha | 4.545 | 2.000 | −139,95 |
| Emb. entradas | 250 | 60 | −33,25 |
| Suco pêssego | 134 | 40 | −319,87 |
| Cebola crocante | 10,5 | 3,82 | −219,41 |
| Escarola | 16,4 | 11,67 | −22,88 |
| Pepsi lata | 35 | 12 | −81,70 |
| Spaten long neck | 12 | 6 | −22,67 |
| Stella lata | 16 | 6 | −45,06 |
| Alho moído, canela, catchup galão, lemon pepper, pimenta… | &gt; ini | sem compra | CMV neg. |

### 4.5 Fator / R$ unitário fora do padrão (&gt;50% vs mediana 4 lojas)

Lista gerada na extração (amostra): custos unitários de compras Ahú com variação &gt;50% frente à mediana do grupo — revisar fator em chocolate/hortifruti/ovos se ainda houver linha antiga; as caixas Diehl de outubro já estão em 10,1.

### 4.6 Custos pendentes e órfãos

Pendências com impacto material (final &gt; 0 ou CMV grande com final 0 por contagem):

| Produto | Final | Impacto |
|---|---:|---|
| Filé (final 0, CMV alto) | 0 | Contagem: Δ −R$ 3.777,72 vs planilha |
| Carne em isca | 0 | Δ −R$ 1.359,63 |
| Catchup galão | 17,1 | CMV −18,94; final impossível |
| Pasta de alho | 10,26 | CMV 107,20 sem custo |
| Emb. entradas | 250 | CMV −33,25 |
| Spaten lata | 12 | CMV 132,36 sem custo |
| Spaten long neck | 12 | CMV −22,67 |
| Guaraná 600 zero | 0 | CMV 328,09 (custo pendente no saldo) |
| Soda | 0 | CMV 161,23 |

Órfãos em nota aprovada: **UNTA FORMA** NFs 4317733 e 4321079 (SEM_MAPEAMENTO) — já fora do CMV (handoff). Não reintroduzir.

### 4.7 Bebidas (Δ R$ 1.642,96)

- Devoluções Spal: corretamente IGNORADA.  
- Guaraná 2L: maior buraco de compra (S1 planilha sem nota).  
- Spaten: duplicidade de nome planilha/sistema.  
- Contagens impossíveis: suco pêssego, pepsi lata, stella, spaten LN.  
- Sprite 2L zero: no catálogo; não é o motor da diferença.

### 4.8 Embalagens (planilha R$ 24.758,99 × sys R$ 24.204,14)

O que mudou na planilha desde R$ 24.917,90: **−R$ 158,91** (ainda não decomposto linha a linha nesta auditoria além do estado atual).  
O que ainda diverge: separador (+241), mesinha (+182), método nas caixas (~+90), entradas (+33), líquido emb. 35 (−13).

---

## 5. Ações (não aplicadas)

### Lançar / corrigir no sistema (perguntar antes de gravar)

| Ação | Onde | Valor / efeito CMV estimado |
|---|---|---|
| Obter DANFEs ou lançar **compra manual** da feira 01–07/10 (tomate, cebola, morango, ovos, folhas…) | Lançamentos Ahú/out | Até ~R$ +7–8 mil em compras MP → CMV sobe na mesma ordem |
| Recontar filé e carne em isca | Contagem / saldo out | Se planilha correta: CMV MP **cai** ~R$ 5.137 |
| Corrigir finais impossíveis: mesinha, emb. entradas, suco pêssego, cebola crocante, escarola, pepsi lata, stella, spaten LN | Contagem | Remove CMV negativo; emb/beb sobem |
| Unificar Spaten lata (nome planilha vs catálogo) | Produtos | Remove Δ ±R$ 100 cruzado |
| Preencher custo pendente Spaten / pasta alho / catchup galão | Saldo | Sem efeito grande se qtd final for corrigida antes |
| Conferir Sabadin/Empório se algum item é alimento | Notas ignoradas | Só se a loja confirmar |

### Corrigir na planilha

| Produto | Semana / célula | Atual | Correto |
|---|---|---|---|
| Chocolate preto | 1ª sem compras | R$ 1.625,60 | **0** (já no estoque set) |
| Tomate | 2ª sem valor | R$ 554 (40 kg) | **R$ 394** (NF 8949813) |
| Morango | 2ª sem valor | R$ 260 (4 kg) | **R$ 180** |
| Separador | 5ª sem | R$ 50,40 | **0** (sem NF) |
| Cebola crocante | 1ª sem | 1 kg / R$ 34 | Mover para **2ª sem** (NF 8949813 10/10) |
| Ovos / pimentão / Kit Kat / Galak / atum / catupiry… | ver §4.3 | valor digitado | valor da NF |
| Spaten | nome | “LATA LATA” | alinhar ao catálogo |

### Perguntar à loja

1. Onde estão as notas da feira/hortifruti de **01–07/10** (tomate 138 kg, cebola 118 kg, morango 16,4 kg, ovos…)?  
2. Qual contagem vale: filé 0 ou 131,42 kg? Isca 0 ou 32,42 kg?  
3. Mesinha: como o app chegou a 4.545?  
4. Separador: houve compra de R$ 50,40 na 5ª semana?  
5. Suco pêssego / pepsi lata / stella: contagem real?  
6. Guaraná 2L: houve compra na 1ª semana (R$ 778,70) sem NF no sistema?

### Aceitar como método (E)

~R$ 166 MP + ~R$ 105 emb + ~R$ 435 beb ≈ **R$ 706** (custo médio do mês na planilha × última compra no sistema), após corrigir A/B/C/D.

---

## 6. Simulação final (ordem de grandeza)

| | Hoje | Se corrigir sistema (A+B+D) | Se corrigir planilha (C) | Ambos + só sobra E+F |
|---|---:|---:|---:|---:|
| CMV MP | 186.742 | ~191–194 mil* | ~186–187 mil** | gap residual ~R$ 0–300 (E+F) |
| CMV Emb | 24.204 | ~24.4–24.6 mil (finais) | ~24.5–24,6 mil | ~método R$ 100 |
| CMV Beb | 28.570 | ~28.8–29,5 mil | ~28.5–28,8 mil | ~método R$ 400 |
| Total | 239.516 | sobe com compras manuais da feira | cai com C | diferença residual ≈ E+F (~R$ 0,8 mil) |

\*Depende do que a loja confirmar na feira S1 e nas contagens.  
\*\*Removendo chocolate 1.625,60 e ajustando preços S2.

A diferença que **deve** sobrar depois de A–D é só **método (E)** e o pouco que cair em **F**.

---

## 7. Apêndice — ponte de compras MP

| | Planilha | Sistema | Δ |
|---|---:|---:|---:|
| Compras MP | 194.898,42 | 186.402,95 | +8.495,47 |
| − Chocolate preto duplo | | | −1.625,60 (C) |
| − Preços S2 tomate/morango etc. | | | ~−240 (C) |
| ≈ compra sem documento / sem nota | | | **~R$ 6,6 mil** (A — majoritariamente hortifruti S1 e semanas sem NF) |

NF 8949813 (R$ 1.999,25) já está no sistema (S2) e **não** explica a S1.

---

*Gerado em modo somente leitura. Scripts temporários de extração não fazem parte do produto.*
