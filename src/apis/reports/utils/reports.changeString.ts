import { Report } from "@/apis/reports/interfaces/reports.interface";

export const reportsChangeString = async (key: string, oldObject: Report, newObject: Report) => {
  switch (key) {
    case 'idOmie':
      if (oldObject.idOmie) {
        return `Alterou o pedido do Omie de ${oldObject.idOmie} para ${newObject.idOmie}`;
      } else {
        return `Adicionou um pedido do Omie a este laudo, ${newObject.idOmie}`;
      }

    case 'idOmieTaxAvaliation':
      if (oldObject.idOmieTaxAvaliation) {
        return `Alterou o pedido do Omie para Taxa de Avaliação de ${oldObject.idOmieTaxAvaliation} para ${newObject.idOmieTaxAvaliation}`;
      } else {
        return `Adicionou um pedido do Omie para Taxa de Avaliação a este laudo, ${newObject.idOmieTaxAvaliation}`;
      }

    case 'descriptionClient':
      return `Alterou a descrição do cliente`;

    case 'descriptionTech':
      return `Alterou a descrição do técnico`;

    case 'pending':
      if (oldObject.pending === true && newObject.pending === false) {
        return `Aprovou o laudo, retirando ele de pendente`;
      }

      if (oldObject.pending === false && newObject.pending === true) {
        return `Colocou o laudo para avaliação novamente, adicionando ele como pendente`;
      }

    case 'denied':
      if (oldObject.denied === false && newObject.denied === true) {
        return `Reprovou o laudo, colocando ele como negado`;
      }

      if (oldObject.denied === true && newObject.denied === false) {
        return `Aprovou o laudo, retirando ele de negado`;
      }

    case 'taxAvaliation':
      if (oldObject.taxAvaliation === false && newObject.taxAvaliation === true) {
        return `Adicionou que o cliente precisa pagar taxa de avaliação`;
      }

      if (oldObject.taxAvaliation === true && newObject.taxAvaliation === false) {
        return `Retirou a taxa de avaliação do laudo`;
      }

    case 'statusId':
      return `Alterou o status de ${oldObject.status.name} para ${newObject.status.name}`;

    case 'cameraId':
      if (oldObject.cameraId !== newObject.cameraId) {
        return `Alterou a câmera do laudo de ${oldObject.camera.serialNumber} para ${newObject.camera.serialNumber}`;
      }

    case 'servicesIDs':
      return `Alterou os serviços prestados neste laudo`;
  }
};
