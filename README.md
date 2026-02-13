# KING DISEÑO - Sistema de Comercio Electrónico

## Descripción

KING DISEÑO es un sistema completo de comercio electrónico especializado en tecnología de vanguardia. El sistema incluye múltiples páginas interconectadas que permiten a los clientes navegar productos, gestionar perfiles, realizar compras y a los administradores gestionar el inventario.

## Páginas del Sistema

### 🏠 index.html - Página Principal
La página de inicio muestra el catálogo completo de productos con una interfaz moderna y atractiva.

**Características:**
- **Hero Section**: Video promocional y descripción de la empresa
- **Secciones de Características**: ¿Por qué elegirnos?
- **Catálogo por Categorías**: Accesorios, Computadoras, Componentes
- **Banners Publicitarios**: Ofertas especiales y promociones
- **Integración Cashea**: Opción de pago en cuotas
- **Navegación**: Enlaces a soporte técnico, acceso admin y cliente

**Cómo usar:**
1. Navega por las categorías de productos
2. Haz clic en "Consultar" para contactar por WhatsApp
3. Accede a soporte técnico o paneles de administración

### 👤 perfil.html - Perfil del Cliente
Panel completo para clientes registrados con gestión de cuenta y compras.

**Características:**
- **Información Personal**: Datos del cliente (cédula, nombre, email, teléfono)
- **Billetera Digital**: Saldo disponible, depósitos y retiros
- **Catálogo de Productos**: Navegación por categorías con filtros
- **Carrito de Compras**: Agregar, modificar y gestionar productos
- **Historial de Compras**: Registro completo de todas las transacciones
- **Menú Hamburguesa**: Navegación móvil optimizada

**Funcionalidades de la Billetera:**
- Depositar fondos
- Retirar dinero (con validación de saldo)
- Saldo actualizado en tiempo real

**Gestión del Carrito:**
- Agregar productos por categoría
- Modificar cantidades
- Eliminar productos
- Procesar compras
- Ver subtotales y totales

### 💳 erick.html - Método de Pago
Página dedicada al proceso de compra y pago con interfaz de carrito inteligente.

**Características:**
- **Catálogo Interactivo**: Búsqueda y filtrado de productos
- **Carrito Inteligente**: Gestión avanzada con cantidades variables
- **Cálculos Automáticos**: Subtotales USD/Bs con IVA incluido
- **Pago Simulado**: Proceso de checkout con validación
- **Exportación PDF**: Generar pedidos en formato PDF
- **Historial de Compras**: Registro automático de transacciones

**Proceso de Compra:**
1. Buscar y seleccionar productos
2. Configurar cantidades
3. Agregar al carrito
4. Revisar totales y proceder al pago
5. Confirmación y generación de ID de transacción

### ⚙️ gestion.html - Panel de Administración
Panel completo para administradores con control total del sistema.

**Características:**
- **Configuración de Tasa**: Establecer tasa de cambio Bs/USD
- **Gestión de Inventario**: CRUD completo de productos
- **Categorización**: Accesorios, Computadoras, Componentes
- **Subida de Imágenes**: URL externa o archivo local
- **Reportes PDF**: Exportación completa del inventario
- **Sincronización**: Guardado automático de datos
- **Tema Oscuro/Claro**: Interfaz personalizable

**Gestión de Productos:**
- Agregar nuevos productos
- Editar productos existentes
- Eliminar productos
- Gestionar stock y precios
- Subir imágenes de productos

## Características Generales del Sistema

### 🎨 Diseño y UX
- **Interfaz Moderna**: Gradientes, animaciones y diseño profesional
- **Responsive Design**: Optimizado para desktop, tablet y móvil
- **Tema Personalizable**: Modo claro y oscuro
- **Animaciones Suaves**: Transiciones y efectos visuales atractivos

### 💾 Gestión de Datos
- **LocalStorage**: Persistencia de datos en el navegador
- **Sincronización**: Datos compartidos entre páginas
- **Backup Automático**: Guardado continuo de cambios

### 🔒 Seguridad y Validación
- **Validación de Formularios**: Entradas sanitizadas
- **Control de Acceso**: Sesiones para clientes y administradores
- **Validación de Saldos**: Prevención de compras sin fondos

### 📱 Integraciones
- **WhatsApp**: Contacto directo para consultas
- **Cashea**: Sistema de pagos en cuotas
- **PDF Generation**: Exportación de reportes y pedidos

## Requisitos Técnicos

### Navegadores Compatibles
- Google Chrome (recomendado)
- Mozilla Firefox
- Microsoft Edge
- Safari

### Requisitos del Sistema
- Conexión a internet para cargar fuentes y scripts externos
- JavaScript habilitado
- LocalStorage habilitado para guardar datos
- Permisos de descarga para PDFs

### Dependencias Externas
- **Google Fonts**: Montserrat, Playfair Display
- **jsPDF**: Generación de documentos PDF
- **jsPDF-AutoTable**: Tablas en PDF
- **Font Awesome**: Iconos (si se usan)

