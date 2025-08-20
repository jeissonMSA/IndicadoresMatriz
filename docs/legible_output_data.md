# FÓRMULAS DE GESTIÓN DE INVENTARIOS

## ¿CUÁNTO TENEMOS?

### Inventario Actual
```
Lo que tenemos en bodega = Suma de todo el stock en todas las bodegas
```
$$
I_{actual} = \sum (Stock_{bodega})
$$

### Valor del Inventario
```
Valor total = Suma de (Cantidad de cada producto × Su precio)
```
$$
V_{inventario} = \sum (Cantidad_i \times Precio_i)
$$

### Costo por Unidad
```
Si no hay valor → $0
Si hay valor → Valor total ÷ Cantidad total
```
$$
CU = 
\frac{V_{inventario}}{Cantidad_{total}} 
$$

## ¿CUÁNTO USAMOS?

### Consumo Promedio
```
Uso promedio por día = Total usado en el período ÷ Días del período
```
$$
CP = \frac{Consumo_{total}}{Dias}
$$

### Variabilidad del Uso
```
Qué tan variable es nuestro consumo = Desviación estándar del consumo histórico
```

$$
\sigma = \text{DesviacionE}(Consumo_{historico})
$$


### Importancia del Producto
```
% de importancia = Consumo de este producto ÷ Consumo total de todos
```
$$
\%Importancia_i = \frac{Consumo_i}{\sum Consumo}
$$

## ¿CUÁNDO COMPRAR?

### Stock de Seguridad
```
Reserva para emergencias = Uso promedio × Días de seguridad configurados
```
$$
SS = CP \times Dias_{seguridad}
$$

### Punto de Reorden
```
Cuándo hacer pedido = (Uso promedio × Tiempo de entrega) + Variabilidad + Reserva
```
$$
ROP = (CP \times LT) + \sigma + SS
$$

## ¿CUÁNTO COMPRAR?

### Costo de Hacer un Pedido
```
Si es importado: (Precio × %) + (Mano de obra ÷ Total productos)
Si es nacional: Mano de obra ÷ Total productos
```

$$
C_{pedido} = 
\begin{cases} 
(Precio \times \%) + \frac{MO}{N_{productos}} & \text{Importado} \\ 
\frac{MO}{N_{productos}} & \text{Nacional} 
\end{cases}
$$


### Costo de Tener Inventario
```
Costo por unidad = Precio × Tasa de almacenamiento
```
$$
C_{alm} = Precio \times Tasa_{almacenamiento}
$$


### Cantidad Ideal de Compra (EOQ)
```
Si no hay costo → 0
Si hay costo → Raíz cuadrada de [(2 × Uso × Costo pedido) ÷ Costo almacenamiento]
```
$$
Q^* = \sqrt{\frac{2 \times CP \times C_{pedido}}{C_{alm}}} 
$$


## ¿COMPRAMOS O NO?

### Inventario Real
```
Stock disponible = Lo que tenemos + Lo que viene - Lo que debemos
```

$$
IR = I_{actual} + Transito - BackOrder
$$

### Decisión de Compra
```
Si stock disponible > Punto de reorden → NO comprar
Si stock disponible ≤ Punto de reorden → COMPRAR
```
$$
\text{Si } IR > ROP \Rightarrow NO\ comprar
$$

$$
\text{Si } IR \leq ROP \Rightarrow COMPRAR
$$

## ¿CUÁNTO COMPRAR?

### Para Importados
```
Comprar = Uso promedio + Lo que debemos - Lo que viene - Lo que tenemos
```
$$
Q_{importado} = CP + BackOrder - Transito - I_{actual}
$$

### Para Nacionales
```
Comprar = Cantidad ideal + Lo que debemos - Lo que viene
```
$$
Q_{nacional} = Q^* + BackOrder - Transito
$$

## CLASIFICACIÓN ABC

- Tipo A → Productos muy importantes (alto consumo)
- Tipo B → Productos medianamente importantes  
- Tipo C → Productos poco importantes
- Sin rotación → Productos que casi no se usan

## TÉRMINOS CLAVE

- Back Order: Lo que hemos vendido pero no hemos entregado
- Tránsito: Lo que hemos comprado pero no ha llegado
- Lead Time: Tiempo que tarda el proveedor en entregar
- Safety Stock: Reserva para emergencias

## EN RESUMEN

1. Calculamos cuánto usamos normalmente
2. Determinamos cuándo debemos comprar
3. Calculamos cuánto nos cuesta comprar y almacenar
4. Decidimos la cantidad ideal a comprar
5. Revisamos si ya tenemos pedidos pendientes
6. Tomamos la decisión final de compra


### AporteNacional
Indicador (probablemente Sí/No) que especifica si el material es de abastecimiento nacional o si es importado.

### IdMaterial
Código único o número de identificación que distingue a cada artículo o producto en el sistema.

### nomMaterial
El nombre o descripción completa del artículo o producto.

### NomProveedor
Nombre del proveedor principal o preferencial que suministra el material.

### PrecioDeCompra
Precio unitario al que se compra el material al proveedor.

### BackOrder
Cantidad de unidades que han sido vendidas o solicitadas por clientes pero que no se pueden entregar de inmediato por falta de stock (órdenes pendientes).

### Transito
Cantidad de unidades que han sido compradas y están en camino a la bodega, pero que aún no han sido recibidas.

### ConsumoMaximo
El valor máximo de consumo registrado para el material durante el período histórico analizado.

### ConsumoMinimo
El valor mínimo de consumo registrado para el material durante el período histórico analizado.