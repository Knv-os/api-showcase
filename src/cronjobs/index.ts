import cron from 'node-cron';
import CamerasJobs from './cameras.jobs';

class CronJobs {
  private camerasJobs = new CamerasJobs();

  public constructor() {
    this.cameraExpires();
  }

  private cameraExpires = async () => {
    cron.schedule('0 3 * * 3,6', async () => {
      const invoices = await this.camerasJobs.getOmieOrders(7);
      const invoicesTrapCam = await this.camerasJobs.getTrapCamsOrder(invoices);
      await this.camerasJobs.getSerialNumbersInInovoice(invoicesTrapCam);
    });
  };
}

export default CronJobs;
