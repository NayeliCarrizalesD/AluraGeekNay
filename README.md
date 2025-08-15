# 🎮 Alura Geek - E-commerce de Productos Geek

## 📋 Descripción del Proyecto

**Alura Geek** es una aplicación web de comercio electrónico desarrollada como parte del programa educativo de Alura LATAM. Se trata de una tienda virtual especializada en productos geek y tecnológicos, diseñada con tecnologías web modernas y una arquitectura escalable.

### 🎯 Objetivos del Proyecto
- Crear una experiencia de compra online completa y moderna
- Implementar mejores prácticas de desarrollo frontend
- Desarrollar un sistema de gestión de productos dinámico
- Aplicar principios de diseño responsivo y accesibilidad
- Integrar tecnologías modernas como ES6 modules y APIs REST

### 🌟 Características Principales

#### 🛍️ **Catálogo de Productos**
- **3 Categorías Principales:**
  - 🚀 **Star Wars**: Productos temáticos de la saga espacial
  - 🎮 **Consolas**: Videoconsolas y accesorios gaming
  - 🔧 **Diversos**: Gadgets y productos tecnológicos variados

#### 🔍 **Sistema de Búsqueda Inteligente**
- Búsqueda en tiempo real por nombre, categoría y descripción
- Interfaz de resultados responsive con filtros dinámicos
- Sugerencias automáticas y manejo de errores

#### 📱 **Diseño Responsivo**
- Optimizado para dispositivos móviles, tablets y desktop
- Interfaz moderna con CSS Grid y Flexbox
- Tipografías personalizadas (Comfortaa, Inter, Raleway, Varela Round)

#### 🎨 **Experiencia de Usuario**
- Banner promocional dinámico con ofertas destacadas
- Navegación intuitiva con smooth scroll
- Formulario de contacto con validaciones en tiempo real
- Efectos visuales y transiciones suaves

## 🚀 Tecnologías Utilizadas

### **Frontend**
- **HTML5**: Estructura semántica y accesible
- **CSS3**: Estilos modernos con variables CSS y Grid/Flexbox
- **JavaScript ES6+**: Módulos, async/await, fetch API
- **JSON Server**: Simulación de API REST para desarrollo

### **Arquitectura**
- **MVC Pattern**: Separación clara entre controladores, servicios y vistas
- **Modular Design**: Código organizado en módulos reutilizables
- **API REST**: Comunicación con base de datos JSON

### **Herramientas de Desarrollo**
- **Node.js**: Entorno de ejecución para herramientas de desarrollo
- **NPM**: Gestión de dependencias
- **Git**: Control de versiones

## 📁 Estructura Técnica

```
aluraweekNay/
├── 📄 index.html                     # Página principal del e-commerce
├── 🗄️ db.json                       # Base de datos JSON con productos y usuarios
├── 📦 package.json                   # Configuración del proyecto y dependencias
├── 🔧 iniciar-servidor.bat          # Script automatizado para Windows
├── 
├── 🎨 assets/
│   ├── css/                          # Hojas de estilo modulares
│   │   ├── normalize.css             # Reset de estilos
│   │   ├── variables.css             # Variables CSS globales
│   │   ├── header.css               # Estilos del header
│   │   ├── banner.css               # Estilos del banner promocional
│   │   ├── products.css             # Estilos de productos
│   │   └── search-results.css       # Estilos de búsqueda
│   └── img/                         # Recursos gráficos y logos
│
├── 🎛️ controller/
│   ├── productos-controllers.js      # Lógica de productos y renderizado
│   ├── search.js                    # Funcionalidad de búsqueda avanzada
│   └── form-validation.js           # Validaciones de formularios
│
├── 🔗 servicios/
│   └── productos-servicios.js       # Servicios API y comunicación con backend
│
└── 📱 screens/                      # Páginas adicionales del sitio
    ├── login.html                   # Página de autenticación
    ├── viewProducts.html            # Vista detallada de productos
    └── allProducts.html             # Catálogo completo
```

## 🎯 Funcionalidades Implementadas

### ✅ **Core Features**
- [x] **Catálogo Dinámico**: Carga automática de productos por categorías
- [x] **Búsqueda Avanzada**: Sistema de filtrado inteligente
- [x] **Validación de Formularios**: Contacto con validaciones robustas
- [x] **Diseño Responsivo**: Adaptable a todos los dispositivos
- [x] **API REST**: Comunicación con base de datos JSON

