export interface OmieData {
  topic: string;
  idPedido: number;
  numPedOmie: string;
  valorPedido: number;
  idCliente: number;
  etapa: string;
  codigoCategoria: string;
  dataInclusao: string;
}

export interface OmieBudgetsApiResponse {
  omieQtdProducts: number;
  omieCodCliente: number;
  omieCodPedido: number;
  omieNumPedido: string;
  omieStep: string;
  omieDtPedido: string;
}

export interface OmieListarEtapasRequest {
  nPagina?: number;
  nRegPorPagina?: number;
  cOrdenarPor?: string;
  cOrdemDecrescente?: string;
  dDtInicial?: string;
  dDtFinal?: string;
  cHrInicial?: string;
  cHrFinal?: string;
  nCodPed?: number;
  cCodIntPed?: string;
  cEtapa?: '10' | '20' | '50' | '60' | '70' | '80';
}

export interface OmieOS {
  Cabecalho?: OmieOSCabecalho;
  InformacoesAdicionais?: OmieInformacoesAdicionais;
  Email?: OmieEmail;
  Departamentos?: OmieDepartamentos;
  ServicosPrestados?: OmieServicosPrestados[];
  Parcelas?: OmieParcelas[];
  Observacoes?: {
    cObsOS: string;
  };
  InfoCadastro?: OmieInfoCadastro;
  despesasReembolsaveis?: {
    cCodCategReemb: string;
  };
  produtosUtilizados?: OmieProdutosUtilizados;
}

export interface OmieOSCabecalho {
  cCodIntOS?: string;
  nCodOS?: number;
  cNumOS?: string;
  cCodIntCli?: string;
  nCodCli?: number;
  dDtPrevisao?: string;
  // ÍNDICE:
  // 10 - Primeira coluna
  // 20 - Segunda coluna
  // 30 - Terceira coluna
  // 40 - Quarta coluna
  // 50 - Faturar
  cEtapa?: '10' | '20' | '30' | '40' | '50';
  nCodVend?: number;
  nQtdeParc?: number;
  cCodParc?: string;
  nValorTotal?: number;
  nValorTotalImpRet?: number;
  nCodCtr?: number;
}

export interface OmieInformacoesAdicionais {
  cEnviarPara?: string;
  nCodCC?: number;
  cNumPedido?: string;
  cNumContrato?: string;
  cContato?: string;
  cDadosAdicNF?: string;
  cCodObra?: string;
  cCodART?: string;
  nCodProj?: number;
  cCidPrestServ?: string;
  dDataRps?: string;
  cNumRecibo?: string;
}

export interface OmieEmail {
  cEnvRecibo?: 'S' | 'N';
  cEnvLink?: 'S' | 'N';
  cEnvBoleto?: 'S' | 'N';
  cEnvPix?: 'S' | 'N';
  cEnviarPara?: string;
  cEnvViaUnica?: 'S' | 'N';
}

export interface OmieDepartamentos {
  cCodDepto: string;
  nPerc: number;
  nValor: number;
  nValorFixo: 'S' | 'N';
}

export interface OmieInfoCadastro {
  cCancelada: string;
  cFaturada: string;
  cAmbiente: 'H' | 'P';
  dDtInc: string;
  cHrInc: string;
  dDtAlt: string;
  cHrAlt: string;
  dDtFat: string;
  cHrFat: string;
  dDtCanc: string;
  cHrCanc: string;
  cOrigem: string;
}

export interface OmieServicosPrestados {
  nCodServico?: number;
  cTribServ?: string;
  cCodServMun?: string;
  cCodServLC116?: string;
  nQtde?: number;
  nValUnit?: number;
  // ÍNDICE:
  // P - Percentual
  // V - Valor
  cTpDesconto?: 'P' | 'V';
  nValorDesconto?: number;
  nAliqDesconto?: number;
  nValorOutrasRetencoes?: number;
  nValorAcrescimos?: number;
  cDescServ?: string;
  cRetemISS?: 'S' | 'N';
  cDadosAdicItem?: string;
  cNbs?: string;
  impostos?: OmieImpostos;
  cNaoGerarFinanceiro?: 'S' | 'N';
  cCodCategItem?: string;
  nSeqItem?: number;
  nIdItem?: number;
  // ÍNDICE:
  // A = Alterar o ítem
  // E = Excluir o ítem
  // I = Incluir o ítem na alteração
  cAcaoItem?: 'A' | 'E' | 'I';
  cReembolso?: 'S' | 'N';
}

