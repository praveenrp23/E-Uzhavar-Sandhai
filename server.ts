import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db, UserRole, OrderStatus } from './server/db';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser
  app.use(express.json());

  // Simple Request Logger for /api routes
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.path}`);
    }
    next();
  });

  // ==========================================
  // REST API ROUTES (/api/*)
  // ==========================================

  // Health check & System Info
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'E-Uzhavar Sandhai Full-Stack Engine',
      state: 'Tamil Nadu Digital Farmers Market',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  // Database Status & Diagnostics
  app.get('/api/db/status', (req: Request, res: Response) => {
    const stats = db.getDbStats();
    res.json({
      ...stats,
      serverTime: new Date().toISOString(),
    });
  });

  // Database Reset / Re-seed
  app.post('/api/db/reset', (req: Request, res: Response) => {
    const freshDb = db.resetDatabase();
    res.json({
      success: true,
      message: 'Database reset to verified Tamil Nadu FPO seed dataset',
      stats: db.getDbStats(),
    });
  });

  // Available Endpoints Catalog
  app.get('/api/endpoints', (req: Request, res: Response) => {
    res.json({
      apiTitle: 'E-Uzhavar Sandhai RESTful API',
      version: '1.0.0',
      endpoints: [
        { method: 'GET', path: '/api/health', description: 'System health check' },
        { method: 'GET', path: '/api/db/status', description: 'Database diagnostic statistics' },
        { method: 'POST', path: '/api/db/reset', description: 'Reset database to initial seed dataset' },
        { method: 'GET', path: '/api/auth/users', description: 'List all registered user accounts' },
        { method: 'POST', path: '/api/auth/login', description: 'Authenticate by role and optional email' },
        { method: 'POST', path: '/api/auth/signup', description: 'Register new user account' },
        { method: 'PUT', path: '/api/auth/profile', description: 'Update current user profile info' },
        { method: 'GET', path: '/api/produce', description: 'Filterable produce listings' },
        { method: 'GET', path: '/api/produce/:id', description: 'Get single produce item' },
        { method: 'POST', path: '/api/produce', description: 'Create new produce listing (FPO)' },
        { method: 'PUT', path: '/api/produce/:id', description: 'Update produce listing or inventory' },
        { method: 'DELETE', path: '/api/produce/:id', description: 'Remove produce listing' },
        { method: 'GET', path: '/api/orders', description: 'Retrieve orders with filters' },
        { method: 'GET', path: '/api/orders/:id', description: 'Get detailed order tracking' },
        { method: 'POST', path: '/api/orders', description: 'Checkout cart & deduct inventory atomically' },
        { method: 'PATCH', path: '/api/orders/:id/status', description: 'Update milestone status' },
        { method: 'POST', path: '/api/orders/:id/assign-logistics', description: 'Assign fleet vehicle' },
        { method: 'GET', path: '/api/analytics', description: 'Central marketplace analytics & metrics' },
        { method: 'GET', path: '/api/prices', description: 'Daily Tamil Nadu mandi benchmark prices' },
        { method: 'GET', path: '/api/audit-logs', description: 'System audit logs' },
      ],
    });
  });

  // --- Auth & Users API ---
  app.get('/api/auth/users', (req: Request, res: Response) => {
    const users = db.getUsers();
    res.json({ success: true, count: Object.keys(users).length, users });
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { role, email } = req.body;
    if (!role) {
      return res.status(400).json({ success: false, message: 'User role is required' });
    }
    const user = db.authenticate(role as UserRole, email);
    res.json({ success: true, user });
  });

  app.post('/api/auth/signup', (req: Request, res: Response) => {
    const userData = req.body;
    if (!userData.role) {
      return res.status(400).json({ success: false, message: 'Role is required for registration' });
    }
    const user = db.registerUser(userData);
    res.status(201).json({ success: true, user });
  });

  app.put('/api/auth/profile', (req: Request, res: Response) => {
    const { id, updates } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }
    const updated = db.updateUser(id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user: updated });
  });

  // --- Produce Catalog API ---
  app.get('/api/produce', (req: Request, res: Response) => {
    const { category, district, organic, search, fpoId } = req.query;
    const produce = db.getProduce({
      category: category as string,
      district: district as string,
      organic: organic === 'true',
      search: search as string,
      fpoId: fpoId as string,
    });
    res.json({
      success: true,
      count: produce.length,
      produce,
    });
  });

  app.get('/api/produce/:id', (req: Request, res: Response) => {
    const item = db.getProduceById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Produce item not found' });
    }
    res.json({ success: true, produce: item });
  });

  app.post('/api/produce', (req: Request, res: Response) => {
    const itemData = req.body;
    if (!itemData.name || !itemData.pricePerKg || !itemData.availableKg) {
      return res.status(400).json({
        success: false,
        message: 'Name, pricePerKg, and availableKg are required fields',
      });
    }
    const item = db.createProduce(itemData);
    res.status(201).json({ success: true, produce: item });
  });

  app.put('/api/produce/:id', (req: Request, res: Response) => {
    const updated = db.updateProduce(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Produce item not found' });
    }
    res.json({ success: true, produce: updated });
  });

  app.delete('/api/produce/:id', (req: Request, res: Response) => {
    const deleted = db.deleteProduce(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Produce item not found' });
    }
    res.json({ success: true, message: 'Produce listing deleted successfully' });
  });

  // --- Orders API ---
  app.get('/api/orders', (req: Request, res: Response) => {
    const { buyerId, buyerType, status, logisticsPartnerId } = req.query;
    const orders = db.getOrders({
      buyerId: buyerId as string,
      buyerType: buyerType as string,
      status: status as string,
      logisticsPartnerId: logisticsPartnerId as string,
    });
    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  });

  app.get('/api/orders/:id', (req: Request, res: Response) => {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order });
  });

  app.post('/api/orders', (req: Request, res: Response) => {
    const payload = req.body;
    const result = db.createOrder(payload);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(201).json(result);
  });

  app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
    const { status, note, updatedBy } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Order status is required' });
    }
    const order = db.updateOrderStatus(req.params.id, status as OrderStatus, note, updatedBy);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order });
  });

  app.post('/api/orders/:id/assign-logistics', (req: Request, res: Response) => {
    const { logisticsPartnerId, logisticsCompany, vehicleNumber } = req.body;
    if (!logisticsCompany || !vehicleNumber) {
      return res.status(400).json({
        success: false,
        message: 'Logistics company and vehicleNumber are required',
      });
    }
    const order = db.assignLogistics(
      req.params.id,
      logisticsPartnerId || 'log_01',
      logisticsCompany,
      vehicleNumber
    );
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order });
  });

  // --- Analytics, Mandi Prices & Audit Logs ---
  app.get('/api/analytics', (req: Request, res: Response) => {
    const analytics = db.getAnalytics();
    res.json({ success: true, analytics });
  });

  app.get('/api/prices', (req: Request, res: Response) => {
    const prices = db.getMarketPrices();
    res.json({ success: true, count: prices.length, prices });
  });

  app.get('/api/audit-logs', (req: Request, res: Response) => {
    const logs = db.getActivityLogs();
    res.json({ success: true, count: logs.length, logs });
  });

  // ==========================================
  // Vite Middleware / Static Asset Serving
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Server] Initializing Vite middleware for development...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] E-Uzhavar Sandhai running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