## Estructura del Proyecto

```
/
├── index.html              # Página principal y catálogo
├── perfil.html             # Perfil del cliente
├── erick.html              # Sistema de pagos y carrito
├── gestion.html            # Panel de administración
├── registro.html           # Registro de nuevos clientes
├── admin_login.html        # Login de administradores
├── pagina_cliente.html     # Acceso clientes
├── soporte tecnico.html    # Página de soporte
├── style.css               # Estilos globales
├── index.css               # Estilos específicos de index.html
├── server.js               # Servidor backend (opcional)
├── package.json            # Dependencias del proyecto
├── IMAGENES/               # Imágenes de productos
├── VIDEO/                  # Videos promocionales
├── TODO.md                 # Lista de tareas pendientes
└── README.md              # Este archivo
```

## Configuración Inicial

### Opción 1: Archivos Estáticos
1. Descarga todos los archivos del proyecto
2. Abre `index.html` directamente en tu navegador web
3. Todas las páginas funcionarán sin servidor adicional

### Opción 2: Con Servidor (Recomendado)
1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Iniciar servidor**:
   ```bash
   node server.js
   ```

3. **Acceder al sistema**:
   - Abre `http://localhost:3000` en tu navegador
   - La página principal se cargará automáticamente

## Flujo de Uso del Sistema

### Para Clientes

1. **Registro**: Accede desde la página principal → "Acceso Cliente"
2. **Perfil**: Gestiona tu información y billetera
3. **Compras**: Navega productos y agrega al carrito
4. **Pago**: Completa la compra en la página de pagos
5. **Historial**: Revisa tus compras anteriores

### Para Administradores

1. **Acceso**: Login desde "Acceso Admin"
2. **Configuración**: Establece tasa de cambio
3. **Inventario**: Agrega, edita y elimina productos
4. **Reportes**: Genera PDFs del inventario completo
5. **Sincronización**: Guarda todos los cambios

## Gestión de Datos

### Claves LocalStorage
- `productosInventario`: Catálogo completo de productos
- `exchangeRateBsPerUsd`: Tasa de cambio actual
- `historialCompras`: Registro de todas las transacciones
- `cliente_{cedula}`: Datos individuales de clientes
- `clientLoggedIn`: Estado de sesión del cliente
- `theme`: Preferencia de tema (light/dark)

### Estructura de Productos
```javascript
{
  id: "string",
  nombre: "string",
  precio: number,
  categoria: "accesorios|computadoras|componentes",
  DISPONIBLE: number,
  urlImagen: "string"
}
```

### Estructura de Clientes
```javascript
{
  cedula: "string",
  name: "string",
  email: "string",
  phone: "string",
  balance: number,
  purchases: [...],
  cart: [...]
}
```

## Solución de Problemas

### Problemas Comunes

1. **Página no carga**:
   - Verifica conexión a internet
   - Habilita JavaScript en el navegador
   - Limpia caché del navegador

2. **Datos no se guardan**:
   - Verifica que LocalStorage esté habilitado
   - Intenta en modo incógnito
   - Revisa permisos del navegador

3. **Imágenes no cargan**:
   - Verifica URLs de imágenes
   - Comprueba conexión a internet
   - Imágenes fallback se mostrarán automáticamente

4. **PDF no se genera**:
   - Asegúrate de que jsPDF esté cargado
   - Verifica permisos de descarga
   - Intenta en un navegador diferente

5. **Pagos no procesan**:
   - Verifica saldo suficiente en billetera
   - Confirma que hay productos en el carrito
   - Revisa datos del cliente

### Mensajes de Error Comunes
- "Producto no encontrado": El producto fue eliminado del inventario
- "Saldo insuficiente": No hay fondos suficientes para la compra
- "Sesión expirada": Es necesario volver a iniciar sesión

## Soporte Técnico

### Contacto
- **WhatsApp**: +58 XXX XXX XXXX
- **Email**: soporte@kingdiseno.com
- **Horario**: Lunes a Viernes, 9:00 AM - 6:00 PM

### Recursos Adicionales
- **Documentación**: Este README.md
- **TODO List**: Revisa TODO.md para futuras actualizaciones
- **Especificaciones**: IMAGES_SPECIFICATIONS.md para imágenes

## Desarrollo y Mantenimiento

### Actualizaciones
- Los productos se sincronizan automáticamente entre páginas
- La tasa de cambio se actualiza en tiempo real
- Los datos se preservan entre sesiones del navegador

### Mejoras Futuras
- Integración con base de datos real
- Sistema de autenticación avanzado
- Notificaciones push
- Integración con pasarelas de pago reales

## Licencia

Este proyecto es propiedad de KING DISEÑO. Todos los derechos reservados.

---

¡Gracias por elegir KING DISEÑO! Tecnología de vanguardia con servicio excepcional.
