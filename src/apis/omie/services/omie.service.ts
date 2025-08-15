import { isEmpty } from '@/utils/util';
import OmieApi from '@apis/omie/utils/omie.api';
import { OmieBudgetsApiResponse, OmieOS, OmieServico } from '@apis/omie/interfaces/omie.interface';
import { Service } from '@/apis/services/interfaces/services.interface';
import { Order } from '@/apis/orders/interfaces/orders.interface';
import { Report } from '@/apis/reports/interfaces/reports.interface';

class OmieService {
  private omieApi = new OmieApi('WE');

  public async getBudgets(): Promise<OmieBudgetsApiResponse[]> {
    const paramsApiOmie: any = {
      pagina: '1',
      registros_por_pagina: '999',
      apenas_importado_api: 'N',
      ordenar_por: 'numero_pedido',
      ordem_descrescente: 'S',
    };

    const { pedido_venda_produto: pedidosProjeto01 }: any = await this.omieApi.getAllBudget({
      ...paramsApiOmie,
      filtrar_por_projeto: 7356094187,
    });

    const { pedido_venda_produto: pedidosProjeto02 }: any = await this.omieApi.getAllBudget({
      ...paramsApiOmie,
      filtrar_por_projeto: 7331342864,
    });

    const { pedido_venda_produto: pedidosProjeto03 }: any = await this.omieApi.getAllBudget({
      ...paramsApiOmie,
      filtrar_por_projeto: 7336427828,
    });

    if (!isEmpty(pedidosProjeto01) || !isEmpty(pedidosProjeto02) || !isEmpty(pedidosProjeto03)) {
      return this.omieDataNormalize([...pedidosProjeto01, ...pedidosProjeto02, ...pedidosProjeto03]);
    }

    return [];
  }

  private omieDataNormalize(omieDataObject: any): OmieBudgetsApiResponse[] {
    return omieDataObject
      .filter((omidata: any) => omidata.cabecalho.etapa !== '00')
      .map((omiObject: any): OmieBudgetsApiResponse => {
        return {
          omieCodCliente: omiObject.cabecalho.codigo_cliente,
          omieCodPedido: omiObject.cabecalho.codigo_pedido,
          omieNumPedido: omiObject.cabecalho.numero_pedido,
          omieQtdProducts: omiObject.cabecalho.quantidade_itens,
          omieStep: omiObject.cabecalho.etapa,
          omieDtPedido: omiObject.infoCadastro.dInc,
        };
      });
  }

  public async getBudget(idNumOmie: string): Promise<OmieBudgetsApiResponse> {
    const data = await this.omieApi.getBudget(idNumOmie);

    return data;
  }

  public async getClient(idClient: string): Promise<any> {
    const data = await this.omieApi.getClient(idClient);

    return data;
  }

  public async getProduct(idProduct: string): Promise<any> {
    const data = await this.omieApi.getProduct(idProduct);

    return data;
  }

  public async getBudgetsInvoice(data_faturamento_de: string, data_faturamento_ate: string): Promise<any> {
    const paramsApiOmie: any = {
      pagina: '1',
      registros_por_pagina: '999',
      apenas_importado_api: 'N',
      ordenar_por: 'numero_pedido',
      ordem_descrescente: 'S',
      status_pedido: 'FATURADO',
      data_faturamento_de,
      data_faturamento_ate,
    };

    const { pedido_venda_produto }: any = await this.omieApi.getAllBudget({
      ...paramsApiOmie,
    });

    return pedido_venda_produto;
  }

  public async getNfe(idInvoice: string): Promise<any> {
    const nfe: any = await this.omieApi.getNfe(idInvoice);

    return nfe;
  }

