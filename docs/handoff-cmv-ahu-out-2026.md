# Handoff — CMV Ahú, outubro/2026

Branch: `fix/cmv-ahu-outubro`. Sem merge na `main` e sem deploy. A tela em produção ainda roda o código antigo.

## Números atuais

- CMV de matéria-prima, sem descontar refeição: **R$ 185.735,65**
- Planilha (célula oficial de MP): **R$ 192.479,77**
- Diferença restante: **R$ 6.744,12**
- Na tela de produção, as refeições ainda são descontadas (R$ 5.055,74), então o card mostra **R$ 180.679,91** até o deploy desta branch.
- Bebidas: **R$ 28.569,58** antes e depois. A regra de bonificação não alterou bebidas porque não foi para o ar.

## O que já foi gravado no banco de produção

Só a Parte 1 e o desperdício, na loja Ahú, competência 2026-10, fechamento aberto. Nenhuma quantidade de contagem já feita foi alterada.

- Unta forma (NF 4317733 e 4321079): vínculo com amaciante removido. Sem produto novo. Os dois lançamentos saíram do CMV (R$ 371,92).
- Linguiça Blumenau: incluída no catálogo de matéria-prima. Saldo de outubro gravado com a contagem de 18,627 kg e o custo da última compra (R$ 33,90/kg).
- Recheio de morango: produto criado em matéria-prima. NF 111221 (5,025 kg, R$ 119,95) movida do morango fresco. Estoque inicial de setembro: 17,66 kg / R$ 418,68. Estoque final de outubro: 19,91 kg, custo da nota (R$ 23,87/kg).
- Kit Kat: NF 6250608 (R$ 168,47) movida do creme Kit Kat para o biscoito Kit Kat. Efeito líquido zero no CMV total.
- Desperdício: dez lançamentos tipo Desperdício em 31/10/2026, observação "Desperdício planilha outubro 2026", soma R$ 1.046,67 (catupiry 12 kg / R$ 294,48; cream cheese 4,5 / 135,36; farinha 50 / 129; presunto 6 / 99; bacon 4,5 / 85,37; mussarela 2 / 56,34; morango 5 / 172,28; filé 2 / 30,06; abacaxi 0,8 / 29,44; ovos 1,62 / 15,34).

CMV de MP depois de cada gravação: 186.304,92 → unta 185.933,00 → linguiça 186.838,90 → recheio 186.782,32 → Kit Kat 186.782,32 → desperdício 185.735,65.

Correção anterior, já no banco e fora desta branch: seis custos de embalagem que estavam divididos por 50 foram regravados pelo preço da última nota, sem mudar quantidade. CMV de embalagens ficou em R$ 24.204,14. Não reverter.

## O que está só no código desta branch

Não está em produção.

- Parte 2: o custo das refeições internas deixa de ser abatido de qualquer CMV. O quadro da tela continua informativo. Sobe junto com a Parte 3, quando ela for liberada.
- Parte 3: mês aberto recalcula o custo do saldo final (última compra da loja, depois do grupo, depois teórico). Custo manual e mês fechado não entram. Bonificação (CFOP 5.910 e 6.910) e troca marcada à mão entram na quantidade e no valor da compra, mas não definem o custo. Variação acima de 50% para cima ou para baixo não grava: vira pendência "custo fora do padrão" no CMV Real, com produto, custo atual, custo novo e nota. Etiqueta Bonificação/Troca na nota e no lançamento, com marca manual.
- Contagem: ao concluir, item em branco pede "zero" ou "não contado". Campo vazio não vira zero, inclusive no somar. Contagens antigas não foram regravadas.

## Decisões pendentes

Não gravar nem fazer deploy antes de confirmação.

