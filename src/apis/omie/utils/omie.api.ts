import axios, { AxiosInstance } from 'axios';
import { OMIE_LOG_APP_KEY, OMIE_LOG_APP_SECRET, OMIE_WE_APP_KEY, OMIE_WE_APP_SECRET } from '@config';
import { OmieListarEtapasRequest, OmieOS, OmieServico } from '@apis/omie/interfaces/omie.interface';

class OmieApi {
  private axiosInstance: AxiosInstance;
  private company: string;

  private defaultBody = {
    LOG: {
      app_key: OMIE_LOG_APP_KEY,
      app_secret: OMIE_LOG_APP_SECRET,
    },
    WE: {
      app_key: OMIE_WE_APP_KEY,
      app_secret: OMIE_WE_APP_SECRET,
    },
  };

  private delay(ms: any) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }

  constructor(company: string = 'LOG') {
    this.company = company;
    this.axiosInstance = axios.create({
      baseURL: 'https://app.omie.com.br/api/v1/',
      timeout: 200000,
      headers: { OMIE_APP_KEY: this.defaultBody[this.company].app_key, OMIE_APP_SECRET: this.defaultBody[this.company].app_secret },
    });
  }

  private async axiosPost(url: any, data: any) {
    try {
      const res = await this.axiosInstance.post(url, data);
      return res;
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
      } else {
        console.log('Error', error.message);
      }
      if (error.response.status === 500 || error.response.status === 425) return error;
      console.log(`Nova tentativa Omie`);
      await this.delay(5000);
      return this.axiosPost(url, data);
    }
  }

  public async getAllBudget(param: any): Promise<any[]> {
    try {
      const { data } = await this.axiosPost('/produtos/pedido/', {
        ...this.defaultBody[this.company],
        call: 'ListarPedidos',
        param: [param],
      });

      return data;
    } catch (err) {
      console.log(err);
    }
  }

  public async getBudget(idNumOmie: string): Promise<any> {
    try {
      const { data } = await this.axiosPost('/produtos/pedido/', {
        ...this.defaultBody[this.company],
        call: 'ConsultarPedido',
        param: [
          {
            numero_pedido: idNumOmie,
          },
        ],
      });

      return data;
    } catch (err) {
      console.log(err);
    }
  }

  public async getClient(idClient: string): Promise<any> {
    try {
      const { data } = await this.axiosPost('/geral/clientes/', {
        ...this.defaultBody[this.company],
        call: 'ConsultarCliente',
        param: [
          {
            codigo_cliente_omie: idClient,
          },
        ],
      });

      return data;
    } catch (err) {
      console.log(err);
    }
  }

  public async getListClient(clientesFiltro: any = undefined): Promise<any> {
    try {
      const { data } = await this.axiosPost('/geral/clientes/', {
        ...this.defaultBody[this.company],
        call: 'ListarClientesResumido',
        param: [
          {
            pagina: 1,
            registros_por_pagina: 50,
            apenas_importado_api: 'N',
            clientesFiltro,
          },
        ],
      });

      return data;
    } catch (err) {
      console.log(err);
    }
  }

  public async getProduct(idProduct: string): Promise<any> {
    try {
      const { data } = await this.axiosPost('/geral/produtos/', {
        ...this.defaultBody[this.company],
        call: 'ConsultarProduto',
        param: [
          {
            codigo_produto: idProduct,
          },
        ],
      });

      return data;
    } catch (err) {
      console.log(err);
    }
  }

  public async getStepsBudget(obj: OmieListarEtapasRequest): Promise<any> {
    try {
      const { data } = await this.axiosPost('/produtos/pedidoetapas/', {
        ...this.defaultBody[this.company],
        call: 'ListarEtapasPedido',
        param: [
          {
            ...obj,
          },
        ],
      });

      return data;
    } catch (err) {
      return Promise.resolve();
    }
  }

  public async getNfe(idNumOmie: string): Promise<any> {
    try {
      const { data } = await this.axiosPost('/produtos/nfconsultar/', {
        ...this.defaultBody[this.company],
        call: 'ConsultarNF',
        param: [
          {
            nIdPedido: idNumOmie,
          },
        ],
      });

      return data;
    } catch (err) {
      return Promise.resolve();
    }
  }

  public async addOs(omieOSData: Partial<OmieOS>): Promise<any> {
    try {
      const { data } = await this.axiosPost('/servicos/os/', {
        ...this.defaultBody[this.company],
        call: 'ConsultarNF',
        param: [{ ...omieOSData }],
      });

      return data;
    } catch (err) {
      return Promise.resolve();
    }
  }

  public async addService(omieServiceData: Partial<OmieServico>): Promise<any> {
    try {
      const { data } = await this.axiosPost('/servicos/servico/', {
        ...this.defaultBody[this.company],
        call: 'IncluirCadastroServico',
        param: [{ ...omieServiceData }],
      });

      return data;
    } catch (err) {
      return Promise.resolve();
    }
  }

  public async updateService(omieServiceData: Partial<OmieServico>): Promise<any> {
    try {
      const { data } = await this.axiosPost('/servicos/servico/', {
        ...this.defaultBody[this.company],
        call: 'AlterarCadastroServico',
        param: [{ ...omieServiceData }],
      });

      return data;
    } catch (err) {
      return Promise.resolve();
    }
  }
}

export default OmieApi;
