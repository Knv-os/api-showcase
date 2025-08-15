import { NextFunction, Request, Response } from 'express';
import { PaginationReqInterface, paginationResHelper, paginationSearchNormalize } from '@/helpers/pagination.helper';
import OrdersService from '../services/orders.service';
import { Order, OrderCreateBody, OrderUpdateBody } from '../interfaces/orders.interface';

class OrdersController {
  public orderOrder = new OrdersService();
  private searchFields = ['idOmie', 'name', 'pricing', 'pricingPartner'];

  public getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paginationParams: PaginationReqInterface = paginationSearchNormalize(req.query, this.searchFields);
      const findAllOrdersData: Order[] = await this.orderOrder.findAllOrders(paginationParams);
      const countOrders: number = await this.orderOrder.orderCount(paginationParams.where);

      const paginationResponse = paginationResHelper({
        all: countOrders,
        page: paginationParams.page ? paginationParams.page : '1',
        perPage: paginationParams.perPage ? paginationParams.perPage : '20',
      });

      res.status(200).json({
        ...paginationResponse,
        data: findAllOrdersData,
      });
    } catch (error) {
      next(error);
    }
  };

  public getOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderId = req.params.id;
      const findOneOrderData: Order = await this.orderOrder.findOrderById(orderId);

      res.status(200).json(findOneOrderData);
    } catch (error) {
      next(error);
    }
  };

  public createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderData: OrderCreateBody = req.body;
      const createOrderData: Order = await this.orderOrder.createOrder(orderData);

      res.status(201).json(createOrderData);
    } catch (error) {
      next(error);
    }
  };

  public updateOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderId = req.params.id;
      const orderData: OrderUpdateBody = req.body;
      const updateOrder: Order = await this.orderOrder.updateOrder(orderId, orderData);

      res.status(200).json(updateOrder);
    } catch (error) {
      next(error);
    }
  };

  public deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderid = req.params.id;
      await this.orderOrder.deleteOrder(orderid);

      res.status(200).send('ok');
    } catch (error) {
      next(error);
    }
  };
}

export default OrdersController;
