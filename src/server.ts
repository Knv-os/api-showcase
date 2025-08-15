import App from '@/app';
import AuthRoute from '@apis/auth/routes/auth.route';
import IndexRoute from '@apis/_general/routes/index.route';
import UsersRoute from '@apis/users/routes/users.route';
import UsersCognitoRoute from '@apis/users_cognito/routes/users_cognito.route';
import StatusRoute from '@apis/status/routes/status.route';
import HistoriesRoute from '@apis/histories/routes/histories.route';
import ServicesRoute from '@apis/services/routes/services.route';
import ReportsRoute from '@apis/reports/routes/reports.route';
import ClientsRoute from '@apis/clients/routes/clients.route';
import CamerasRoute from '@apis/cameras/routes/cameras.route';
import OmieRoute from '@apis/omie/routes/omie.route';
import BillingsRoute from '@apis/billings/routes/billings.route';
import OrdersRoute from '@apis/orders/routes/orders.route';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App([
  new IndexRoute(),
  new AuthRoute(),
  new UsersRoute(),
  new UsersCognitoRoute(),
  new StatusRoute(),
  new HistoriesRoute(),
  new ServicesRoute(),
  new ReportsRoute(),
  new CamerasRoute(),
  new ClientsRoute(),
  new OmieRoute(),
  new BillingsRoute(),
  new OrdersRoute(),
]);

app.listen();
