'use client';

import { FormEvent, useMemo, useState } from 'react';

type Product = { id: string; category: string; name: string; description: string; price: number; image?: string };
type CartItem = Product & { extras: string[]; key: string };

const products: Product[] = [
  { id:'escobar', category:'Hamburguesas', name:'Escobar', price:15, description:'120 g de pura carne de res a la parrilla, cheddar derretido, lechuga fresca y tomate del huerto, salsas secretas de la casa y abundantes papas nativas.', image:'/hamburguesa-escobar.png' },
  { id:'napoles', category:'Hamburguesas', name:'Nápoles', price:16, description:'120 g de pechuga jugosa, cheddar derretido, jamón, ensalada fresca y salsa secreta de la casa. Todo acompañado de abundantes papas nativas.', image:'/hamburguesa-napoles-cuadrada.png' },
  { id:'cartel', category:'Hamburguesas', name:'Cartel de Medellín', price:18, description:'120 g de carne de res a la parrilla, cheddar derretido, jamón, chorizo y chimichurri de la casa, con ensalada fresca y abundantes papas nativas.', image:'/hamburguesa-cartel-medellin.png' },
  { id:'popeye', category:'Hamburguesas', name:'Popeye', price:19, description:'Carne a la parrilla, cheddar derretido, huevo con yema cremosa, tocino crujiente y cebolla caramelizada, con ensalada fresca y abundantes papas nativas.', image:'/hamburguesa-popeye.png' },
  { id:'dea', category:'Hamburguesas', name:'DEA', price:20, description:'150 g de pollo crispy crujiente, tocino dorado y salsa BBQ, con ensalada fresca y abundantes papas nativas.', image:'/hamburguesa-dea.png' },
  { id:'catedral', category:'Hamburguesas', name:'La Catedral', price:20, description:'150 g de pollo crispy, cheddar bien derretido y huevo con yema cremosa, acompañados de ensalada fresca y abundantes papas nativas.', image:'/hamburguesa-catedral.png' },
  { id:'patron', category:'Hamburguesas', name:'El Patrón', price:25, description:'240 g de doble carne a la parrilla, doble cheddar derretido, doble tocino crujiente y cebolla caramelizada, con ensalada fresca y abundantes papas nativas.', image:'/hamburguesa-el-patron.png' },
  { id:'alitas8', category:'Alitas', name:'Alitas · 8 piezas', price:20, description:'Alitas doraditas y crujientes, bañadas en la salsa que tú eliges, con abundantes papas peruanitas doradas por fuera y suaves por dentro.', image:'/alitas-el-patron.png' },
  { id:'alitas16', category:'Alitas', name:'Alitas · 16 piezas', price:40, description:'Alitas doraditas y crujientes, bañadas en la salsa que tú eliges, con abundantes papas peruanitas doradas por fuera y suaves por dentro.', image:'/alitas-16-piezas.png' },
  { id:'alitas24', category:'Alitas', name:'Alitas · 24 piezas', price:50, description:'Alitas doraditas y crujientes, bañadas en la salsa que tú eliges, con abundantes papas peruanitas doradas por fuera y suaves por dentro.', image:'/alitas-maracuya-24.png' },
  { id:'alitas32', category:'Alitas', name:'Alitas · 32 piezas', price:65, description:'Alitas doraditas y crujientes, bañadas en la salsa que tú eliges, con abundantes papas peruanitas doradas por fuera y suaves por dentro.', image:'/alitas-chalaca-32.png' },
  { id:'broaster1', category:'Pollo Broaster', name:'Pollo Broaster · 1 pieza', price:17, description:'Una generosa pechuga broaster extra crocante, sobre papas artesanales doraditas y acompañada de ensalada fresca.', image:'/pollo-broaster-1.png' },
  { id:'broaster2', category:'Pollo Broaster', name:'Pollo Broaster · 2 piezas', price:25, description:'Dos piezas de pollo broaster bien crocantes, con una porción abundante de papas artesanales y ensalada fresca.', image:'/pollo-broaster-2.png' },
  { id:'mostrito', category:'Pollo Broaster', name:'Mostrito', price:22, description:'Pollo broaster crocante, papas artesanales, arroz chaufa de pollo y ensalada fresca.', image:'/mostrito.png' },
  { id:'ceviche', category:'Ceviches', name:'Ceviche Nocturno', price:35, description:'Delicioso ceviche mixto preparado con pescado fresco y frutos del mar, jugo de limón al punto, cebolla crocante, choclo peruano, cancha doradita y camote. Coronado con ají arnacho para el toque que manda.', image:'/ceviche-nocturno.png' },
  { id:'leche', category:'Ceviches', name:'Leche de Tigre', price:25, description:'Leche de tigre, intensa y refrescante: pescado y mariscos frescos, limón al punto, cebolla morada y ají. Coronada con chicharrón de pota crocante, cancha y chifle para un golpe marino que manda.', image:'/leche-tigre.png' },
  { id:'churrasco', category:'Especiales', name:'Churrasco Tradicional', price:28, description:'Churrasco, papas y ensalada.', image:'/churrasco-tradicional.jpg' },
  { id:'churrasco-patron', category:'Especiales', name:'Churrasco a lo Patrón', price:35, description:'Churrasco, chorizo, tocino, papas y ensalada.', image:'/churrasco-el-patron.jpg' },
  { id:'lomo', category:'Especiales', name:'Lomo Saltado', price:30, description:'Lomo, papas y arroz blanco.', image:'/lomo-saltado-carne.jpg' },
  { id:'lomo-pobre', category:'Especiales', name:'Lomo Saltado a lo Pobre', price:35, description:'Lomo saltado, huevo, plátano y arroz blanco.', image:'/lomo-saltado-carne-pobre.jpg' },
  { id:'tallarin-carne', category:'Especiales', name:'Tallarín Saltado de Carne', price:25, description:'Delicioso tallarín saltado criollo, con abundante carne y la sazón peruana que cautiva paladares exigentes.', image:'/tallarin-saltado-carne.jpg' },
  { id:'milanesa', category:'Especiales', name:'Milanesa Tradicional', price:30, description:'Milanesa, papas y ensalada.', image:'/milanesa-pollo.jpg' },
  { id:'pechuga-light', category:'Especiales', name:'Filete de Pechuga Light', price:25, description:'Pechuga de pollo deshuesada y ensalada especial.', image:'/pechuga-plancha.jpg' },
  { id:'pechuga', category:'Especiales', name:'Filete de Pechuga', price:28, description:'Pechuga de pollo deshuesada, papas y ensalada.', image:'/pechuga-plancha.jpg' },
  { id:'chicharron-pollo', category:'Especiales', name:'Chicharrón de Pollo', price:25, description:'Cortes de pollo crispy, papas y ensalada.', image:'/chicharron-pollo.jpg' },
  { id:'chaufa', category:'Especiales', name:'Arroz Chaufa de Pollo', price:20, description:'Clásico y contundente.', image:'/arroz-chaufa.jpg' },
  { id:'salchipapa', category:'Salchipapas', name:'Salchipapa Clásica', price:15, description:'Hot dog doradito y sabroso, acompañado de una montaña de papas artesanales crocantes por fuera, suaves por dentro y llenas de sabor.', image:'/salchipapas-clasica.png' },
  { id:'choripapa', category:'Salchipapas', name:'Choripapa', price:18, description:'Chorizo bien doradito, jugoso y lleno de sabor, servido sobre una porción generosa de papas artesanales crocantes.', image:'/choripapa.png' },
  { id:'mixta', category:'Salchipapas', name:'Mixta', price:19, description:'Hot dog doradito y chorizo jugoso, acompañados de una generosa porción de papas artesanales crujientes y humeantes.', image:'/mixta.png' },
  { id:'americana', category:'Salchipapas', name:'Americana', price:19, description:'Una montaña de papas artesanales crocantes, hot dog troceado, tocino doradito y huevo frito coronando el plato.', image:'/americana.png' },
  { id:'salchialitas', category:'Salchipapas', name:'Salchialitas', price:23, description:'Un delicioso hot dog, 4 alitas en salsa BBQ y abundantes papas fritas crujientes.', image:'/salchialitas.png' },
  { id:'salchibroaster', category:'Salchipapas', name:'Salchibroaster', price:25, description:'Una pieza de pollo broaster bien crocante, hot dog troceado y una porción abundante de papas fritas doraditas.', image:'/salchibroaster.png' },
  { id:'papas-chicas', category:'Papas Nativas', name:'Porción de Papas Chicas', price:5, description:'Papas peruanitas, crujientes y doraditas.', image:'/papas-fritas.jpg' },
  { id:'papas-grandes', category:'Papas Nativas', name:'Porción de Papas Grandes', price:10, description:'Papas peruanitas, crujientes y doraditas.', image:'/papas-fritas.jpg' },
];
const extras = [{name:'Queso cheddar',price:3},{name:'Tocino',price:3},{name:'Huevo',price:2},{name:'Jamón',price:2},{name:'Chorizo',price:3},{name:'Porción personal de papas',price:5}];
const freeComplements = ['Ensalada','Ají','Mayonesa','Kétchup'];
const broasterSauces = ['Ají','Mayonesa','Kétchup'];
const wingSauces = ['BBQ','BBQ picante','Teriyaki','Maracuyá','Rocoto','Broaster','Salsa infierno','Alachalaca'];
const cevicheSpiceLevels = ['Sin picante','Medio picante','Muy picante'];
const categories = ['Ceviches','Hamburguesas','Alitas','Salchipapas','Pollo Broaster','Especiales','Papas Nativas'];
const money = (amount:number) => `S/ ${amount.toFixed(2)}`;
const categoryEmoji: Record<string,string> = { 'Hamburguesas':'🍔', 'Alitas':'🍗', 'Salchipapas':'🍟', 'Pollo Broaster':'🍗', 'Especiales':'🍽️', 'Papas Nativas':'🥔', 'Ceviches':'🍤' };
const SHEET_WEBHOOK_URL = '';
function orderTag() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2,'0');
  const month = String(now.getMonth()+1).padStart(2,'0');
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2,'0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${day}/${month} · ${hours}:${minutes} ${ampm}`;
}

