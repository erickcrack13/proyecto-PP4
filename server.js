const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const BACKUP_DIR = path.join(__dirname, 'backups');
const PUBLIC_DIR = path.join(__dirname);
const DB_FILE = path.join(__dirname, 'db.json');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(PUBLIC_DIR));

let clients = [];
let db = {};

// Database Schema and Validation
const DB_SCHEMA = {
  version: '1.0.0',
  products: [],
  clients: [],
  transactions: [],
  rate: 216.38,
  settings: {
    currency: 'USD',
    language: 'es',
    timezone: 'America/Caracas'
  },
  metadata: {
    created: new Date().toISOString(),
    lastBackup: null,
    totalTransactions: 0
  }
};

// Product validation schema
const PRODUCT_SCHEMA = {
  id: 'string',
  nombre: 'string',
  precio: 'number',
  categoria: ['accesorios', 'computadoras', 'componentes'],
  DISPONIBLE: 'number',
  urlImagen: 'string',
  descripcion: 'string',
  fechaCreacion: 'string',
  ultimaActualizacion: 'string'
};

// Client validation schema
const CLIENT_SCHEMA = {
  id: 'string',
  nombre: 'string',
  email: 'string',
  telefono: 'string',
  cedula: 'string',
  balance: 'number',
  fechaRegistro: 'string',
  ultimaActividad: 'string'
};

// Transaction validation schema
const TRANSACTION_SCHEMA = {
  id: 'string',
  clienteId: 'string',
  productos: 'array',
  total: 'number',
  metodoPago: ['efectivo', 'transferencia', 'pago_movil', 'zelle'],
  estado: ['pendiente', 'completada', 'cancelada'],
  fecha: 'string',
  notas: 'string'
};

// Database utilities with validation and error handling
async function initializeDatabase() {
  try {
    await fs.access(DB_FILE);
    const data = await readDB();
    // Validate and migrate database if needed
    db = await validateAndMigrateDatabase(data);
    console.log('Database loaded successfully');
  } catch (e) {
    console.log('Database not found, creating new one...');
    db = { ...DB_SCHEMA };
    await writeDB(db);
    await createBackup('initial');
  }
}

async function validateAndMigrateDatabase(data) {
  // Add missing fields from schema
  const migrated = { ...DB_SCHEMA, ...data };

  // Ensure all required arrays exist
  migrated.products = migrated.products || [];
  migrated.clients = migrated.clients || [];
  migrated.transactions = migrated.transactions || [];
  migrated.settings = { ...DB_SCHEMA.settings, ...migrated.settings };
  migrated.metadata = { ...DB_SCHEMA.metadata, ...migrated.metadata };

  // Validate and clean data
  migrated.products = migrated.products.filter(p => validateProduct(p));
  migrated.clients = migrated.clients.filter(c => validateClient(c));
  migrated.transactions = migrated.transactions.filter(t => validateTransaction(t));

  // Add timestamps to products if missing
  migrated.products = migrated.products.map(p => ({
    ...p,
    fechaCreacion: p.fechaCreacion || new Date().toISOString(),
    ultimaActualizacion: p.ultimaActualizacion || new Date().toISOString()
  }));

  await writeDB(migrated);
  return migrated;
}

function validateProduct(product) {
  if (!product || typeof product !== 'object') return false;
  if (!product.nombre || typeof product.precio !== 'number') return false;
  if (product.precio < 0 || (product.DISPONIBLE !== undefined && product.DISPONIBLE < 0)) return false;
  if (product.categoria && !['accesorios', 'computadoras', 'componentes'].includes(product.categoria)) return false;
  return true;
}

function validateClient(client) {
  if (!client || typeof client !== 'object') return false;
  if (!client.nombre || !client.cedula) return false;
  if (client.balance !== undefined && client.balance < 0) return false;
  return true;
}

function validateTransaction(transaction) {
  if (!transaction || typeof transaction !== 'object') return false;
  if (!transaction.clienteId || !Array.isArray(transaction.productos) || typeof transaction.total !== 'number') return false;
  if (transaction.total < 0) return false;
  if (transaction.metodoPago && !['efectivo', 'transferencia', 'pago_movil', 'zelle'].includes(transaction.metodoPago)) return false;
  if (transaction.estado && !['pendiente', 'completada', 'cancelada'].includes(transaction.estado)) return false;
  return true;
}

// Enhanced database operations
async function readDB(){
  try {
    const raw = await fs.readFile(DB_FILE, 'utf8');
    const data = JSON.parse(raw);
    return data;
  } catch(e){
    console.error('Error reading database:', e);
    return { ...DB_SCHEMA };
  }
}

