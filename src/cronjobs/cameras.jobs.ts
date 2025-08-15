import OmieService from '@/apis/omie/services/omie.service';
import { Camera } from '@/apis/cameras/interfaces/cameras.interface';
import CameraService from '@/apis/cameras/services/cameras.service';
import { chatgpt } from '@/utils/ai';
import { logger } from '@/utils/logger';
import { subtractDays, formatDate, addDays, normalizeDate } from '@/utils/util';
import { Promise } from 'bluebird';

class CamerasJobs {
  public cameraService = new CameraService();
  public omieService = new OmieService();

  private gptPrompt: string = `Extract all trap camera serial numbers from the note below the company's invoice. Remove the camera model if it precedes the serial number. If cameras were replaced under camera, separate their serial numbers from the new ones. Include prefixes HRT, CI, or B as part of the serial number. Return the results in this JSON format: {"new_cameras": ["serial_number1", "serial_number2", ...],"replaced_cameras": ["serial_number1", "serial_number2", ...]} Return only the serial numbers, no extra text.`;

  public getOmieOrders = async (days: number) => {
    const dateToday: Date = new Date();
    const dateMinusDays: Date = subtractDays(dateToday, days);

    try {
      const invoices = await this.omieService.getBudgetsInvoice(formatDate(dateMinusDays, '-'), formatDate(dateToday, '-'));

      return invoices;
    } catch(err) {
      logger.error(`CRON-SERIALSNUMBERS - Não foi possível carregar os pedidos do Omie das datas: ${formatDate(dateMinusDays, '-')} a ${formatDate(dateToday, '-')}.`);
      return []
    }
  };

  public getTrapCamsOrder = async (invoices: any) => {
    const invoicesTrapCams = [];

    invoices.map((invoice: any) => {
      let brek = 0;
      invoice.det.map((product: any) => {
        if (brek !== 1) {
          const prd = product.produto.descricao.split('TRAP');
          if (prd.length > 1) {
            invoicesTrapCams.push(invoice);
            brek = 1;
          }
        }
      });
    });

    return invoicesTrapCams;
  };

  public getSerialNumbersInInovoice = async (invoices: any) => {
    const serialNumbers = {
      new_cameras: [],
      replaced_cameras: [],
    };

    await Promise.map(
      invoices,
      async (invoice: any) => {
        try {
          const resultGpt: any = await chatgpt(`${this.gptPrompt} ${invoice.informacoes_adicionais.dados_adicionais_nf}"`);
          const normalizeResponse1 = resultGpt.text.replace('```json', '');
          const normalizeResponse2 = normalizeResponse1.replace('```', '');
          const serials = JSON.parse(normalizeResponse2);

          serialNumbers.new_cameras.push(...serials.new_cameras);
          serialNumbers.replaced_cameras.push(...serials.replaced_cameras);

          if (serials.new_cameras.length > 0) {
            this.createCameras(serialNumbers.new_cameras, invoice);
          }

          if (serials.replaced_cameras.length > 0) {
            this.updateCameras(serials.replaced_cameras);
          }
        } catch(err) {
          logger.error(
            `CRON-SERIALSNUMBERS - Ocorreu um erro para carregar a invoice ${invoice.cabecalho.numero_pedido} no chatgpt, precisa refazer ela.`,
          );
        }
      },
      { concurrency: 1 },
    );

    return serialNumbers;
  };

  public createCameras = async (serials: any, invoice: any) => {
    const nfe = await this.omieService.getNfe(`${invoice.cabecalho.codigo_pedido}`);
    await Promise.map(
      serials,
      async (serialNumber: string) => {
        try {
          await this.cameraService.createCamera({
            invoice: `${nfe.ide.nNF}`,
            idOrderOmie: `${invoice.cabecalho.codigo_pedido}`,
            warrantyFinishDate: addDays(new Date(`${normalizeDate(nfe.ide.dEmi)}`), 365),
            serialNumber,
          });
        } catch(err) {
          if (err.status !== 409){
            logger.error(`CRON-SERIALSNUMBERS - SerialNumber não adicionado: ${serialNumber} da invoice ${invoice.cabecalho.numero_pedido}`);
          }
          return Promise.resolve();
        }
      },
      { concurrency: 1 },
    );
  }

  public updateCameras = async (serials: any) => {
    await Promise.map(
      serials,
      async (serialNumber: string) => {
        try {
          const camera: Camera[] = await this.cameraService.findAllCamera({ where: { serialNumber } });
          if (camera.length > 0) {
            const cameraSelect = camera[0];
            await this.cameraService.updateCamera(cameraSelect.id, {
              invoice: `${cameraSelect.invoice}`,
              serialNumber: `${cameraSelect.serialNumber}`,
              replaced: true
            });
          }
        } catch(err) {
          logger.error(`CRON-SERIALSNUMBERS - SerialNumber não alterado para substituído: ${serialNumber} .`);
          return Promise.resolve();
        }
      }, {concurrency: 1})
  }
}

export default CamerasJobs;
