# Handoff — CMV Ahú, outubro/2026

A branch `fix/cmv-ahu-outubro` entra na `main` e sobe para a Vercel. A tela de fechamento de Ahú/outubro ainda não foi aberta depois desse deploy, então os 27 custos da Parte 3 continuam só na simulação até essa abertura.

`/cmv-real` cai em Revisão e não grava custo. O recálculo roda no GET de `/api/cmv-real/fechamento`, quando a aba Fechamento carrega a loja e o mês. A aba abre em Ahú no mês corrente. Novembro/2026 está aberto e não tem estoque final, então essa primeira carga não grava nada. O que grava é **Ahú, Outubro de 2026**.

## Números

Planilha oficial de matéria-prima: **R$ 192.479,77**.

Antes de abrir o fechamento de outubro (refeição já fora da conta, custos da Parte 3 ainda não gravados):

- Matéria-prima: **R$ 187.313,42**
- Embalagens: **R$ 24.204,14**
- Bebidas: **R$ 28.569,58**

Depois de abrir Ahú/outubro, o esperado na tela:

- CMV MP: **R$ 186.741,96** (sem desconto de refeição)
- CMV Embalagens: **R$ 24.204,14**
- CMV Bebidas: **R$ 28.569,58**
- CMV Total: **R$ 239.515,68**
- Quadro "Refeições internas": mostra o custo (R$ 5.055,74 no levantamento) e não abate de nenhum CMV

A diferença da matéria-prima para a planilha passa a **R$ 5.737,81**. Os R$ 571,46 a mais em relação aos R$ 5.166,35 de antes da abertura são o efeito dos 27 custos (o estoque final fica mais caro e o CMV cai).

## O que já está no banco

Produção, Ahú, outubro aberto. Quantidade de contagem já feita não foi alterada.

- Parte 1 e desperdício: unta forma fora do CMV (R$ 371,92), linguiça Blumenau no catálogo (18,627 kg, R$ 33,90/kg), recheio de morango criado, Kit Kat da NF 6250608 no biscoito, desperdício de 31/10 no valor de R$ 1.046,67. Embalagens corrigidas antes desta branch: CMV R$ 24.204,14. Não reverter.
- Bacon, NF 180098: fator 1 (1 kg). Continua bonificação (CFOP 5.910) e não define o custo. O valor da compra segue R$ 33,95.
- Coca lata, NF 9677430: marca manual de bonificação. O custo do saldo permanece o da NF 9677431, R$ 3,3894.
- Morango: custo manual R$ 57,1429 (NF 732). Manjericão: custo manual R$ 116,2667 (NF 732, kg do XML). A Parte 3 não sobrescreve custo manual.
- NF 8949813 (MJ Hortifruti, 10/10) aprovada. A linha "embalagem plástica" (50 UN, R$ 53,50) está ignorada. Entraram R$ 1.999,25 de compra. O CMV de matéria-prima subiu exatamente esse valor.
- Chocolate preto, Diehl, caixa `ean:0742832375306|CX`: mapeamento em **10,1**. A NF 6324 (30/09) não foi alterada.
- Chocolate branco, Diehl, caixa `ean:0742832375283|CX`: mapeamento corrigido de 1,01 para **10,1**. As notas de outubro em caixa já estavam em 10,1 (Portão 6343, Uberaba 6417 e 6520, Pilarzinho 6418 e 6521, Ahú 6522, 6641 e 6735). Nenhuma delas foi regravada. O CMV não muda por causa desse fator.

A bisnaga avulsa (Portão, NF 12955, unidade, 1,01 kg) continua com fator 1,01.

## O que o deploy passa a fazer

- Parte 2: refeição interna deixa de ser abatida. O quadro da tela continua informativo.
- Parte 3: mês aberto, com quantidade final positiva e origem diferente de manual, grava a última compra (loja, depois grupo, depois outra loja, depois teórico). Variação acima de 50% não grava e vira pendência "custo fora do padrão". Bonificação, troca manual e devolução não definem o custo.
- Desempate da última compra no mesmo dia: importação mais recente (`createdAt`) e, se empatar, o maior número de nota. No chocolate branco do Ahú, a NF 6735 (importada depois) ganha da NF 111764. O custo fica R$ 19,6995.
- CFOP de entrada (1.xxx/2.xxx) em nota de fornecedor: a linha vira compra negativa no fechamento, não define o custo, e a etiqueta é "Devolução/Troca". Lançamento antigo positivo também é subtraído na hora de montar o fechamento, uma vez só.

## Custos que a abertura de Ahú/outubro grava

Simulação, ainda não conferida no banco depois da abertura. Efeito é a mudança no CMV. Soma **−R$ 571,46**. Nenhuma linha do Ahú estourou 50%.