### ✅ **User Experience**
- [x] **Navegación Fluida**: Smooth scroll y transiciones
- [x] **Interfaz Intuitiva**: Diseño centrado en el usuario
- [x] **Feedback Visual**: Estados de carga y mensajes informativos
- [x] **Accesibilidad**: Estructura semántica y navegación por teclado

### 🚧 **Próximas Características**
- [ ] **Carrito de Compras**: Sistema completo de compras
- [ ] **Autenticación**: Login y registro de usuarios
- [ ] **Panel Administrativo**: Gestión de productos y pedidos
- [ ] **Pagos Online**: Integración con pasarelas de pago
- [ ] **Wishlist**: Lista de productos favoritos

## 🛠️ Instalación y Configuración

### **Prerrequisitos**
- Node.js (versión 14 o superior)
- Navegador web moderno
- Editor de código (VS Code recomendado)

### **Pasos de Instalación**

1. **Clonar el repositorio**:
   ```bash
   git clone [url-del-repositorio]
   cd aluraweekNay
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar servidor de desarrollo**:
   ```bash
   # Opción 1: Script automatizado (Windows)
   .\iniciar-servidor.bat
   
   # Opción 2: Comando directo
   npm start
   ```

4. **Abrir la aplicación**:
   - Servidor JSON: `http://localhost:3000`
   - Abrir `index.html` en el navegador

## 🔧 API y Base de Datos

### **Endpoints Disponibles**
```javascript
// Productos
GET /productos              // Obtener todos los productos
GET /productos?categoria=X  // Filtrar por categoría
GET /productos/{id}         // Producto específico

// Usuarios
GET /users                  // Listado de usuarios
POST /users                 // Crear nuevo usuario

// Categorías
GET /categories             // Categorías disponibles
```

### **Estructura de Datos**
```json
{
  "productos": [
    {
      "id": "uuid",
      "name": "Nombre del producto",
      "price": "$XX.XX",
      "categoria": "StarWars|Consolas|Diversos",
      "imageUrl": "URL de la imagen",
      "description": "Descripción del producto"
    }
  ]
}
```

## 🎨 Diseño y UX

### **Paleta de Colores**
- **Primarios**: Azul tecnológico, Verde geek
- **Secundarios**: Grises modernos, Blancos puros
- **Acentos**: Naranjas energéticos para CTAs

### **Tipografía**
- **Headers**: Comfortaa (moderna y redondeada)
- **Cuerpo**: Inter (legible y profesional)
- **Detalles**: Raleway y Varela Round

### **Componentes Reutilizables**
- Cards de productos con hover effects
- Botones con estados interactivos
- Formularios con validación visual
- Sistema de grid responsivo

## � Métricas y Rendimiento

### **Optimizaciones Implementadas**
- Carga lazy de imágenes
- Minificación de CSS
- Código JavaScript modular
- Compresión de assets

### **Compatibilidad**
- **Navegadores**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Dispositivos**: Mobile first, tablets, desktop
- **Resoluciones**: 320px hasta 1920px+

## 🤝 Contribución y Desarrollo

### **Estándares de Código**
- ES6+ para JavaScript
- BEM methodology para CSS
- Semantic HTML5
- Comentarios descriptivos

### **Flujo de Desarrollo**
1. Fork del repositorio
2. Feature branch para nuevas funcionalidades
3. Pull requests con descripción detallada
4. Review de código antes de merge

## 📈 Próximos Pasos

### **Roadmap Técnico**
- Migración a TypeScript
- Implementación de PWA
- Optimización SEO avanzada
- Tests automatizados
- CI/CD pipeline

### **Funcionalidades Business**
- Sistema de reviews y ratings
- Programa de fidelización
- Integración con redes sociales
- Analytics y métricas de usuario

---

## 🏆 Créditos

**Desarrollado por**: Nayeli Carrizales  
**Programa**: Alura LATAM  
**Año**: 2023  
**Versión**: 1.0.0

### **Enlaces**
- 🔗 [GitHub](https://github.com/NayeliCarrizalesD)
- 💼 [LinkedIn](https://www.linkedin.com/in/nayeli-carrizales-diaz/)

---

*Este proyecto forma parte del portafolio de desarrollo frontend y demuestra competencias en tecnologías web modernas, arquitectura de software y experiencia de usuario.*
