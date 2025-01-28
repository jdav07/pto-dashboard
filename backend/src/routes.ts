import Router from 'koa-router';
import { AuthService } from './services/AuthService';
import { PtoService } from './services/PtoService';
import { AuthController } from './controllers/AuthController';
import { PtoController } from './controllers/PtoController';
import { authMiddleware } from './middleware/authMiddleware';

const router = new Router();

const SECRET_KEY = process.env.JWT_SECRET_KEY;
if (!SECRET_KEY) {
    throw new Error('JWT_SECRET_KEY environment variable is required');
}
const authService = new AuthService(SECRET_KEY);
const ptoService = new PtoService();

const authController = new AuthController(authService);
const ptoController = new PtoController(ptoService);

// Auth
router.post('/auth/login', (ctx) => authController.login(ctx));

// PTO
router.get('/pto/balance', authMiddleware, (ctx) => ptoController.getBalance(ctx));
router.get('/pto/requests', authMiddleware, (ctx) => ptoController.getRequests(ctx));
router.post('/pto/request', authMiddleware, (ctx) => ptoController.submitRequest(ctx));

export default router;