| Produto | Atual | Novo | Nota | Efeito |
|---|---:|---:|---|---:|
| Tomate | 9,80 | 13,3791 | 732 | −445,77 |
| Costela | 55,90 | 59,90 | 111764 | −119,51 |
| Farinha de trigo | 2,58 | 2,78 | 111764 | −108,00 |
| Cebola crocante | 39,00 | 34,00 | 728 | +52,50 |
| Cereja | 52,95 | 46,1364 | 4317733 | +31,00 |
| Biscoito Kit Kat | 95,1807 | 84,5733 | 6250608 | +14,87 |
| Escarola | 10,80 | 9,90 | 732 | +14,76 |
| Pimentão verde | 9,80 | 12,00 | 732 | −12,98 |
| Açúcar | 3,10 | 2,90 | 111764 | +11,20 |
| Cebola | 6,70 | 6,50 | 732 | +10,56 |
| Brócolis | 17,00 | 18,24 | 732 | −10,09 |
| Óleo | 7,7667 | 8,3222 | 111764 | −7,00 |
| Rúcula | 24,00 | 21,9048 | 732 | +6,66 |
| Tempero completo | 12,50 | 14,75 | 735 | −6,30 |
| Atum lata | 59,8095 | 60,1498 | 1764874 | −5,63 |
| Linguiça calabresa | 18,55 | 18,65 | 111764 | −3,56 |
| Vinagre | 2,10 | 1,89 | 111764 | +2,84 |
| Figo em calda | 29,975 | 29,75 | 111764 | +2,79 |
| Coco ralado | 31,99 | 30,90 | 111764 | +2,09 |
| Bolacha Negresco | 40,95 | 41,36 | 2147772 | −1,85 |
| Tomate cereja | 25,80 | 25,4118 | 732 | +1,41 |
| Ameixa | 34,00 | 34,50 | 735 | −0,78 |
| Banana | 3,10 | 3,15 | 732 | −0,55 |
| Creme culinário | 8,8217 | 8,865 | 1758152 (Uberaba) | −0,13 |
| Presunto | 16,5001 | 16,50 | 111764 | +0,01 |
| Queijo gorgonzola | 48,9004 | 48,9013 | 111764 | 0 |
| Linguiça Blumenau | 33,8998 | 33,90 | 40959 | 0 |

Creme culinário vem do grupo (Uberaba). O restante é última compra do Ahú. Gorgonzola e linguiça Blumenau são regravados no mesmo valor.

Pilarzinho, Portão e Uberaba não têm estoque final de outubro. Abrir o fechamento dessas lojas não grava custo e não cria pendência de 50%.

## Pendências

Ainda sem decisão. Não alterar quantidade nem a planilha até a loja confirmar.

### Qual contagem vale

O sinal é planilha menos sistema: negativo significa que o CMV do sistema está mais alto. Soma destas seis linhas: **−R$ 6.513,02**.

| Produto | No app, outubro | Na planilha | Diferença no CMV |
|---|---|---|---:|
| Filé de peito sem osso | 0 kg, custo pendente (setembro tinha 116 kg a R$ 14,2702) | 131,42 kg | −3.777,72 |
| Carne em isca | 0 kg, custo pendente (setembro tinha 18,5 kg a R$ 41,8021) | 32,42 kg | −1.359,63 |
| Chocolate branco | 67,39 kg a R$ 19,6995 (NF 6735) | contagem da planilha ainda não escolhida | −418,38 |
| Parmesão | 31,6 kg a R$ 32 | contagem da planilha ainda não escolhida | −320,33 |
| Milho | 181,05 kg a R$ 12 | contagem da planilha ainda não escolhida | −319,30 |
| Cebola crocante | 10,5 kg; o custo vai a R$ 34 (NF 728) quando o fechamento abrir | contagem da planilha ainda não escolhida | −317,66 |

### Compras sem nota na planilha

Cerca de **R$ 7.598** ainda estão na planilha e não têm nota aprovada no sistema, depois de tirar o chocolate preto e de lançar a NF 8949813. Confirmar com a loja quais compras existem de fato.

### Correções da planilha

- Chocolate preto, NF 6324, R$ 1.625,60 na 1ª semana de outubro. A nota é de 30/09 e esse chocolate já estava no estoque final de setembro. É contagem dupla da planilha. A nota não entra no CMV de outubro.
- NF 38137 de embalagem lançada na 3ª semana.
- Separador de R$ 50,40.

### Bebidas

CMV de bebidas no sistema: **R$ 28.569,58**. Diferença de **R$ 1.642,96** para a planilha, ainda não investigada.

### Venda do mês

Platefull **R$ 696.735,14**. Planilha **R$ 688.341,78**.

### Devoluções do Pilarzinho

Confirmar com a loja. Hoje entram como compra positiva, R$ 610,63. Com o código novo, o fechamento do Pilarzinho subtrai o mesmo valor: o CMV cai R$ 1.221,26 (matéria-prima −R$ 1.118,56, bebidas −R$ 102,70). Isso só acontece quando o fechamento do Pilarzinho for montado.

| Nota | Data | Produto | Valor |
|---|---|---|---:|
| 6236067 | 02/10 | Creme Kit Kat | 168,69 |
| 6236067 | 02/10 | Azeitona verde | 110,95 |
| 6258650 | 16/10 | Creme Kit Kat | 168,69 |
| 6258650 | 16/10 | Azeitona verde | 110,95 |
| 741496 | 21/10 | Sprite 2 L zero | 51,35 |

Não há nota normal desses produtos no mesmo dia. A reposição do creme e da azeitona, no mesmo valor, é a NF 6250396 de 14/10. O Sprite tem a NF 9644900 em 20/10 (24 un, R$ 205,60) e a NF 9632442 em 15/10 (6 un, R$ 51,39).
