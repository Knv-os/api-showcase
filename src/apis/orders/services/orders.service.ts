import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { PaginationReqInterface } from '@helpers/pagination.helper';
import { OrderRepository } from '../repositories/orders.repository';
import { Order, OrderCreateBody, OrderUpdateBody } from '../interfaces/orders.interface';

class OrdersService {
  public orderRepository = new OrderRepository();

  public async findAllOrders(paginationParams: PaginationReqInterface): Promise<Order[]> {
    return this.orderRepository.findAll(paginationParams);
  }

  public async findOrderById(orderId: string): Promise<Order> {
    if (isEmpty(orderId)) throw new HttpException(400, 'You not send userId');

    const findOrder: Order = await this.orderRepository.findById(orderId);
    if (!findOrder) throw new HttpException(409, 'Not find user');

    return findOrder;
  }

  public async createOrder(orderData: OrderCreateBody): Promise<Order> {
    if (isEmpty(orderData)) throw new HttpException(400, 'You not send orderData');

    const createOrderData: Order = await this.orderRepository.create(orderData);
    return createOrderData;
  }

  public async updateOrder(orderId: string, orderData: OrderUpdateBody): Promise<Order> {
    if (isEmpty(orderData)) throw new HttpException(400, 'You not send orderData');

    const findOrder: Order = await this.orderRepository.findById(orderId);
    if (!findOrder) throw new HttpException(409, 'Not find order');

    await this.orderRepository.update(orderData, orderId);

    const updateOrder: Order = await this.orderRepository.findById(orderId);
    return updateOrder;
  }

  public async deleteOrder(orderId: string): Promise<Order> {
    if (isEmpty(orderId)) throw new HttpException(400, 'You not send orderId');

    const findOrder: Order = await this.orderRepository.findById(orderId);
    if (!findOrder) throw new HttpException(409, 'Not find order');

    await this.orderRepository.destroy(findOrder.id);

    return findOrder;
  }

  public async orderCount(where?: string): Promise<number> {
    return this.orderRepository.count(where ? { where: JSON.parse(where) } : undefined);
  }
}

export default OrdersService;