  public async createService(service: Service): Promise<any> {
    const omieService: Partial<OmieServico> = {
      intIncluir: {
        cCodIntServ: service.id,
      },
      descricao: {
        cDescrCompleta: service.name.toUpperCase(),
      },
      cabecalho: {
        cCodigo: `SRV${Math.floor(Math.random() * 999)}`,
        cCodCateg: '1.02.01',
        cCodLC116: '14.02',
        cCodServMun: '1402-0/01-88',
        cDescricao: service.name.toUpperCase(),
        cIdTrib: '01',
        nIdNBS: '',
        nPrecoUnit: parseInt(service.pricing),
      },
      impostos: {
        cRetCOFINS: 'N',
        cRetCSLL: 'N',
        cRetINSS: 'N',
        cRetIR: 'N',
        cRetISS: 'N',
        cRetPIS: 'N',
        lDeduzISS: false,
        nAliqCOFINS: 0,
        nAliqCSLL: 0,
        nAliqINSS: 0,
        nAliqIR: 0,
        nAliqISS: 0,
        nAliqPIS: 0,
        nRedBaseCOFINS: 0,
        nRedBaseINSS: 0,
        nRedBasePIS: 0,
      },
    };

    return this.omieApi.addService(omieService);
  }

  public async updateService(service: Service): Promise<any> {
    const omieService: Partial<OmieServico> = {
      intEditar: {
        cCodIntServ: service.id,
        nCodServ: service.idOmie,
      },
      descricao: {
        cDescrCompleta: service.name.toUpperCase(),
      },
      cabecalho: {
        cDescricao: service.name.toUpperCase(),
        nPrecoUnit: parseInt(service.pricing),
      },
    };

    return this.omieApi.updateService(omieService);
  }

  private selectServicesOfReports(order: Order): any {
    const services = order.reports.map((report: Report) => {
      return report.services.map((service: Service) => {
        let nValUnit = '';
        if (report.client.partner) {
          nValUnit = service.pricingPartner;
        } else {
          nValUnit = service.pricing;
        }
        return { nCodServico: service.idOmie, nQtde: 1, nValUnit: parseInt(nValUnit) };
      });
    });

    const combinedServices = services.reduce((accumulator: any, currentValue: any) => {
      const existingService = accumulator.find((item: any) => item.nCodServico === currentValue.nCodServico);

      if (existingService) {
        existingService.nQtde += currentValue.nQtde;
      } else {
        accumulator.push({ ...currentValue });
      }

      return accumulator;
    });
    console.log(combinedServices);

    return combinedServices;
  }

  public async createOS(order: Order): Promise<any> {
    const omieClient = await this.omieApi.getListClient({
      cnpj_cpf: order.billing.document,
    });

    const servicos = this.selectServicesOfReports(order);

    let somaServicos = 0;

    servicos.map((servico: any) => {
      somaServicos = somaServicos + servico.nQtde * servico.nValUnit;
    });

    const omieOS: OmieOS = {
      Cabecalho: {
        cEtapa: '10',
        dDtPrevisao: '13/10/2024',
        nCodCli: omieClient.clientes_cadastro_resumido.codigo_cliente,
        nQtdeParc: 1,
        nValorTotal: somaServicos,
        nValorTotalImpRet: 0,
      },
      Email: {
        cEnvBoleto: 'N',
        cEnvLink: 'N',
        cEnviarPara: 'kalado@gmail.com',
      },
      InformacoesAdicionais: {
        nCodCC: 11850365,
      },
      ServicosPrestados: [...servicos],
      Parcelas: [
        {
          dDtVenc: '13/10/2024',
          meio_pagamento: '15',
          nDias: 0,
          nParcela: 1,
          nPercentual: 100,
          nValor: somaServicos,
          tipo_documento: 'BOL',
          nao_gerar_boleto: 'S',
          parcela_adiantamento: 'S',
          categoria_adiantamento: '1.02.01',
          conta_corrente_adiantamento: 10519639201,
        },
      ],
    };

    const teste = await this.omieApi.addOs(omieOS);
    console.log(teste);
  }
}

export default OmieService;