async function writeDB(data){
  try {
    // Update metadata
    data.metadata = data.metadata || {};
    data.metadata.lastModified = new Date().toISOString();

    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch(e){
    console.error('Error writing database:', e);
    throw new Error('Failed to save database');
  }
}

// Backup system
async function createBackup(reason = 'manual') {
  try {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(BACKUP_DIR, `db_backup_${reason}_${timestamp}.json`);

    const db = await readDB();
    await fs.writeFile(backupFile, JSON.stringify(db, null, 2), 'utf8');

    // Update last backup timestamp
    db.metadata.lastBackup = new Date().toISOString();
    await writeDB(db);

    console.log(`Backup created: ${backupFile}`);
    return backupFile;
  } catch(e) {
    console.error('Error creating backup:', e);
    throw e;
  }
}

async function restoreBackup(backupFile) {
  try {
    const backupData = await fs.readFile(backupFile, 'utf8');
    const data = JSON.parse(backupData);
    await writeDB(data);
    console.log(`Database restored from: ${backupFile}`);
    return true;
  } catch(e) {
    console.error('Error restoring backup:', e);
    throw e;
  }
}

// SSE stream
app.get('/api/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });
  res.write('\n');
  clients.push(res);
  req.on('close', () => {
    clients = clients.filter(c => c !== res);
  });
});

function broadcast(event){
  clients.forEach(res => {
    try { res.write(`event: ${event}\ndata: update\n\n`); } catch(e){ /* ignore */ }
  });
}

// API endpoints
app.get('/api/products', async (req, res) => {
  try {
    const db = await readDB();
    res.json(db.products || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const p = req.body;
    p.id = p.id || ('p' + Date.now());
    p.fechaCreacion = p.fechaCreacion || new Date().toISOString();
    p.ultimaActualizacion = new Date().toISOString();

    const db = await readDB();
    db.products.push(p);
    await writeDB(db);

    broadcast('products');
    res.status(201).json(p);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updates = { ...req.body, ultimaActualizacion: new Date().toISOString() };

    const db = await readDB();
    const index = db.products.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ error: 'Producto no encontrado' });

    db.products[index] = { ...db.products[index], ...updates };
    await writeDB(db);

    broadcast('products');
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const db = await readDB();
    const index = db.products.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ error: 'Producto no encontrado' });

    db.products.splice(index, 1);
    await writeDB(db);

    broadcast('products');
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/rate', async (req, res) => {
  try {
    const db = await readDB();
    res.json({ rate: db.rate || 216.38 });
  } catch (error) {
    res.json({ rate: 216.38 });
  }
});

app.put('/api/rate', async (req, res) => {
  try {
    const r = Number(req.body.rate);
    if (!isNaN(r) && r > 0) {
      const db = await readDB();
      db.rate = r;
      await writeDB(db);
      broadcast('rate');
      res.json({ rate: r });
    } else {
      res.status(400).json({ error: 'Invalid rate' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/checkout', async (req, res) => {
  try {
    const compra = req.body;
    compra.id = compra.id || ('TXN-' + Math.random().toString(36).slice(2,10).toUpperCase());
    compra.fecha = new Date().toISOString();

    const db = await readDB();
    db.transactions.push(compra);
    await writeDB(db);

    res.status(201).json(compra);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/history', async (req, res) => {
  try {
    const db = await readDB();
    res.json(db.transactions || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clients endpoints
app.get('/api/clients', async (req, res) => {
  try {
    const db = await readDB();
    res.json(db.clients || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/clients', async (req, res) => {
  try {
    const client = req.body;
    client.id = client.id || ('client_' + Date.now());

    const db = await readDB();
    // Check if client with same cedula already exists
    const existing = db.clients.find(c => c.cedula === client.cedula);
    if (existing) {
      return res.status(400).json({ error: 'Ya existe un cliente con esta cédula' });
    }

    db.clients.push(client);
    await writeDB(db);

    broadcast('clients');
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/clients/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;

    const db = await readDB();
    const index = db.clients.findIndex(c => c.id === id);
    if (index === -1) return res.status(404).json({ error: 'Cliente no encontrado' });

    db.clients[index] = { ...db.clients[index], ...updates };
    await writeDB(db);

    broadcast('clients');
    res.json(db.clients[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/clients/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const db = await readDB();
    const index = db.clients.findIndex(c => c.id === id);
    if (index === -1) return res.status(404).json({ error: 'Cliente no encontrado' });

    db.clients.splice(index, 1);
    await writeDB(db);

    broadcast('clients');
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

// fallback to index
app.get('/', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'erick.html')));

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();
    console.log('Base de datos inicializada correctamente');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor KING DISEÑO ejecutándose en http://localhost:${PORT}`);
      console.log(`📊 API disponible en http://localhost:${PORT}/api`);
      console.log(`💾 Base de datos: ${DB_FILE}`);
      console.log(`🔄 Backups: ${BACKUP_DIR}`);
    });
  } catch (error) {
    console.error('Error al inicializar el servidor:', error);
    process.exit(1);
  }
}

startServer();