- Bacon, NF 180098 (27/10, 1 PT, fator 20, R$ 33,95). Descrição: `BACON CUBOS BARRIGA BEM MAIS 20X1 RF 520`. Unidade comercial PT, quantidade 1, valor líquido R$ 33,95. O XML importado não tem unidade nem quantidade tributável. O fator 20 não é o peso do pacote. CFOP 5.910: é bonificação, então não deve virar o custo do saldo. O fator continua 20 até alguém informar o peso em kg.
- Troca: nenhum CFOP foi definido como troca. Bonificação automática é só 5.910 e 6.910. CFOPs vistos em todas as lojas, com exemplo: 5.102 (compra, linguiça), 5.401 (Coca, inclusive a NF 9677430), 5.403, sem CFOP (hortifruti), 6.102, 5.101, 5.405, 6.106, 5.910 (bonificação), 5.656 (gás), 1.410, 5.949, 1.949, 6.108, 2.202, 6.101, 6.105, 1.101, 5.908, 6.910 (bonificação), 1.909, 1.662, 6.404, 1.202.
- Coca lata, NF 9677430: R$ 1,0192/lata é bonificação na operação, mas o CFOP gravado é 5.401, não 5.910. A trava de 50% segura o custo. Marcar a linha à mão se a regra for valer para ela.
- Manjericão, NF 732: unidade KG, quantidade 0,75, R$ 87,20, fator 1. Os R$ 116,27/kg são o preço da própria nota, não um fator errado. A trava segura porque o saldo está em R$ 49.
- NF 8949813 (MJ Hortifruti, 10/10): não aprovada. Sugestões a partir das notas 724, 728, 732 e 735, ainda sem gravar. Tomate caixa: 2 CX, R$ 394, fator atual 1; sugestão fator 20 para fechar 40 kg a R$ 9,85/kg, igual à NF 728. Manjericão 2 UN / R$ 21,80 → fator 0,1 (R$ 109/kg, igual à 728). Morango 4 CX / R$ 180 → fator 1 (R$ 45/kg, igual à 728). Brócolis 3 UN / R$ 17,10 → fator 0,3833. Rúcula 3 UN / R$ 12,30 → fator 0,1833. Escarola 4 UN / R$ 13,20 → fator 0,0775 (a 735 tem o mesmo valor em outro peso). Tempero 3 UN / R$ 17,40 → fator 0,4. Cebola 2 CX / R$ 244 → fator 18. Cebola 03/10, 1 CX / R$ 127 → fator 18, igual à 724. Tomate cereja 03/10, 2 BDJ / R$ 14,30 → fator 0,25. Ovo caixa 2 CX / R$ 364 → fator 19,4. Ovo 2 CX / R$ 374 → fator 19,44. Sem par nas notas aprovadas: tomate cereja bandeja, ovo bandeja e embalagem plástica.
- Milho, NF 2147782: não alterar. A loja ainda confirma se cada UN é uma caixa com 6 latas de 1,7 kg (fator 10,2).
- Recontar, sem mudar quantidade: filé (0 contra 131,42 kg), carne em isca (0 contra 32,42 kg), chocolate branco, parmesão, milho e cebola crocante.

## Pendências de custo se a Parte 3 subir

Simulação, nada gravado. Efeito é a mudança no valor do estoque final. O que passa de 50% fica pendente.

| Produto | Atual | Novo | Nota | Efeito | Situação |
|---|---:|---:|---|---:|---|
| Tomate | 9,80 | 13,3791 | 732 | −445,77 | grava |
| Morango | 23,8706 | 57,1429 | 732 | −336,05 | pendência |
| Costela | 55,90 | 59,90 | 111764 | −119,51 | grava |
| Coca lata | 3,3894 | 1,0192 | 9677430 | +109,03 | pendência (CFOP 5.401) |
| Farinha de trigo | 2,58 | 2,78 | 111764 | −108,00 | grava |
| Manjericão | 49,00 | 116,2667 | 732 | −85,43 | pendência |
| Chocolate branco | 19,6995 | 20,9429 | 111764 | −83,79 | grava |
| Cebola crocante | 39,00 | 34,00 | 728 | +52,50 | grava |
| Cereja | 52,95 | 46,1364 | 4317733 | +31,00 | grava |
| Biscoito Kit Kat | 95,1807 | 84,5733 | 6250608 | +14,87 | grava |
| Escarola | 10,80 | 9,90 | 732 | +14,76 | grava |
| Pimentão verde | 9,80 | 12,00 | 732 | −12,98 | grava |
| Açúcar | 3,10 | 2,90 | 111764 | +11,20 | grava |
| Cebola | 6,70 | 6,50 | 732 | +10,56 | grava |
| Brócolis | 17,00 | 18,24 | 732 | −10,09 | grava |

A soma do que gravaria sozinho é cerca de −R$ 649 no CMV. Bacon não entra nessa lista: a NF 180098 é CFOP 5.910.

## Diferença restante contra a planilha

Os R$ 6.744,12 se separam assim, nas linhas de R$ 50 ou mais. Linguiça, recheio, amaciante e creme Kit Kat fecharam dentro de R$ 20.

- Contagem a recontar: filé R$ 3.777,72; carne em isca R$ 1.359,63; chocolate branco R$ 418,38; parmesão R$ 320,33; milho R$ 319,30; cebola crocante R$ 317,66.
- Compra sem nota aprovada no sistema: tomate R$ 3.520,46; chocolate preto R$ 1.519,09; ovos R$ 1.498,40; cebola R$ 1.441,95; morango R$ 1.095,42; batata palha R$ 407,33; manjericão R$ 395,40; brócolis R$ 208,24; rúcula R$ 159,60; tomate cereja R$ 136,48; fermento R$ 126,52; creme Galak R$ 118,89; banana R$ 114,82; escarola R$ 113,82; orégano R$ 104,98; pimentão verde R$ 104,01; tempero R$ 51,30.
- Método (média da planilha contra última compra) ou preço digitado diferente da nota: mussarela R$ 455,42; calabresa R$ 224,89; catupiry R$ 187,66; atum R$ 133,47 (planilha abaixo das notas); cheddar R$ 115,79; carne moída R$ 101,53; bacon R$ 88,94 (fator 20 ainda na quantidade); biscoito Kit Kat R$ 81,66 (nota R$ 168,47, planilha R$ 161,16); cream cheese R$ 60,82; farinha R$ 57,59; costela R$ 53,98.