export default function Home() {
  const [activeCategory,setActiveCategory] = useState('Ceviches');
  const [cart,setCart] = useState<CartItem[]>([]);
  const [selectedProduct,setSelectedProduct] = useState<Product | null>(null);
  const [selectedExtras,setSelectedExtras] = useState<string[]>([]);
  const [orderFor,setOrderFor] = useState('now');
  const [name,setName] = useState('');
  const [phone,setPhone] = useState('');
  const [address,setAddress] = useState('');
  const [schedule,setSchedule] = useState('');
  const [payment,setPayment] = useState('Yape');
  const [note,setNote] = useState('');
  const visibleProducts = useMemo(() => products.filter(item => item.category === activeCategory),[activeCategory]);
  const extrasTotal = (item:CartItem) => item.extras.reduce((total,extra) => total + (extras.find(option => option.name === extra)?.price ?? 0),0);
  const subtotal = cart.reduce((total,item) => total + item.price + extrasTotal(item),0);
  const delivery = cart.length ? 4 : 0;
  const total = subtotal + delivery;
  const addProduct = (product:Product, additions:string[] = []) => { setCart(items => [...items,{...product,extras:additions,key:`${product.id}-${Date.now()}`}]); setSelectedProduct(null); setSelectedExtras([]); };
  const [confirmingId,setConfirmingId] = useState<string | null>(null);
  const confirmAdd = (product:Product, additions:string[] = []) => {
    setConfirmingId(product.id);
    setTimeout(() => { addProduct(product, additions); setConfirmingId(null); }, 350);
  };
  const removeItem = (key:string) => setCart(items => items.filter(item => item.key !== key));
  function sendOrder(event:FormEvent) {
    event.preventDefault();
    if (!cart.length) return;
    if (!name || !phone || !address || (orderFor === 'scheduled' && !schedule)) { window.alert('Completa nombre, teléfono, dirección y el horario si deseas programar el pedido.'); return; }
    const tag = orderTag();
    const lines = categories.flatMap(category => {
      const group = cart.filter(item => item.category === category);
      return group.length ? [`${categoryEmoji[category] ?? '•'} *${category.toUpperCase()}*`, ...group.map(item => `• ${item.name} — ${money(item.price + extrasTotal(item))}${item.extras.length ? `%0A  + ${item.extras.join(', ')}` : ''}`)] : [];
    });
    const when = orderFor === 'scheduled' ? `Programado: ${schedule}` : 'Lo quiero ahora';
    const productsPlain = categories.flatMap(category => {
      const group = cart.filter(item => item.category === category);
      return group.map(item => `${item.name}${item.extras.length ? ` (+${item.extras.join(', ')})` : ''}`);
    }).join(' | ');
    const message = `🧾 *PEDIDO ${tag}*%0A*EL PATRÓN DEL HUARIQUE*%0A%0A${lines.join('%0A')}%0A%0A━━━━━━━━━━━━%0ADelivery: ${money(delivery)}%0A*TOTAL: ${money(total)}*%0A━━━━━━━━━━━━%0A%0A👤 ${name}%0A📞 ${phone}%0A📍 ${address}%0A🕐 ${when}%0A💳 ${payment}${note ? `%0A📝 ${note}` : ''}%0A%0A👉 Envía tu comprobante de pago para confirmar`;
    if (SHEET_WEBHOOK_URL) {
      fetch(SHEET_WEBHOOK_URL, { method:'POST', body: JSON.stringify({ orderNumber: tag, name, phone, address, products: productsPlain, delivery, total, payment }) }).catch(() => {});
    }
    window.open(`https://wa.me/51926304161?text=${message}`,'_blank','noopener,noreferrer');
  }
  return <main data-site-version="salchipapas-20260826-2152">
    <nav className="topbar"><a href="#inicio" className="brand-mini" aria-label="El Patrón del Huarique"><img src="/logo-oficial-el-patron.jpeg" alt="El Patrón del Huarique"/></a><div className="nav-links"><a href="#carta">Carta</a><a href="#historias">Historias</a><a href="#delivery">Delivery</a></div><a className="nav-order" href="#pedido">Pedir ahora</a></nav>
    <section className="hero" id="inicio"><div className="hero-copy"><span className="eyebrow">EL PATRÓN ESTÁ DE REGRESO EN HUACHO</span><h1>CUANDO EL HAMBRE<br/><em>MANDA,</em> EL PATRÓN<br/>RESPONDE.</h1><p>Las mejores hamburguesas, alitas o pollito broster lo tenemos nosotros. Atendemos desde las 11 a. m. hasta las 3 a. m.</p><div className="hero-actions"><a href="#carta" className="button primary">Ver la carta</a><a href="https://wa.me/51926304161" className="button ghost">WhatsApp · 926 304 161</a></div></div><div className="hero-art"><img src="/portada-el-patron.png" alt="Ceviche El Patrón"/><span className="hero-stamp">SABOR<br/>QUE<br/>MANDA</span></div></section>
    <section className="quickbar" id="delivery"><div><strong>DELIVERY PROPIO</strong><span>S/ 4.00 en Huacho</span></div><div><strong>ATENCIÓN DIARIA</strong><span>11 a. m. — 3 a. m.</span></div><div><strong>PIDE COMO QUIERAS</strong><span>WhatsApp o Llama Food</span></div></section>
    <section className="menu-section" id="carta"><div className="section-title"><span className="eyebrow">La carta del patrón</span><h2>ELIGE TU<br/><em>ENCARGO.</em></h2><p>Arma tu pedido, agrega extras y envíalo por WhatsApp.</p></div><div className="category-tabs" role="tablist">{categories.map(category => <button key={category} className={activeCategory === category ? 'active' : ''} onClick={() => setActiveCategory(category)}>{category}</button>)}</div><div className="product-grid">{visibleProducts.map(product => <article className="product-card" key={product.id}><div className="product-photo">{product.image ? <img src={product.image} alt={product.name}/> : <span>FOTO DEL PRODUCTO<br/><b>PRÓXIMAMENTE</b></span>}</div><div className="product-number">{String(product.price).padStart(2,'0')}</div><h3>{product.name}</h3><p>{product.description}</p><div className="card-bottom"><strong>{money(product.price)}</strong><button className={confirmingId === product.id ? 'confirming' : undefined} onClick={() => product.category === 'Hamburguesas' || product.category === 'Alitas' || product.category === 'Salchipapas' || product.category === 'Pollo Broaster' || product.category === 'Papas Nativas' || ['ceviche','leche'].includes(product.id) ? (setSelectedProduct(product),setSelectedExtras([])) : confirmAdd(product)}>{confirmingId === product.id ? '✓ Agregado' : product.category === 'Alitas' ? 'ELIGE SALSA +' : product.category === 'Hamburguesas' ? 'COMPLEMENTOS' : product.category === 'Salchipapas' ? 'COMPLETA' : product.category === 'Pollo Broaster' ? 'ELIGE SALSAS +' : product.category === 'Papas Nativas' ? 'COMPLEMENTOS' : ['ceviche','leche'].includes(product.id) ? 'ELIGE PICANTE +' : 'Agregar +'}</button></div></article>)}</div></section>
    <section className="story-section" id="historias"><div className="story-photo"><img src="/protagonista-moto.png" alt="El Patrón junto a la moto de delivery"/></div><div className="story-copy"><span className="eyebrow">Historias del Patrón</span><h2>LA NOCHE TIENE<br/>SUS <em>PROPIOS</em><br/>ENCARGOS.</h2><p>El Patrón no solo prepara comida: también tiene historias que contar. Mira las campañas, videos y aventuras de la casa.</p><a href="https://www.facebook.com/elpatrondelhuarique" className="button primary" target="_blank">Ver historias en Facebook</a><video className="story-video" controls preload="metadata" playsInline aria-label="Video de El Patrón"><source src="/historia-el-patron.mp4" type="video/mp4"/>Tu navegador no puede reproducir este video.</video></div></section>
    <section className="order-section" id="pedido"><div className="order-heading"><span className="eyebrow">Tu pedido</span><h2>EL PATRÓN<br/><em>TE ESCUCHA.</em></h2><p>Elige ahora o programa tu delivery. Confirmaremos todo por WhatsApp.</p></div><form className="order-panel" onSubmit={sendOrder}><div className="cart-title"><h3>Mi encargo</h3><span>{cart.length} producto{cart.length === 1 ? '' : 's'}</span></div><div className="cart-items">{cart.length ? cart.map(item => <div className="cart-item" key={item.key}><div><strong>{item.name}</strong>{item.extras.length > 0 && <small>+ {item.extras.join(', ')}</small>}</div><div><b>{money(item.price + extrasTotal(item))}</b><button type="button" onClick={() => removeItem(item.key)} aria-label={`Quitar ${item.name}`}>×</button></div></div>) : <p className="empty-cart">Tu encargo aún está vacío. Escoge algo de la carta.</p>}</div><div className="totals"><span>Productos <b>{money(subtotal)}</b></span><span>Delivery <b>{money(delivery)}</b></span><strong>Total <b>{money(total)}</b></strong></div><div className="choice-row"><button type="button" className={orderFor === 'now' ? 'choice selected' : 'choice'} onClick={() => setOrderFor('now')}>Lo quiero ahora</button><button type="button" className={orderFor === 'scheduled' ? 'choice selected' : 'choice'} onClick={() => setOrderFor('scheduled')}>Programar pedido</button></div><div className="checkout-fields"><label>Nombre de quien recibe<input value={name} onChange={event => setName(event.target.value)} placeholder="Tu nombre" required/></label><label>Teléfono<input value={phone} onChange={event => setPhone(event.target.value)} placeholder="999 999 999" required/></label><label className="wide">Dirección y referencia<input value={address} onChange={event => setAddress(event.target.value)} placeholder="Ej. Av. ... / casa color ..." required/></label>{orderFor === 'scheduled' && <label className="wide">Día y hora de entrega<input type="datetime-local" value={schedule} onChange={event => setSchedule(event.target.value)} required/></label>}<label>Pago<select value={payment} onChange={event => setPayment(event.target.value)}><option>Yape</option><option>Plin</option><option>Transferencia</option><option>Efectivo</option></select></label><label>Indicaciones<input value={note} onChange={event => setNote(event.target.value)} placeholder="Sin cebolla, tocar timbre..."/></label></div><button className="send-order" type="submit" disabled={!cart.length}>Enviar pedido por WhatsApp <span>↗</span></button></form></section>
    {selectedProduct && <div className="modal-backdrop" role="presentation"><div className="extras-modal" role="dialog" aria-modal="true" aria-labelledby="extras-title"><button className="modal-close" onClick={() => setSelectedProduct(null)} aria-label="Cerrar">×</button><span className="eyebrow">{selectedProduct.category === 'Alitas' ? 'Elige una salsa' : ['ceviche','leche'].includes(selectedProduct.id) ? 'Elige el nivel de picante' : selectedProduct.category === 'Salchipapas' ? 'Completa tu salchipapa' : selectedProduct.category === 'Pollo Broaster' || selectedProduct.category === 'Papas Nativas' ? 'Elige tus salsas' : 'Hazlo a tu manera'}</span><h2 id="extras-title">{selectedProduct.name}</h2><p>{selectedProduct.category === 'Alitas' ? 'Tu salsa viene incluida. Elige una para continuar.' : ['ceviche','leche'].includes(selectedProduct.id) ? 'Tu nivel de picante viene incluido. Elige uno para continuar.' : selectedProduct.category === 'Salchipapas' || selectedProduct.category === 'Pollo Broaster' || selectedProduct.category === 'Papas Nativas' ? 'Cuéntanos qué más quieres que le pongamos.' : selectedProduct.description}</p><div className="extra-list">{selectedProduct.category === 'Alitas' ? wingSauces.map(sauce => <label key={sauce}><input type="radio" name="wing-sauce" checked={selectedExtras[0] === sauce} onChange={() => setSelectedExtras([sauce])}/><span>{sauce}</span><b>Incluida</b></label>) : ['ceviche','leche'].includes(selectedProduct.id) ? cevicheSpiceLevels.map(level => <label key={level}><input type="radio" name="ceviche-spice" checked={selectedExtras[0] === level} onChange={() => setSelectedExtras([level])}/><span>{level}</span><b>Incluido</b></label>) : selectedProduct.category === 'Salchipapas' ? freeComplements.map(complement => <label key={complement}><input type="checkbox" checked={selectedExtras.includes(complement)} onChange={() => setSelectedExtras(current => current.includes(complement) ? current.filter(item => item !== complement) : [...current,complement])}/><span>{complement}</span><b>Incluido</b></label>) : selectedProduct.category === 'Pollo Broaster' || selectedProduct.category === 'Papas Nativas' ? broasterSauces.map(sauce => <label key={sauce}><input type="checkbox" checked={selectedExtras.includes(sauce)} onChange={() => setSelectedExtras(current => current.includes(sauce) ? current.filter(item => item !== sauce) : [...current,sauce])}/><span>{sauce}</span><b>Incluida</b></label>) : extras.map(extra => <label key={extra.name}><input type="checkbox" checked={selectedExtras.includes(extra.name)} onChange={() => setSelectedExtras(current => current.includes(extra.name) ? current.filter(item => item !== extra.name) : [...current,extra.name])}/><span>{extra.name}</span><b>+{money(extra.price)}</b></label>)}</div><button className={confirmingId === selectedProduct.id ? 'send-order confirming' : 'send-order'} disabled={(selectedProduct.category === 'Alitas' || ['ceviche','leche'].includes(selectedProduct.id)) && !selectedExtras.length} onClick={() => confirmAdd(selectedProduct,selectedExtras)}>{confirmingId === selectedProduct.id ? '✓ Agregado al pedido' : (selectedProduct.category === 'Alitas' || ['ceviche','leche'].includes(selectedProduct.id)) && !selectedExtras.length ? selectedProduct.category === 'Alitas' ? 'Elige una salsa para continuar' : 'Elige el picante para continuar' : `Agregar al pedido · ${money(selectedProduct.price + selectedExtras.reduce((total,extra) => total + (extras.find(item => item.name === extra)?.price ?? 0),0))}`}</button></div></div>}
    <section className="story-section" id="catering"><div className="story-photo"><video controls preload="metadata" playsInline aria-label="Video de catering El Patrón"><source src="/catering-el-patron.mp4" type="video/mp4"/>Tu navegador no puede reproducir este video.</video></div><div className="story-copy"><span className="eyebrow">Servicio para eventos</span><h2>EL PATRÓN<br/>TAMBIÉN <em>VA</em><br/>A TU EVENTO.</h2><p>¿Fiesta, reunión de trabajo o celebración familiar? Llevamos el sabor de El Patrón a donde nos necesites, con packs armados para grupos grandes. Pide con anticipación y cotizamos según tu número de invitados.</p><a href="https://wa.me/51926304161?text=Hola%2C%20quiero%20cotizar%20el%20servicio%20de%20catering%20para%20mi%20evento" className="button primary" target="_blank">Cotiza tu evento</a></div></section>
    <footer><img src="/logo-el-patron.jpeg" alt="El Patrón del Huarique"/><div><strong>EL PATRÓN DEL HUARIQUE</strong><span>Solo delivery · Huacho</span></div><a href="https://wa.me/51926304161">926 304 161</a></footer>
  </main>;
}