export interface OmieImpostos {
  cFixarISS: string;
  nAliqISS: number;
  nBaseISS: number;
  nTotDeducao: number;
  nValorISS: number;
  cUtilizaValorImposto: 'S' | 'N';
  nAliqIRRF: number;
  nValorIRRF: number;
  cRetemIRRF: 'S' | 'N';
  nAliqPIS: number;
  nValorPIS: number;
  cRetemPIS: 'S' | 'N';
  nAliqCOFINS: number;
  nValorCOFINS: number;
  cRetemCOFINS: 'S' | 'N';
  nAliqCSLL: number;
  nValorCSLL: number;
  cRetemCSLL: 'S' | 'N';
  nAliqINSS: number;
  nValorINSS: number;
  cRetemINSS: 'S' | 'N';
  nAliqRedBaseINSS: number;
  nAliqRedBaseCOFINS: number;
  nAliqRedBasePIS: number;
  lDeduzISS: boolean;
}

export interface OmieParcelas {
  nParcela?: number;
  dDtVenc?: string;
  nValor?: number;
  nPercentual?: number;
  nDias?: number;
  // ÍNDICE:
  // BOL = Boleto
  // CRC = Cartão de Crédito
  // CRD = Cartão de Débito
  // DEP = Depósito em Conta
  tipo_documento?: 'BOL' | 'CRC' | 'CRD' | 'DEP';
  // ÍNDICE:
  // 15 = Boleto
  // 03 = Cartão de Crédito
  // 04 = Cartão de Débito
  // 16 = Depósito em Conta
  meio_pagamento?: '15' | '03' | '04' | '16';
  nsu?: string;
  nao_gerar_boleto?: 'S' | 'N';
  parcela_adiantamento?: 'S' | 'N';
  categoria_adiantamento?: string;
  conta_corrente_adiantamento?: number;
}

export interface OmieProdutosUtilizados {
  nIdItemPU: number;
  // ÍNDICE:
  // A = Alterar o ítem
  // E = Excluir o ítem
  // I = Incluir o ítem na alteração
  cAcaoItemPU: 'A' | 'E' | 'I';
  nCodProdutoPU: string;
  nQtdePU: number;
  codigo_local_estoque: number;
}

export interface OmieServico {
  intIncluir?: {
    cCodIntServ: string;
  };
  intEditar?: {
    nCodServ: string;
    cCodIntServ?: string;
  };
  cabecalho: OmieCabecalhoServico;
  descricao: {
    cDescrCompleta: string;
  };
  impostos: OmieImpostosServico;
  produtosUtilizados: OmieProdutosUtilizados;
  viaUnica: OmieViaUnica;
}

export interface OmieCabecalhoServico {
  cDescricao?: string;
  cCodigo?: string;
  cIdTrib?: string;
  cCodServMun?: string;
  cCodLC116?: string;
  nIdNBS?: string;
  nPrecoUnit?: number;
  cCodCateg?: string;
}

export interface OmieImpostosServico {
  nAliqISS: number;
  cRetISS: 'S' | 'N';
  nAliqPIS: number;
  cRetPIS: 'S' | 'N';
  nAliqCOFINS: number;
  cRetCOFINS: 'S' | 'N';
  nAliqCSLL: number;
  cRetCSLL: 'S' | 'N';
  nAliqIR: number;
  cRetIR: 'S' | 'N';
  nAliqINSS: number;
  cRetINSS: 'S' | 'N';
  nRedBaseINSS: number;
  nRedBasePIS: number;
  nRedBaseCOFINS: number;
  lDeduzISS: boolean;
}

export interface OmieViaUnica {
  cUtilizaViaUnica: 'S' | 'N';
  // ÍNDICE:
  // 21 - Nota Fiscal de Serviço de Comunicação
  // 22 - Nota Fiscal de Serviço de Telecomunicação
  cModeloNF: '21' | '22';
  cCFOP: string;
  cClassifServico: string;
  // ÍNDICE:
  // 0 - Receita própria - serviços prestados
  // 1 - Receita própria - cobrança de débitos
  // 2 - Receita própria - venda de mercadorias
  // 3 - Receita própria - venda de serviço pré-pago
  // 4 - Outras receitas próprias
  // 5 - Receitas de terceiros (co-faturamento)
  // 9 - Outras receitas de terceiros
  cTipoReceita: '0' | '1' | '2' | '2' | '3' | '4' | '5' | '9';
  cTipoUtilizacao: string;
}
