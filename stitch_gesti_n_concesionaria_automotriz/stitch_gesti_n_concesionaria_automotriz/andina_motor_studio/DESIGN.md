# Documentación del Sistema de Diseño: Concesionaria Web

## 1. El Norte Creativo: "Precision Editorial"
Este sistema de diseño no es una plantilla; es una experiencia de curaduría automotriz. El Norte Creativo se define como **Precision Editorial**. Buscamos alejarnos de la estética saturada de los "marketplaces" tradicionales para abrazar un diseño que respira, similar a una revista de autos de lujo. 

La arquitectura visual rompe la rigidez de la cuadrícula estándar mediante el uso de **asimetría intencionada**, donde las imágenes de los vehículos pueden desbordar contenedores sutiles, y una **jerarquía tipográfica audaz** que guía al usuario con autoridad y claridad. No solo vendemos autos; ofrecemos una plataforma de confianza y sofisticación.

---

## 2. Paleta de Colores y Sofisticación Tonal

El sistema rechaza la planitud. Utilizamos una progresión de tonos para guiar el ojo y crear una sensación de relieve físico.

### Los Colores Core
*   **Primary Dark Charcoal (`#2E3133`):** Nuestra ancla. Se utiliza para el texto de máxima jerarquía y superficies que requieren autoridad.
*   **Secondary Silver Gray (`#8E9196`):** El tono de la neutralidad técnica. Ideal para detalles mecánicos y estados secundarios.
*   **Accent Electric Blue (`#007AFF`):** La chispa de modernidad. Se usa con extrema precisión en CTAs y elementos interactivos críticos.
*   **Background Light Gray (`#F9F9FC`):** El lienzo limpio que permite que el producto sea el protagonista.

### Reglas de Aplicación Premium
*   **La Regla de "No-Line":** Queda estrictamente prohibido el uso de bordes sólidos de 1px para seccionar contenido. La separación se logra mediante el cambio de tono entre superficies (ej. un `surface-container-low` sobre un `surface`).
*   **Jerarquía de Superficies:** Utiliza el "nesting" (anidamiento) para crear profundidad. Los vehículos destacados deben vivir en `surface-container-lowest` (blanco puro) sobre un fondo `surface` para que parezcan "elevarse" hacia el usuario.
*   **Efecto Glassmorphism:** Para menús flotantes o filtros sobre imágenes, aplica el color de la superficie con un 80% de opacidad y un `backdrop-blur` de 16px. Esto evita que la interfaz se sienta fragmentada.
*   **Texturas de Gradiente:** Los CTAs principales deben usar un gradiente sutil desde `primary` hasta `primary_container` para evitar la planitud y añadir un acabado de "pintura automotriz".

---

## 3. Arquitectura Tipográfica

La tipografía es el motor de la confianza. Mezclamos la ingeniería de **Inter** con la elegancia progresiva de **Manrope**.

*   **Display & Headlines (Manrope):** Usamos escalas generosas (`display-lg`: 3.5rem) para títulos de modelos de autos. El tracking debe ser ligeramente negativo (-0.02em) para una apariencia más compacta y premium.
*   **Body & Titles (Inter):** La claridad es técnica. Inter proporciona la legibilidad necesaria para especificaciones de motor y detalles de financiamiento.
*   **Jerarquía como Narrativa:** Los títulos grandes en Manrope establecen el "deseo", mientras que los cuerpos en Inter validan la "decisión" con datos estructurados.

---

## 4. Elevación y Profundidad Atmosférica

En este sistema, la profundidad se siente, no se ve.

*   **Capas Tonales:** En lugar de sombras proyectadas pesadas, apilamos tokens. Un elemento de búsqueda puede usar `surface_container_highest` para destacar sin necesidad de bordes.
*   **Sombras Ambientales:** Cuando el movimiento requiera una sombra (ej. un modal), esta debe ser extra-difuminada: `box-shadow: 0 20px 40px rgba(46, 49, 51, 0.06)`. El color de la sombra nunca es negro; es una versión diluida de nuestro `on-surface`.
*   **Ghost Borders (El último recurso):** Si la accesibilidad requiere un límite visual, usa el token `outline-variant` con un 15% de opacidad. Nunca debe ser el protagonista del diseño.

---

## 5. Componentes de Firma

### Botones (Buttons)
*   **Primario:** Fondo `primary`, texto `on-primary`, esquinas `md` (0.75rem). Sin bordes.
*   **Secundario:** Fondo `secondary_container`, sin borde, efecto de elevación tonal al hacer hover.
*   **Estado:** El radio de curvatura debe ser consistente: `md` para botones de acción, `full` para etiquetas de estado (chips).

### Tarjetas de Vehículos (Vehicle Cards)
*   **Prohibición de Divisores:** No uses líneas para separar el nombre del auto de su precio. Usa `spacing-lg` (espacio en blanco) para crear la distinción.
*   **Composición:** Imagen a sangre (edge-to-edge) en la parte superior, seguida de una sección en `surface-container-low` para los datos técnicos.

### Filtros Automotrices (Chips)
*   Uso de `surface-container-high` para estados inactivos. Al activar, pasan a `tertiary_container` con texto en `on-tertiary_container`.

### Campos de Entrada (Input Fields)
*   Fondo `surface_container_low`. El estado de foco no añade un borde grueso; en su lugar, cambia el fondo a `surface_container_highest` y añade un sutil resplandor en `Accent Electric Blue` con 20% de opacidad.

---

## 6. Do’s & Don’ts (Mandamientos Visuales)

### ✅ Do’s
*   **Espaciado Generoso:** Deja que los autos "respiren". El espacio en blanco es un signo de lujo.
*   **Micro-interacciones:** Los cambios de estado deben ser suaves (transiciones de 300ms con curva `cubic-bezier(0.4, 0, 0.2, 1)`).
*   **Imágenes de Alta Calidad:** El sistema depende de fotografía editorial. Usa máscaras con esquinas `lg` (1rem).

### ❌ Don’ts
*   **Evita el "Flat Design" Total:** Sin sombras sutiles o cambios tonales, el sistema pierde su carácter premium y se vuelve genérico.
*   **No satures con Electric Blue:** El azul es un bisturí, no una brocha gorda. Úsalo solo donde la acción sea necesaria.
*   **Prohibido el uso de Gris Puro (#808080):** Utiliza siempre nuestros grises cromáticos (`Silver Gray`) para mantener la coherencia térmica de la marca.

---
*Este sistema de diseño es un organismo vivo. Su objetivo es convertir la compra de un vehículo en un proceso tan fluido y estético como conducir uno de alta gama.*